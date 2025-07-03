"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setEmail("")

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1000)
  }

  return (
    <section className="bg-amber-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Fique por dentro das novidades</h2>
        <p className="mb-6 max-w-md mx-auto">
          Assine nossa newsletter e receba ofertas exclusivas, lançamentos e recomendações personalizadas.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white text-gray-800 border-0"
          />
          <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-white">
            {isSubmitting ? "Enviando..." : "Assinar Newsletter"}
          </Button>
        </form>

        {isSuccess && <p className="mt-3 text-amber-300">Obrigado! Você foi inscrito com sucesso.</p>}
      </div>
    </section>
  )
}
