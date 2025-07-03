"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"

/**
 * Hook para proteger rotas que requerem autenticação
 * @param redirectTo Rota para redirecionar caso o usuário não esteja autenticado
 */
export function useAuthGuard(redirectTo = "/login") {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Só verifica após o carregamento inicial para evitar redirecionamentos desnecessários
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  return { isAuthenticated, isLoading }
}
