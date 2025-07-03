"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { CartModel } from "../models/cart-model"
import { cartService } from "../services"
import { useAuth } from "./auth-context"

interface CartContextType {
  cart: CartModel | null
  isLoading: boolean
  error: string | null
  addToCart: (bookId: number, quantity: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<CartModel | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)

    try {
      const cartData = await cartService.getCart()
      setCart(cartData)
    } catch (err) {
      console.error("Failed to fetch cart:", err)
      setError("Falha ao carregar o carrinho")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

  const addToCart = async (bookId: number, quantity: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedCart = await cartService.addToCart(bookId, quantity)
      setCart(updatedCart)
    } catch (err) {
      setError("Falha ao adicionar item ao carrinho")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  return (
    <CartContext.Provider value={{ cart, isLoading, error, addToCart, refreshCart }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
