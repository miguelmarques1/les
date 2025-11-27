import type { CouponModel, CouponValidateRequest, CouponCreateRequest } from "../models/coupon-model"
import type { ApiService } from "./api-service"

export class CouponService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getCoupons(): Promise<CouponModel[]> {
    return this.apiService.getCoupons()
  }

  async createCoupon(request: CouponCreateRequest): Promise<CouponModel> {
    return this.apiService.createCoupon(request)
  }

  async toggleStatus(id: number, status: string): Promise<CouponModel> {
    return this.apiService.toggleCouponStatus(id, status)
  }
}
