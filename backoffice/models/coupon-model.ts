import { CouponType } from "../enums/coupon-type"

export interface CouponCreateRequest {
  code: string
  discount: number
  type: "PERCENTAGE" | "VALUE"
  status: "AVAILABLE" | "USED" | "EXPIRED"
  expiryDate: string
}

export class CouponModel {
  id: number
  code: string
  type: CouponType
  discount: number
  expiryDate: Date
  isActive: boolean

  constructor(id: number, code: string, type: CouponType, discount: number, expiryDate: Date, isActive = true) {
    this.id = id
    this.code = code
    this.type = type
    this.discount = discount
    this.expiryDate = expiryDate
    this.isActive = isActive
  }

  static fromMap(map: any): CouponModel {
    return new CouponModel(
      map.id,
      map.code,
      map.type,
      map.discount,
      new Date(map.expiry_date),
      map.is_active !== undefined ? map.is_active : true,
    )
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      code: this.code,
      type: this.type,
      discount: this.discount,
      expiry_date: this.expiryDate.toISOString(),
      is_active: this.isActive,
    }
  }

  /**
   * Aplica o desconto ao preço original
   * @param originalPrice Preço original
   * @returns Preço com desconto aplicado
   */
  applyDiscount(originalPrice: number): number {
    if (!this.isActive || this.expiryDate < new Date()) {
      return originalPrice
    }

    switch (this.type) {
      case CouponType.PERCENTAGE:
        return originalPrice * (1 - this.discount / 100)
      case CouponType.VALUE:
        return Math.max(0, originalPrice - this.discount)
      default:
        return originalPrice
    }
  }

  /**
   * Calcula o valor do desconto
   * @param originalPrice Preço original
   * @returns Valor do desconto
   */
  calculateDiscountAmount(originalPrice: number): number {
    if (!this.isActive || this.expiryDate < new Date()) {
      return 0
    }

    switch (this.type) {
      case CouponType.PERCENTAGE:
        return originalPrice * (this.discount / 100)
      case CouponType.VALUE:
        return Math.min(originalPrice, this.discount)
      default:
        return 0
    }
  }

  /**
   * Verifica se o cupom é válido
   * @returns true se o cupom estiver ativo e dentro da validade
   */
  isValid(): boolean {
    return this.isActive && this.expiryDate > new Date()
  }
}

export interface CouponValidateRequest {
  code: string
}
