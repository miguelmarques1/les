import type { CouponModel, CouponValidateRequest } from "../models/coupon-model"
import type { ApiService } from "./api-service"

export class CouponService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async validateCoupon(request: CouponValidateRequest): Promise<CouponModel> {
    return this.apiService.validateCoupon(request)
  }
}
