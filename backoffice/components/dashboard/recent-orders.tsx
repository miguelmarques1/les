"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RecentOrder } from "@/services/api-service"

interface RecentOrdersProps {
  orders: RecentOrder[]
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const statusLabels = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  SHIPPING: "Em preparação",
  APPROVED: "Pagamento aprovado"
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum pedido recente encontrado</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Itens</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{order.transaction?.card?.holder_name || "N/A"}</p>
                <p className="text-sm text-muted-foreground">
                  {order.address?.city}, {order.address?.state}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                {statusLabels[order.status as keyof typeof statusLabels] || order.status}
              </Badge>
            </TableCell>
            <TableCell>
              R${" "}
              {order.transaction?.amount?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "0,00"}
            </TableCell>
            <TableCell>{order.items?.length || 0} item(s)</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
