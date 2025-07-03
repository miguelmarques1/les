import type { CouponModel } from "../models/coupon-model"
import type { ApiService } from "./api-service"

export class CouponService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  /**
   * Valida um cupom pelo código
   * @param code Código do cupom
   * @returns Objeto CouponModel se o cupom for válido
   * @throws Error se o cupom for inválido ou expirado
   */
  async validateCoupon(code: string): Promise<CouponModel> {
    return await this.apiService.validateCoupon({ code })
  }
}
