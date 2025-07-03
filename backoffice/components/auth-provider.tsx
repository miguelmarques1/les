"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type AuthState } from "@/services"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for stored authentication on mount
    const token = authService.getStoredToken()
    const user = authService.getStoredUser()

    setState({
      user,
      token,
      isAuthenticated: !!(token && user),
      isLoading: false,
    })
  }, [])

  const login = async (email: string, password: string) => {
    setState((prev: any) => ({ ...prev, isLoading: true }))

    try {
      const { user, token } = await authService.login(email, password)

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setState((prev: any) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
