import { ApiService } from "./api-service"
import { AuthService } from "./auth-service"
import { BookService } from "./book-service"
import { BrandService } from "./brand-service"
import { CardService } from "./card-service"
import { CartService } from "./cart-service"
import { CouponService } from "./coupon-service"
import { CustomerService } from "./customer-service"
import { OrderService } from "./order-service"
import { ReturnExchangeService } from "./return-exchange-service"

// Criar instância do serviço de API
const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api")

// Criar instâncias dos serviços específicos
const authService = new AuthService(apiService)
const bookService = new BookService(apiService)
const brandService = new BrandService(apiService)
const cardService = new CardService(apiService)
const cartService = new CartService(apiService)
const couponService = new CouponService(apiService)
const customerService = new CustomerService(apiService)
const orderService = new OrderService(apiService)
const returnExchangeService = new ReturnExchangeService(apiService)

// Exportar serviços
export const services = {
  api: apiService,
  auth: authService,
  book: bookService,
  brand: brandService,
  card: cardService,
  cart: cartService,
  coupon: couponService,
  customer: customerService,
  order: orderService,
  returnExchangeService: returnExchangeService,
}

export {
  authService,
  cartService,
  addressService,
  bookService,
  brandService,
  cardService,
  couponService,
  customerService,
  orderService,
  returnExchangeService,
  apiService,
}

import { AddressService } from "./address-service"
const addressService = new AddressService(apiService)
