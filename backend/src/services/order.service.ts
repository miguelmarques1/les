import { Order } from "../domain/entity/Order"
import type { CreateOrderInputDTO, OrderCardInputDTO, OrderOutputDTO, UpdateOrderStatusInputDTO } from "../dto/order.dto"
import type { DBTransaction } from "../repositories/DBTransaction"
import { CartService, type CartServiceInterface } from "./cart.service"
import { Transaction as TransactionEntity } from "../domain/entity/Transaction"
import { OrderMapper } from "../mapper/OrderMapper"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { MonthlySalesOutputDTO } from "../dto/dashboard.dto"
import { Repository } from "typeorm"
import { Address } from "../domain/entity/Address"
import { Card } from "../domain/entity/Card"
import { Coupon } from "../domain/entity/Coupon"
import { StockBook } from "../domain/entity/StockBook"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { Transaction } from "../domain/entity/Transaction"
import { Customer } from "../domain/entity/Customer"
import { Cart } from "../domain/entity/Cart"
import { OrderRepository } from "../repositories/OrderRepository"
import { StockBookStatus } from "../domain/enums/StockBookStatus"
import { Brand } from "../domain/entity/Brand"
import { PaymentService, PaymentServiceInterface } from "./payment.service"

export interface OrderServiceInterface {
  store(input: CreateOrderInputDTO): Promise<OrderOutputDTO>
  show(orderId: number): Promise<OrderOutputDTO>
  index(customerId: number): Promise<OrderOutputDTO[]>
  update(input: UpdateOrderStatusInputDTO): Promise<OrderOutputDTO>
  all(): Promise<OrderOutputDTO[]>
  totalSales(): Promise<number>
  totalOrders(): Promise<number>
  averageOrderValue(): Promise<number>
  getRecentOrders(): Promise<OrderOutputDTO[]>
  monthlySales(): Promise<MonthlySalesOutputDTO[]>
}

export class OrderService implements OrderServiceInterface {
  private addressRepository: Repository<Address>
  private cardRepository: Repository<Card>
  private couponRepository: Repository<Coupon>
  private stockBookRepository: Repository<StockBook>
  private dbTransaction: DBTransaction
  private orderRepository: Repository<Order> & typeof OrderRepository
  private transactionRepository: Repository<Transaction>
  private customerRepository: Repository<Customer>
  private cartService: CartService
  private brandRepository: Repository<Brand>
  private paymentService: PaymentServiceInterface

  public constructor(repositoryFactory: RepositoryFactory) {
    this.orderRepository = repositoryFactory.getOrderRepository()
    this.transactionRepository = repositoryFactory.getTransactionRepository()
    this.addressRepository = repositoryFactory.getAddressRepository()
    this.cardRepository = repositoryFactory.getCardRepository()
    this.couponRepository = repositoryFactory.getCouponRepository()
    this.stockBookRepository = repositoryFactory.getStockBookRepository()
    this.dbTransaction = repositoryFactory.createTransaction()
    this.customerRepository = repositoryFactory.getCustomerRepository()
    this.cartService = new CartService(repositoryFactory)
    this.brandRepository = repositoryFactory.getBrandRepository()
    this.paymentService = new PaymentService(repositoryFactory)
  }

  async monthlySales(): Promise<MonthlySalesOutputDTO[]> {
    return this.orderRepository.monthlySales()
  }

  async totalSales(): Promise<number> {
    return this.orderRepository.totalSales()
  }

  async totalOrders(): Promise<number> {
    return this.orderRepository.totalOrders()
  }

  async averageOrderValue(): Promise<number> {
    return this.orderRepository.averageOrderValue();
  }

