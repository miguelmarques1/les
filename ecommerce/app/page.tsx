"use client"

import { useEffect, useState } from "react"
import BookCarousel from "@/components/book-carousel"
import BookGrid from "@/components/book-grid"
import Footer from "@/components/footer"
import Header from "@/components/header"
import HeroBanner from "@/components/hero-banner"
import NewsletterSignup from "@/components/newsletter-signup"
import SectionHeading from "@/components/section-heading"
import { useBooks, useRecommendedBooks } from "@/lib/hooks/use-books"
import type { BookModel } from "@/lib/models/book-model"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/contexts/auth-context"
import FloatingChatbot from "@/components/floating-chatbot"

export default function HomePage() {
  const { books, isLoading, error } = useBooks()
  const { isAuthenticated } = useAuth()
  const [booksOnSale, setBooksOnSale] = useState<BookModel[]>([])
  const [bestSellers, setBestSellers] = useState<BookModel[]>([])
  const [newReleases, setNewReleases] = useState<BookModel[]>([])

  useEffect(() => {
    if (books.length > 0) {
      // Log para depuração
      console.log("Books sample:", books[0])

      // Verificar se os livros têm a estrutura esperada
      const validBooks = books.filter(
        (book) => book && typeof book === "object" && book.id && book.title && book.author,
      )

      // Filter books for different sections
      // In a real app, these would come from different API endpoints or have specific flags

      // For now, we'll just split the books into different sections
      const onSale = validBooks.slice(0, 5)
      const bestSelling = validBooks.slice(5, 8)
      const newBooks = validBooks.slice(12, 16)

      setBooksOnSale(onSale)
      setBestSellers(bestSelling)
      setNewReleases(newBooks)
    }
  }, [books])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />

        <div className="container mx-auto px-4 py-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

          <section className="mb-12">
            <SectionHeading title="Livros em Promoção" viewAllLink="/promocoes" />
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <BookGrid books={booksOnSale} />
            )}
          </section>

          <section className="mb-12">
            <SectionHeading title="Best-Sellers" viewAllLink="/best-sellers" />
            {isLoading ? (
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-none w-48 sm:w-56 md:w-64 space-y-3">
                    <Skeleton className="h-[300px] w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <BookCarousel books={bestSellers} />
            )}
          </section>

          {/* {isAuthenticated && (
            <section className="mb-12">
              <SectionHeading title="Recomendados para Você" viewAllLink="/recomendados" poweredBy="SenseRead" />
              {isRecommendedLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[300px] w-full rounded-md" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <BookGrid books={recommendedBooks} />
              )}
            </section>
          )} */}

          {/* <section className="mb-12">
            <SectionHeading title="Lançamentos" viewAllLink="/lancamentos" />
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <BookGrid books={newReleases} />
            )}
          </section> */}
        </div>

        <NewsletterSignup />
      </main>
      <FloatingChatbot />
      <Footer />
    </div>
  )
}
