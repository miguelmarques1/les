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

// Export types
export type { DashboardData, SalesData, CategoryOverview, RecentOrder } from "./api-service"
export type { User, AuthState } from "./auth-service"
export type { StockAddRequest, StockResponse } from "../models/stock-request"
