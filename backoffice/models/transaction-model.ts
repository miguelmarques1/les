import type { PaymentMethod } from "../enums/payment-method"
import type { TransactionStatus } from "../enums/transaction-status"
import { CardModel } from "./card-model"
import { CouponModel } from "./coupon-model"

export class TransactionModel {
  id?: number
  paymentMethod: PaymentMethod
  card?: CardModel
  coupon?: CouponModel
  status: TransactionStatus
  amount: number
  createdAt: Date

  constructor(
    paymentMethod: PaymentMethod,
    status: TransactionStatus,
    amount: number,
    createdAt: Date,
    id?: number,
    card?: CardModel,
    coupon?: CouponModel,
  ) {
    this.id = id
    this.paymentMethod = paymentMethod
    this.card = card
    this.coupon = coupon
    this.status = status
    this.amount = amount
    this.createdAt = createdAt
  }

  static fromMap(map: any): TransactionModel {
    return new TransactionModel(
      map.payment_method,
      map.status,
      map.amount,
      new Date(map.created_at || map.date),
      map.id,
      map.card ? CardModel.fromMap(map.card) : undefined,
      map.coupon ? CouponModel.fromMap(map.coupon) : undefined,
    )
  }

  getFinalPrice(): number {
    if (this.coupon) {
      return this.coupon.applyDiscount(this.amount)
    }
    return this.amount
  }

  toMap(): Record<string, any> {
    const map: Record<string, any> = {
      id: this.id,
      payment_method: this.paymentMethod,
      status: this.status,
      amount: this.amount,
      created_at: this.createdAt.toISOString(),
    }

    if (this.card) {
      map.card = this.card.toMap()
    }

    if (this.coupon) {
      map.coupon = this.coupon.toMap()
    }

    return map
  }
}
