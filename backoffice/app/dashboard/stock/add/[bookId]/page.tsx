"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { services } from "@/services"
import { toast } from "@/components/ui/use-toast"

export default function AddStockPage({ params }: { params: { bookId: string } }) {
  const router = useRouter()
  const bookId = Number.parseInt(params.bookId)
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [bookId])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const bookData = await services.bookService.getBookById(bookId)
      setBook(bookData)
    } catch (error) {
      console.error("Error fetching book:", error)
      toast({
        title: "Error",
        description: "Failed to load book details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const stockData = {
      book_id: bookId,
      supplier: formData.get("supplier") as string,
      quantity: Number(formData.get("quantity")),
      costs_value: Number(formData.get("costs_value")),
    }

    try {
      await services.bookService.addStock(stockData)

      toast({
        title: "Success",
        description: "Stock added successfully",
      })

      router.push("/dashboard/stock")
    } catch (error) {
      console.error("Error adding stock:", error)
      toast({
        title: "Error",
        description: "Failed to Adicionar em Estoque",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/stock">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Adicionar em Estoque</h1>
        </div>
        <div>Loading...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/stock">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Adicionar em Estoque</h1>
        </div>
        <div>Book not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/stock">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Adicionar em Estoque</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
          <CardDescription>Review the book information before adding stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Title</p>
              <p className="font-medium">{book.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Author</p>
              <p>{book.author}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Publisher</p>
              <p>{book.publisher}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Retail Price</p>
              <p>${book.price?.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Stock Information</CardTitle>
            <CardDescription>Enter the details for the new stock</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" name="supplier" placeholder="Enter supplier name" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" placeholder="Number of copies" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costs_value">Cost per Unit ($)</Label>
                <Input
                  id="costs_value"
                  name="costs_value"
                  type="number"
                  step="0.01"
                  placeholder="Cost value"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
            <Save className="h-4 w-4 mr-2" />
            {submitting ? "Adding..." : "Add to Stock"}
          </Button>
        </div>
      </form>
    </div>
  )
}