  async getRecentOrders(): Promise<OrderOutputDTO[]> {
    const orders = await this.orderRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 5,
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          },
        },
        customer: true,
        transaction: {
          coupon: true,
          order: false,
        },
      }
    });
    return orders.map(OrderMapper.entityToOutputDTO);
  }

  async all(): Promise<OrderOutputDTO[]> {
    const orders = await this.orderRepository.find({
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          },
        },
        transaction: {
          coupon: true,
        },
        customer: true,
      }
    });

    return orders.map(OrderMapper.entityToOutputDTO);
  }

  async update(input: UpdateOrderStatusInputDTO): Promise<OrderOutputDTO> {
    const order = await this.orderRepository.findOne({
      where: {
        id: input.order_id,
      }
    })
    order.setStatus(input.status)
    await this.orderRepository.save(order)

    return this.show(order.id)
  }

  async show(orderId: number): Promise<OrderOutputDTO> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          },
        },
        transaction: {
          coupon: true,
        },
        customer: true,
      }
    });

    return OrderMapper.entityToOutputDTO(order);
  }

  async index(customerId: number): Promise<OrderOutputDTO[]> {
    const orders = await this.orderRepository.find({
      where: {
        customer: {
          id: customerId,
        }
      },
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          },
        },
        transaction: {
          coupon: true,
        },
        customer: true,
      }
    })

    return orders.map((order) => OrderMapper.entityToOutputDTO(order));
  }

  async store(input: CreateOrderInputDTO): Promise<OrderOutputDTO> {
    this.dbTransaction.start();
    try {
      const { customer, address, card, coupon } = await this.validateAndGetOrderData(input);

      if (customer.cart.items.length === 0) {
        throw new Error("Seu carrinho está vazio");
      }

      const order = await this.createOrder(customer, customer.cart, address);

      const transaction = await this.createTransaction(customer.cart, card, order, coupon);

      order.transaction = transaction;

      await this.orderRepository.save(order);

      await this.cartService.clear(input.customer_id);

      this.dbTransaction.commit();
      this.paymentService.handle(order.id);
      return this.show(order.id);
    } catch (e) {
      this.dbTransaction.rollback();
      throw e;
    }
  }

  private async validateAndGetOrderData(input: CreateOrderInputDTO): Promise<{
    customer: Customer,
    address: Address,
    card: Card,
    coupon: Coupon | null
  }> {
    const customer = await this.getCustomer(input.customer_id);
    const card = await this.getCard(input, customer);
    const address = await this.validateCustomerAddress(input.address_id, input.customer_id);
    const coupon = await this.getCouponIfExists(input.coupon_code);

    return { customer, address, card, coupon };
  }

  private async getCard(input: CreateOrderInputDTO, customer: Customer): Promise<Card> {
    let card: Card;

    if (input.card_id != null) {
      card = await this.validateCustomerCard(input.card_id, input.customer_id);
      return card;
    }

    const brand = await this.brandRepository.findOne({
      where: {
        id: input.card.brandId,
      }
    });
    card = new Card(
      input.card.number,
      input.card.holderName,
      input.card.cvv,
      customer,
      input.card.expiryDate,
      brand,
    )

    return card;
  }

  private async getCustomer(customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: {
        cart: {
          items: {
            stockBook: {
              book: {
                categories: true,
                precificationGroup: true,
              }
            }
          }
        },
      }
    });
    if (!customer) {
      throw new UnauthorizedException("Cliente não encontrado no sistema");
    }
    return customer;
  }

  private async validateCustomerAddress(addressId: number, customerId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['customer']
    });
    if (!address || address.customer.id !== customerId) {
      throw new UnauthorizedException("Acesso negado ao endereço");
    }
    return address;
  }

  private async validateCustomerCard(cardId: number, customerId: number): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: {
        customer: true,
        brand: true,
      }
    });
    if (!card || card.customer.id !== customerId) {
      throw new UnauthorizedException("Acesso negado ao cartão");
    }
    return card;
  }

  private async getCouponIfExists(couponCode?: string): Promise<Coupon | null> {
    if (!couponCode) return null;
    return await this.couponRepository.findOne({ where: { code: couponCode } });
  }

  private async createOrder(
    customer: Customer,
    cart: Cart,
    address: Address
  ): Promise<Order> {
    const stockItems = cart.items.map(item => item.stockBook);
    for (let stockItem of stockItems) {
      stockItem.status = StockBookStatus.SOLD;
      stockItem.saleDate = new Date();
      await this.stockBookRepository.save(stockItem);
    }

    const order = new Order(stockItems, customer, address, "PROCESSING");
    return await this.orderRepository.save(order);
  }

  private async createTransaction(
    cart: Cart,
    card: Card,
    order: Order,
    coupon: Coupon | null
  ): Promise<TransactionEntity> {
    const transaction = new TransactionEntity(
      cart.getTotal(),
      order,
      card,
      coupon,
      new Date()
    );

    return await this.transactionRepository.save(transaction);
  }
}
