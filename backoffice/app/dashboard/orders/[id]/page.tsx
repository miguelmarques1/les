"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { OrderStatus } from "@/enums/order-status"
import Link from "next/link"
import { services } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = Number.parseInt(params.id)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const data = await services.order.getOrderById(orderId)
      setOrder(data)
    } catch (error) {
      console.error("Failed to fetch order details:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do pedido.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetails()
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

  const formatStatus = (status: string) => {
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
          <div>
            <h1 className="text-3xl font-bold">Order #{orderId}</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Pedido não encontrado</h1>
          </div>
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
            Status: <Badge className={getStatusColor(order.status as OrderStatus)}>{formatStatus(order.status)}</Badge>
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
                    <th className="text-right pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{item.book_details?.title || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{item.book_details?.author || "N/A"}</div>
                        </div>
                      </td>
                      <td className="py-4 text-right">R$ {item.unit_price?.toFixed(2) || "0.00"}</td>
                      <td className="py-4 text-right">
                        <Badge variant="outline">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="pt-4 text-right font-bold">
                      Total
                    </td>
                    <td className="pt-4 text-right font-bold">R$ {order.transaction?.amount?.toFixed(2) || "0.00"}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>
                  {order.address?.street || "N/A"}, {order.address?.number || ""}
                </p>
                <p>{order.address?.district || ""}</p>
                <p>
                  {order.address?.city || ""}, {order.address?.state || ""} {order.address?.zip_code || ""}
                </p>
                <p>{order.address?.country || ""}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p>R$ {order.transaction?.amount?.toFixed(2) || "0.00"}</p>
                </div>
                {order.transaction?.card && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Card</p>
                    <p>**** {order.transaction.card.number?.slice(-4) || "****"}</p>
                  </div>
                )}
                {order.transaction?.coupon && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Coupon</p>
                    <p>{order.transaction.coupon.code}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                  <Badge className={`mt-1 ${getStatusColor(order.status as OrderStatus)}`}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
