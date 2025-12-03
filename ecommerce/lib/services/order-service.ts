import type { PaymentMethod } from "../enums/payment-method"
import type { OrderModel, OrderCardInput, OrderCardPayment } from "../models/order-model"
import type { ApiService } from "./api-service"

export class OrderService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async createOrder(
    addressId: number,
    paymentMethod: PaymentMethod,
    cardId?: number,
    couponCode?: string,
    temporaryCard?: OrderCardInput,
    multipleCards?: OrderCardPayment[],
  ): Promise<OrderModel> {
    const request: any = {
      address_id: addressId,
    }

    if (couponCode) {
      request.coupon_code = couponCode
    }

    if (multipleCards && multipleCards.length > 0) {
      request.cards = multipleCards.map((payment) => ({
        card_id: payment.cardId,
        card: payment.card,
        amount: payment.amount,
      }))
    } else if (temporaryCard) {
      request.card = {
        number: temporaryCard.number,
        holderName: temporaryCard.holderName,
        cvv: temporaryCard.cvv,
        expiryDate: temporaryCard.expiryDate,
        brandId: temporaryCard.brandId,
      }
    } else if (cardId) {
      request.card_id = cardId
    }

    return await this.apiService.createOrder(request)
  }

  async getOrders(): Promise<OrderModel[]> {
    return await this.apiService.getOrders()
  }

  async getOrderById(id: number): Promise<OrderModel> {
    return await this.apiService.getOrderById(id)
  }
}
