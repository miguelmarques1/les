import type { ApiService } from "./api-service"
import type { DashboardData } from "../models/dashboard-model"

export interface DashboardFilters {
  startDate?: string
  endDate?: string
}

export class DashboardService {
  constructor(private apiService: ApiService) {}

  async getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
    let endpoint = "/admin/dashboard"

    // Add query parameters if filters are provided
    if (filters) {
      const params = new URLSearchParams()
      if (filters.startDate) {
        params.append("startDate", filters.startDate)
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate)
      }
      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiService["accessToken"]}`,
        "ngrok-skip-browser-warning": "true"
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.status}`)
    }

    const result = await response.json()
    return result.data || result
  }
}
