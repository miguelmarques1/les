import { NextResponse } from "next/server"
import { bookService } from "@/lib/services"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 })
    }

    const book = await bookService.getBookById(id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error(`Error fetching book ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch book details" }, { status: 500 })
  }
}
