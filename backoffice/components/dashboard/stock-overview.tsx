"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { CategoryOverview } from "@/services/api-service"
import { ca, fi } from "date-fns/locale"

interface StockOverviewProps {
  data: CategoryOverview[]
}

export function StockOverview({ data }: StockOverviewProps) {
  const filteredData = data.filter((item) => item.totalItems > 0)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ categoryName, percentage }) => `${categoryName}: ${percentage.toFixed(1)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="totalItems"
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.colorCode} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, index: number) => {
            const categoryName = filteredData[index].categoryName;
            return [value, categoryName];
          }}
          labelFormatter={(index) => `Categoria: ${index}`}
        />
        <Legend formatter={(index) => {
          const categoryName = filteredData[index].categoryName;
          return [categoryName];
        }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
