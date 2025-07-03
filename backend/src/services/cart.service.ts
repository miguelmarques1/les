import { Repository } from "typeorm";
import { AddToCartInputDTO, CartOutputDTO } from "../dto/cart.dto";
import { CartMapper } from "../mapper/CartMapper";
import { CartItemService, CartItemServiceInterface } from "./cart-item.service";
import { Cart } from "../domain/entity/Cart";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { Customer } from "../domain/entity/Customer";
import { NotFoundException } from "../exceptions/NotFoundException";
import { StockBook } from "../domain/entity/StockBook";

export interface CartServiceInterface {
    show(customerId: number): Promise<CartOutputDTO>;
    store(input: AddToCartInputDTO): Promise<CartOutputDTO>;
    delete(items: number[], customerId: number): Promise<CartOutputDTO>;
    clear(customerId: number): Promise<CartOutputDTO>;
}

export class CartService implements CartServiceInterface {
    private cartRepository: Repository<Cart>;
    private cartItemService: CartItemService;
    private customerRepository: Repository<Customer>;
    private stockBookRepository: Repository<StockBook>;

    public constructor(
        repositoryFactory: RepositoryFactory,
    ) {
        this.cartRepository = repositoryFactory.getCartRepository();
        this.cartItemService = new CartItemService(repositoryFactory);
        this.customerRepository = repositoryFactory.getCustomerRepository();
        this.stockBookRepository = repositoryFactory.getStockBookRepository();
    }

    async clear(customerId: number): Promise<CartOutputDTO> {
        const cart = await this.findOrCreate(customerId);
        for (let cartItem of cart.items) {
            await this.cartItemService.delete(cartItem.id)
        }

        return this.show(customerId);
    }

    async delete(items: number[], customerId: number): Promise<CartOutputDTO> {
        for (let item of items) {
            await this.cartItemService.delete(item)
        }

        return this.show(customerId);
    }

    async store(input: AddToCartInputDTO): Promise<CartOutputDTO> {
        const cart = await this.findOrCreate(input.customer_id);
        await this.cartItemService.store({
            book_id: input.book_id,
            cart_id: cart.id,
            quantity: input.quantity,
        });

        return this.show(input.customer_id);
    }

    async show(customerId: number): Promise<CartOutputDTO> {
        const cart = await this.findOrCreate(customerId);

        for (let item of cart.items) {
            const stockBook: StockBook = item.stockBook;
            const bookId = stockBook.book.id;
            const result = await this.stockBookRepository
                .createQueryBuilder("stock")
                .select("MAX(stock.costsValue)", "highest")
                .where("stock.book_id = :bookId", { bookId })
                .getRawOne();

            const highestCost = parseFloat(result?.highest) || 0;

            for (const item of cart.items) {
                item.stockBook.higherCostsValue = highestCost;
            }
        }

        return CartMapper.entityToOutputDTO(cart);
    }

    private async findOrCreate(customerId: number): Promise<Cart> {
        const customer = await this.customerRepository.findOne({
            where: {
                id: customerId,
            }
        });
        if (!customer) {
            throw new NotFoundException("Cliente não encontrado")
        }

        let cart = await this.cartRepository.findOne({
            where: {
                customer: {
                    id: customer.id,
                },
            },
            relations: {
                items: {
                    stockBook: {
                        book: {
                            categories: true,
                            precificationGroup: true,
                        },
                    },
                }
            }
        });
        if (!cart) {
            const entity = new Cart([], customer);
            cart = await this.cartRepository.save(entity);
        }

        return cart;
    }
}
