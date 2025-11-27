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
import { dashboardService } from "@/services"
import type { DashboardData } from "@/models/dashboard-model"

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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [filteredData, setFilteredData] = useState<DashboardData | null>(null)
  const [filters, setFilters] = useState<DashboardFiltersType>(defaultFilters)
  const [loading, setLoading] = useState(true)
  const [applyingFilters, setApplyingFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async (appliedFilters?: DashboardFiltersType) => {
    try {
      setLoading(true)

      // Convert date range to API format (YYYY-MM-DD)
      const currentFilters = appliedFilters || filters
      let startDate: string | undefined
      let endDate: string | undefined

      if (currentFilters.dateRange?.from) {
        startDate = currentFilters.dateRange.from.toISOString().split("T")[0]
      }
      if (currentFilters.dateRange?.to) {
        endDate = currentFilters.dateRange.to.toISOString().split("T")[0]
      }

      const data = await dashboardService.getDashboardData({ startDate, endDate })
      setDashboardData(data)

      const filtered = applyLocalFilters(data, currentFilters)
      setFilteredData(filtered)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
      setError("Falha ao carregar dados do dashboard. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const applyLocalFilters = (data: DashboardData, appliedFilters: DashboardFiltersType): DashboardData => {
    const filtered = { ...data }

    // Filter recent orders by status
    if (appliedFilters.orderStatus.length > 0) {
      filtered.recentOrders = data.recentOrders.filter((order) => appliedFilters.orderStatus.includes(order.status))
    }

    // Filter categories
    if (appliedFilters.categories.length > 0) {
      filtered.categoryOverview = data.categoryOverview.filter((category) =>
        appliedFilters.categories.includes(category.categoryName),
      )
    }

    return filtered
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
    if (dashboardData) {
      const filtered = applyLocalFilters(dashboardData, defaultFilters)
      setFilteredData(filtered)
    }
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

  if (error || !filteredData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || "Erro ao carregar dados."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

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
              <p className="text-xs text-muted-foreground">Total de vendas no período</p>
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
              <p className="text-xs text-muted-foreground">Total de pedidos no período</p>
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
              <p className="text-xs text-muted-foreground">Valor médio por pedido</p>
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
                {dashboardData && filteredData.recentOrders.length !== dashboardData.recentOrders.length && (
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
