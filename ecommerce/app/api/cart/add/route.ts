import { NextResponse } from "next/server"
import { cartService } from "@/lib/services"

export async function POST(request: Request) {
  try {
    const { book_id, quantity } = await request.json()

    if (!book_id || !quantity) {
      return NextResponse.json({ error: "Book ID and quantity are required" }, { status: 400 })
    }

    const cart = await cartService.addToCart(book_id, quantity)
    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}
