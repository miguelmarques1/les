import { NextResponse } from "next/server"
import { cardService } from "@/lib/services"

export async function GET() {
  try {
    const cards = await cardService.getCards()
    return NextResponse.json(cards)
  } catch (error) {
    console.error("Error fetching cards:", error)
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { number, holder_name, expiry_date, brand_id, cvv } = await request.json()

    if (!number || !holder_name || !expiry_date || !brand_id || !cvv) {
      return NextResponse.json({ error: "Missing required card fields" }, { status: 400 })
    }

    const card = await cardService.createCard(number, holder_name, expiry_date, brand_id, cvv)

    return NextResponse.json(card)
  } catch (error) {
    console.error("Error creating card:", error)
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 })
  }
}
