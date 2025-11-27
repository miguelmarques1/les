export interface StockAddRequest {
  book_id: number
  supplier: string
  quantity: number
  costs_value: number
}

export interface StockResponse {
  id: number
  book_id: number
  supplier: string
  entry_date: string
  sale_date?: string | null
  costs_value: number
  unit_price: number
  cart_item_id?: number | nulls
  order_item_id?: number | null
}

export interface StockItem extends StockResponse {
  book_details?: {
    id: number
    title: string
    author: string
    publisher: string
    price: number
    cover_image?: string
  }
}

export interface StockListResponse {
  data: StockItem[]
  total: number
}
