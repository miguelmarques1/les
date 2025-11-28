"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card } from "@/components/ui/card"

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangeFilterProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  onApply: () => void
}

const periodOptions = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
]

export function DateRangeFilter({ dateRange, onDateRangeChange, onApply }: DateRangeFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  const handlePeriodClick = (period: string) => {
    const today = new Date()
    const fromDate = new Date()

    switch (period) {
      case "7d":
        fromDate.setDate(today.getDate() - 7)
        break
      case "30d":
        fromDate.setDate(today.getDate() - 30)
        break
      case "90d":
        fromDate.setDate(today.getDate() - 90)
        break
    }

    setSelectedPeriod(period)
    onDateRangeChange({ from: fromDate, to: today })
    onApply()
  }

  const handleDateChange = (type: "from" | "to", date: Date | undefined) => {
    setSelectedPeriod(null)
    onDateRangeChange({
      ...dateRange,
      [type]: date,
    })
  }

  const handleClearDates = () => {
    setSelectedPeriod(null)
    onDateRangeChange({ from: undefined, to: undefined })
    onApply()
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Filtrar por período</span>
          {(dateRange.from || dateRange.to) && (
            <Button variant="ghost" size="sm" onClick={handleClearDates} className="h-7 text-xs">
              Limpar
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedPeriod === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodClick(option.value)}
              className="h-8 text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex-1 justify-start text-left font-normal h-9",
                  !dateRange.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => handleDateChange("from", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground text-sm">até</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex-1 justify-start text-left font-normal h-9",
                  !dateRange.to && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => handleDateChange("to", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {(dateRange.from || dateRange.to) && !selectedPeriod && (
          <Button size="sm" onClick={onApply} className="h-8">
            Aplicar filtro
          </Button>
        )}
      </div>
    </Card>
  )
}
