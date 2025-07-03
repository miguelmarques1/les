import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: true, message: "Não autorizado" }, { status: 401 })
    }

    // Fazer a requisição real para a API externa
    const response = await fetch(`${process.env.API_URL}/customers/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: true, message: errorData.message || "Erro ao buscar perfil" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar solicitação:", error)
    return NextResponse.json({ error: true, message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: true, message: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Fazer a requisição real para a API externa
    const response = await fetch(`${process.env.API_URL}/customers/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: true, message: errorData.message || "Erro ao atualizar perfil" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar solicitação:", error)
    return NextResponse.json({ error: true, message: "Erro interno do servidor" }, { status: 500 })
  }
}
