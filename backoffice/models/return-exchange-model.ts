import type { BookModel } from "./book-model"

export interface ReturnExchangeItemModel {
  id: number
  status: string
  code: string
  supplier: string
  costs_value: number
  book_details: BookModel
  entry_date: string
  sale_date: string
  unit_price: number
}

export interface ReturnExchangeModel {
  id: number
  description: string
  customer_id: number
  status: string
  items: ReturnExchangeItemModel[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateReturnExchangeRequest {
  description: string
  order_item_ids: number[]
  type: "exchange" | "return"
}

export interface UpdateReturnExchangeStatusRequest {
  status: string
}
