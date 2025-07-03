import type { ReturnExchangeModel } from "../models/return-exchange-model"
import type { ApiService } from "./api-service"

export class ReturnExchangeService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getMyReturnExchangeRequests(): Promise<ReturnExchangeModel[]> {
    return this.apiService.getMyReturnExchangeRequests()
  }

  async getAllRequests(): Promise<ReturnExchangeModel[]> {
    return this.apiService.getAllReturnExchangeRequests()
  }

  async updateStatus(requestId: number, status: string): Promise<any> {
    return this.apiService.updateReturnExchangeStatus(requestId, status)
  }
}
