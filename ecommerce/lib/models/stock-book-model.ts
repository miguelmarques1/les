import { BookModel } from "./book-model"

export class StockBookModel {
  id?: number
  bookDetails: BookModel
  entryDate: Date
  saleDate?: Date
  supplier: string
  costsValue: number
  unitPrice: number
  cartItemId?: number
  orderItemId?: number

  constructor(
    bookDetails: BookModel,
    entryDate: Date,
    supplier: string,
    costsValue: number,
    unitPrice: number,
    id?: number,
    saleDate?: Date,
    cartItemId?: number,
    orderItemId?: number,
  ) {
    this.id = id
    this.bookDetails = bookDetails
    this.entryDate = entryDate
    this.saleDate = saleDate
    this.supplier = supplier
    this.costsValue = costsValue
    this.unitPrice = unitPrice
    this.cartItemId = cartItemId
    this.orderItemId = orderItemId
  }

  static fromMap(map: any): StockBookModel {
    return new StockBookModel(
      BookModel.fromMap(map.book_details),
      new Date(map.entry_date),
      map.supplier,
      map.costs_value,
      map.unit_price,
      map.id,
      map.sale_date ? new Date(map.sale_date) : undefined,
      map.cart_item_id,
      map.order_item_id,
    )
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      book_details: this.bookDetails.toMap(),
      entry_date: this.entryDate.toISOString(),
      sale_date: this.saleDate?.toISOString(),
      supplier: this.supplier,
      costs_value: this.costsValue,
      unit_price: this.unitPrice,
      cart_item_id: this.cartItemId,
      order_item_id: this.orderItemId,
    }
  }
}
