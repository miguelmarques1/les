import type { OrderStatus } from "../enums/order-status"
import { AddressModel } from "./address-model"
import { StockBookModel } from "./stock-book-model"
import { TransactionModel } from "./transaction-model"

export class OrderModel {
  id?: number
  address: AddressModel
  status: OrderStatus
  items: StockBookModel[]
  transaction: TransactionModel

  constructor(
    address: AddressModel,
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
      AddressModel.fromMap(map.address),
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
}

export interface OrderRequest {
  address_id: number
  payment_method: string
  card_id?: number
  coupon_code?: string
}
