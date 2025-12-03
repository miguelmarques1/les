import { NextResponse } from "next/server"
import { orderService } from "@/lib/services"

export async function GET() {
  try {
    const orders = await orderService.getOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { address_id, payment_method, card_id, coupon_code, card, cards } = await request.json()

    if (!address_id || !payment_method) {
      return NextResponse.json({ error: "Address ID and payment method are required" }, { status: 400 })
    }

    if (cards && Array.isArray(cards) && cards.length > 0) {
      const totalAmount = cards.reduce((sum: number, c: any) => sum + (c.amount || 0), 0)

      if (totalAmount <= 0) {
        return NextResponse.json({ error: "Total payment amount must be greater than zero" }, { status: 400 })
      }

      const order = await orderService.createOrder(address_id, payment_method, undefined, coupon_code, undefined, cards)

      return NextResponse.json(order)
    }

    const order = await orderService.createOrder(address_id, payment_method, card_id, coupon_code, card)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
