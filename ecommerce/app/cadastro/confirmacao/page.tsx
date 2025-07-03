"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

export default function RegistrationConfirmationPage() {
  // Simulate a redirect if someone tries to access this page directly
  useEffect(() => {
    // Check if we have registration data in session storage
    const hasRegistered = sessionStorage.getItem("registrationComplete")

    if (!hasRegistered) {
      // Set it for demo purposes
      sessionStorage.setItem("registrationComplete", "true")
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#F5F5DC" }}>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

          <h1 className="text-2xl font-bold mb-4" style={{ color: "#2C3E50" }}>
            Cadastro concluído!
          </h1>

          <p className="text-gray-600 mb-8">Bem-vindo(a) à Livraria XYZ. Sua conta foi criada com sucesso.</p>

          <Button asChild className="w-full text-white" style={{ backgroundColor: "#2C3E50" }}>
            <Link href="/conta">Acessar Minha Conta</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
