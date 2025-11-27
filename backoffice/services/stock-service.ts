import type { ApiService } from "./api-service"
import type { StockAddRequest, StockResponse, StockItem } from "../models/stock-request"

export class StockService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getStockItems(): Promise<StockItem[]> {
    return this.apiService.getStockItems()
  }

  async getStockItemById(id: number): Promise<StockItem> {
    return this.apiService.getStockItemById(id)
  }

  async addStock(stockData: StockAddRequest): Promise<StockResponse> {
    return this.apiService.addStock(stockData)
  }
}
