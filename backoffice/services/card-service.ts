import type { CardModel, CardRequest } from "../models/card-model"
import type { ApiService } from "./api-service"

export class CardService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async createCard(card: CardRequest): Promise<CardModel> {
    return this.apiService.createCard(card)
  }

  async getCards(): Promise<CardModel[]> {
    return this.apiService.getCards()
  }

  async deleteCard(id: number): Promise<void> {
    return this.apiService.deleteCard(id)
  }
}
