"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, CreditCard, MapPin, Truck, Tag, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AuthGuard from "@/components/auth-guard"
import { useCart } from "@/lib/hooks/use-cart"
import { useAddresses } from "@/lib/hooks/use-addresses"
import { useCards } from "@/lib/hooks/use-cards"
import { useOrders } from "@/lib/hooks/use-orders"
import { useCoupon } from "@/lib/hooks/use-coupon"
import { PaymentMethod } from "@/lib/enums/payment-method"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressType } from "@/lib/enums/address-type"
import { ResidenceType } from "@/lib/enums/residence-type"
import type { OrderCardInput } from "@/lib/models/order-model"
import { useBrands } from "@/lib/hooks/use-brands"

// Checkout steps
type CheckoutStep = "shipping" | "payment" | "confirmation"

// Address form state
interface AddressFormState {
  alias: string
  type: AddressType
  residenceType: ResidenceType
  streetType: string
  street: string
  number: string
  complement: string
  district: string
  zipCode: string
  city: string
  state: string
  country: string
  observations: string
}

// Card form state
interface CardFormState {
  number: string
  holderName: string
  expiryDate: string
  brandId: number
  cvv: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, groupedItems, isLoading: isCartLoading, refreshCart } = useCart()
  const { addresses, isLoading: isAddressesLoading, createAddress } = useAddresses()
  const { cards, isLoading: isCardsLoading, createCard } = useCards()
  const { createOrder, isLoading: isOrderLoading } = useOrders()
  const { brands, isLoading: brandsLoading } = useBrands()
  const { coupon, validateCoupon, clearCoupon, isLoading: isCouponLoading } = useCoupon()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("standard")
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD)
  const [isNewAddress, setIsNewAddress] = useState(false)
  const [isNewPayment, setIsNewPayment] = useState(false)
  const [useTemporaryCard, setUseTemporaryCard] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [hasCouponApplied, setHasCouponApplied] = useState(false)

  // Form states
  const [addressForm, setAddressForm] = useState<AddressFormState>({
    alias: "",
    type: AddressType.SHIPPING,
    residenceType: ResidenceType.HOUSE,
    streetType: "STREET",
    street: "",
    number: "",
    complement: "",
    district: "",
    zipCode: "",
    city: "",
    state: "",
    country: "Brasil",
    observations: "",
  })

  const [cardForm, setCardForm] = useState<CardFormState>({
    number: "",
    holderName: "",
    expiryDate: "",
    brandId: 1,
    cvv: "",
  })

  // Set default address and payment method when data is loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id || null)
    }
    if (cards.length > 0 && !selectedPaymentId && !useTemporaryCard) {
      setSelectedPaymentId(cards[0].id || null)
    }
  }, [addresses, cards, selectedAddressId, selectedPaymentId, useTemporaryCard])

  // Calculate subtotal
  const subtotal = cart?.total || 0

  // Shipping cost based on method
  const shippingCost = selectedShippingMethod === "express" ? 25.9 : 15.9

  // Coupon discount
  const couponDiscount = coupon ? coupon.calculateDiscountAmount(subtotal) : 0

  // Total
  const total = subtotal + shippingCost - couponDiscount

  // Go to next step
  const goToNextStep = () => {
    if (currentStep === "shipping") {
      if (!selectedAddressId) {
        toast({
          title: "Endereço necessário",
          description: "Por favor, selecione um endereço de entrega.",
        })
        return
      }
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      if (selectedPaymentMethod === PaymentMethod.CREDIT_CARD) {
        if (useTemporaryCard) {
          if (!cardForm.number || !cardForm.holderName || !cardForm.expiryDate || !cardForm.cvv) {
            toast({
              title: "Dados do cartão necessários",
              description: "Por favor, preencha todos os dados do cartão.",
            })
            return
          }
        } else if (!selectedPaymentId) {
          toast({
            title: "Forma de pagamento necessária",
            description: "Por favor, selecione um cartão de crédito.",
          })
          return
        }
      }
      setCurrentStep("confirmation")
    }
  }

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep === "payment") setCurrentStep("shipping")
    else if (currentStep === "confirmation") setCurrentStep("payment")
  }

  // Get selected address
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)

  // Get selected payment method
  const selectedPaymentCard = cards.find((card) => card.id === selectedPaymentId)

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim()
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/, "$1/")
      .slice(0, 5)
  }

  // Format zip code
  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9)
  }

  // Handle address form change
  const handleAddressFormChange = (field: keyof AddressFormState, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }))
  }

  // Handle card form change
  const handleCardFormChange = (field: keyof CardFormState, value: string) => {
    setCardForm((prev) => ({ ...prev, [field]: value }))
  }

  // Save new address
  const handleSaveAddress = async () => {
    if (
      !addressForm.alias ||
      !addressForm.street ||
      !addressForm.number ||
      !addressForm.district ||
      !addressForm.zipCode ||
      !addressForm.city ||
      !addressForm.state
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      return
    }

    try {
      const newAddress = await createAddress(
        addressForm.alias,
        addressForm.type,
        addressForm.residenceType,
        addressForm.streetType,
        addressForm.street,
        addressForm.number,
        addressForm.district,
        addressForm.zipCode,
        addressForm.city,
        addressForm.state,
        addressForm.country,
        addressForm.complement,
        addressForm.observations,
      )

      setSelectedAddressId(newAddress.id || null)
      setIsNewAddress(false)

      toast({
        title: "Endereço adicionado",
        description: "O endereço foi adicionado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o endereço.",
      })
    }
  }

  // Save new card
  const handleSaveCard = async () => {
    if (!cardForm.number || !cardForm.holderName || !cardForm.expiryDate || !cardForm.cvv) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      return
    }

    try {
      const newCard = await createCard(
        cardForm.number.replace(/\s/g, ""),
        cardForm.holderName,
        cardForm.expiryDate,
        cardForm.brandId,
        cardForm.cvv,
      )

      setSelectedPaymentId(newCard.id || null)
      setIsNewPayment(false)
      setUseTemporaryCard(false)

      toast({
        title: "Cartão adicionado",
        description: "O cartão foi adicionado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cartão.",
      })
    }
  }

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Por favor, informe um código de cupom.")
      toast({
        title: "Código vazio",
        description: "Por favor, informe um código de cupom.",
      })
      return
    }

    try {
      setCouponError(null)
      const validCoupon = await validateCoupon(couponCode)

      if (validCoupon) {
        toast({
          title: "Cupom aplicado",
          description: `Cupom ${validCoupon.code} aplicado com sucesso!`,
        })
        setCouponCode("")
        setHasCouponApplied(true)
      }
    } catch (error) {
      setCouponError("Código de cupom inválido ou expirado.")
      toast({
        title: "Cupom inválido",
        description: "O código de cupom informado não é válido ou está expirado.",
      })
    }
  }

  // Remove coupon
  const removeCoupon = () => {
    clearCoupon()
    setCouponCode("")
    setCouponError(null)
    setHasCouponApplied(false)
    toast({
      title: "Cupom removido",
      description: "O cupom foi removido do pedido.",
    })
  }

  // Handle order completion
  const handleCompleteOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, selecione um endereço de entrega.",
      })
      return
    }

    if (selectedPaymentMethod === PaymentMethod.CREDIT_CARD) {
      if (useTemporaryCard) {
        if (!cardForm.number || !cardForm.holderName || !cardForm.expiryDate || !cardForm.cvv) {
          toast({
            title: "Informações incompletas",
            description: "Por favor, preencha todos os dados do cartão.",
          })
          return
        }
      } else if (!selectedPaymentId) {
        toast({
          title: "Informações incompletas",
          description: "Por favor, selecione um cartão de crédito.",
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      let temporaryCard: OrderCardInput | undefined

      if (useTemporaryCard) {
        temporaryCard = {
          number: cardForm.number.replace(/\s/g, ""),
          holderName: cardForm.holderName,
          cvv: cardForm.cvv,
          expiryDate: cardForm.expiryDate,
          brandId: cardForm.brandId,
        }
      }

      await createOrder(
        selectedAddressId,
        selectedPaymentMethod,
        useTemporaryCard ? undefined : (selectedPaymentId ?? undefined),
        coupon?.code,
        temporaryCard,
      )

      // Clear cart after successful order
      await refreshCart()

      toast({
        title: "Pedido realizado com sucesso!",
        description: "Seu pedido foi processado e está sendo preparado.",
      })

      // Redirect to order confirmation page
      router.push("/")
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Erro ao finalizar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if cart is empty
  const isCartEmpty = !groupedItems || groupedItems.length === 0

  if (isCartEmpty && !isCartLoading) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
              <p className="text-gray-600 mb-6">Adicione produtos ao seu carrinho antes de finalizar a compra.</p>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                <a href="/">Continuar Comprando</a>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Finalizar Compra</h1>

            {/* Checkout Steps */}
            <div className="flex justify-between mb-8">
              <div className="flex-1 flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {currentStep === "shipping" ? "1" : <Check className="h-5 w-5" />}
                </div>
                <div className="ml-2">
                  <p className={`font-medium ${currentStep === "shipping" ? "text-amber-700" : "text-gray-800"}`}>
                    Entrega
                  </p>
                </div>
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  <div
                    className={`h-full ${currentStep === "payment" || currentStep === "confirmation" ? "bg-amber-500" : "bg-gray-200"
                      }`}
                  ></div>
                </div>
              </div>

              <div className="flex-1 flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep === "payment" || currentStep === "confirmation"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {currentStep === "payment" ? (
                    "2"
                  ) : currentStep === "confirmation" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    "2"
                  )}
                </div>
                <div className="ml-2">
                  <p className={`font-medium ${currentStep === "payment" ? "text-amber-700" : "text-gray-800"}`}>
                    Pagamento
                  </p>
                </div>
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  <div className={`h-full ${currentStep === "confirmation" ? "bg-amber-500" : "bg-gray-200"}`}></div>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep === "confirmation" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                >
                  3
                </div>
                <div className="ml-2">
                  <p className={`font-medium ${currentStep === "confirmation" ? "text-amber-700" : "text-gray-800"}`}>
                    Confirmação
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {/* Shipping Step */}
                  {currentStep === "shipping" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-amber-500" />
                        Endereço de Entrega
                      </h2>

                      {isAddressesLoading ? (
                        <div className="space-y-4 mb-6">
                          {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-lg" />
                          ))}
                        </div>
                      ) : !isNewAddress ? (
                        <div className="space-y-4 mb-6">
                          {addresses.length > 0 ? (
                            <RadioGroup
                              value={selectedAddressId?.toString() || ""}
                              onValueChange={(value) => setSelectedAddressId(Number.parseInt(value))}
                            >
                              {addresses.map((address) => (
                                <div
                                  key={address.id}
                                  className={`border rounded-lg p-4 ${selectedAddressId === address.id ? "border-amber-500 bg-amber-50" : ""
                                    }`}
                                >
                                  <div className="flex items-start">
                                    <RadioGroupItem
                                      value={address.id?.toString() || ""}
                                      id={`address-${address.id}`}
                                      className="mt-1"
                                    />
                                    <div className="ml-3">
                                      <Label
                                        htmlFor={`address-${address.id}`}
                                        className="font-medium flex items-center"
                                      >
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
                                      </Label>
                                      <p className="text-gray-600 mt-1">
                                        {address.street}, {address.number}
                                      </p>
                                      {address.complement && <p className="text-gray-600">{address.complement}</p>}
                                      <p className="text-gray-600">
                                        {address.district}, {address.city} - {address.state}
                                      </p>
                                      <p className="text-gray-600">CEP: {address.zipCode}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <div className="text-center py-6 border rounded-lg border-dashed">
                              <p className="text-gray-600 mb-4">Você não possui endereços cadastrados.</p>
                              <Button onClick={() => setIsNewAddress(true)}>Adicionar Endereço</Button>
                            </div>
                          )}

                          {addresses.length > 0 && (
                            <Button
                              variant="outline"
                              onClick={() => setIsNewAddress(true)}
                              className="flex items-center"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Novo Endereço
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="alias">Nome do Endereço</Label>
                              <Input
                                id="alias"
                                placeholder="Ex: Casa, Trabalho"
                                value={addressForm.alias}
                                onChange={(e) => handleAddressFormChange("alias", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="type">Tipo de Endereço</Label>
                              <select
                                id="type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={addressForm.type}
                                onChange={(e) => handleAddressFormChange("type", e.target.value)}
                              >
                                <option value={AddressType.SHIPPING}>Entrega</option>
                                <option value={AddressType.BILLING}>Cobrança</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="zipCode">CEP</Label>
                              <Input
                                id="zipCode"
                                placeholder="00000-000"
                                value={addressForm.zipCode}
                                onChange={(e) => handleAddressFormChange("zipCode", formatZipCode(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="residenceType">Tipo de Residência</Label>
                              <select
                                id="residenceType"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={addressForm.residenceType}
                                onChange={(e) => handleAddressFormChange("residenceType", e.target.value)}
                              >
                                <option value={ResidenceType.HOUSE}>Casa</option>
                                <option value={ResidenceType.APARTMENT}>Apartamento</option>
                                <option value={ResidenceType.COMMERCIAL}>Comercial</option>
                                <option value={ResidenceType.OTHER}>Outro</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="street">Logradouro</Label>
                              <Input
                                id="street"
                                placeholder="Rua, Avenida, etc."
                                value={addressForm.street}
                                onChange={(e) => handleAddressFormChange("street", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="number">Número</Label>
                              <Input
                                id="number"
                                placeholder="123"
                                value={addressForm.number}
                                onChange={(e) => handleAddressFormChange("number", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="complement">Complemento</Label>
                              <Input
                                id="complement"
                                placeholder="Apto, Bloco, etc."
                                value={addressForm.complement}
                                onChange={(e) => handleAddressFormChange("complement", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="district">Bairro</Label>
                              <Input
                                id="district"
                                value={addressForm.district}
                                onChange={(e) => handleAddressFormChange("district", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="city">Cidade</Label>
                              <Input
                                id="city"
                                value={addressForm.city}
                                onChange={(e) => handleAddressFormChange("city", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">Estado</Label>
                              <Input
                                id="state"
                                value={addressForm.state}
                                onChange={(e) => handleAddressFormChange("state", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">País</Label>
                              <Input id="country" value={addressForm.country} disabled className="bg-gray-100" />
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setIsNewAddress(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleSaveAddress} className="bg-amber-500 hover:bg-amber-600 text-white">
                              Salvar Endereço
                            </Button>
                          </div>
                        </div>
                      )}

                      <Separator className="my-6" />

                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <Truck className="mr-2 h-5 w-5 text-amber-500" />
                        Método de Entrega
                      </h2>

                      <RadioGroup
                        value={selectedShippingMethod}
                        onValueChange={setSelectedShippingMethod}
                        className="space-y-4 mb-6"
                      >
                        <div
                          className={`border rounded-lg p-4 ${selectedShippingMethod === "standard" ? "border-amber-500 bg-amber-50" : ""
                            }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem value="standard" id="shipping-standard" className="mt-1" />
                            <div className="ml-3 flex-grow">
                              <div className="flex justify-between">
                                <Label htmlFor="shipping-standard" className="font-medium">
                                  Entrega Padrão
                                </Label>
                                <span className="font-medium">R$15,90</span>
                              </div>
                              <p className="text-gray-600 mt-1">Receba em até 7 dias úteis</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border rounded-lg p-4 ${selectedShippingMethod === "express" ? "border-amber-500 bg-amber-50" : ""
                            }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem value="express" id="shipping-express" className="mt-1" />
                            <div className="ml-3 flex-grow">
                              <div className="flex justify-between">
                                <Label htmlFor="shipping-express" className="font-medium">
                                  Entrega Expressa
                                </Label>
                                <span className="font-medium">R$25,90</span>
                              </div>
                              <p className="text-gray-600 mt-1">Receba em até 3 dias úteis</p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>

                      <div className="flex justify-end">
                        <Button
                          onClick={goToNextStep}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          disabled={!selectedAddressId}
                        >
                          Continuar para Pagamento
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Payment Step */}
                  {currentStep === "payment" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <CreditCard className="mr-2 h-5 w-5 text-amber-500" />
                        Forma de Pagamento
                      </h2>

                      {/* Cupom de Desconto Section */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Tag className="mr-2 h-4 w-4 text-amber-500" />
                          Cupom de Desconto
                        </h3>

                        {coupon ? (
                          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center">
                              <Tag className="h-5 w-5 text-green-600 mr-2" />
                              <div>
                                <p className="font-medium text-green-700">{coupon.code}</p>
                                <p className="text-sm text-green-600">
                                  {coupon.type === "PERCENTAGE"
                                    ? `${coupon.discount}% de desconto`
                                    : `R$${coupon.discount.toFixed(2)} de desconto`}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-red-500"
                              onClick={removeCoupon}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Código do cupom"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={isCouponLoading}
                              />
                              <Button variant="outline" onClick={applyCoupon} disabled={isCouponLoading}>
                                {isCouponLoading ? "Aplicando..." : "Aplicar"}
                              </Button>
                            </div>
                            {couponError && <p className="text-sm text-red-600">{couponError}</p>}
                          </div>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-800 mb-3">Método de Pagamento</h3>
                      <RadioGroup
                        value={selectedPaymentMethod}
                        onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
                        className="space-y-4 mb-6"
                      >
                        {/* Credit Card Option */}
                        <div
                          className={`border rounded-lg p-4 ${selectedPaymentMethod === PaymentMethod.CREDIT_CARD ? "border-amber-500 bg-amber-50" : ""
                            }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem
                              value={PaymentMethod.CREDIT_CARD}
                              id="payment-credit-card"
                              className="mt-1"
                            />
                            <div className="ml-3 flex-grow">
                              <Label htmlFor="payment-credit-card" className="font-medium">
                                Cartão de Crédito
                              </Label>

                              {selectedPaymentMethod === PaymentMethod.CREDIT_CARD && (
                                <div className="mt-4">
                                  {/* Option to use temporary card */}
                                  <div className="mb-4">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="use-temporary-card"
                                        checked={useTemporaryCard}
                                        onCheckedChange={(checked) => {
                                          setUseTemporaryCard(checked as boolean)
                                          if (checked) {
                                            setSelectedPaymentId(null)
                                            setIsNewPayment(false)
                                          }
                                        }}
                                      />
                                      <Label htmlFor="use-temporary-card" className="text-sm">
                                        Usar cartão sem salvar na conta
                                      </Label>
                                    </div>
                                  </div>

                                  {useTemporaryCard ? (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                          <Label htmlFor="tempCardNumber">Número do Cartão</Label>
                                          <Input
                                            id="tempCardNumber"
                                            placeholder="0000 0000 0000 0000"
                                            value={cardForm.number}
                                            onChange={(e) =>
                                              handleCardFormChange("number", formatCardNumber(e.target.value))
                                            }
                                            maxLength={19}
                                          />
                                        </div>
                                        <div className="md:col-span-2">
                                          <Label htmlFor="tempCardName">Nome no Cartão</Label>
                                          <Input
                                            id="tempCardName"
                                            placeholder="Como aparece no cartão"
                                            value={cardForm.holderName}
                                            onChange={(e) => handleCardFormChange("holderName", e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="tempExpiry">Validade</Label>
                                          <Input
                                            id="tempExpiry"
                                            placeholder="MM/AA"
                                            value={cardForm.expiryDate}
                                            onChange={(e) =>
                                              handleCardFormChange("expiryDate", formatExpiryDate(e.target.value))
                                            }
                                            maxLength={5}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="tempCvv">CVV</Label>
                                          <Input
                                            id="tempCvv"
                                            placeholder="123"
                                            value={cardForm.cvv}
                                            onChange={(e) =>
                                              handleCardFormChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                                            }
                                            maxLength={4}
                                          />
                                        </div>
                                        <div className="md:col-span-2">
                                          <Label htmlFor="tempBrandId">Bandeira</Label>
                                          <select
                                            id="tempBrandId"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={cardForm.brandId}
                                            onChange={(e) => handleCardFormChange("brandId", e.target.value)}
                                          >
                                            {brands && brands.map((brand) => {
                                              return (
                                                <option key={brand.id + "-tempBrand"} value={brand.id}>{brand.name}</option>
                                              )
                                            })}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      {isCardsLoading ? (
                                        <div className="space-y-4">
                                          {[...Array(2)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-full rounded-lg" />
                                          ))}
                                        </div>
                                      ) : !isNewPayment ? (
                                        <div className="space-y-4">
                                          {cards.length > 0 ? (
                                            <RadioGroup
                                              value={selectedPaymentId?.toString() || ""}
                                              onValueChange={(value) => setSelectedPaymentId(Number.parseInt(value))}
                                            >
                                              {cards.map((card) => (
                                                <div
                                                  key={card.id}
                                                  className={`border rounded-lg p-4 ${selectedPaymentId === card.id ? "border-amber-500 bg-amber-50" : ""
                                                    }`}
                                                >
                                                  <div className="flex items-start">
                                                    <RadioGroupItem
                                                      value={card.id?.toString() || ""}
                                                      id={`payment-${card.id}`}
                                                      className="mt-1"
                                                    />
                                                    <div className="ml-3 flex-grow">
                                                      <div className="flex justify-between">
                                                        <Label
                                                          htmlFor={`payment-${card.id}`}
                                                          className="font-medium flex items-center"
                                                        >
                                                          {brands.find((brand) => brand.id == card.brandId)?.name}{" "}
                                                          terminado em {card.number.slice(-4)}
                                                        </Label>
                                                      </div>
                                                      <p className="text-gray-600 mt-1">{card.holderName}</p>
                                                      <p className="text-gray-600 text-sm">
                                                        Validade: {card.expiryDate}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </RadioGroup>
                                          ) : (
                                            <div className="text-center py-6 border rounded-lg border-dashed">
                                              <p className="text-gray-600 mb-4">Você não possui cartões cadastrados.</p>
                                              <Button onClick={() => setIsNewPayment(true)}>Adicionar Cartão</Button>
                                            </div>
                                          )}

                                          {cards.length > 0 && (
                                            <Button
                                              variant="outline"
                                              onClick={() => setIsNewPayment(true)}
                                              className="flex items-center"
                                            >
                                              <Plus className="h-4 w-4 mr-2" />
                                              Adicionar Novo Cartão
                                            </Button>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                              <Label htmlFor="cardNumber">Número do Cartão</Label>
                                              <Input
                                                id="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                value={cardForm.number}
                                                onChange={(e) =>
                                                  handleCardFormChange("number", formatCardNumber(e.target.value))
                                                }
                                                maxLength={19}
                                              />
                                            </div>
                                            <div className="md:col-span-2">
                                              <Label htmlFor="cardName">Nome no Cartão</Label>
                                              <Input
                                                id="cardName"
                                                placeholder="Como aparece no cartão"
                                                value={cardForm.holderName}
                                                onChange={(e) => handleCardFormChange("holderName", e.target.value)}
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor="expiry">Validade</Label>
                                              <Input
                                                id="expiry"
                                                placeholder="MM/AA"
                                                value={cardForm.expiryDate}
                                                onChange={(e) =>
                                                  handleCardFormChange("expiryDate", formatExpiryDate(e.target.value))
                                                }
                                                maxLength={5}
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor="cvv">CVV</Label>
                                              <Input
                                                id="cvv"
                                                placeholder="123"
                                                value={cardForm.cvv}
                                                onChange={(e) =>
                                                  handleCardFormChange(
                                                    "cvv",
                                                    e.target.value.replace(/\D/g, "").slice(0, 4),
                                                  )
                                                }
                                                maxLength={4}
                                              />
                                            </div>
                                            <div className="md:col-span-2">
                                              <Label htmlFor="brandId">Bandeira</Label>
                                              <select
                                                id="brandId"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={cardForm.brandId}
                                                onChange={(e) => handleCardFormChange("brandId", e.target.value)}
                                              >
                                                {brands && brands.map((brand) => {
                                                  return (
                                                    <option key={brand.id + "-cardForm"} value={brand.id}>{brand.name}</option>
                                                  )
                                                })}
                                              </select>
                                            </div>
                                          </div>

                                          <div className="flex gap-3">
                                            <Button variant="outline" onClick={() => setIsNewPayment(false)}>
                                              Cancelar
                                            </Button>
                                            <Button
                                              onClick={handleSaveCard}
                                              className="bg-amber-500 hover:bg-amber-600 text-white"
                                            >
                                              Salvar Cartão
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </RadioGroup>

                      <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={goToPreviousStep}>
                          Voltar para Entrega
                        </Button>
                        <Button
                          onClick={goToNextStep}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          disabled={
                            selectedPaymentMethod === PaymentMethod.CREDIT_CARD &&
                            !useTemporaryCard &&
                            !selectedPaymentId
                          }
                        >
                          Revisar Pedido
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Confirmation Step */}
                  {currentStep === "confirmation" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6">Revisar e Finalizar Pedido</h2>

                      <div className="space-y-6">
                        {/* Shipping Information */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-800">Endereço de Entrega</h3>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-amber-700"
                              onClick={() => setCurrentStep("shipping")}
                            >
                              Alterar
                            </Button>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {selectedAddress && (
                              <>
                                <p className="font-medium">
                                  {selectedAddress.street}, {selectedAddress.number}
                                </p>
                                {selectedAddress.complement && <p>{selectedAddress.complement}</p>}
                                <p>
                                  {selectedAddress.district}, {selectedAddress.city} - {selectedAddress.state}
                                </p>
                                <p>CEP: {selectedAddress.zipCode}</p>
                                <p className="mt-2">
                                  <span className="font-medium">Método de Entrega:</span>{" "}
                                  {selectedShippingMethod === "express"
                                    ? "Expressa (até 3 dias úteis)"
                                    : "Padrão (até 7 dias úteis)"}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-800">Forma de Pagamento</h3>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-amber-700"
                              onClick={() => setCurrentStep("payment")}
                            >
                              Alterar
                            </Button>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {selectedPaymentMethod === PaymentMethod.CREDIT_CARD && (
                              <>
                                {useTemporaryCard ? (
                                  <p>
                                    Cartão de Crédito{" "}
                                    {brands.find((brand) => brand.id == cardForm.brandId)?.name}{" "}
                                    terminado em {cardForm.number.replace(/\s/g, "").slice(-4)}
                                  </p>
                                ) : (
                                  selectedPaymentCard && (
                                    <p>
                                      Cartão de Crédito{" "}
                                      {brands.find((brand) => brand.id == selectedPaymentCard.brandId)?.name}{" "}
                                      terminado em {selectedPaymentCard.number.slice(-4)}
                                    </p>
                                  )
                                )}
                              </>
                            )}

                            {coupon && (
                              <div className="flex items-center mt-2">
                                <Tag className="h-5 w-5 text-green-600 mr-2" />
                                <p>
                                  Cupom de Desconto: <span className="font-medium">{coupon.code}</span> (
                                  {coupon.type === "PERCENTAGE"
                                    ? `${coupon.discount}% de desconto`
                                    : `R$${coupon.discount.toFixed(2)} de desconto`}
                                  )
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h3 className="font-medium text-gray-800 mb-2">Itens do Pedido</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {isCartLoading ? (
                              <div className="space-y-4">
                                {[...Array(2)].map((_, i) => (
                                  <div key={i} className="flex gap-4">
                                    <Skeleton className="h-16 w-12 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                      <Skeleton className="h-4 w-3/4" />
                                      <Skeleton className="h-3 w-1/2" />
                                      <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-16" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : groupedItems && groupedItems.length > 0 ? (
                              <div className="space-y-4">
                                {groupedItems.map((item) => (
                                  <div key={item.bookId} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                      <div className="relative h-16 w-12 bg-gray-100 rounded-md overflow-hidden">
                                        <Image
                                          src={
                                            item.coverImage ||
                                            `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(item.title) || "/placeholder.svg"}`
                                          }
                                          alt={item.title}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-grow">
                                      <p className="font-medium">{item.title}</p>
                                      <p className="text-sm text-gray-600">{item.author}</p>
                                      <div className="flex justify-between mt-1">
                                        <p className="text-sm">Qtd: {item.quantity}</p>
                                        <p className="font-medium">R${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600">Seu carrinho está vazio.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={goToPreviousStep}>
                          Voltar para Pagamento
                        </Button>
                        <Button
                          onClick={handleCompleteOrder}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processando..." : "Concluir Pedido"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>

                  {isCartLoading ? (
                    <div className="space-y-4 mb-6">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>R${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frete</span>
                          <span>R${shippingCost.toFixed(2)}</span>
                        </div>

                        {coupon && (
                          <div className="flex justify-between items-center text-green-600">
                            <div className="flex items-center">
                              <span>Cupom: {coupon.code}</span>
                              <button className="ml-2 text-gray-400 hover:text-red-500" onClick={removeCoupon}>
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <span>-R${couponDiscount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />

                      <div className="flex justify-between font-bold text-lg mb-6">
                        <span>Total</span>
                        <span>R${total.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {currentStep === "shipping" && (
                    <Button
                      onClick={goToNextStep}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={!selectedAddressId || isCartLoading}
                    >
                      Continuar para Pagamento
                    </Button>
                  )}

                  {currentStep === "payment" && (
                    <Button
                      onClick={goToNextStep}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={
                        (selectedPaymentMethod === PaymentMethod.CREDIT_CARD &&
                          !useTemporaryCard &&
                          !selectedPaymentId) ||
                        isCartLoading
                      }
                    >
                      Revisar Pedido
                    </Button>
                  )}

                  {currentStep === "confirmation" && (
                    <Button
                      onClick={handleCompleteOrder}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={isSubmitting || isCartLoading}
                    >
                      {isSubmitting ? "Processando..." : "Concluir Pedido"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
