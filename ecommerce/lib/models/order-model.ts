import type { OrderStatus } from "../enums/order-status"
import { StockBookModel } from "./stock-book-model"
import { TransactionModel } from "./transaction-model"

export class OrderModel {
  id?: number
  address: OrderAddressModel
  status: OrderStatus
  items: StockBookModel[]
  transaction: TransactionModel

  constructor(
    address: OrderAddressModel,
    status: OrderStatus,
    items: StockBookModel[],
    transaction: TransactionModel,
    id?: number,
  ) {
    this.id = id
    this.address = address
    this.status = status
    this.items = items
    this.transaction = transaction
  }

  static fromMap(map: any): OrderModel {
    return new OrderModel(
      OrderAddressModel.fromMap(map.address),
      map.status,
      map.items.map((item: any) => StockBookModel.fromMap(item)),
      TransactionModel.fromMap(map.transaction),
      map.id,
    )
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      address: this.address.toMap(),
      status: this.status,
      items: this.items.map((item) => item.toMap()),
      transaction: this.transaction.toMap(),
    }
  }

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.unitPrice, 0)
  }

  getFinalPrice(): number {
    return Number(this.transaction.amount)
  }

  getCreatedAt(): Date {
    return this.transaction.date
  }
}

export class OrderAddressModel {
  alias: string
  type: string
  residenceType: string
  streetType: string
  street: string
  number: string
  district: string
  zipCode: string
  city: string
  state: string
  country: string
  observations?: string

  constructor(
    alias: string,
    type: string,
    residenceType: string,
    streetType: string,
    street: string,
    number: string,
    district: string,
    zipCode: string,
    city: string,
    state: string,
    country: string,
    observations?: string,
  ) {
    this.alias = alias
    this.type = type
    this.residenceType = residenceType
    this.streetType = streetType
    this.street = street
    this.number = number
    this.district = district
    this.zipCode = zipCode
    this.city = city
    this.state = state
    this.country = country
    this.observations = observations
  }

  static fromMap(map: any): OrderAddressModel {
    return new OrderAddressModel(
      map.alias,
      map.type,
      map.residence_type,
      map.street_type,
      map.street,
      map.number,
      map.district,
      map.zip_code,
      map.city,
      map.state,
      map.country,
      map.observations,
    )
  }

  toMap(): Record<string, any> {
    return {
      alias: this.alias,
      type: this.type,
      residence_type: this.residenceType,
      street_type: this.streetType,
      street: this.street,
      number: this.number,
      district: this.district,
      zip_code: this.zipCode,
      city: this.city,
      state: this.state,
      country: this.country,
      observations: this.observations,
    }
  }
}

export interface OrderRequest {
  address_id: number
  coupon_code?: string
  card?: OrderCardInput
  card_id?: number
  cards?: OrderCardPayment[]
}

export interface OrderCardInput {
  number: string
  holderName: string
  cvv: string
  expiryDate: string
  brandId: number
}

export interface OrderCardPayment {
  cardId?: number // ID for saved cards
  card?: OrderCardInput // Full card data for temporary cards
  amount: number // Amount to charge on this card
}
