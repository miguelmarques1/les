import type { BookModel } from "../models/book-model"
import type { ApiService } from "./api-service"

export class BookService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getAllBooks(): Promise<BookModel[]> {
    return this.apiService.getAllBooks()
  }

  async getBookById(id: number): Promise<BookModel> {
    return this.apiService.getBookById(id)
  }

  async searchBooks(query?: string): Promise<BookModel[]> {
    return this.apiService.searchBooks(query)
  }

  async addStock(stockData: {
    book_id: number
    supplier: string
    quantity: number
    costs_value: number
  }): Promise<any> {
    return this.apiService.addStock(stockData)
  }
}
