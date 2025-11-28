import { AddressModel, type AddressRequest } from "../models/address-model"
import { AuthModel, type LoginRequest } from "../models/auth-model"
import { BookModel } from "../models/book-model"
import { BrandModel } from "../models/brand-model"
import { CardModel, type CardRequest } from "../models/card-model"
import { type CartAddRequest, CartModel } from "../models/cart-model"
import { CouponModel } from "../models/coupon-model"
import { CustomerModel, type CustomerRequest, type CustomerUpdateRequest } from "../models/customer-model"
import { OrderModel, type OrderRequest } from "../models/order-model"
import type { ReturnExchangeModel } from "../models/return-exchange-model"
import type { DashboardData } from "../models/dashboard-model"
import type { StockAddRequest, StockResponse, StockItem } from "../models/stock-request"

// Admin-specific interfaces
export interface AdminAuthRequest {
  email: string
  password: string
}

export interface AdminAuthResponse {
  data: {
    access_token: string
  }
  error: boolean
  message: string | null
}

export type {
  DashboardData,
  DashboardSummary,
  SalesData,
  RecentOrder,
  CategoryOverview,
  DashboardResponse,
} from "../models/dashboard-model"

export class ApiService {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  getAccessToken(): string | null {
    return this.accessToken
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
    return responseData.data || responseData
  }

  // Admin Authentication
  async authenticateAdmin(email: string, password: string): Promise<string> {
    const request: AdminAuthRequest = { email, password }
    const response = await this.request<{ access_token: string }>("/admin/auth", "POST", request)

    const token = response.access_token
    this.setAccessToken(token)
    return token
  }

  async getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    let endpoint = "/admin/dashboard"
    const params = new URLSearchParams()

    if (startDate) {
      params.append("startDate", startDate)
    }
    if (endDate) {
      params.append("endDate", endDate)
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const response = await this.request<DashboardData>(endpoint)
    return response
  }

  // Legacy Authentication (keeping for compatibility)
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
    const data = await this.request<any[]>("/book", "GET")
    return data.map((item) => BookModel.fromMap(item))
  }

  async getBookById(id: number): Promise<BookModel> {
    const data = await this.request<any>(`/book/${id}`)
    return BookModel.fromMap(data)
  }

  async searchBooks(query?: string): Promise<BookModel[]> {
    const endpoint = query ? `/book?query=${encodeURIComponent(query)}` : "/book"
    const data = await this.request<any[]>(endpoint)
    return data.map((item) => BookModel.fromMap(item))
  }

  // Stock
  async addStock(stockData: StockAddRequest): Promise<StockResponse> {
    return await this.request<StockResponse>("/stock", "POST", stockData)
  }

  async getStockItems(): Promise<StockItem[]> {
    const data = await this.request<StockItem[]>("/stock")
    return data
  }

  async getStockItemById(id: number): Promise<StockItem> {
    return await this.request<StockItem>(`/stock/${id}`)
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
    const data = await this.request<any[]>("/order")
    return data.map((item: any) => OrderModel.fromMap(item))
  }

  async getAllOrders(): Promise<any[]> {
    const data = await this.request<any[]>("/admin/orders")
    return data
  }

  async getOrderById(id: number): Promise<OrderModel> {
    const data = await this.request<any>(`/admin/orders/${id}`)
    return OrderModel.fromMap(data)
  }

  async updateOrderStatus(id: number, status: string): Promise<any> {
    return await this.request<any>(`/order/${id}`, "PUT", { status })
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

  // Cards
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
    const data = await this.request<any[]>("/admin/brands")
    return data.map((item) => BrandModel.fromMap(item))
  }

  async createBrand(request: { name: string }): Promise<BrandModel> {
    const data = await this.request<any>("/admin/brands", "POST", request)
    return BrandModel.fromMap(data)
  }

  async deleteBrand(id: number): Promise<void> {
    await this.request<any>(`/admin/brands/${id}`, "DELETE")
  }

  // Coupons
  async getCoupons(): Promise<CouponModel[]> {
    const data = await this.request<any[]>("/admin/coupons")
    return data.map((item) => CouponModel.fromMap(item))
  }

  async createCoupon(request: {
    code: string
    discount: number
    type: string
    status: string
    expiryDate: string
  }): Promise<CouponModel> {
    const data = await this.request<any>("/admin/coupons", "POST", request)
    return CouponModel.fromMap(data)
  }

  async toggleCouponStatus(id: number, status: string): Promise<CouponModel> {
    const data = await this.request<any>(`/admin/coupons/${id}/status`, "PUT", { status })
    return CouponModel.fromMap(data)
  }

  // Return/Exchange methods
  async getMyReturnExchangeRequests(): Promise<ReturnExchangeModel[]> {
    const data = await this.request<any[]>("/return-exchange-requests/my-requests")
    return data
  }

  async getAllReturnExchangeRequests(): Promise<ReturnExchangeModel[]> {
    const data = await this.request<any[]>("/admin/returns")
    return data
  }

  async createReturnExchangeRequest(data: {
    description: string
    order_item_ids: number[]
    type: "exchange" | "return"
  }): Promise<any> {
    return await this.request<any>("/return-exchange-requests", "POST", data)
  }

  async updateReturnExchangeStatus(requestId: number, status: string): Promise<any> {
    return await this.request<any>(`/admin/returns/${requestId}/status`, "PUT", { status })
  }

  // Admin-specific methods
  async getAllUsers(): Promise<any[]> {
    const data = await this.request<any[]>("/admin/users")
    return data
  }
}
