import BookCard from "@/components/book-card"
import type { BookModel } from "@/lib/models/book-model"

interface BookGridProps {
  books: BookModel[]
}

export default function BookGrid({ books }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
