import type { ApiResponse } from "@/types/api-response"
import { AddressModel, type AddressRequest } from "../models/address-model"
import { AuthModel, type LoginRequest } from "../models/auth-model"
import { BookModel } from "../models/book-model"
import { BrandModel } from "../models/brand-model"
import { CardModel, type CardRequest } from "../models/card-model"
import { type CartAddRequest, CartModel } from "../models/cart-model"
import { CouponCreateRequest, CouponModel, type CouponValidateRequest } from "../models/coupon-model"
import { CustomerModel, type CustomerRequest, type CustomerUpdateRequest } from "../models/customer-model"
import { DashboardModel, type DashboardData } from "../models/dashboard-model"
import { OrderModel, type OrderRequest } from "../models/order-model"
import type { ReturnExchangeModel, UpdateReturnExchangeStatusRequest } from "../models/return-exchange-model"

export interface AdminAuthRequest {
  email: string
  password: string
}

export interface AdminAuthData {
  access_token: string
}

export class ApiService {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api") {
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

    if (body && method !== "GET") {
      options.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: true,
          message: `Request failed with status ${response.status}`,
        }))
        throw new Error(errorData.message || `API request failed with status ${response.status}`)
      }

      const responseData: ApiResponse<T> = await response.json()

      if (responseData.error) {
        throw new Error(responseData.message || "API returned an error")
      }

      return responseData.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("An unexpected error occurred")
    }
  }

  // ==================== ADMIN ENDPOINTS ====================

  // Admin Authentication
  async authenticateAdmin(email: string, password: string): Promise<string> {
    const request: AdminAuthRequest = { email, password }
    const data = await this.request<AdminAuthData>("/admin/auth", "POST", request)
    const token = data.access_token
    this.setAccessToken(token)
    return token
  }

  // Admin Dashboard
  async getDashboardData(startDate?: string, endDate?: string): Promise<DashboardModel> {
    if (!this.accessToken) {
      throw new Error("Authentication required")
    }

    let endpoint = "/admin/dashboard"
    const params = new URLSearchParams()

    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    const data = await this.request<DashboardData>(endpoint)
    return DashboardModel.fromMap(data)
  }

  // Admin Users
  async getAllUsers(): Promise<CustomerModel[]> {
    const data = await this.request<any[]>("/admin/users")
    return data.map((item) => CustomerModel.fromMap(item))
  }

  // Admin Orders
  async getAllOrders(): Promise<OrderModel[]> {
    const data = await this.request<any[]>("/admin/orders")
    return data.map((item) => OrderModel.fromMap(item))
  }

  async getOrderById(id: number): Promise<OrderModel> {
    const data = await this.request<any>(`/admin/orders/${id}`)
    return OrderModel.fromMap(data)
  }

  async updateOrderStatus(id: number, status: string): Promise<OrderModel> {
    const data = await this.request<any>(`/admin/orders/${id}/status`, "PATCH", { status })
    return OrderModel.fromMap(data)
  }

  // Admin Brands
  async getAllBrands(): Promise<BrandModel[]> {
    const data = await this.request<any[]>("/admin/brands")
    return data.map((item) => BrandModel.fromMap(item))
  }

  async createBrand(name: string): Promise<BrandModel> {
    const data = await this.request<any>("/admin/brands", "POST", { name })
    return BrandModel.fromMap(data)
  }

  async deleteBrand(id: number): Promise<void> {
    await this.request<void>(`/admin/brands/${id}`, "DELETE")
  }

  // Admin Coupons
  async getAllCoupons(): Promise<CouponModel[]> {
    const data = await this.request<any[]>("/admin/coupons")
    return data.map((item) => CouponModel.fromMap(item))
  }

  async createCoupon(couponData: CouponCreateRequest): Promise<CouponModel> {
    const data = await this.request<any>("/admin/coupons", "POST", couponData)
    return CouponModel.fromMap(data)
  }

  async updateCouponStatus(id: number, status: string): Promise<CouponModel> {
    const data = await this.request<any>(`/admin/coupons/${id}/status`, "PATCH", { status })
    return CouponModel.fromMap(data)
  }

  // Admin Returns/Exchanges
  async getAllReturnExchangeRequests(): Promise<ReturnExchangeModel[]> {
    const data = await this.request<any[]>("/admin/returns")
    return data
  }

  async updateReturnExchangeStatus(requestId: number, status: string): Promise<ReturnExchangeModel> {
    const request: UpdateReturnExchangeStatusRequest = { status }
    const data = await this.request<any>(`/admin/returns/${requestId}/status`, "PATCH", request)
    return data
  }

  // ==================== CUSTOMER ENDPOINTS ====================

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthModel> {
    const data = await this.request<any>("/auth/login", "POST", credentials)
    const authModel = AuthModel.fromMap(data)
    this.setAccessToken(authModel.accessToken)
    return authModel
  }

  // Customer Profile
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
    const data = await this.request<any[]>("/book")
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
  async addStock(stockData: {
    book_id: number
    supplier: string
    quantity: number
    costs_value: number
  }): Promise<any> {
    return await this.request<any>("/stock", "POST", stockData)
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

  // Brands (Customer)
  async getBrands(): Promise<BrandModel[]> {
    const data = await this.request<any[]>("/brand")
    return data.map((item) => BrandModel.fromMap(item))
  }

  // Coupons (Customer)
  async validateCoupon(request: CouponValidateRequest): Promise<CouponModel> {
    const data = await this.request<any>("/coupon/validate", "POST", request)
    return CouponModel.fromMap(data)
  }

  // Return/Exchange Requests (Customer)
  async getMyReturnExchangeRequests(): Promise<ReturnExchangeModel[]> {
    const data = await this.request<any[]>("/return-exchange-requests/my-requests")
    return data
  }

  async createReturnExchangeRequest(requestData: {
    description: string
    order_item_ids: number[]
    type: "exchange" | "return"
  }): Promise<any> {
    return await this.request<any>("/return-exchange-requests", "POST", requestData)
  }
}
