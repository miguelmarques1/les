"use client"

import { useState } from "react"
import { couponService } from "../services"
import type { CouponModel } from "../models/coupon-model"

export const MIN_CARD_AMOUNT = 10.0

export function useMultipleCoupons() {
  const [coupons, setCoupons] = useState<CouponModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Valida e adiciona um cupom à lista
   * @param code Código do cupom
   * @param subtotal Subtotal dos produtos (para validação do limite de desconto)
   * @returns CouponModel se o cupom for válido e adicionado
   */
  const validateAndAddCoupon = async (code: string, subtotal: number): Promise<CouponModel | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Verifica se cupom já está adicionado
      if (coupons.some((c) => c.code.toUpperCase() === code.toUpperCase())) {
        setError("Este cupom já foi adicionado")
        return null
      }

      const validCoupon = await couponService.validateCoupon(code)

      // Calcula o desconto total atual
      const currentTotalDiscount = calculateTotalDiscount(subtotal)

      // Calcula quanto desconto este novo cupom daria
      const newCouponDiscount = validCoupon.calculateDiscountAmount(subtotal)

      // Verifica se o desconto total não ultrapassa o subtotal
      if (currentTotalDiscount + newCouponDiscount > subtotal) {
        const remainingDiscount = subtotal - currentTotalDiscount
        if (remainingDiscount <= 0) {
          setError(
            "O desconto dos cupons já atingiu o valor máximo dos produtos. Não é possível adicionar mais cupons.",
          )
          return null
        }
        // Permite adicionar, mas avisa que o desconto será limitado
      }

      setCoupons([...coupons, validCoupon])
      return validCoupon
    } catch (err) {
      console.error("Failed to validate coupon:", err)
      setError("Cupom inválido ou expirado")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Remove um cupom da lista pelo código
   * @param code Código do cupom a remover
   */
  const removeCoupon = (code: string) => {
    setCoupons(coupons.filter((c) => c.code !== code))
    setError(null)
  }

  /**
   * Calcula o desconto total de todos os cupons aplicados
   * O desconto total nunca excede o subtotal dos produtos
   * @param subtotal Subtotal dos produtos
   * @returns Valor total do desconto (limitado ao subtotal)
   */
  const calculateTotalDiscount = (subtotal: number): number => {
    let totalDiscount = 0

    for (const coupon of coupons) {
      // Calcula o desconto deste cupom considerando o desconto já aplicado
      const availableAmount = Math.max(0, subtotal - totalDiscount)
      const couponDiscount = coupon.calculateDiscountAmount(availableAmount)
      totalDiscount += couponDiscount
    }

    // Garante que o desconto total não excede o subtotal
    return Math.min(totalDiscount, subtotal)
  }

  /**
   * Verifica se é possível adicionar mais cupons baseado no desconto atual
   * @param subtotal Subtotal dos produtos
   * @returns true se ainda há espaço para mais desconto
   */
  const canAddMoreCoupons = (subtotal: number): boolean => {
    const currentDiscount = calculateTotalDiscount(subtotal)
    return currentDiscount < subtotal
  }

  /**
   * Limpa todos os cupons
   */
  const clearCoupons = () => {
    setCoupons([])
    setError(null)
  }

  /**
   * Retorna os códigos de todos os cupons aplicados (para enviar ao backend)
   */
  const getCouponCodes = (): string[] => {
    return coupons.map((c) => c.code)
  }

  return {
    coupons,
    isLoading,
    error,
    validateAndAddCoupon,
    removeCoupon,
    calculateTotalDiscount,
    canAddMoreCoupons,
    clearCoupons,
    getCouponCodes,
  }
}

/**
 * Valida se os valores dos cartões estão corretos para múltiplos cartões
 * @param payments Lista de pagamentos com cartões
 * @param totalAmount Valor total a ser pago
 * @returns Objeto com resultado da validação e mensagem de erro se houver
 */
export function validateMultipleCardPayments(
  payments: { amount: number }[],
  totalAmount: number,
): { isValid: boolean; error?: string } {
  if (payments.length === 0) {
    return { isValid: false, error: "Nenhum cartão selecionado" }
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  // Verifica se o total pago é igual ao total da compra
  if (Math.abs(totalPaid - totalAmount) > 0.01) {
    return {
      isValid: false,
      error: `O valor total dos cartões (R$ ${totalPaid.toFixed(2)}) deve ser igual ao total da compra (R$ ${totalAmount.toFixed(2)}).`,
    }
  }

  // Se só tem um cartão, não precisa validar valor mínimo
  if (payments.length === 1) {
    return { isValid: true }
  }

  // Valida que cada cartão tem no mínimo R$10, exceto o último se o valor restante for menor
  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i]
    const isLastCard = i === payments.length - 1

    if (payment.amount < MIN_CARD_AMOUNT) {
      // Se é o último cartão e o valor é menor que R$10, é válido apenas se
      // o valor total que sobrou era menor que R$10
      if (isLastCard && totalAmount < MIN_CARD_AMOUNT) {
        continue
      }

      // Calcula quanto já foi pago pelos cartões anteriores
      const paidBefore = payments.slice(0, i).reduce((sum, p) => sum + p.amount, 0)
      const remainingAfterPrevious = totalAmount - paidBefore

      // Se é o último cartão e o restante é menor que R$10, é válido
      if (isLastCard && remainingAfterPrevious < MIN_CARD_AMOUNT) {
        continue
      }

      return {
        isValid: false,
        error: `O valor mínimo por cartão é R$ ${MIN_CARD_AMOUNT.toFixed(2)}. O cartão ${i + 1} tem R$ ${payment.amount.toFixed(2)}.`,
      }
    }
  }

  return { isValid: true }
}
