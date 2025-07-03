import type { CartModel, CartAddRequest } from "../models/cart-model"
import type { ApiService } from "./api-service"

export class CartService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async addToCart(request: CartAddRequest): Promise<CartModel> {
    return this.apiService.addToCart(request)
  }

  async getCart(): Promise<CartModel> {
    return this.apiService.getCart()
  }

  async removeFromCart(itemIds: number[]): Promise<CartModel> {
    return this.apiService.removeFromCart(itemIds)
  }
}
