import { Repository } from "typeorm"
import { CartItem } from "../domain/entity/CartItem"
import { StockBookStatus } from "../domain/enums/StockBookStatus"
import type { AddCartItemInputDTO } from "../dto/cart-item.dto"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { StockBook } from "../domain/entity/StockBook"
import { Cart } from "../domain/entity/Cart"
import e = require("express")

export interface CartItemServiceInterface {
  store(input: AddCartItemInputDTO): Promise<void>
  delete(id: number): Promise<void>
}

export class CartItemService implements CartItemServiceInterface {
  private cartItemRepository: Repository<CartItem>
  private stockBookRepository: Repository<StockBook>
  private cartRepository: Repository<Cart>

  public constructor(repositoryFactory: RepositoryFactory) {
    this.cartItemRepository = repositoryFactory.getCartItemRepository()
    this.stockBookRepository = repositoryFactory.getStockBookRepository()
    this.cartRepository = repositoryFactory.getCartRepository()
  }

  async delete(id: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        stockBook: true,
      },
    })

    await this.cartItemRepository.delete(cartItem.id)
  }

  async store(input: AddCartItemInputDTO): Promise<void> {
    const stockBooks = await this.stockBookRepository.find({
      where: {
        book: {
          id: input.book_id,
        }
      },
      take: input.quantity,
    })
    if(stockBooks.length < input.quantity) {
      throw new Error('Não tem essa quantidade em estoque')
    }

    const cart = await this.cartRepository.findOne({
      where: {
        id: input.cart_id,
      }
    })

    for (const stockBook of stockBooks) {
      const cartItem = new CartItem(cart, stockBook, new Date())
      await this.cartItemRepository.save(cartItem)

      stockBook.status = StockBookStatus.BLOCKED
      await this.stockBookRepository.save(stockBook)
    }
  }
}
