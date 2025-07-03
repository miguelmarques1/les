import type { AuthModel, LoginRequest } from "../models/auth-model"
import type { ApiService } from "./api-service"

export class AuthService {
  private apiService: ApiService
  private tokenKey = "auth_token"

  constructor(apiService: ApiService) {
    this.apiService = apiService
    this.loadTokenFromStorage()
  }

  private loadTokenFromStorage() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(this.tokenKey)
      if (token) {
        this.apiService.setAccessToken(token)
      }
    }
  }

  private saveTokenToStorage(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  async login(email: string, password: string): Promise<AuthModel> {
    const request: LoginRequest = { email, password }
    const authModel = await this.apiService.login(request)
    this.saveTokenToStorage(authModel.accessToken)
    return authModel
  }

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey)
      // Limpar o token no apiService também
      this.apiService.setAccessToken(null)
    }
  }

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(this.tokenKey)
    }
    return false
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }
}
