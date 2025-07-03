"use client"

import { useState } from "react"
import { couponService } from "../services"
import type { CouponModel } from "../models/coupon-model"

export function useCoupon() {
  const [coupon, setCoupon] = useState<CouponModel | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Valida um cupom pelo código
   * @param code Código do cupom
   * @returns CouponModel se o cupom for válido
   */
  const validateCoupon = async (code: string): Promise<CouponModel | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const validCoupon = await couponService.validateCoupon(code)
      setCoupon(validCoupon)
      return validCoupon
    } catch (err) {
      console.error("Failed to validate coupon:", err)
      setError("Cupom inválido ou expirado")
      setCoupon(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Limpa o cupom atual
   */
  const clearCoupon = () => {
    setCoupon(null)
    setError(null)
  }

  return { coupon, isLoading, error, validateCoupon, clearCoupon }
}
