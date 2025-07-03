import { NextResponse } from "next/server"
import { cartService } from "@/lib/services"

export async function GET() {
  try {
    const cart = await cartService.getCart()
    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}
