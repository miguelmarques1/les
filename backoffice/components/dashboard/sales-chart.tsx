"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { SalesData } from "@/services/api-service"

interface SalesChartProps {
  data: SalesData[]
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$ ${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Vendas"]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Area type="monotone" dataKey="totalSales" stroke="#8884d8" fillOpacity={1} fill="url(#colorSales)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
