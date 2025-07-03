import type { CartModel } from "../models/cart-model"
import type { ApiService } from "./api-service"

export class CartService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async addToCart(bookId: number, quantity: number): Promise<CartModel> {
    return await this.apiService.addToCart({
      book_id: bookId,
      quantity: quantity,
    })
  }

  async getCart(): Promise<CartModel> {
    return await this.apiService.getCart()
  }

  async removeFromCart(itemIds: number[]): Promise<CartModel> {
    return await this.apiService.removeFromCart(itemIds)
  }
}
