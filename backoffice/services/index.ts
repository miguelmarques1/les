import { ApiService } from "./api-service"
import { AuthService } from "./auth-service"
import { BookService } from "./book-service"
import { CouponService } from "./coupon-service"
import { CustomerService } from "./customer-service"
import { AddressService } from "./address-service"
import { CartService } from "./cart-service"
import { BrandService } from "./brand-service"
import { CardService } from "./card-service"
import { ReturnExchangeService } from "./return-exchange-service"
import { OrderService } from "./order-service"

// Create single instances to be shared across the app
export const apiService = new ApiService()
export const authService = new AuthService()
export const bookService = new BookService(apiService)
export const couponService = new CouponService(apiService)
export const customerService = new CustomerService(apiService)
export const addressService = new AddressService(apiService)
export const cartService = new CartService(apiService)
export const brandService = new BrandService(apiService)
export const cardService = new CardService(apiService)
export const returnExchangeService = new ReturnExchangeService(apiService)
export const orderService = new OrderService(apiService)

// Export services object for easier imports
export const services = {
  apiService,
  authService,
  bookService,
  couponService,
  customerService,
  addressService,
  cartService,
  brandService,
  cardService,
  returnExchangeService,
  order: orderService,
}

// Export model types
export type {
  DashboardData,
  DashboardSummary,
  SalesDataItem,
  CategoryOverviewItem,
  RecentOrderItem,
} from "../models/dashboard-model"
export type { UserData } from "../models/user-model"
export type { CouponModel, CouponCreateRequest } from "../models/coupon-model"
export type { BrandModel, BrandCreateRequest } from "../models/brand-model"
export type { ReturnExchangeModel } from "../models/return-exchange-model"
export type { AdminAuthRequest } from "../models/admin-auth-model"
export type { ApiResponse } from "../types/api-response"
export type { User, AuthState } from "./auth-service"
export type { StockBookModel } from "../models/stock-book-model"
