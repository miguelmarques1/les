import { NextResponse } from "next/server"
import { bookService } from "@/lib/services"

export async function GET() {
  try {
    const books = await bookService.getAllBooks()
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}
