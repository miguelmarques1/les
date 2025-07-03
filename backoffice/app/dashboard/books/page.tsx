"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Book, Plus, Search, Package } from "lucide-react"
import Link from "next/link"
import { services } from "@/services"
import { toast } from "@/components/ui/use-toast"
import type { BookModel } from "@/models/book-model"

export default function BooksPage() {
  const [books, setBooks] = useState<BookModel[]>([])
  const [filteredBooks, setFilteredBooks] = useState<BookModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookModel | null>(null)
  const [stockSubmitting, setStockSubmitting] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [books, searchQuery, categoryFilter])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const booksData = await services.bookService.getAllBooks()
      setBooks(booksData)
    } catch (error) {
      console.error("Error fetching books:", error)
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterBooks = () => {
    let filtered = books

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.publisher.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((book) => book.categories.map((category) => category.name).includes(categoryFilter))
    }

    setFilteredBooks(filtered)
  }

  const handleAddStock = (book: BookModel) => {
    setSelectedBook(book)
    setStockModalOpen(true)
  }

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBook) return

    setStockSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const stockData = {
      book_id: selectedBook.id as number,
      supplier: formData.get("supplier") as string,
      quantity: Number(formData.get("quantity")),
      costs_value: Number(formData.get("costs_value")),
    }

    try {
      await services.bookService.addStock(stockData)

      toast({
        title: "Success",
        description: `Stock added successfully for "${selectedBook.title}"`,
      })

      setStockModalOpen(false)
      setSelectedBook(null)
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error("Error adding stock:", error)
      toast({
        title: "Error",
        description: "Failed to Adicionar em Estoque",
        variant: "destructive",
      })
    } finally {
      setStockSubmitting(false)
    }
  }

  const categories = ["all", "FICTION", "NON_FICTION", "SCIENCE", "TECHNOLOGY", "HISTORY", "BIOGRAPHY"]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Books</h1>
        </div>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Books</h1>
        <Link href="/dashboard/books/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search books by title, author, or publisher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Todas as Categorias" : category.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="mt-1">by {book.author}</CardDescription>
                </div>
                <Book className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Publisher:</span>
                  <span>{book.publisher}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="secondary">{book.categories.map((category) => category.name).join(", ")}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">${book.price?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleAddStock(book)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Adicionar Estoque
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No books found</h3>
          <p className="text-muted-foreground">
            {searchQuery || categoryFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first book"}
          </p>
        </div>
      )}

      {/* Adicionar em Estoque Modal */}
      <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar em Estoque</DialogTitle>
            <DialogDescription>Adicionar em Estoque for "{selectedBook?.title}"</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" name="supplier" placeholder="Enter supplier name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" min="1" placeholder="Units" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costs_value">Cost per Unit</Label>
                  <Input id="costs_value" name="costs_value" type="number" step="0.01" placeholder="0.00" required />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStockModalOpen(false)}
                disabled={stockSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={stockSubmitting}>
                {stockSubmitting ? "Adding..." : "Adicionar em Estoque"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
