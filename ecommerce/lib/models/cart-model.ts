import { StockBookModel } from "./stock-book-model"

export class CartModel {
  id?: number
  items: StockBookModel[]
  total: number
  freightValue: number

  constructor(items: StockBookModel[], total: number, freightValue: number, id?: number) {
    this.id = id
    this.items = items
    this.total = total
    this.freightValue = freightValue
  }

  static fromMap(map: any): CartModel {
    return new CartModel(
      map.items.map((item: any) => StockBookModel.fromMap(item)),
      map.total,
      map.freightValue,
      map.id,
    )
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      items: this.items.map((item) => item.toMap()),
      total: this.total,
      freightValue: this.freightValue,
    }
  }
}

export interface CartAddRequest {
  book_id: number
  quantity: number
}


export interface GroupedCartItem {
  bookId: number
  title: string
  author: string
  coverImage?: string
  unitPrice: number
  quantity: number
  stockItems: StockBookModel[]
}