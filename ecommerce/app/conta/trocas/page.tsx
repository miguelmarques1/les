"use client"

import { useEffect, useState } from "react"
import { useReturnExchange } from "@/lib/hooks/use-return-exchange"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, RefreshCw, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AuthGuard from "@/components/auth-guard"
import type { ReturnExchangeModel } from "@/lib/models/return-exchange-model"

export default function ExchangesPage() {
  const { requests, isLoading, getMyRequests, cancelRequest } = useReturnExchange()
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null)
  const [isCancelling, setIsCancelling] = useState<number | null>(null)

  useEffect(() => {
    getMyRequests()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      return "Data inválida"
    }
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      EXCHANGE_REQUESTED: {
        label: "Troca solicitada",
        color: "bg-amber-100 text-amber-800",
      },
      EXCHANGE_PENDING: {
        label: "Troca pendente",
        color: "bg-amber-100 text-amber-800",
      },
      EXCHANGE_ACCEPTED: {
        label: "Troca aprovada",
        color: "bg-green-100 text-green-800",
      },
      EXCHANGE_REJECTED: {
        label: "Troca rejeitada",
        color: "bg-red-100 text-red-800",
      },
      EXCHANGE_COMPLETED: {
        label: "Troca concluída",
        color: "bg-blue-100 text-blue-800",
      },
      EXCHANGE_CANCELLED: {
        label: "Troca cancelada",
        color: "bg-gray-100 text-gray-800",
      },
      RETURN_REQUESTED: {
        label: "Devolução solicitada",
        color: "bg-amber-100 text-amber-800",
      },
      RETURN_PENDING: {
        label: "Devolução pendente",
        color: "bg-amber-100 text-amber-800",
      },
      RETURN_ACCEPTED: {
        label: "Devolução aprovada",
        color: "bg-green-100 text-green-800",
      },
      RETURN_REJECTED: {
        label: "Devolução rejeitada",
        color: "bg-red-100 text-red-800",
      },
      RETURN_COMPLETED: {
        label: "Devolução concluída",
        color: "bg-blue-100 text-blue-800",
      },
      RETURN_CANCELLED: {
        label: "Devolução cancelada",
        color: "bg-gray-100 text-gray-800",
      },
    }

    return (
      statusMap[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
      }
    )
  }

  const handleCancelRequest = async (requestId: number) => {
    if (confirm("Tem certeza que deseja cancelar esta solicitação?")) {
      setIsCancelling(requestId)
      try {
        await cancelRequest(requestId)
      } catch (error) {
        console.error("Error cancelling request:", error)
      } finally {
        setIsCancelling(null)
      }
    }
  }

  const canCancelRequest = (request: ReturnExchangeModel) => {
    return (
      request.status === "EXCHANGE_REQUESTED" ||
      request.status === "EXCHANGE_PENDING" ||
      request.status === "RETURN_REQUESTED" ||
      request.status === "RETURN_PENDING"
    )
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/conta">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Minha Conta
                </Link>
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Trocas e Devoluções</h1>
              <p className="text-gray-600 mt-1">Acompanhe suas solicitações de troca e devolução</p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-800 mb-2">Nenhuma solicitação encontrada</h2>
                <p className="text-gray-600 mb-6">Você ainda não possui solicitações de troca ou devolução.</p>
                <Button asChild>
                  <Link href="/conta">Voltar para Minha Conta</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((request) => {
                  const statusInfo = getStatusInfo(request.status)
                  const isExpanded = expandedRequest === request.id

                  return (
                    <div key={request.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="font-medium">Solicitação #{request.id}</h2>
                              <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {request.createdAt && `Criada em ${formatDate(request.createdAt)}`}
                              {request.updatedAt &&
                                request.createdAt !== request.updatedAt &&
                                ` • Atualizada em ${formatDate(request.updatedAt)}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {canCancelRequest(request) && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => handleCancelRequest(request.id)}
                                disabled={isCancelling === request.id}
                              >
                                {isCancelling === request.id ? "Cancelando..." : "Cancelar"}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedRequest(isExpanded ? null : request.id)}
                            >
                              {isExpanded ? "Ocultar Detalhes" : "Ver Detalhes"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50">
                        <div className="flex items-center gap-2 text-sm">
                          <Tag className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">Tipo:</span>
                          <span>{request.status.startsWith("EXCHANGE") ? "Troca" : "Devolução"}</span>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Motivo:</span>
                          <p className="text-gray-700 mt-1">{request.description}</p>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t">
                          <h3 className="font-medium mb-3">Itens da solicitação</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {request.items.map((item) => (
                              <div key={item.id} className="flex gap-3 p-3 border rounded-md">
                                <div className="relative h-20 w-16 bg-gray-100 rounded overflow-hidden">
                                  <Image
                                    src={`/placeholder.svg?height=300&width=200&text=${encodeURIComponent(item.book_details.title)}`}
                                    alt={item.book_details.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm line-clamp-2">{item.book_details.title}</p>
                                  <p className="text-xs text-gray-600">{item.book_details.author}</p>
                                  <p className="text-xs mt-1">R$ {item.unit_price.toFixed(2)}</p>
                                  <p className="text-xs text-gray-500 mt-1">Código: {item.code}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
