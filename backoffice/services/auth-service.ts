import { apiService } from "./index"
import { LoginRequest, AuthModel } from "../models/auth-model"

export interface User {
  id: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export class AuthService {
  private static readonly TOKEN_KEY = "auth_token"
  private static readonly USER_KEY = "auth_user"

  constructor() {
    // Initialize API service with stored token
    const token = this.getStoredToken()
    if (token) {
      apiService.setAccessToken(token)
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Use admin authentication for this dashboard
      const token = await apiService.authenticateAdmin(email, password)

      const user: User = {
        id: "admin",
        email: email,
        role: "admin",
      }

      // Store in localStorage
      this.storeToken(token)
      this.storeUser(user)

      return { user, token }
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Invalid email or password")
    }
  }

  logout(): void {
    // Clear stored data
    localStorage.removeItem(AuthService.TOKEN_KEY)
    localStorage.removeItem(AuthService.USER_KEY)

    // Clear API service token
    apiService.setAccessToken(null)
  }

  getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(AuthService.TOKEN_KEY)
  }

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(AuthService.USER_KEY)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!(this.getStoredToken() && this.getStoredUser())
  }

  private storeToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token)
  }

  private storeUser(user: User): void {
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user))
  }

  // Legacy method for backward compatibility
  async legacyLogin(credentials: LoginRequest): Promise<AuthModel> {
    const { user, token } = await this.login(credentials.email, credentials.password)

    return new AuthModel(
      token,
    )
  }
}
