import type { CardModel } from "../models/card-model"
import type { ApiService } from "./api-service"

export class CardService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getCards(): Promise<CardModel[]> {
    return await this.apiService.getCards()
  }

  async createCard(
    number: string,
    holderName: string,
    expiryDate: string,
    brandId: number,
    cvv: string,
  ): Promise<CardModel> {
    return await this.apiService.createCard({
      number,
      holder_name: holderName,
      expiry_date: expiryDate,
      brand_id: brandId,
      cvv,
    })
  }

  async deleteCard(id: number): Promise<void> {
    await this.apiService.deleteCard(id)
  }
}
