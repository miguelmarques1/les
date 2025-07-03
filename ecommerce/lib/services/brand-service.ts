import type { BrandModel } from "../models/brand-model"
import type { ApiService } from "./api-service"

export class BrandService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getBrands(): Promise<BrandModel[]> {
    return await this.apiService.getBrands()
  }
}
