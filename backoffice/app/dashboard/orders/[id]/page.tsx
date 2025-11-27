"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { OrderStatus } from "@/enums/order-status"
import Link from "next/link"
import { orderService } from "@/services"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = Number.parseInt(params.id)

  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await orderService.getOrderById(orderId)
        setOrder(data)
      } catch (err) {
        console.error("[v0] Error fetching order:", err)
        setError("Falha ao carregar detalhes do pedido")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const getStatusColor = (status: OrderStatus) => {
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

  const formatStatus = (status: OrderStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Carregando pedido...</h1>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Erro</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {order.date || new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2 font-medium">Product</th>
                    <th className="text-right pb-2 font-medium">Price</th>
                    <th className="text-right pb-2 font-medium">Quantity</th>
                    <th className="text-right pb-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item: any, index: number) => (
                    <tr key={item.id || index} className="border-b">
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{item.book_details?.title || item.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.book_details?.author || item.author}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right">${(item.unit_price || item.price || 0).toFixed(2)}</td>
                      <td className="py-4 text-right">{item.quantity || 1}</td>
                      <td className="py-4 text-right">
                        ${((item.unit_price || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-medium">
                      Subtotal
                    </td>
                    <td className="pt-4 text-right">
                      ${(order.subtotal || order.transaction?.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-bold">
                      Total
                    </td>
                    <td className="pt-4 text-right font-bold">
                      ${(order.total || order.transaction?.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {order.timeline && (
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
                <CardDescription>Status history of this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-muted pl-6 pb-2">
                  {order.timeline.map((event: any, index: number) => (
                    <div key={index} className="mb-8 relative">
                      <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(event.status).split(" ")[0]}`} />
                      </div>
                      <div>
                        <Badge className={getStatusColor(event.status)}>{formatStatus(event.status)}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{order.customer?.name || order.address?.alias || "N/A"}</p>
                </div>
                {order.customer?.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{order.customer.email}</p>
                  </div>
                )}
                {order.customer?.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{order.customer.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {order.address && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p>{order.address.alias}</p>
                  <p>
                    {order.address.street}, {order.address.number}
                  </p>
                  <p>{order.address.district}</p>
                  <p>
                    {order.address.city}, {order.address.state} {order.address.zip_code}
                  </p>
                  <p>{order.address.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {order.transaction && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                    <p>Credit Card</p>
                  </div>
                  {order.transaction.card && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Card Details</p>
                      <p>Ending in {order.transaction.card.number?.slice(-4)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p>${order.transaction.amount?.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                  <Badge className={`mt-1 ${getStatusColor(order.status)}`}>{formatStatus(order.status)}</Badge>
                </div>
                <Link href="/dashboard/orders">
                  <Button className="w-full">Atualizar Status</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
