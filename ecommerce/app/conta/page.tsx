"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CreditCard, Home, Package, RefreshCw, Settings, ShoppingBag, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookCard from "@/components/book-card"
import SectionHeading from "@/components/section-heading"
import AuthGuard from "@/components/auth-guard"
import { useAuth } from "@/lib/contexts/auth-context"
import { useBooks } from "@/lib/hooks/use-books"
import { useAddresses } from "@/lib/hooks/use-addresses"
import { useCards } from "@/lib/hooks/use-cards"
import { useOrders } from "@/lib/hooks/use-orders"
import { useCustomerProfile } from "@/lib/hooks/use-customer-profile"
import { useReturnExchange } from "@/lib/hooks/use-return-exchange"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import AddressModal from "@/components/address-modal"
import CardModal from "@/components/card-modal"
import ExchangeRequestModal from "@/components/exchange-request-modal"
import { useToast } from "@/hooks/use-toast"

export default function CustomerAccountPage() {
  const [activeTab, setActiveTab] = useState("orders")
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Only initialize hooks if user is authenticated
  const { addresses, isLoading: isAddressesLoading, deleteAddress } = useAddresses()
  const { cards, isLoading: isCardsLoading, deleteCard } = useCards()
  const { orders, isLoading: isOrdersLoading, fetchOrders } = useOrders()
  const { profile, isLoading: isProfileLoading, updateProfile } = useCustomerProfile()
  const { requests, isLoading: isRequestsLoading, getMyRequests } = useReturnExchange()
  const { books } = useBooks()
  const recommendedBooks = books.slice(0, 4)

  // Modals state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [selectedOrderForExchange, setSelectedOrderForExchange] = useState<any>(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    gender: "",
    birthdate: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      getMyRequests()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        gender: profile.gender || "",
        birthdate: profile.birthdate ? formatDateForInput(profile.birthdate.toString()) : "",
      })
    }
  }, [profile])

  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "yyyy-MM-dd")
    } catch (error) {
      return ""
    }
  }

  // Helper to format date for display
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString
      return format(date, "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      return "Data inválida"
    }
  }

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle profile form submission
  const handleProfileSubmit = async () => {
    try {
      await updateProfile(profileForm.name, profileForm.gender, profileForm.birthdate)
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Handle address deletion
  const handleDeleteAddress = async (addressId: number) => {
    if (confirm("Tem certeza que deseja excluir este endereço?")) {
      try {
        await deleteAddress(addressId)
        toast({
          title: "Endereço excluído",
          description: "O endereço foi excluído com sucesso.",
        })
      } catch (error) {
        console.error("Error deleting address:", error)
        toast({
          title: "Erro",
          description: "Não foi possível excluir o endereço. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle card deletion
  const handleDeleteCard = async (cardId: number) => {
    if (confirm("Tem certeza que deseja remover este cartão?")) {
      try {
        await deleteCard(cardId)
        toast({
          title: "Cartão removido",
          description: "O cartão foi removido com sucesso.",
        })
      } catch (error) {
        console.error("Error deleting card:", error)
        toast({
          title: "Erro",
          description: "Não foi possível remover o cartão. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  // Open address modal for editing
  const handleEditAddress = (address: any) => {
    setSelectedAddress(address)
    setIsAddressModalOpen(true)
  }

  // Open exchange modal
  const handleOpenExchangeModal = (order: any) => {
    setSelectedOrderForExchange(order)
    setIsExchangeModalOpen(true)
  }

  // Função para obter o status em português
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PROCESSING: "EM PROCESSAMENTO",
      APPROVED: "APROVADO",
      SHIPPING: "EM TRANSPORTE",
      DELIVERED: "ENTREGUE",
      REJECTED: "PAGAMENTO RECUSADO"
    }
    return statusMap[status] || status
  }

  // Função para obter a classe CSS do status
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

  // Get exchange status info
  const getExchangeStatusInfo = (status: string) => {
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

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Minha Conta</h1>

            <div className="grid md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-100 rounded-full p-3">
                      <User className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h2 className="font-bold">{profile?.name || user?.name || "Usuário"}</h2>
                      <p className="text-sm text-gray-600">{profile?.email || user?.email || "usuario@email.com"}</p>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "orders" ? "bg-amber-50 text-amber-700" : ""}`}
                      onClick={() => setActiveTab("orders")}
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Meus Pedidos
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "addresses" ? "bg-amber-50 text-amber-700" : ""}`}
                      onClick={() => setActiveTab("addresses")}
                    >
                      <Home className="h-5 w-5 mr-2" />
                      Endereços
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "payments" ? "bg-amber-50 text-amber-700" : ""}`}
                      onClick={() => setActiveTab("payments")}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Formas de Pagamento
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "exchanges" ? "bg-amber-50 text-amber-700" : ""}`}
                      onClick={() => setActiveTab("exchanges")}
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Trocas
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "settings" ? "bg-amber-50 text-amber-700" : ""}`}
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Configurações
                    </Button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {/* Orders Tab */}
                  {activeTab === "orders" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <Package className="mr-2 h-5 w-5 text-amber-500" />
                        Meus Pedidos
                      </h2>

                      {isOrdersLoading ? (
                        <div className="space-y-6">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="border rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-4">
                                <div className="animate-pulse space-y-2">
                                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                  {[...Array(2)].map((_, j) => (
                                    <div key={j} className="animate-pulse space-y-2">
                                      <div className="h-32 bg-gray-200 rounded w-24 mx-auto"></div>
                                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                                      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Você ainda não fez nenhum pedido</h3>
                          <p className="text-gray-600 mb-4">Quando você fizer um pedido, ele aparecerá aqui.</p>
                          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                            <Link href="/">Começar a Comprar</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">Pedido #{order.id}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(order.status)}`}>
                                      {getStatusText(order.status)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Data: {formatDate(order.transaction.createdAt)} | Total: R$
                                    {order.transaction.amount.toFixed(2)}
                                    {order.transaction.coupon && (
                                      <span className="ml-2 text-green-600">
                                        (Cupom {order.transaction.coupon.code}:{" "}
                                        {order.transaction.coupon.type === "PERCENTAGE"
                                          ? `${order.transaction.coupon.discount}% off`
                                          : `R$${order.transaction.coupon.discount.toFixed(2)} off`}
                                        )
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/pedido/${order.id}`}>Ver Detalhes</Link>
                                  </Button>
                                  {order.status === "DELIVERED" && (
                                    <Button variant="outline" size="sm" onClick={() => handleOpenExchangeModal(order)}>
                                      Solicitar Troca
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex flex-col items-center">
                                      <div className="relative h-32 w-24 bg-gray-100 rounded-md overflow-hidden mb-2">
                                        <Image
                                          src={`/placeholder.svg?height=300&width=200&text=${encodeURIComponent(item.bookDetails.title)}`}
                                          alt={item.bookDetails.title}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <p className="text-sm font-medium text-center line-clamp-1">
                                        {item.bookDetails.title}
                                      </p>
                                      <p className="text-xs text-gray-600">R$ {item.unitPrice.toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === "addresses" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <Home className="mr-2 h-5 w-5 text-amber-500" />
                        Meus Endereços
                      </h2>

                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {isAddressesLoading ? (
                          [...Array(2)].map((_, i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                              </div>
                            </div>
                          ))
                        ) : addresses.length > 0 ? (
                          addresses.map((address) => (
                            <div key={address.id} className="border rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <h3 className="font-medium flex items-center">
                                  {address.alias}
                                  {address.type === "BILLING" && (
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                      Cobrança
                                    </span>
                                  )}
                                  {address.type === "SHIPPING" && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                                      Entrega
                                    </span>
                                  )}
                                </h3>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => handleEditAddress(address)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteAddress(address.id ?? 0)}
                                  >
                                    Excluir
                                  </Button>
                                </div>
                              </div>
                              <p className="text-gray-600">
                                {address.street}, {address.number}
                              </p>
                              {address.complement && <p className="text-gray-600">{address.complement}</p>}
                              <p className="text-gray-600">
                                {address.district}, {address.city} - {address.state}
                              </p>
                              <p className="text-gray-600">CEP: {address.zipCode}</p>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-8">
                            <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum endereço cadastrado</h3>
                            <p className="text-gray-600 mb-4">Adicione um endereço para facilitar suas compras.</p>
                          </div>
                        )}

                        <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-center">
                          <Home className="h-8 w-8 text-gray-400 mb-2" />
                          <h3 className="font-medium text-gray-800 mb-1">Adicionar Novo Endereço</h3>
                          <p className="text-sm text-gray-600 mb-4">Cadastre um novo endereço para entrega</p>
                          <Button
                            onClick={() => {
                              setSelectedAddress(null)
                              setIsAddressModalOpen(true)
                            }}
                          >
                            Adicionar Endereço
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payments Tab */}
                  {activeTab === "payments" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <CreditCard className="mr-2 h-5 w-5 text-amber-500" />
                        Formas de Pagamento
                      </h2>

                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {isCardsLoading ? (
                          [...Array(2)].map((_, i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))
                        ) : cards.length > 0 ? (
                          cards.map((card) => (
                            <div key={card.id} className="border rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <h3 className="font-medium flex items-center">
                                  {card.brandId === 1 ? "Visa" : card.brandId === 2 ? "Mastercard" : "Cartão"} terminado
                                  em {card.number.slice(-4)}
                                </h3>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteCard(card.id ?? 0)}
                                  >
                                    Remover
                                  </Button>
                                </div>
                              </div>
                              <p className="text-gray-600">{card.holderName}</p>
                              <p className="text-gray-600">Validade: {card.expiryDate}</p>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-8">
                            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum cartão cadastrado</h3>
                            <p className="text-gray-600 mb-4">Adicione um cartão para facilitar suas compras.</p>
                          </div>
                        )}

                        <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-center">
                          <CreditCard className="h-8 w-8 text-gray-400 mb-2" />
                          <h3 className="font-medium text-gray-800 mb-1">Adicionar Novo Cartão</h3>
                          <p className="text-sm text-gray-600 mb-4">Cadastre um novo cartão para pagamentos</p>
                          <Button onClick={() => setIsCardModalOpen(true)}>Adicionar Cartão</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exchanges Tab */}
                  {activeTab === "exchanges" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <RefreshCw className="mr-2 h-5 w-5 text-amber-500" />
                        Trocas e Devoluções
                      </h2>

                      {isRequestsLoading ? (
                        <div className="animate-pulse space-y-4">
                          <Skeleton className="h-32 w-full rounded-lg" />
                          <Skeleton className="h-32 w-full rounded-lg" />
                        </div>
                      ) : requests.length === 0 ? (
                        <div className="text-center py-8">
                          <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Você não tem trocas em andamento</h3>
                          <p className="text-gray-600 mb-4">Quando você solicitar uma troca, ela aparecerá aqui.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {requests.map((request) => {
                            const statusInfo = getExchangeStatusInfo(request.status)

                            return (
                              <div key={request.id} className="border rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">Solicitação #{request.id}</h3>
                                      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                                        {statusInfo.label}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Criada em {request.createdAt ? formatDate(request.createdAt) : "N/A"}
                                    </p>
                                  </div>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href="/conta/trocas">Ver Detalhes</Link>
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Tag className="h-4 w-4 text-amber-500" />
                                  <span className="font-medium">Tipo:</span>
                                  <span>{request.status.startsWith("EXCHANGE") ? "Troca" : "Devolução"}</span>
                                </div>
                                <div className="mt-1 text-sm">
                                  <span className="font-medium">Motivo:</span>
                                  <p className="text-gray-700 mt-1">{request.description}</p>
                                </div>
                              </div>
                            )
                          })}

                          {requests.length > 3 && (
                            <div className="text-center">
                              <Button variant="outline" asChild>
                                <Link href="/conta/trocas">Ver Todas as Solicitações</Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === "settings" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <Settings className="mr-2 h-5 w-5 text-amber-500" />
                        Configurações da Conta
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-gray-800 mb-4">Informações Pessoais</h3>
                          {isProfileLoading ? (
                            <div className="animate-pulse space-y-4">
                              <div className="h-10 bg-gray-200 rounded w-full"></div>
                              <div className="h-10 bg-gray-200 rounded w-full"></div>
                              <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                              </div>
                              <div>
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                  id="email"
                                  value={profile?.email || user?.email || ""}
                                  disabled
                                  className="bg-gray-50"
                                />
                              </div>
                              <div>
                                <Label htmlFor="gender">Gênero</Label>
                                <Select
                                  value={profileForm.gender}
                                  onValueChange={(value) => setProfileForm((prev) => ({ ...prev, gender: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="MALE">Masculino</SelectItem>
                                    <SelectItem value="FEMALE">Feminino</SelectItem>
                                    <SelectItem value="OTHER">Outro</SelectItem>
                                    <SelectItem value="PREFER_NOT_TO_SAY">Prefiro não informar</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="birthdate">Data de Nascimento</Label>
                                <Input
                                  id="birthdate"
                                  name="birthdate"
                                  type="date"
                                  value={profileForm.birthdate}
                                  onChange={handleProfileChange}
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                  id="phone"
                                  value={
                                    profile?.phone
                                      ? `(${profile.phone.ddd}) ${profile.phone.number}`
                                      : "(11) 98765-4321"
                                  }
                                  disabled
                                  className="bg-gray-50"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                  id="cpf"
                                  value={profile?.document || user?.document || "123.456.789-00"}
                                  disabled
                                  className="bg-gray-50"
                                />
                              </div>
                            </div>
                          )}
                          <Button className="mt-4" onClick={handleProfileSubmit} disabled={isProfileLoading}>
                            Salvar Alterações
                          </Button>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium text-gray-800 mb-4">Alterar Senha</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="current-password">Senha Atual</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="new-password">Nova Senha</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                          </div>
                          <Button className="mt-4">Alterar Senha</Button>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium text-gray-800 mb-4">Preferências</h3>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="newsletter"
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                                Receber newsletter com novidades e promoções
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="order-updates"
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label htmlFor="order-updates" className="ml-2 block text-sm text-gray-700">
                                Receber atualizações sobre meus pedidos por e-mail
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="recommendations"
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label htmlFor="recommendations" className="ml-2 block text-sm text-gray-700">
                                Receber recomendações personalizadas de livros
                              </label>
                            </div>
                          </div>
                          <Button className="mt-4">Salvar Preferências</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommended Books - Only show if authenticated */}
                {isAuthenticated && (
                  <section className="mt-8">
                    <SectionHeading title="Recomendados para Você" viewAllLink="/recomendados" poweredBy="SenseRead" />
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {recommendedBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Modals */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={() => {
          setIsAddressModalOpen(false)
        }}
        editAddress={selectedAddress}
      />

      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSuccess={() => setIsCardModalOpen(false)}
      />

      {selectedOrderForExchange && (
        <ExchangeRequestModal
          isOpen={isExchangeModalOpen}
          onClose={() => {
            setIsExchangeModalOpen(false)
            setSelectedOrderForExchange(null)
          }}
          orderId={selectedOrderForExchange.id}
          orderItems={selectedOrderForExchange.items}
        />
      )}
    </AuthGuard>
  )
}
