import type { PrecificationGroup } from "../models/precification-group"
import type { ApiService } from "./api-service"

export class PrecificationGroupService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getAll(): Promise<PrecificationGroup[]> {
    return this.apiService.getPrecificationGroups()
  }
}
