import { NextResponse } from "next/server"
import { orderService } from "@/lib/services"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const order = await orderService.getOrderById(id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(`Error fetching order ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 })
  }
}
