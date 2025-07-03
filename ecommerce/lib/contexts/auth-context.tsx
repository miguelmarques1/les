"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { AuthModel } from "../models/auth-model"
import type { CustomerModel } from "../models/customer-model"
import { authService } from "../services"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: CustomerModel | null
  login: (email: string, password: string) => Promise<AuthModel>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<CustomerModel | null>(null)

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated()
      setIsAuthenticated(isAuth)

      if (isAuth) {
        try {
          // Fetch user profile if authenticated
          // Note: We would need an endpoint for this, assuming it exists
          // const userProfile = await userService.getProfile()
          // setUser(userProfile)

          // For now, we'll just set a placeholder user
        } catch (error) {
          console.error("Failed to fetch user profile:", error)
          authService.logout()
          setIsAuthenticated(false)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const authModel = await authService.login(email, password)
      setIsAuthenticated(true)

      // Fetch user profile after login
      // const userProfile = await userService.getProfile()
      // setUser(userProfile)

      // For now, we'll just set a placeholder user

      setIsLoading(false)
      return authModel
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
