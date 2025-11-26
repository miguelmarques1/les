import { BrandModel } from "@/models/brand-model"
import type { ApiService } from "./api-service"

export class BrandService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getBrands(): Promise<BrandModel[]> {
    return this.apiService.getAllBrands()
  }

  async createBrand(name: string): Promise<BrandModel> {
    return this.apiService.createBrand(name)
  }

  async deleteBrand(id: number): Promise<void> {
    return this.apiService.deleteBrand(id)
  }
}
