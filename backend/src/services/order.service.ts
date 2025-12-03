import { Order } from "../domain/entity/Order"
import type { CreateOrderInputDTO, OrderOutputDTO, UpdateOrderStatusInputDTO } from "../dto/order.dto"
import type { DBTransaction } from "../repositories/DBTransaction"
import { CartService } from "./cart.service"
import { Transaction as TransactionEntity } from "../domain/entity/Transaction"
import { CardPayment } from "../domain/entity/CardPayment"
import { OrderMapper } from "../mapper/OrderMapper"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { NotFoundException } from "../exceptions/NotFoundException"
import type { MonthlySalesOutputDTO } from "../dto/dashboard.dto"
import type { Repository } from "typeorm"
import type { Address } from "../domain/entity/Address"
import { Card } from "../domain/entity/Card"
import type { Coupon } from "../domain/entity/Coupon"
import type { StockBook } from "../domain/entity/StockBook"
import type { RepositoryFactory } from "../factories/RepositoryFactory"
import type { Transaction } from "../domain/entity/Transaction"
import type { Customer } from "../domain/entity/Customer"
import type { Cart } from "../domain/entity/Cart"
import type { OrderRepository } from "../repositories/OrderRepository"
import { StockBookStatus } from "../domain/enums/StockBookStatus"
import type { Brand } from "../domain/entity/Brand"
import { type MessagePublisherServiceInterface, RabbitMQPublisherService } from "./message-publisher.service"
import type { TransactionMessage } from "../dto/rabbitmq.dto"

export interface OrderServiceInterface {
  store(input: CreateOrderInputDTO): Promise<OrderOutputDTO>
  show(orderId: number): Promise<OrderOutputDTO>
  index(customerId: number): Promise<OrderOutputDTO[]>
  update(input: UpdateOrderStatusInputDTO): Promise<OrderOutputDTO>
  all(): Promise<OrderOutputDTO[]>
  totalSales(startDate?: Date, endDate?: Date): Promise<number>
  totalOrders(startDate?: Date, endDate?: Date): Promise<number>
  averageOrderValue(startDate?: Date, endDate?: Date): Promise<number>
  getRecentOrders(startDate?: Date, endDate?: Date): Promise<OrderOutputDTO[]>
  monthlySales(startDate?: Date, endDate?: Date): Promise<MonthlySalesOutputDTO[]>
}

export class OrderService implements OrderServiceInterface {
  private addressRepository: Repository<Address>
  private cardRepository: Repository<Card>
  private couponRepository: Repository<Coupon>
  private stockBookRepository: Repository<StockBook>
  private dbTransaction: DBTransaction
  private orderRepository: Repository<Order> & typeof OrderRepository
  private transactionRepository: Repository<Transaction>
  private cardPaymentRepository: Repository<CardPayment>
  private customerRepository: Repository<Customer>
  private cartService: CartService
  private brandRepository: Repository<Brand>
  private messageService: MessagePublisherServiceInterface

  public constructor(repositoryFactory: RepositoryFactory) {
    this.orderRepository = repositoryFactory.getOrderRepository()
    this.transactionRepository = repositoryFactory.getTransactionRepository()
    this.cardPaymentRepository = repositoryFactory.getCardPaymentRepository()
    this.addressRepository = repositoryFactory.getAddressRepository()
    this.cardRepository = repositoryFactory.getCardRepository()
    this.couponRepository = repositoryFactory.getCouponRepository()
    this.stockBookRepository = repositoryFactory.getStockBookRepository()
    this.dbTransaction = repositoryFactory.createTransaction()
    this.customerRepository = repositoryFactory.getCustomerRepository()
    this.cartService = new CartService(repositoryFactory)
    this.brandRepository = repositoryFactory.getBrandRepository()
    this.messageService = new RabbitMQPublisherService()
  }

  async monthlySales(startDate?: Date, endDate?: Date): Promise<MonthlySalesOutputDTO[]> {
    return this.orderRepository.monthlySales(startDate, endDate)
  }

