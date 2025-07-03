import type { BookModel } from "../models/book-model"
import type { StockBookModel } from "../models/stock-book-model"
import type { ApiService } from "./api-service"

export class BookService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getAllBooks(): Promise<BookModel[]> {
    return await this.apiService.getAllBooks()
  }

  async getBookById(id: number): Promise<BookModel> {
    return await this.apiService.getBookById(id)
  }

  async getRecommendedBooks(): Promise<BookModel[]> {
    return await this.apiService.getRecommendedBooks()
  }
}
