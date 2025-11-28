"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/enums/order-status"
import Link from "next/link"
import { services } from "@/services"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.PROCESSING)
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterAndSortOrders()
  }, [orders, searchQuery, statusFilter, sortBy])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await services.orderService.getAllOrders()
      setOrders(data)
      setFilteredOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortOrders = () => {
    let filtered = [...orders]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id?.toString().includes(query) ||
          order.customer?.name?.toLowerCase().includes(query) ||
          order.customer?.email?.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
        case "oldest":
          return new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime()
        case "highest":
          return (b.transaction?.amount || 0) - (a.transaction?.amount || 0)
        case "lowest":
          return (a.transaction?.amount || 0) - (b.transaction?.amount || 0)
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order)
    setNewStatus(order.status as OrderStatus)
    setOpenDialog(true)
  }

  const confirmStatusUpdate = async () => {
    try {
      await services.orderService.updateOrderStatus(selectedOrder.id, newStatus)

      // Update the local state
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          return { ...order, status: newStatus }
        }
        return order
      })

      setOrders(updatedOrders)

      toast({
        title: "Status Updated",
        description: `Order #${selectedOrder.id} status has been updated to ${formatStatus(newStatus)}`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setOpenDialog(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.APPROVED:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.REJECTED:
        return "bg-red-100 text-red-800"
      case OrderStatus.CANCELED:
        return "bg-gray-100 text-gray-800"
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800"
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString()
  }

  const calculateTotal = (order: any) => {
    if (order.transaction?.amount) {
      return Number(order.transaction.amount)
    }

    return order.items?.reduce((sum: number, item: any) => sum + (item.unit_price || 0), 0) || 0
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar por ID do pedido ou Cliente"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value={OrderStatus.PROCESSING}>Processando</SelectItem>
            <SelectItem value={OrderStatus.APPROVED}>Aprovado</SelectItem>
            <SelectItem value={OrderStatus.REJECTED}>Rejeitado</SelectItem>
            <SelectItem value={OrderStatus.CANCELED}>Cancelado</SelectItem>
            <SelectItem value={OrderStatus.SHIPPING}>Em preparação</SelectItem>
            <SelectItem value={OrderStatus.SHIPPED}>Enviad</SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>Entregue</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="newest" value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais novo</SelectItem>
            <SelectItem value="oldest">Mais velho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">#{order.id}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{order.customer?.name || "Customer"}</div>
                          <div className="text-sm text-muted-foreground">{order.customer?.email || "-"}</div>
                        </div>
                      </td>
                      <td className="p-4">{formatDate(order.createdAt || order.date)}</td>
                      <td className="p-4">{order.items?.length || 0} items</td>
                      <td className="p-4 font-medium">${calculateTotal(order).toFixed(2)}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(order.status)}>{formatStatus(order.status)}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order)}>
                            Atualizar Status
                          </Button>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{selectedOrder?.id} for customer{" "}
              {selectedOrder?.customer?.name || "Customer"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Status</p>
              <Badge variant="outline" className={selectedOrder ? getStatusColor(selectedOrder.status) : ""}>
                {selectedOrder ? formatStatus(selectedOrder.status) : ""}
              </Badge>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium">New Status</p>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                  <SelectItem value={OrderStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={OrderStatus.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={OrderStatus.CANCELED}>Canceled</SelectItem>
                  <SelectItem value={OrderStatus.SHIPPING}>Shipping</SelectItem>
                  <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                  <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusUpdate}>Atualizar Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
