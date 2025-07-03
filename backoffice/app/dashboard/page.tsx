"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { StockOverview } from "@/components/dashboard/stock-overview"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import {
  DashboardFilters,
  type DashboardFilters as DashboardFiltersType,
} from "@/components/dashboard/dashboard-filters"
import { apiService } from "@/services"
import type { DashboardData } from "@/services/api-service"

const mockDashboardData: DashboardData = {
  summary: {
    totalSales: 45231.89,
    formattedTotalSales: "R$ 45.231,89",
    totalOrders: 1234,
    averageOrderValue: 36.67,
    formattedAverageOrderValue: "R$ 36,67",
    inventoryCount: 2543,
    lowStockItems: 12,
  },
  salesData: [
    { month: "jan.", monthNumber: 1, totalSales: 4000, totalOrders: 120, averageOrderValue: 33.33, year: 2024 },
    { month: "fev.", monthNumber: 2, totalSales: 3000, totalOrders: 98, averageOrderValue: 30.61, year: 2024 },
    { month: "mar.", monthNumber: 3, totalSales: 5000, totalOrders: 142, averageOrderValue: 35.21, year: 2024 },
    { month: "abr.", monthNumber: 4, totalSales: 4500, totalOrders: 128, averageOrderValue: 35.16, year: 2024 },
    { month: "mai.", monthNumber: 5, totalSales: 6000, totalOrders: 165, averageOrderValue: 36.36, year: 2024 },
    { month: "jun.", monthNumber: 6, totalSales: 5500, totalOrders: 152, averageOrderValue: 36.18, year: 2024 },
  ],
  recentOrders: [],
  categoryOverview: [
    { categoryId: 1, categoryName: "Ficção", percentage: 35, totalItems: 450, colorCode: "#8884d8" },
    { categoryId: 2, categoryName: "Romance", percentage: 25, totalItems: 320, colorCode: "#82ca9d" },
    { categoryId: 3, categoryName: "Suspense", percentage: 20, totalItems: 256, colorCode: "#ffc658" },
    { categoryId: 4, categoryName: "Terror", percentage: 12, totalItems: 154, colorCode: "#ff7300" },
    { categoryId: 5, categoryName: "Fantasia", percentage: 8, totalItems: 102, colorCode: "#00ff00" },
  ],
}

const defaultFilters: DashboardFiltersType = {
  dateRange: {
    from: undefined,
    to: undefined,
  },
  orderStatus: [],
  categories: [],
  period: "30d",
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockDashboardData)
  const [filteredData, setFilteredData] = useState<DashboardData>(mockDashboardData)
  const [filters, setFilters] = useState<DashboardFiltersType>(defaultFilters)
  const [loading, setLoading] = useState(true)
  const [applyingFilters, setApplyingFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async (appliedFilters?: DashboardFiltersType) => {
    try {
      setLoading(true)
      // Em uma implementação real, você passaria os filtros para a API
      const data = await apiService.getDashboardData()
      setDashboardData(data)

      // Aplicar filtros localmente (em produção, isso seria feito no backend)
      const filtered = applyFiltersToData(data, appliedFilters || filters)
      setFilteredData(filtered)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
      setError("Falha ao carregar dados do dashboard. Usando dados de exemplo.")

      // Aplicar filtros aos dados mock
      const filtered = applyFiltersToData(mockDashboardData, appliedFilters || filters)
      setFilteredData(filtered)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersToData = (data: DashboardData, appliedFilters: DashboardFiltersType): DashboardData => {
    const filtered = { ...data }

    // Filtrar pedidos recentes por status
    if (appliedFilters.orderStatus.length > 0) {
      filtered.recentOrders = data.recentOrders.filter((order) => appliedFilters.orderStatus.includes(order.status))
    }

    // Filtrar categorias
    if (appliedFilters.categories.length > 0) {
      filtered.categoryOverview = data.categoryOverview.filter((category) =>
        appliedFilters.categories.includes(category.categoryName),
      )
    }

    // Filtrar dados de vendas por período
    if (appliedFilters.period !== "30d") {
      filtered.salesData = filterSalesDataByPeriod(data.salesData, appliedFilters.period)
    }

    // Filtrar por data personalizada
    if (appliedFilters.period === "custom" && (appliedFilters.dateRange.from || appliedFilters.dateRange.to)) {
      // Implementar filtro por data personalizada
      // Esta lógica dependeria da estrutura real dos dados
    }

    return filtered
  }

  const filterSalesDataByPeriod = (salesData: any[], period: string) => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "6m":
        startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        return salesData
    }

    // Para dados mock, retornamos todos os dados
    // Em produção, você filtraria baseado na data real
    return salesData
  }

  const handleFiltersChange = (newFilters: DashboardFiltersType) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = async () => {
    setApplyingFilters(true)
    try {
      await fetchDashboardData(filters)
    } finally {
      setApplyingFilters(false)
    }
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    const filtered = applyFiltersToData(dashboardData, defaultFilters)
    setFilteredData(filtered)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Filtros */}
      <DashboardFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        isLoading={applyingFilters}
      />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20m8-10H4" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredData.summary.formattedTotalSales}</div>
              <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredData.summary.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+180.1% em relação ao mês passado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredData.summary.formattedAverageOrderValue}</div>
              <p className="text-xs text-muted-foreground">+19% em relação ao mês passado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredData.summary.inventoryCount}</div>
              <p className="text-xs text-muted-foreground">
                {filteredData.summary.lowStockItems} itens com estoque baixo
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Vendas</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <SalesChart data={filteredData.salesData} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>Distribuição do estoque por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <StockOverview data={filteredData.categoryOverview} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-7">
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>
                Últimos pedidos realizados na plataforma
                {filteredData.recentOrders.length !== dashboardData.recentOrders.length && (
                  <span className="ml-2 text-sm text-blue-600">
                    ({filteredData.recentOrders.length} de {dashboardData.recentOrders.length} pedidos)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={filteredData.recentOrders} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
