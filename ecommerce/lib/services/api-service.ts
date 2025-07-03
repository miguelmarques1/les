import { AddressModel, type AddressRequest } from "../models/address-model"
import { AuthModel, type LoginRequest } from "../models/auth-model"
import { BookModel } from "../models/book-model"
import { BrandModel } from "../models/brand-model"
import { CardModel, type CardRequest } from "../models/card-model"
import { type CartAddRequest, CartModel } from "../models/cart-model"
import type { ChatMessage, ChatResponse } from "../models/chat-model"
import { CouponModel, type CouponValidateRequest } from "../models/coupon-model"
import { CustomerModel, type CustomerRequest, type CustomerUpdateRequest } from "../models/customer-model"
import { OrderModel, type OrderRequest } from "../models/order-model"

export class ApiService {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  private async request<T>(endpoint: string, method = "GET", body?: any): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    const responseData = await response.json()

    return responseData.data
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthModel> {
    const data = await this.request<any>("/auth/login", "POST", credentials)
    const authModel = AuthModel.fromMap(data)
    this.setAccessToken(authModel.accessToken)
    return authModel
  }

  // Customer
  async registerCustomer(customer: CustomerRequest): Promise<CustomerModel> {
    const data = await this.request<any>("/customers", "POST", customer)
    return CustomerModel.fromMap(data)
  }

  async getCustomerProfile(): Promise<CustomerModel> {
    const data = await this.request<any>("/customers")
    return CustomerModel.fromMap(data)
  }

  async updateCustomerProfile(updateData: CustomerUpdateRequest): Promise<CustomerModel> {
    const data = await this.request<any>("/customers", "PUT", updateData)
    return CustomerModel.fromMap(data)
  }

  // Books
  async getAllBooks(): Promise<BookModel[]> {
    const data = await this.request<any[]>("/stock")
    return data.map((item) => BookModel.fromMap(item))
  }

  async getBookById(id: number): Promise<BookModel> {
    const data = await this.request<any>(`/stock/${id}`)
    return BookModel.fromMap(data)
  }

  // Cart
  async addToCart(request: CartAddRequest): Promise<CartModel> {
    const data = await this.request<any>("/cart/add", "POST", request)
    return CartModel.fromMap(data)
  }

  async getCart(): Promise<CartModel> {
    const data = await this.request<any>("/cart")
    return CartModel.fromMap(data)
  }

  async removeFromCart(itemIds: number[]): Promise<CartModel> {
    const data = await this.request<any>("/cart", "DELETE", { items: itemIds })
    return CartModel.fromMap(data)
  }

  // Orders
  async createOrder(request: OrderRequest): Promise<OrderModel> {
    const data = await this.request<any>("/order", "POST", request)
    return OrderModel.fromMap(data)
  }

  async getOrders(): Promise<OrderModel[]> {
    const data = await this.request<any>("/order")
    return data.map((item: any) => OrderModel.fromMap(item))
  }

  async getOrderById(id: number): Promise<OrderModel> {
    const data = await this.request<any>(`/order/${id}`)
    return OrderModel.fromMap(data)
  }

  // Addresses
  async getAddresses(): Promise<AddressModel[]> {
    const data = await this.request<any[]>("/address")
    return data.map((item) => AddressModel.fromMap(item))
  }

  async createAddress(address: AddressRequest): Promise<AddressModel> {
    const data = await this.request<any>("/address", "POST", address)
    return AddressModel.fromMap(data)
  }

  async updateAddress(id: number, address: AddressRequest): Promise<AddressModel> {
    const data = await this.request<any>(`/address/${id}`, "PUT", address)
    return AddressModel.fromMap(data)
  }

  async deleteAddress(id: number): Promise<void> {
    await this.request<any>(`/address/${id}`, "DELETE")
  }

  async createCard(card: CardRequest): Promise<CardModel> {
    const data = await this.request<any>("/card", "POST", card)
    return CardModel.fromMap(data)
  }

  async getCards(): Promise<CardModel[]> {
    const data = await this.request<any[]>("/card")
    return data.map((item) => CardModel.fromMap(item))
  }

  async deleteCard(id: number): Promise<void> {
    await this.request<any>(`/card/${id}`, "DELETE")
  }

  // Brands
  async getBrands(): Promise<BrandModel[]> {
    const data = await this.request<any[]>("/brand")
    return data.map((item) => BrandModel.fromMap(item))
  }

  // Coupons
  async validateCoupon(request: CouponValidateRequest): Promise<CouponModel> {
    const data = await this.request<any>("/coupon/validate", "POST", request)
    return CouponModel.fromMap(data)
  }

  // Return/Exchange methods
  async getMyReturnExchangeRequests() {
    const data = await this.request<any[]>("/return-exchange-requests/my-requests")
    return data
  }

  async createReturnExchangeRequest(data: { description: string; order_item_ids: number[]; type: string }) {
    const response = await this.request<any[]>("/return-exchange-requests", "POST", data)
    return response
  }

  async updateReturnExchangeStatus(requestId: number, data: { status: string }) {
    const response = await this.request<any[]>(`/return-exchange-requests/${requestId}/status`, "PUT", data)
    return response
  }

  async sendChatMessage(message: string, history: ChatMessage[] = []): Promise<ChatResponse> {
    try {
      console.log("Enviando mensagem para chat:", message)
      console.log("Histórico:", history)

      const requestBody = {
        message: message.trim(),
        history: history.map((msg) => ({
          content: msg.content,
          role: msg.isUser ? 'user' : 'model'
        })),
      }

      const response = await this.request<ChatResponse>("/recommendations", "POST", requestBody)

      console.log("Resposta do chat recebida:", response)

      if (typeof response === "string") {
        return {
          message: response,
          recommendations: [],
        }
      }

      return {
        message: response.message || response.toString(),
        recommendations: response.recommendations || [],
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem para chat:", error)
      throw error
    }
  }
}
