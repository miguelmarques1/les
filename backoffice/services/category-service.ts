import type { CategoryModel } from "../models/category-model"
import type { ApiService } from "./api-service"

export class CategoryService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getAll(): Promise<CategoryModel[]> {
    return this.apiService.getCategories()
  }
}