  async totalSales(startDate?: Date, endDate?: Date): Promise<number> {
    return this.orderRepository.totalSales(startDate, endDate)
  }

  async totalOrders(startDate?: Date, endDate?: Date): Promise<number> {
    return this.orderRepository.totalOrders(startDate, endDate)
  }

  async averageOrderValue(startDate?: Date, endDate?: Date): Promise<number> {
    return this.orderRepository.averageOrderValue(startDate, endDate)
  }

  async getRecentOrders(startDate?: Date, endDate?: Date): Promise<OrderOutputDTO[]> {
    let queryBuilder = this.orderRepository.createQueryBuilder("order").take(5).orderBy("order.createdAt", "DESC")

    if (startDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt >= :startDate", { startDate })
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt <= :endDate", { endDate })
    }

    const orders = await queryBuilder
      .leftJoinAndSelect("order.items", "items")
      .leftJoinAndSelect("items.book", "book")
      .leftJoinAndSelect("book.categories", "categories")
      .leftJoinAndSelect("book.precificationGroup", "precificationGroup")
      .leftJoinAndSelect("order.customer", "customer")
      .leftJoinAndSelect("order.transaction", "transaction")
      .leftJoinAndSelect("transaction.cardPayments", "cardPayments")
      .leftJoinAndSelect("transaction.coupon", "coupon")
      .getMany()

    return orders.map(OrderMapper.entityToOutputDTO)
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
          cardPayments: true,
          coupon: true,
        },
        customer: true,
      },
    })

    return orders.map(OrderMapper.entityToOutputDTO)
  }

  async update(input: UpdateOrderStatusInputDTO): Promise<OrderOutputDTO> {
    const order = await this.orderRepository.findOne({
      where: {
        id: input.order_id,
      },
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
          cardPayments: true,
          coupon: true,
        },
        customer: true,
      },
    })

    return OrderMapper.entityToOutputDTO(order)
  }

  async index(customerId: number): Promise<OrderOutputDTO[]> {
    const orders = await this.orderRepository.find({
      where: {
        customer: {
          id: customerId,
        },
      },
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          },
        },
        transaction: {
          cardPayments: true,
          coupon: true,
        },
        customer: true,
      },
    })

    return orders.map((order) => OrderMapper.entityToOutputDTO(order))
  }

  async store(input: CreateOrderInputDTO): Promise<OrderOutputDTO> {
    this.dbTransaction.start()
    try {
      const { customer, address, cards, coupon } = await this.validateAndGetOrderData(input)

      if (customer.cart.items.length === 0) {
        throw new Error("Seu carrinho está vazio")
      }

      this.validatePaymentAmounts(input.cards, customer.cart.getTotal(), coupon)

      const order = await this.createOrder(customer, customer.cart, address)

      const transaction = await this.createTransaction(customer.cart, cards, order, coupon)

      order.transaction = transaction
      await this.orderRepository.save(order)

      await this.cartService.clear(input.customer_id)

      await this.sendPaymentToQueue(transaction)

      this.dbTransaction.commit()
      return this.show(order.id)
    } catch (e) {
      this.dbTransaction.rollback()
      throw e
    }
  }

  private validatePaymentAmounts(cardPayments: { amount: number }[], cartTotal: number, coupon: Coupon | null): void {
    const totalPaid = cardPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const expectedTotal = coupon ? cartTotal - coupon.discount : cartTotal
  }

  private async validateAndGetOrderData(input: CreateOrderInputDTO): Promise<{
    customer: Customer
    address: Address
    cards: { card: Card; amount: number }[]
    coupon: Coupon | null
  }> {
    const customer = await this.customerRepository.findOne({
      where: { id: input.customer_id },
      relations: {
        cart: {
          items: {
            stockBook: {
              book: {
                categories: true,
                precificationGroup: true,
              },
            },
          },
        },
      },
    })

    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    const cards = await this.getCards(input, customer)
    const address = await this.validateCustomerAddress(input.address_id, input.customer_id)
    const coupon = await this.getCouponIfExists(input.coupon_code)

    return { customer, address, cards, coupon }
  }

  private async getCards(input: CreateOrderInputDTO, customer: Customer): Promise<{ card: Card; amount: number }[]> {
    const cardPromises = input.cards.map(async (cardPayment) => {
      let card: Card

      if (cardPayment.card_id != null) {
        card = await this.validateCustomerCard(cardPayment.card_id, input.customer_id)
      } else {
        const brand = await this.brandRepository.findOne({
          where: { id: cardPayment.card.brandId },
        })
        card = new Card(
          cardPayment.card.number,
          cardPayment.card.holderName,
          cardPayment.card.cvv,
          customer,
          cardPayment.card.expiryDate,
          brand,
        )
      }

      return { card, amount: cardPayment.amount }
    })

    return Promise.all(cardPromises)
  }

  private async validateCustomerAddress(addressId: number, customerId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ["customer"],
    })
    if (!address || address.customer.id !== customerId) {
      throw new UnauthorizedException("Acesso negado ao endereço")
    }
    return address
  }

  private async validateCustomerCard(cardId: number, customerId: number): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: {
        customer: true,
        brand: true,
      },
    })
    if (!card || card.customer.id !== customerId) {
      throw new UnauthorizedException("Acesso negado ao cartão")
    }
    return card
  }

  private async getCouponIfExists(couponCode?: string): Promise<Coupon | null> {
    if (!couponCode) return null
    return await this.couponRepository.findOne({ where: { code: couponCode } })
  }

  private async createOrder(customer: Customer, cart: Cart, address: Address): Promise<Order> {
    const stockItems = cart.items.map((item) => item.stockBook)

    const alreadySold = stockItems.filter((si) => si.status === StockBookStatus.SOLD)
    if (alreadySold.length > 0) {
      throw new Error(`Os seguintes itens já foram vendidos: ${alreadySold.map((si) => si.id).join(", ")}`)
    }

    const stockBookIds = stockItems.map((si) => si.id)
    const uniqueIds = Array.from(new Set(stockBookIds))
    if (stockBookIds.length !== uniqueIds.length) {
      throw new Error("Itens duplicados encontrados no carrinho")
    }

    for (const stockItem of stockItems) {
      stockItem.status = StockBookStatus.SOLD
      stockItem.saleDate = new Date()
      await this.stockBookRepository.save(stockItem)
    }

    const order = new Order(stockItems, customer, address, "PROCESSING")
    return await this.orderRepository.save(order)
  }

  private async createTransaction(
    cart: Cart,
    cards: { card: Card; amount: number }[],
    order: Order,
    coupon: Coupon | null,
  ): Promise<TransactionEntity> {
    // Calcula o total de todos os pagamentos
    const totalAmount = cards.reduce((sum, { amount }) => sum + amount, 0)

    // Cria a transaction
    const transaction = new TransactionEntity(totalAmount, order, coupon, new Date())
    const savedTransaction = await this.transactionRepository.save(transaction)

    // Cria os CardPayments para cada cartão
    const cardPayments: CardPayment[] = []
    for (const { card, amount } of cards) {
      const cardPayment = new CardPayment(amount, card, savedTransaction)
      const savedCardPayment = await this.cardPaymentRepository.save(cardPayment)
      cardPayments.push(savedCardPayment)
    }

    savedTransaction.cardPayments = cardPayments
    return savedTransaction
  }

  private async sendPaymentToQueue(transaction: TransactionEntity): Promise<void> {
    // Usa o primeiro cardPayment para enviar ao RabbitMQ
    const primaryCardPayment = transaction.cardPayments[0]

    const message: TransactionMessage = {
      id: transaction.id,
      amount: transaction.amount,
      card: {
        cvv: primaryCardPayment.cardCVV,
        expiryDate: primaryCardPayment.cardExpiryDate,
        holderName: primaryCardPayment.cardHolderName,
        number: primaryCardPayment.cardNumber,
      },
    }

    await this.messageService.publish(message)
  }
}
