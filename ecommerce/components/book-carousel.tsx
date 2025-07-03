"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookCard from "@/components/book-card"
import { BookModel } from "@/lib/models/book-model"

interface BookCarouselProps {
  books: BookModel[]
}

export default function BookCarousel({ books }: BookCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const { scrollWidth, clientWidth } = carouselRef.current
    const scrollAmount = clientWidth * 0.8

    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(scrollWidth - clientWidth, scrollPosition + scrollAmount)

    carouselRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })

    setScrollPosition(newPosition)
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = carouselRef.current
    ? scrollPosition < carouselRef.current.scrollWidth - carouselRef.current.clientWidth
    : false

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        {books.map((book) => (
          <div key={book.id} className="flex-none w-48 sm:w-56 md:w-64">
            <BookCard book={book} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-md border-amber-200 z-10"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-md border-amber-200 z-10"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
