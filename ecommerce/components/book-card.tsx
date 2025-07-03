"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'
import type { BookModel } from "@/lib/models/book-model"
import { useCart } from "@/lib/contexts/cart-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface BookCardProps {
  book: BookModel
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  // Calculate sale price (in a real app, this would come from the API)
  const originalPrice = book.price
  const salePrice = book.price * 0.8 // 20% discount for demo
  const discount = "20%"

  const handleAddToCart = async () => {
    if (!book.id) return

    setIsAdding(true)
    try {
      await addToCart(book.id, 1)
      toast({
        title: "Adicionado ao carrinho",
        description: `${book.title} foi adicionado ao seu carrinho.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao carrinho.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group relative flex flex-col h-full border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <Link href={`/livro/${book.id}`}>
          <Image
            src={`/placeholder.svg?height=300&width=200&text=${encodeURIComponent(book.title)}`}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-3">
        <Link href={`/livro/${book.id}`} className="hover:underline">
          <h3 className="font-medium text-sm line-clamp-2 mb-1">{book.title}</h3>
        </Link>
        <p className="text-gray-600 text-xs mb-2">{book.author}</p>
        <p className="text-xs text-gray-500 mb-2">{book.categories[0].name}</p>

        <div className="mt-auto">
          <div className="flex items-baseline mb-2">
            <span className="text-gray-400 text-xs line-through mr-2">R${originalPrice.toFixed(2)}</span>
            <span className="text-amber-700 font-bold">R${salePrice.toFixed(2)}</span>
          </div>

          <Button
            size="sm"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleAddToCart}
            disabled={isAdding || book.stockCount <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAdding ? "Adicionando..." : book.stockCount <= 0 ? "Indisponível" : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
