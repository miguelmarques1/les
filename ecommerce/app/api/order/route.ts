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
    const { address_id, payment_method, card_id, coupon_code } = await request.json()

    if (!address_id || !payment_method) {
      return NextResponse.json({ error: "Address ID and payment method are required" }, { status: 400 })
    }

    const order = await orderService.createOrder(address_id, payment_method, card_id, coupon_code)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
