"use client"

import { useState, useEffect } from "react"
import type { BookModel } from "../models/book-model"
import { bookService } from "../services"

export function useBooks() {
  const [books, setBooks] = useState<BookModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAllBooks()
        console.log("Books data:", data) // Log para depuração
        setBooks(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch books:", err)
        setError("Falha ao carregar os livros")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return { books, isLoading, error }
}

export function useRecommendedBooks(shouldFetch = true) {
  const [recommendedBooks, setRecommendedBooks] = useState<BookModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(shouldFetch)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldFetch) {
      setIsLoading(false)
      return
    }

    const fetchBooks = async () => {
      try {
        const data = await bookService.getRecommendedBooks()
        console.log("Books data:", data)
        setRecommendedBooks(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch books:", err)
        setError("Falha ao carregar os livros")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [shouldFetch])

  return { recommendedBooks, isLoading, error }
}

export function useBook(id: number) {
  const [book, setBook] = useState<BookModel | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(id)
        setBook(data)
        setError(null)
      } catch (err) {
        console.error(`Failed to fetch book ${id}:`, err)
        setError("Falha ao carregar os detalhes do livro")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchBook()
    }
  }, [id])

  return { book, isLoading, error }
}
