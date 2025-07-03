import { NextResponse } from "next/server"
import { couponService } from "@/lib/services"

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Código do cupom é obrigatório" }, { status: 400 })
    }

    const coupon = await couponService.validateCoupon(code)
    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ error: "Cupom inválido ou expirado" }, { status: 400 })
  }
}
