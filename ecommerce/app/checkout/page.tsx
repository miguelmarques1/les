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
import { useMultipleCoupons, validateMultipleCardPayments } from "@/lib/hooks/use-multiple-coupons"
import { PaymentMethod } from "@/lib/enums/payment-method"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressType } from "@/lib/enums/address-type"
import { ResidenceType } from "@/lib/enums/residence-type"
import type { OrderCardPayment } from "@/lib/models/order-model"
import MultiCardPayment from "@/components/multi-card-payment"
import Link from "next/link"
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
  const { brands, isLoading: isBrandsLoading } = useBrands()
  const { createOrder, isLoading: isOrderLoading } = useOrders()
  const {
    coupons,
    validateAndAddCoupon,
    removeCoupon: removeMultipleCoupon,
    calculateTotalDiscount,
    canAddMoreCoupons,
    clearCoupons,
    getCouponCodes,
    isLoading: isCouponLoading,
    error: couponError,
  } = useMultipleCoupons()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("standard")
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD)
  const [isNewAddress, setIsNewAddress] = useState(false)
  const [isNewPayment, setIsNewPayment] = useState(false)
  const [useTemporaryCard, setUseTemporaryCard] = useState(false)
  const [useMultipleCards, setUseMultipleCards] = useState(false)
  const [multipleCardPayments, setMultipleCardPayments] = useState<OrderCardPayment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [localCouponError, setLocalCouponError] = useState<string | null>(null)
  const [tempCard, setTempCard] = useState<CardFormState | null>(null)

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
    if (cards.length > 0 && !selectedPaymentId && !useTemporaryCard && !useMultipleCards) {
      setSelectedPaymentId(cards[0].id || null)
    }
  }, [addresses, cards, selectedAddressId, selectedPaymentId, useTemporaryCard, useMultipleCards])

  // Calculate subtotal
  const subtotal = cart?.total || 0

  // Shipping cost based on method
  const shippingCost = selectedShippingMethod === "express" ? 25.9 : 15.9

  const couponDiscount = calculateTotalDiscount(subtotal)

  // Total
  const total = Math.max(0, subtotal + shippingCost - couponDiscount)

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
    if (useTemporaryCard) {
      setTempCard((prev) => ({ ...prev!, [field]: value }))
    }
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
      setTempCard(null)
      setCardForm({
        number: "",
        holderName: "",
        expiryDate: "",
        brandId: 1,
        cvv: "",
      })

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

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setLocalCouponError("Por favor, informe um código de cupom.")
      toast({
        title: "Código vazio",
        description: "Por favor, informe um código de cupom.",
      })
      return
    }

    setLocalCouponError(null)
    const validCoupon = await validateAndAddCoupon(couponCode, subtotal)

    if (validCoupon) {
      toast({
        title: "Cupom aplicado",
        description: `Cupom ${validCoupon.code} aplicado com sucesso!`,
      })
      setCouponCode("")
    } else if (couponError) {
      setLocalCouponError(couponError)
      toast({
        title: "Erro ao aplicar cupom",
        description: couponError,
      })
    }
  }

  const handleRemoveCoupon = (code: string) => {
    removeMultipleCoupon(code)
    toast({
      title: "Cupom removido",
      description: `O cupom ${code} foi removido do pedido.`,
    })
  }

  const handleClearAllCoupons = () => {
    clearCoupons()
    setCouponCode("")
    setLocalCouponError(null)
    toast({
      title: "Cupons removidos",
      description: "Todos os cupons foram removidos do pedido.",
    })
  }

  const validateStep = (step: CheckoutStep): boolean => {
    if (step === "shipping") {
      if (!selectedAddressId) {
        toast({ title: "Endereço necessário", description: "Por favor, selecione um endereço de entrega." })
        return false
      }
    }

    if (step === "payment" && selectedPaymentMethod === PaymentMethod.CREDIT_CARD) {
      if (useMultipleCards) {
        const validation = validateMultipleCardPayments(multipleCardPayments, total)
        if (!validation.isValid) {
          toast({
            title: "Erro no pagamento",
            description: validation.error,
          })
          return false
        }
      } else if (useTemporaryCard) {
        if (!tempCard || !tempCard.number || !tempCard.holderName || !tempCard.expiryDate || !tempCard.cvv) {
          toast({ title: "Dados do cartão necessários", description: "Por favor, preencha todos os dados do cartão." })
          return false
        }
      } else if (!selectedPaymentId) {
        toast({ title: "Forma de pagamento necessária", description: "Por favor, selecione um cartão de crédito." })
        return false
      }
    }

    return true
  }

  // Go to next step
  const goToNextStep = () => {
    if (!validateStep(currentStep)) return

    if (currentStep === "shipping") setCurrentStep("payment")
    else if (currentStep === "payment") setCurrentStep("confirmation")
  }

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep === "payment") setCurrentStep("shipping")
    else if (currentStep === "confirmation") setCurrentStep("payment")
  }

  const buildCardPayments = (): OrderCardPayment[] => {
    if (useMultipleCards && multipleCardPayments.length > 0) {
      return multipleCardPayments
    }

    if (useTemporaryCard && tempCard) {
      return [
        {
          card: {
            number: tempCard.number.replace(/\s/g, ""),
            holderName: tempCard.holderName,
            cvv: tempCard.cvv,
            expiryDate: tempCard.expiryDate,
            brandId: tempCard.brandId,
          },
          amount: total,
        },
      ]
    }

    if (selectedPaymentId) {
      return [
        {
          cardId: selectedPaymentId,
          amount: total,
        },
      ]
    }

    return []
  }

  // Handle order completion
  const handleCompleteOrder = async () => {
    if (!validateStep("shipping") || !validateStep("payment")) return

    setIsSubmitting(true)

    try {
      const cardPayments = buildCardPayments()

      if (cardPayments.length === 0) {
        toast({
          title: "Pagamento inválido",
          description: "Por favor, selecione ou adicione um cartão para pagamento.",
        })
        setIsSubmitting(false)
        return
      }

      const couponCodes = getCouponCodes()
      const primaryCouponCode = couponCodes.length > 0 ? couponCodes.join(",") : undefined

      await createOrder(
        selectedAddressId!,
        selectedPaymentMethod,
        undefined,
        primaryCouponCode,
        undefined,
        cardPayments,
      )
      await refreshCart()

      toast({
        title: "Pedido realizado com sucesso!",
        description: "Seu pedido foi processado e está sendo preparado.",
      })

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
                <Link href="/">Continuar Comprando</Link>
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
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation"
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
                    className={`h-full ${
                      currentStep === "payment" || currentStep === "confirmation" ? "bg-amber-500" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              </div>

              <div className="flex-1 flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    currentStep === "payment" || currentStep === "confirmation"
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
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    currentStep === "confirmation" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-600"
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
                                  className={`border rounded-lg p-4 ${
                                    selectedAddressId === address.id ? "border-amber-500 bg-amber-50" : ""
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
                                        {address.type === AddressType.SHIPPING && (
                                          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                            Entrega
                                          </span>
                                        )}
                                        {address.type === AddressType.BILLING && (
                                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                            Cobrança
                                          </span>
                                        )}
                                        {address.type === AddressType.BOTH && (
                                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                            Entrega e Cobrança
                                          </span>
                                        )}
                                      </Label>
                                      <p className="text-gray-600 mt-1">
                                        {address.street}, {address.number}
                                        {address.complement ? `, ${address.complement}` : ""}
                                      </p>
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
                            <div className="text-center py-8 border rounded-lg">
                              <p className="text-gray-500 mb-4">Você não possui endereços cadastrados.</p>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setIsNewAddress(true)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Novo Endereço
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label htmlFor="alias">Apelido do Endereço</Label>
                              <Input
                                id="alias"
                                placeholder="Ex: Casa, Trabalho"
                                value={addressForm.alias}
                                onChange={(e) => handleAddressFormChange("alias", e.target.value)}
                              />
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
                              <Label htmlFor="street">Rua</Label>
                              <Input
                                id="street"
                                value={addressForm.street}
                                onChange={(e) => handleAddressFormChange("street", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="number">Número</Label>
                              <Input
                                id="number"
                                value={addressForm.number}
                                onChange={(e) => handleAddressFormChange("number", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="complement">Complemento</Label>
                              <Input
                                id="complement"
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
                          className={`border rounded-lg p-4 ${
                            selectedShippingMethod === "standard" ? "border-amber-500 bg-amber-50" : ""
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
                          className={`border rounded-lg p-4 ${
                            selectedShippingMethod === "express" ? "border-amber-500 bg-amber-50" : ""
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
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-6">
                        <CreditCard className="mr-2 h-5 w-5 text-amber-500" />
                        <h2 className="text-xl font-semibold">Forma de Pagamento</h2>
                      </div>

                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Tag className="mr-2 h-4 w-4 text-amber-500" />
                          Cupons de Desconto
                        </h3>

                        {/* Lista de cupons aplicados */}
                        {coupons.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {coupons.map((coupon) => (
                              <div
                                key={coupon.code}
                                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
                              >
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
                                  onClick={() => handleRemoveCoupon(coupon.code)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}

                            {/* Aviso quando desconto atingiu o limite */}
                            {!canAddMoreCoupons(subtotal) && (
                              <p className="text-sm text-amber-600 mt-2">
                                O desconto máximo foi atingido (igual ao valor dos produtos).
                              </p>
                            )}

                            {/* Botão para remover todos os cupons */}
                            {coupons.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-500 mt-2"
                                onClick={handleClearAllCoupons}
                              >
                                Remover todos os cupons
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Campo para adicionar novo cupom */}
                        {canAddMoreCoupons(subtotal) && (
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
                            {(localCouponError || couponError) && (
                              <p className="text-sm text-red-600">{localCouponError || couponError}</p>
                            )}
                            {coupons.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Você pode adicionar mais cupons. O desconto total não pode ultrapassar o valor dos
                                produtos.
                              </p>
                            )}
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
                          className={`border rounded-lg p-4 ${
                            selectedPaymentMethod === PaymentMethod.CREDIT_CARD ? "border-amber-500 bg-amber-50" : ""
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
                                <div className="mt-4 space-y-4">
                                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <Checkbox
                                      id="use-multiple-cards"
                                      checked={useMultipleCards}
                                      onCheckedChange={(checked) => {
                                        setUseMultipleCards(checked as boolean)
                                        if (checked) {
                                          setUseTemporaryCard(false)
                                          setSelectedPaymentId(null)
                                          setIsNewPayment(false)
                                          setTempCard(null)
                                        } else {
                                          setMultipleCardPayments([])
                                        }
                                      }}
                                    />
                                    <Label htmlFor="use-multiple-cards" className="text-sm cursor-pointer">
                                      Dividir pagamento entre múltiplos cartões
                                    </Label>
                                  </div>

                                  {useMultipleCards ? (
                                    <MultiCardPayment
                                      cards={cards}
                                      totalAmount={total}
                                      brands={brands}
                                      onPaymentsChange={setMultipleCardPayments}
                                    />
                                  ) : (
                                    <>
                                      {isCardsLoading ? (
                                        <div className="space-y-3">
                                          {[...Array(2)].map((_, i) => (
                                            <Skeleton key={i} className="h-16 w-full rounded-lg" />
                                          ))}
                                        </div>
                                      ) : (
                                        <>
                                          {cards.length > 0 && !useTemporaryCard && (
                                            <RadioGroup
                                              value={selectedPaymentId?.toString() || ""}
                                              onValueChange={(value) => setSelectedPaymentId(Number.parseInt(value))}
                                            >
                                              {cards.map((card) => (
                                                <div
                                                  key={card.id}
                                                  className={`border rounded-lg p-3 ${
                                                    selectedPaymentId === card.id ? "border-amber-500 bg-amber-50" : ""
                                                  }`}
                                                >
                                                  <div className="flex items-center">
                                                    <RadioGroupItem
                                                      value={card.id?.toString() || ""}
                                                      id={`card-${card.id}`}
                                                    />
                                                    <div className="ml-3">
                                                      <Label htmlFor={`card-${card.id}`} className="font-medium">
                                                        {brands.find((brand) => brand.id == card.brandId)?.name}{" "}
                                                        terminado em {card.number.slice(-4)}
                                                      </Label>
                                                      <p className="text-sm text-gray-600">{card.holderName}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </RadioGroup>
                                          )}

                                          {!isNewPayment && !useTemporaryCard && (
                                            <div className="space-y-2 mt-4">
                                              <Button
                                                variant="outline"
                                                className="w-full bg-transparent"
                                                onClick={() => {
                                                  setIsNewPayment(true)
                                                  setSelectedPaymentId(null)
                                                }}
                                              >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Adicionar Novo Cartão (Salvar)
                                              </Button>
                                              <Button
                                                variant="outline"
                                                className="w-full bg-transparent"
                                                onClick={() => {
                                                  setUseTemporaryCard(true)
                                                  setSelectedPaymentId(null)
                                                  setTempCard({
                                                    number: "",
                                                    holderName: "",
                                                    expiryDate: "",
                                                    brandId: 1,
                                                    cvv: "",
                                                  })
                                                }}
                                              >
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Usar Cartão Temporário (Não Salvar)
                                              </Button>
                                            </div>
                                          )}

                                          {(isNewPayment || useTemporaryCard) && (
                                            <div className="space-y-4 border rounded-lg p-4">
                                              <h4 className="font-medium">
                                                {useTemporaryCard ? "Dados do Cartão (Não será salvo)" : "Novo Cartão"}
                                              </h4>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
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
                                                <div className="col-span-2">
                                                  <Label htmlFor="cardName">Nome no Cartão</Label>
                                                  <Input
                                                    id="cardName"
                                                    placeholder="Nome como está no cartão"
                                                    value={cardForm.holderName}
                                                    onChange={(e) => handleCardFormChange("holderName", e.target.value)}
                                                  />
                                                </div>
                                                <div>
                                                  <Label htmlFor="cardExpiry">Validade</Label>
                                                  <Input
                                                    id="cardExpiry"
                                                    placeholder="MM/AA"
                                                    value={cardForm.expiryDate}
                                                    onChange={(e) =>
                                                      handleCardFormChange(
                                                        "expiryDate",
                                                        formatExpiryDate(e.target.value),
                                                      )
                                                    }
                                                    maxLength={5}
                                                  />
                                                </div>
                                                <div>
                                                  <Label htmlFor="cardCvv">CVV</Label>
                                                  <Input
                                                    id="cardCvv"
                                                    placeholder="000"
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
                                              </div>
                                              <div className="flex gap-3">
                                                <Button
                                                  variant="outline"
                                                  onClick={() => {
                                                    setIsNewPayment(false)
                                                    setUseTemporaryCard(false)
                                                    setTempCard(null)
                                                    setCardForm({
                                                      number: "",
                                                      holderName: "",
                                                      expiryDate: "",
                                                      brandId: 1,
                                                      cvv: "",
                                                    })
                                                    if (cards.length > 0) {
                                                      setSelectedPaymentId(cards[0].id || null)
                                                    }
                                                  }}
                                                >
                                                  Cancelar
                                                </Button>
                                                {!useTemporaryCard && (
                                                  <Button
                                                    onClick={handleSaveCard}
                                                    className="bg-amber-500 hover:bg-amber-600 text-white"
                                                  >
                                                    Salvar Cartão
                                                  </Button>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </>
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
                            (selectedPaymentMethod === PaymentMethod.CREDIT_CARD &&
                              !useMultipleCards &&
                              !useTemporaryCard &&
                              !selectedPaymentId) ||
                            (selectedPaymentMethod === PaymentMethod.CREDIT_CARD &&
                              useMultipleCards &&
                              multipleCardPayments.length === 0) ||
                            (selectedPaymentMethod === PaymentMethod.CREDIT_CARD && useTemporaryCard && !tempCard)
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
                                {useMultipleCards ? (
                                  <p className="font-medium">Pagamento em múltiplos cartões</p>
                                ) : useTemporaryCard ? (
                                  <p>
                                    Cartão de Crédito {brands.find((brand) => brand.id == tempCard?.brandId)?.name}{" "}
                                    terminado em {tempCard?.number.replace(/\s/g, "").slice(-4)}
                                  </p>
                                ) : (
                                  selectedPaymentCard && (
                                    <p>
                                      Cartão de Crédito{" "}
                                      {brands.find((brand) => brand.id == selectedPaymentCard.brandId)?.name} terminado
                                      em {selectedPaymentCard.number.slice(-4)}
                                    </p>
                                  )
                                )}
                              </>
                            )}

                            {coupons.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {coupons.map((coupon) => (
                                  <div key={coupon.code} className="flex items-center">
                                    <Tag className="h-5 w-5 text-green-600 mr-2" />
                                    <p>
                                      Cupom de Desconto: <span className="font-medium">{coupon.code}</span> (
                                      {coupon.type === "PERCENTAGE"
                                        ? `${coupon.discount}% de desconto`
                                        : `R$${coupon.discount.toFixed(2)} de desconto`}
                                      )
                                    </p>
                                  </div>
                                ))}
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
                          disabled={isSubmitting || isCartLoading}
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

                        {coupons.length > 0 && (
                          <div className="space-y-2">
                            {coupons.map((coupon) => (
                              <div key={coupon.code} className="flex justify-between items-center text-green-600">
                                <div className="flex items-center">
                                  <span className="text-sm">Cupom: {coupon.code}</span>
                                  <button
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                    onClick={() => handleRemoveCoupon(coupon.code)}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <span className="text-sm">
                                  -
                                  {coupon.type === "PERCENTAGE"
                                    ? `${coupon.discount}%`
                                    : `R$${coupon.discount.toFixed(2)}`}
                                </span>
                              </div>
                            ))}
                            {/* Total do desconto */}
                            <div className="flex justify-between text-green-700 font-medium pt-1 border-t border-green-200">
                              <span>Desconto total</span>
                              <span>-R${couponDiscount.toFixed(2)}</span>
                            </div>
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
                          !useMultipleCards &&
                          !useTemporaryCard &&
                          !selectedPaymentId) ||
                        (selectedPaymentMethod === PaymentMethod.CREDIT_CARD &&
                          useMultipleCards &&
                          multipleCardPayments.length === 0) ||
                        (selectedPaymentMethod === PaymentMethod.CREDIT_CARD && useTemporaryCard && !tempCard) ||
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
