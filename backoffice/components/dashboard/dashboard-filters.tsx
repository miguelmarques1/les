"use client"

import { useState } from "react"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface DashboardFilters {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  orderStatus: string[]
  categories: string[]
  period: string
}

interface DashboardFiltersProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isLoading?: boolean
}

const orderStatusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "PROCESSING", label: "Processando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "APPROVED", label: "Aprovado" },
]

const categoryOptions = [
  { value: "Ficção", label: "Ficção" },
  { value: "Romance", label: "Romance" },
  { value: "Suspense", label: "Suspense" },
  { value: "Terror", label: "Terror" },
  { value: "Fantasia", label: "Fantasia" },
  { value: "Biografia", label: "Biografia" },
  { value: "História", label: "História" },
  { value: "Ciência", label: "Ciência" },
]

const periodOptions = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "6m", label: "Últimos 6 meses" },
  { value: "1y", label: "Último ano" },
  { value: "custom", label: "Período personalizado" },
]

export function DashboardFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isLoading = false,
}: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilters = (updates: Partial<DashboardFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleOrderStatus = (status: string) => {
    const newStatuses = filters.orderStatus.includes(status)
      ? filters.orderStatus.filter((s) => s !== status)
      : [...filters.orderStatus, status]
    updateFilters({ orderStatus: newStatuses })
  }

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    updateFilters({ categories: newCategories })
  }

  const hasActiveFilters =
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.orderStatus.length > 0 ||
    filters.categories.length > 0 ||
    filters.period !== "30d"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {[
                  filters.orderStatus.length,
                  filters.categories.length,
                  filters.dateRange.from || filters.dateRange.to ? 1 : 0,
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Período Predefinido */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select value={filters.period} onValueChange={(value) => updateFilters({ period: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Range - só aparece se período personalizado for selecionado */}
          {filters.period === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.from && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from
                        ? format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) =>
                        updateFilters({
                          dateRange: { ...filters.dateRange, from: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.to && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to
                        ? format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) =>
                        updateFilters({
                          dateRange: { ...filters.dateRange, to: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <Separator />

          {/* Status dos Pedidos */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status dos Pedidos</label>
            <div className="flex flex-wrap gap-2">
              {orderStatusOptions.map((status) => (
                <Badge
                  key={status.value}
                  variant={filters.orderStatus.includes(status.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleOrderStatus(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Categorias */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categorias</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <Badge
                  key={category.value}
                  variant={filters.categories.includes(category.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleCategory(category.value)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Botões de Ação */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClearFilters} disabled={!hasActiveFilters || isLoading}>
              Limpar Filtros
            </Button>
            <Button onClick={onApplyFilters} disabled={isLoading}>
              {isLoading ? "Aplicando..." : "Aplicar Filtros"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
