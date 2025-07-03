"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo à Livraria XYZ!",
      })
      router.push("/")
    } catch (err) {
      console.error("Login error:", err)
      setError("E-mail ou senha inválidos. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#F5F5DC" }}>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="relative h-16 w-48 mx-auto">
                <h1 className="text-3xl font-bold text-amber-700">Livraria XYZ</h1>
              </div>
            </Link>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#2C3E50" }}>
              Entrar na sua conta
            </h2>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700">
                    Senha
                  </Label>
                  <Link href="/recuperar-senha" className="text-sm hover:underline" style={{ color: "#C0392B" }}>
                    Esqueci minha senha
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-white"
                disabled={isLoading}
                style={{ backgroundColor: "#2C3E50" }}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-700">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="font-medium hover:underline" style={{ color: "#C0392B" }}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
