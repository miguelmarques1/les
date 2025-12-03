"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useOrders } from "@/lib/hooks/use-orders"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import ExchangeRequestModal from "@/components/exchange-request-modal"
import type { OrderModel } from "@/lib/models/order-model"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { isLoading, getOrderById } = useOrders()
  const [order, setOrder] = useState<OrderModel | null>(null)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)

  useEffect(() => {
    const orderIdInt = Number.parseInt(orderId)
    getOrder(orderIdInt)
  }, [])

  const getOrder = async (orderId: number) => {
    const order = await getOrderById(orderId)
    setOrder(order)
  }

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (error) {
      return "Data inválida"
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PROCESSING: "Em processamento",
      APPROVED: "Aprovado",
      SHIPPING: "Em transporte",
      DELIVERED: "Entregue",
      REJECTED: "Pagamento Recusado",
    }
    return statusMap[status] || status
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "SHIPPING":
        return "bg-blue-100 text-blue-800"
      case "APPROVED":
        return "bg-amber-100 text-amber-800"
      case "PROCESSING":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "SHIPPING":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "APPROVED":
        return <Package className="h-5 w-5 text-amber-600" />
      case "PROCESSING":
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const renderOrderProgress = (status: string) => {
    const steps = [
      { id: "PROCESSING", label: "Processando" },
      { id: "APPROVED", label: "Aprovado" },
      { id: "SHIPPING", label: "Em transporte" },
      { id: "DELIVERED", label: "Entregue" },
    ]

    const currentStepIndex = steps.findIndex((step) => step.id === status)

    return (
      <div className="w-full py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  index <= currentStepIndex ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${index <= currentStepIndex ? "text-amber-600" : "text-gray-500"}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 w-full bg-gray-200">
          <div
            className="h-1 bg-amber-500"
            style={{
              width: `${
                currentStepIndex >= 0 ? Math.min(100, ((currentStepIndex + 0.5) / (steps.length - 1)) * 100) : 0
              }%`,
            }}
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Skeleton className="h-8 w-64" />
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Skeleton className="mb-6 h-8 w-full max-w-md" />
              <Skeleton className="mb-8 h-24 w-full" />
              <Skeleton className="mb-6 h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center">
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <p className="text-gray-600">
                Não foi possível encontrar o pedido solicitado. Por favor, verifique o número do pedido e tente
                novamente.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/conta">Voltar para Minha Conta</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Detalhes do Pedido</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Pedido #{order.id}</h2>
                    <p className="text-gray-600">Realizado em {formatDate(order.getCreatedAt())}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {renderOrderProgress(order.status)}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-amber-500" />
                      <div>
                        <h3 className="font-medium">Previsão de entrega</h3>
                        <p className="text-sm text-gray-600">
                          {order.status === "DELIVERED"
                            ? "Entregue em 28 de abril de 2025"
                            : "Entre 30 de abril e 5 de maio de 2025"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-amber-500" />
                      <div>
                        <h3 className="font-medium">Método de entrega</h3>
                        <p className="text-sm text-gray-600">Entrega padrão</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Itens do Pedido</h2>
                <div className="space-y-4">
                  {(() => {
                    const groupedItems = order.items.reduce((acc: any, item: any) => {
                      const bookId = item.bookDetails?.id || item.book?.id
                      if (!acc[bookId]) {
                        acc[bookId] = {
                          bookDetails: item.bookDetails || item.book,
                          quantity: 0,
                          totalPrice: 0,
                          unitPrice: item.unitPrice,
                          items: [],
                        }
                      }
                      acc[bookId].quantity += 1
                      acc[bookId].totalPrice += item.unitPrice
                      acc[bookId].items.push(item)
                      return acc
                    }, {})

                    return Object.values(groupedItems).map((group: any) => (
                      <div key={group.bookDetails.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                        <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={`/placeholder_image.png?height=300&width=200&text=${encodeURIComponent(
                              group.bookDetails.title,
                            )}`}
                            alt={group.bookDetails.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{group.bookDetails.title}</h3>
                              <p className="text-sm text-gray-600">{group.bookDetails.author}</p>
                            </div>
                            <p className="font-medium">R$ {group.unitPrice.toFixed(2)}</p>
                          </div>
                          <div className="mt-auto flex items-end justify-between">
                            <p className="text-sm text-gray-600">Quantidade: {group.quantity}</p>
                            <p className="font-medium">Subtotal: R$ {group.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Endereço de Entrega</h2>
                <div className="rounded-lg border bg-gray-50 p-4">
                  <p className="font-medium">{order.address.alias || "Endereço Principal"}</p>
                  <p className="text-gray-600">
                    {order.address.street}, {order.address.number}
                  </p>
                  {order.address.observations && <p className="text-gray-600">{order.address.observations}</p>}
                  <p className="text-gray-600">
                    {order.address.district}, {order.address.city} - {order.address.state}
                  </p>
                  <p className="text-gray-600">CEP: {order.address.zipCode}</p>
                  <p className="text-gray-600">{order.address.country}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Resumo do Pedido</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {order.getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>Grátis</span>
                  </div>

                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {order.getFinalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Pagamento</h2>
                <div className="space-y-4">
                  {order.transaction.cardPayments.map((cardPayment, idx) => (
                    <div key={idx} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-gray-100 p-2">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Cartão de crédito</p>
                          <p className="text-sm text-gray-600">
                            {cardPayment.card.getBrandName()} terminado em {cardPayment.card.getLastFourDigits()}
                          </p>
                        </div>
                        <p className="font-medium text-amber-600">R$ {cardPayment.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-600">
                      <span className="font-medium">Status do pagamento:</span> Aprovado
                    </p>
                    {order.transaction.cardPayments.length > 1 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Pagamento dividido em {order.transaction.cardPayments.length} cartões
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Ações</h2>
                <div className="space-y-3">
                  {order.status === "DELIVERED" && (
                    <Button className="w-full" onClick={() => setIsExchangeModalOpen(true)}>
                      Solicitar Troca ou Devolução
                    </Button>
                  )}
                  <Button variant="outline" className="w-full bg-transparent">
                    Imprimir Pedido
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/ajuda">Preciso de Ajuda</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ExchangeRequestModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        orderId={order.id ?? 0}
        orderItems={order.items}
      />
    </div>
  )
}
