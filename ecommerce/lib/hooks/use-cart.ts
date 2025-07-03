"use client"

import { useState, useEffect } from "react"
import type { CartModel } from "../models/cart-model"
import type { StockBookModel } from "../models/stock-book-model"
import { cartService } from "../services"
import { useAuth } from "../contexts/auth-context"

// Interface para representar itens agrupados no carrinho
interface GroupedCartItem {
  bookId: number
  title: string
  author: string
  coverImage?: string
  unitPrice: number
  quantity: number
  stockItems: StockBookModel[]
}

export function useCart() {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<CartModel | null>(null)
  const [groupedItems, setGroupedItems] = useState<GroupedCartItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)

    try {
      const cartData = await cartService.getCart()
      setCart(cartData)

      // Agrupar itens do carrinho por livro
      groupCartItems(cartData.items)
    } catch (err) {
      console.error("Failed to fetch cart:", err)
      setError("Falha ao carregar o carrinho")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para agrupar itens do carrinho por livro
  const groupCartItems = (items: StockBookModel[]) => {
    if (!items || items.length === 0) {
      setGroupedItems([])
      return
    }

    const grouped: Record<number, GroupedCartItem> = {}

    items.forEach((item) => {
      const bookId = item.bookDetails.id || 0

      if (!grouped[bookId]) {
        grouped[bookId] = {
          bookId,
          title: item.bookDetails.title,
          author: item.bookDetails.author,
          coverImage: "",
          unitPrice: item.unitPrice,
          quantity: 1,
          stockItems: [item],
        }
      } else {
        grouped[bookId].quantity += 1
        grouped[bookId].stockItems.push(item)
      }
    })

    setGroupedItems(Object.values(grouped))
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart(null)
      setGroupedItems([])
    }
  }, [isAuthenticated])

  const addToCart = async (bookId: number, quantity: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedCart = await cartService.addToCart(bookId, quantity)
      setCart(updatedCart)
      groupCartItems(updatedCart.items)
      return updatedCart
    } catch (err) {
      console.error("Failed to add to cart:", err)
      setError("Falha ao adicionar item ao carrinho")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (itemIds: number[]) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedCart = await cartService.removeFromCart(itemIds)
      setCart(updatedCart)
      groupCartItems(updatedCart.items)
      return updatedCart
    } catch (err) {
      console.error("Failed to remove from cart:", err)
      setError("Falha ao remover itens do carrinho")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Função para atualizar a quantidade de um livro no carrinho
  const updateQuantity = async (bookId: number, newQuantity: number) => {
    const groupedItem = groupedItems.find((item) => item.bookId === bookId)

    if (!groupedItem) return

    const currentQuantity = groupedItem.quantity

    if (newQuantity > currentQuantity) {
      // Adicionar mais unidades
      await addToCart(bookId, newQuantity - currentQuantity)
    } else if (newQuantity < currentQuantity) {
      // Remover unidades
      const itemsToRemove = groupedItem.stockItems
        .slice(newQuantity, currentQuantity)
        .map((item) => item.id || 0)
        .filter((id) => id !== 0)

      if (itemsToRemove.length > 0) {
        await removeFromCart(itemsToRemove)
      }
    }
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  return {
    cart,
    groupedItems,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart,
  }
}
