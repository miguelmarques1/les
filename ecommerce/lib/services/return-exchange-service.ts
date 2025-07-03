import type { ApiService } from "./api-service"

export class ReturnExchangeService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getMyRequests() {
    return await this.apiService.getMyReturnExchangeRequests()
  }

  async createRequest(description: string, orderItemIds: number[], type: "exchange" | "return") {
    return await this.apiService.createReturnExchangeRequest({
      description,
      order_item_ids: orderItemIds,
      type,
    })
  }

  async updateStatus(requestId: number, status: string) {
    return await this.apiService.updateReturnExchangeStatus(requestId, { status })
  }
}
