"use client"

import { useState } from "react"
import { customerService } from "../services"
import { useAuth } from "../contexts/auth-context"
import { useRouter } from "next/navigation"

export function useCustomerRegistration() {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (
    name: string,
    email: string,
    password: string,
    gender: string,
    birthdate: string,
    document: string,
    phone?: { type: string; ddd: string; number: string },
    billingAddress?: any,
    deliveryAddress?: any,
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      // Register the customer
      const customer = await customerService.register(
        name,
        email,
        password,
        gender,
        birthdate,
        document,
        phone,
        billingAddress,
        deliveryAddress,
      )

      // Auto login after registration
      await login(email, password)

      return customer
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Falha ao registrar. Por favor, tente novamente.")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}
