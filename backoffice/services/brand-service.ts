import type { BrandModel, BrandCreateRequest } from "../models/brand-model"
import type { ApiService } from "./api-service"

export class BrandService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getBrands(): Promise<BrandModel[]> {
    return this.apiService.getBrands()
  }

  async createBrand(request: BrandCreateRequest): Promise<BrandModel> {
    return this.apiService.createBrand(request)
  }

  async deleteBrand(id: number): Promise<void> {
    return this.apiService.deleteBrand(id)
  }
}
