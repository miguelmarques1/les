"use client"

import { useState, useCallback } from "react"
import { orderService } from "../services"
import type { OrderModel, OrderCardInput } from "../models/order-model"
import type { PaymentMethod } from "../enums/payment-method"

export function useOrders() {
  const [orders, setOrders] = useState<OrderModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedOrders = await orderService.getOrders()
      setOrders(fetchedOrders)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createOrder = useCallback(
    async (
      addressId: number,
      paymentMethod: PaymentMethod,
      cardId?: number,
      couponCode?: string,
      temporaryCard?: OrderCardInput,
    ): Promise<OrderModel> => {
      setIsLoading(true)
      setError(null)
      try {
        const newOrder = await orderService.createOrder(addressId, paymentMethod, cardId, couponCode, temporaryCard)
        setOrders((prev) => [newOrder, ...prev])
        return newOrder
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create order"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getOrderById = useCallback(async (id: number): Promise<OrderModel> => {
    setIsLoading(true)
    setError(null)
    try {
      const order = await orderService.getOrderById(id)
      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch order"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    getOrderById,
  }
}
