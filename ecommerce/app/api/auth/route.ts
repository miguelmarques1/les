import { NextResponse } from "next/server"
import { authService } from "@/lib/services"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const authModel = await authService.login(email, password)

    return NextResponse.json(authModel)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
