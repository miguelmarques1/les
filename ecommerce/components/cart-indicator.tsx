"use client"

import { useCart } from "@/lib/contexts/cart-context"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CartIndicator() {
  const { cart, isLoading } = useCart()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (cart && cart.items) {
      // Agrupar itens por ID do livro para contar corretamente
      const groupedItems = cart.items.reduce(
        (acc, item) => {
          const bookId = item.bookDetails.id
          if (!acc[bookId]) {
            acc[bookId] = 0
          }
          acc[bookId] += 1
          return acc
        },
        {} as Record<number, number>,
      )

      // Contar o número de livros únicos no carrinho
      setItemCount(Object.keys(groupedItems).length)
    } else {
      setItemCount(0)
    }
  }, [cart])

  return (
    <Link href="/carrinho">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5 text-amber-700" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  )
}
