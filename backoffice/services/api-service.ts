import { AddressModel, type AddressRequest } from "../models/address-model"
import { AuthModel, type LoginRequest } from "../models/auth-model"
import { BookModel } from "../models/book-model"
import { BrandModel } from "../models/brand-model"
import { CardModel, type CardRequest } from "../models/card-model"
import { type CartAddRequest, CartModel } from "../models/cart-model"
import { CouponModel, type CouponValidateRequest } from "../models/coupon-model"
import { CustomerModel, type CustomerRequest, type CustomerUpdateRequest } from "../models/customer-model"
import { OrderModel, type OrderRequest } from "../models/order-model"
import type { ReturnExchangeModel } from "../models/return-exchange-model"

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

export interface DashboardSummary {
  totalSales: number
  formattedTotalSales: string
  totalOrders: number
  averageOrderValue: number
  formattedAverageOrderValue: string
  inventoryCount: number
  lowStockItems: number
}

export interface SalesData {
  month: string
  monthNumber: number
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  year: number
}

export interface RecentOrder {
  id: number
  address: {
    id: number
    alias: string
    type: string
    residence_type: string
    street_type: string
    street: string
    number: string
    district: string
    zip_code: string
    city: string
    state: string
    country: string
    customerId: number
    observations: string
  }
  status: string
  items: Array<{
    status: string
    code: string
    supplier: string
    costs_value: number
    book_details: any
    entry_date: string
    id: number
    sale_date: string
    unit_price: number
    order_item_id: number
  }>
  transaction: {
    id: number
    amount: number
    card: {
      id: number
      number: string
      holder_name: string
      expiry_date: string
      brand_id: number
      customer_id: number
    }
    date: string
    coupon: {
      id: number
      code: string
      discount: number
      type: string
      status: string
      expiryDate: string
    }
  }
}

export interface CategoryOverview {
  categoryId: number
  categoryName: string
  percentage: number
  totalItems: number
  colorCode: string
}

export interface DashboardData {
  summary: DashboardSummary
  salesData: SalesData[]
  recentOrders: RecentOrder[]
  categoryOverview: CategoryOverview[]
}

export interface DashboardResponse {
  data: DashboardData
  error: boolean
  message: string | null
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

  // Dashboard Data
  async getDashboardData(): Promise<DashboardData> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    const response = await this.request<DashboardData>("/admin/dashboard")
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

  async getAllOrders(): Promise<any[]> {
    const data = await this.request<any[]>("/order/all")
    return data
  }

  async getOrderById(id: number): Promise<OrderModel> {
    const data = await this.request<any>(`/order/${id}`)
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
    const data = await this.request<any[]>("/brand")
    return data.map((item) => BrandModel.fromMap(item))
  }

  // Coupons
  async validateCoupon(request: CouponValidateRequest): Promise<CouponModel> {
    const data = await this.request<any>("/coupon/validate", "POST", request)
    return CouponModel.fromMap(data)
  }

  // Return/Exchange methods
  async getMyReturnExchangeRequests(): Promise<ReturnExchangeModel[]> {
    const data = await this.request<any[]>("/return-exchange-requests/my-requests")
    return data
  }

  async getAllReturnExchangeRequests(): Promise<ReturnExchangeModel[]> {
    const data = await this.request<any[]>("/return-exchange-requests")
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
    return await this.request<any>(`/return-exchange-requests/${requestId}/status`, "PUT", { status })
  }
}
