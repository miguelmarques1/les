import type { PaymentMethod } from "../enums/payment-method"
import type { TransactionStatus } from "../enums/transaction-status"
import { CouponModel } from "./coupon-model"

export class TransactionModel {
  id?: number
  paymentMethod: PaymentMethod
  card?: TransactionCardModel
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
    card?: TransactionCardModel,
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
      map.paymentMethod, // Assumindo que sempre será cartão de crédito por enquanto
      map.status, // Status padrão
      Number(map.amount),
      new Date(map.date),
      map.id,
      map.card ? TransactionCardModel.fromMap(map.card) : undefined,
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
      date: this.createdAt.toISOString(),
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

export class TransactionCardModel {
  number: string
  holderName: string
  expiryDate: string
  brandId: number

  constructor(number: string, holderName: string, expiryDate: string, brandId: number) {
    this.number = number
    this.holderName = holderName
    this.expiryDate = expiryDate
    this.brandId = brandId
  }

  static fromMap(map: any): TransactionCardModel {
    return new TransactionCardModel(map.number, map.holder_name, map.expiry_date, map.brand_id)
  }

  toMap(): Record<string, any> {
    return {
      number: this.number,
      holder_name: this.holderName,
      expiry_date: this.expiryDate,
      brand_id: this.brandId,
    }
  }

  // Método para obter os últimos 4 dígitos do cartão
  getLastFourDigits(): string {
    return this.number.slice(-4)
  }

  // Método para obter o nome da bandeira
  getBrandName(): string {
    switch (this.brandId) {
      case 1:
        return "Visa"
      case 2:
        return "Mastercard"
      case 3:
        return "American Express"
      case 4:
        return "Elo"
      default:
        return "Cartão"
    }
  }
}
