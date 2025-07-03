"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Heart, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookCard from "@/components/book-card"
import SectionHeading from "@/components/section-heading"
import { useBook, useBooks } from "@/lib/hooks/use-books"
import { useCart } from "@/lib/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { BookModel } from "@/lib/models/book-model"

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const bookId = Number.parseInt(id)
  const { book, isLoading: isBookLoading, error: bookError } = useBook(bookId)
  const { books } = useBooks()
  const [recommendedBooks, setRecommendedBooks] = useState<BookModel[]>([])
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    // Get some recommended books (in a real app, this would be based on the current book)
    if (books.length > 0) {
      const filtered = books.filter((b) => b.id !== bookId).slice(0, 4)
      setRecommendedBooks(filtered)
    }
  }, [books, bookId])

  const handleAddToCart = async () => {
    if (!book?.id) return

    setIsAdding(true)
    try {
      await addToCart(book.id, quantity)
      toast({
        title: "Adicionado ao carrinho",
        description: `${book.title} foi adicionado ao seu carrinho.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao carrinho.",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-amber-700">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            {!isBookLoading && book && (
              <>
                <Link
                  href={`/categoria/${book.categories[0]?.name.toLowerCase()}`}
                  className="hover:text-amber-700"
                >
                  {book.categories[0].name}
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-gray-700 truncate">{book.title}</span>
              </>
            )}
          </div>

          {bookError && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{bookError}</div>}

          {/* Book Details Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Images */}
            <div>
              {isBookLoading ? (
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              ) : book ? (
                <div className="mb-4 aspect-[3/4] relative border rounded-lg overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=600&width=400&text=${encodeURIComponent(book.title)}`}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -20%
                  </div>
                </div>
              ) : null}

              {/* Thumbnail Gallery - Placeholder for now */}
              {!isBookLoading && book && (
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-[3/4] relative border rounded-md overflow-hidden cursor-pointer hover:border-amber-500"
                    >
                      <Image
                        src={`/placeholder.svg?height=150&width=100&text=${encodeURIComponent(book.title)}`}
                        alt={`${book.title} - Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div>
              {isBookLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-5 w-5" />
                    ))}
                    <Skeleton className="h-5 w-24 ml-2" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : book ? (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>

                  <div className="mb-4">
                    <p className="text-gray-600">
                      por{" "}
                      <Link
                        href={`/autor/${book.author.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-amber-700 hover:underline"
                      >
                        {book.author}
                      </Link>
                    </p>
                    <p className="text-gray-600 text-sm">Editora: {book.publisher}</p>
                  </div>

                  {/* Rating - Placeholder for now */}
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : i < 4.5
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">4.5 (128 avaliações)</span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-gray-400 text-sm line-through mr-2">R${book.price.toFixed(2)}</span>
                      <span className="text-amber-700 text-3xl font-bold">R${(book.price * 0.8).toFixed(2)}</span>
                    </div>
                    <p className="text-green-600 text-sm">Economize R${(book.price * 0.2).toFixed(2)} (20%)</p>
                  </div>

                  {/* Book Info */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
                    <div>
                      <span className="text-gray-500">ISBN:</span> {book.isbn}
                    </div>
                    <div>
                      <span className="text-gray-500">Páginas:</span> {book.pages}
                    </div>
                    <div>
                      <span className="text-gray-500">Idioma:</span> Português
                    </div>
                    <div>
                      <span className="text-gray-500">Publicação:</span> {book.year}
                    </div>
                    <div>
                      <span className="text-gray-500">Dimensões:</span> {book.dimensions.width}cm x{" "}
                      {book.dimensions.height}cm
                    </div>
                    <div>
                      <span className="text-gray-500">Disponibilidade:</span>{" "}
                      {book.stockCount > 0 ? (
                        <span className="text-green-600">Em estoque</span>
                      ) : (
                        <span className="text-red-600">Indisponível</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex border rounded-md">
                      <button className="px-3 py-2 border-r hover:bg-gray-100" onClick={decrementQuantity}>
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-12 text-center"
                      />
                      <button className="px-3 py-2 border-l hover:bg-gray-100" onClick={incrementQuantity}>
                        +
                      </button>
                    </div>

                    <Button
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={!book.stockCount || isAdding}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isAdding ? "Adicionando..." : "Adicionar ao Carrinho"}
                    </Button>

                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5 text-amber-700" />
                    </Button>
                  </div>

                  {/* Description Preview */}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-800 mb-2">Descrição</h3>
                    <p className="text-gray-600 text-sm line-clamp-4">
                      {book.title} é um livro escrito por {book.author} e publicado pela{" "}
                      {book.publisher} em {book.year}. Com {book.pages} páginas,
                      este livro explora temas importantes e oferece uma leitura envolvente.
                    </p>
                    <Button variant="link" className="text-amber-700 p-0 h-auto">
                      Ler mais
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Tabs Section */}
          {!isBookLoading && book && (
            <Tabs defaultValue="description" className="mb-12">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-amber-700 px-4 py-2"
                >
                  Descrição
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-amber-700 px-4 py-2"
                >
                  Detalhes
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-amber-700 px-4 py-2"
                >
                  Avaliações (3)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-6">
                <div className="prose max-w-none">
                  <p className="mb-4">
                    {book.title} é um livro escrito por {book.author} e publicado pela{" "}
                    {book.publisher} em {book.year}. Com {book.pages} páginas, este
                    livro explora temas importantes e oferece uma leitura envolvente.
                  </p>
                  <p>Este livro é dividido em três partes principais:</p>
                  <ul className="list-disc pl-5 my-4">
                    <li>Parte 1: Introdução aos conceitos</li>
                    <li>Parte 2: Desenvolvimento das ideias principais</li>
                    <li>Parte 3: Conclusões e aplicações práticas</li>
                  </ul>
                  <p>
                    Cada capítulo inclui exercícios práticos e estudos de caso que ilustram como aplicar os conceitos
                    apresentados. O autor também compartilha sua própria jornada, oferecendo insights valiosos sobre o
                    tema.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Informações do Produto</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-gray-600">ISBN</td>
                          <td className="py-2">{book.isbn}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-gray-600">Autor</td>
                          <td className="py-2">{book.author}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-gray-600">Editora</td>
                          <td className="py-2">{book.publisher}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-gray-600">Idioma</td>
                          <td className="py-2">Português</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-gray-600">Páginas</td>
                          <td className="py-2">{book.pages}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-gray-600">Data de Publicação</td>
                          <td className="py-2">{book.year}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">Dimensões</td>
                          <td className="py-2">
                            {book.dimensions.width}cm x {book.dimensions.height}cm x{" "}
                            {book.dimensions.depth}cm
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-4">Sobre o Autor</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {book.author} é um autor renomado com vários livros publicados. Formado pela
                      Universidade de São Paulo, dedica-se há muitos anos ao estudo e escrita sobre este tema.
                    </p>
                    <p className="text-sm text-gray-600">
                      Autor de diversos best-sellers, já ajudou milhares de pessoas com seus conhecimentos. Atualmente,
                      divide seu tempo entre a escrita e palestras em todo o mundo.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : i < 4.5
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-lg">4.5 de 5</p>
                      <p className="text-sm text-gray-600">128 avaliações</p>
                    </div>
                  </div>

                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">Escrever Avaliação</Button>
                </div>

                <Separator className="my-6" />

                {/* Reviews List - Placeholder for now */}
                <div className="space-y-6">
                  {[
                    {
                      id: 1,
                      name: "Ana Oliveira",
                      rating: 5,
                      date: "12/06/2023",
                      comment: "Livro incrível! Recomendo fortemente para quem busca conhecimento nesta área.",
                    },
                    {
                      id: 2,
                      name: "Ricardo Mendes",
                      rating: 4,
                      date: "28/05/2023",
                      comment: "Conteúdo muito bom, mas achei algumas partes um pouco repetitivas.",
                    },
                    {
                      id: 3,
                      name: "Juliana Costa",
                      rating: 5,
                      date: "15/04/2023",
                      comment: "As técnicas apresentadas no livro são práticas e fáceis de aplicar no dia a dia.",
                    },
                  ].map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-bold">{review.name}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Recommended Books */}
          <section className="mb-12">
            <SectionHeading title="Quem comprou este livro também levou..." viewAllLink="/recomendados" />
            {isBookLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recommendedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
