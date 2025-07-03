import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { OrderStatus } from "@/enums/order-status"
import Link from "next/link"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = Number.parseInt(params.id)

  // Mock order data - in a real app, you would fetch this from API
  const order = {
    id: orderId,
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    date: "2023-04-15",
    items: [
      { id: 101, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 14.99, quantity: 1 },
      { id: 102, title: "To Kill a Mockingbird", author: "Harper Lee", price: 12.99, quantity: 1 },
    ],
    subtotal: 27.98,
    shipping: 4.99,
    tax: 2.8,
    total: 35.77,
    status: OrderStatus.DELIVERED,
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "4242",
      cardBrand: "Visa",
    },
    timeline: [
      { status: OrderStatus.PROCESSING, date: "2023-04-15 09:30:00" },
      { status: OrderStatus.APPROVED, date: "2023-04-15 10:15:00" },
      { status: OrderStatus.SHIPPED, date: "2023-04-16 14:20:00" },
      { status: OrderStatus.DELIVERED, date: "2023-04-18 11:45:00" },
    ],
  }

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
          <p className="text-muted-foreground">Placed on {order.date}</p>
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
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.author}</div>
                        </div>
                      </td>
                      <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-4 text-right">{item.quantity}</td>
                      <td className="py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-medium">
                      Subtotal
                    </td>
                    <td className="pt-4 text-right">${order.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium">
                      Shipping
                    </td>
                    <td className="pt-2 text-right">${order.shipping.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium">
                      Tax
                    </td>
                    <td className="pt-2 text-right">${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-bold">
                      Total
                    </td>
                    <td className="pt-4 text-right font-bold">${order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Status history of this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-muted pl-6 pb-2">
                {order.timeline.map((event, index) => (
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
                  <p>{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{order.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.customer}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </p>
                <p>{order.address.country}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p>{order.payment.method}</p>
                </div>
                {order.payment.cardLast4 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Card Details</p>
                    <p>
                      {order.payment.cardBrand} ending in {order.payment.cardLast4}
                    </p>
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
