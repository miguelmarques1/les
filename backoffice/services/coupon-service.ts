import { CouponCreateRequest } from "."
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

  async getAllCoupons(): Promise<CouponModel[]> {
    return this.apiService.getAllCoupons()
  }

  async createCoupon(couponData: CouponCreateRequest): Promise<CouponModel> {
    return this.apiService.createCoupon(couponData)
  }

  async updateCouponStatus(id: number, status: string): Promise<CouponModel> {
    return this.apiService.updateCouponStatus(id, status)
  }
}
