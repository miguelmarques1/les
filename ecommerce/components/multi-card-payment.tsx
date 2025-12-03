"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, CreditCard, AlertCircle } from "lucide-react"
import type { CardModel } from "@/lib/models/card-model"
import type { OrderCardInput, OrderCardPayment } from "@/lib/models/order-model"
import { MIN_CARD_AMOUNT } from "@/lib/hooks/use-multiple-coupons"

interface MultiCardPaymentProps {
  cards: CardModel[]
  totalAmount: number
  brands: { id: number; name: string }[]
  onPaymentsChange: (payments: OrderCardPayment[]) => void
}

interface CardFormState {
  number: string
  holderName: string
  expiryDate: string
  brandId: number
  cvv: string
}

export default function MultiCardPayment({ cards, totalAmount, brands, onPaymentsChange }: MultiCardPaymentProps) {
  const [payments, setPayments] = useState<OrderCardPayment[]>([])
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [newCardForm, setNewCardForm] = useState<CardFormState>({
    number: "",
    holderName: "",
    expiryDate: "",
    brandId: 1,
    cvv: "",
  })

  const calculateMinimumForNextCard = (): number => {
    const currentTotal = payments.reduce((sum, p) => sum + p.amount, 0)
    const remaining = totalAmount - currentTotal

    // Se o restante é menor que R$10, esse é o valor mínimo para o próximo cartão
    if (remaining < MIN_CARD_AMOUNT && remaining > 0) {
      return remaining
    }
    return MIN_CARD_AMOUNT
  }

  const isCardAmountValid = (amount: number, cardIndex: number): { valid: boolean; message?: string } => {
    if (amount <= 0) {
      return { valid: false, message: "O valor deve ser maior que zero" }
    }

    // Se só tem um cartão, não precisa validar valor mínimo
    if (payments.length === 1) {
      return { valid: true }
    }

    const isLastCard = cardIndex === payments.length - 1
    const paidBefore = payments.slice(0, cardIndex).reduce((sum, p) => sum + p.amount, 0)
    const remainingAfterPrevious = totalAmount - paidBefore

    // Se é o último cartão e o restante é menor que R$10, é válido
    if (isLastCard && remainingAfterPrevious < MIN_CARD_AMOUNT) {
      return { valid: true }
    }

    // Se o valor é menor que R$10 e não é uma exceção válida
    if (amount < MIN_CARD_AMOUNT) {
      return {
        valid: false,
        message: `Valor mínimo: R$ ${MIN_CARD_AMOUNT.toFixed(2)}`,
      }
    }

    return { valid: true }
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim()
  }

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/, "$1/")
      .slice(0, 5)
  }

  const handleCardFormChange = (field: keyof CardFormState, value: string) => {
    setNewCardForm((prev) => ({ ...prev, [field]: value }))
  }

  const addPayment = (cardId?: number) => {
    const remainingAmount = totalAmount - payments.reduce((sum, p) => sum + p.amount, 0)

    if (remainingAmount <= 0) {
      return
    }

    const newPayment: OrderCardPayment = {
      cardId,
      amount: Math.min(remainingAmount, totalAmount),
    }

    const updatedPayments = [...payments, newPayment]
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)
  }

  const addTemporaryCardPayment = () => {
    if (!newCardForm.number || !newCardForm.holderName || !newCardForm.expiryDate || !newCardForm.cvv) {
      return
    }

    const remainingAmount = totalAmount - payments.reduce((sum, p) => sum + p.amount, 0)

    if (remainingAmount <= 0) {
      return
    }

    const temporaryCard: OrderCardInput = {
      number: newCardForm.number.replace(/\s/g, ""),
      holderName: newCardForm.holderName,
      cvv: newCardForm.cvv,
      expiryDate: newCardForm.expiryDate,
      brandId: newCardForm.brandId,
    }

    const newPayment: OrderCardPayment = {
      card: temporaryCard,
      amount: Math.min(remainingAmount, totalAmount),
    }

    const updatedPayments = [...payments, newPayment]
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)

    // Reset form
    setNewCardForm({
      number: "",
      holderName: "",
      expiryDate: "",
      brandId: 1,
      cvv: "",
    })
    setShowNewCardForm(false)
  }

  const removePayment = (index: number) => {
    const updatedPayments = payments.filter((_, i) => i !== index)
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)
  }

  const updatePaymentAmount = (index: number, amount: number) => {
    const updatedPayments = [...payments]
    updatedPayments[index] = { ...updatedPayments[index], amount: Math.max(0, amount) }
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)
  }

  const remainingAmount = totalAmount - payments.reduce((sum, p) => sum + p.amount, 0)
  const isFullyPaid = Math.abs(remainingAmount) < 0.01

  const hasValidationErrors = payments.some((payment, index) => {
    const validation = isCardAmountValid(payment.amount, index)
    return !validation.valid
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dividir pagamento entre cartões</h3>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold">R$ {totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {payments.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-blue-700">
            O valor mínimo por cartão é <strong>R$ {MIN_CARD_AMOUNT.toFixed(2)}</strong>, exceto quando o valor restante
            for menor que esse mínimo.
          </p>
        </div>
      )}

      {payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((payment, index) => {
            const card = payment.cardId ? cards.find((c) => c.id === payment.cardId) : null
            const brand = card
              ? brands.find((b) => b.id === card.brandId)
              : payment.card
                ? brands.find((b) => b.id === payment.card?.brandId)
                : null

            const validation = isCardAmountValid(payment.amount, index)

            return (
              <Card key={index} className={`p-4 ${!validation.valid ? "border-red-300 bg-red-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-amber-500 mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {card
                            ? `${brand?.name} terminado em ${card.number.slice(-4)}`
                            : payment.card
                              ? `${brand?.name} terminado em ${payment.card.number.slice(-4)}`
                              : "Cartão temporário"}
                        </p>
                        {card && <p className="text-sm text-gray-600">{card.holderName}</p>}
                        {payment.card && <p className="text-sm text-gray-600">{payment.card.holderName}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removePayment(index)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`amount-${index}`} className="text-sm">
                        Valor:
                      </Label>
                      <Input
                        id={`amount-${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        max={totalAmount}
                        value={payment.amount}
                        onChange={(e) => updatePaymentAmount(index, Number.parseFloat(e.target.value) || 0)}
                        className={`w-32 ${!validation.valid ? "border-red-500" : ""}`}
                      />
                    </div>
                    {!validation.valid && validation.message && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validation.message}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {!isFullyPaid && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Falta pagar:</span>
            <span className="font-bold text-amber-600">R$ {remainingAmount.toFixed(2)}</span>
          </div>

          {remainingAmount > 0 && remainingAmount < MIN_CARD_AMOUNT && (
            <p className="text-xs text-gray-500">
              Como o valor restante é menor que R$ {MIN_CARD_AMOUNT.toFixed(2)}, o próximo cartão pode ter esse valor.
            </p>
          )}

          {!showNewCardForm && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Adicionar cartão ao pagamento:</p>
              <div className="grid grid-cols-1 gap-2">
                {cards.map((card) => {
                  const isAlreadyUsed = payments.some((p) => p.cardId === card.id)
                  return (
                    <Button
                      key={card.id}
                      variant="outline"
                      onClick={() => addPayment(card.id)}
                      disabled={isAlreadyUsed}
                      className="justify-start text-left h-auto py-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {brands.find((b) => b.id === card.brandId)?.name} terminado em {card.number.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-600">{card.holderName}</p>
                      </div>
                    </Button>
                  )
                })}
              </div>
              <Button variant="outline" onClick={() => setShowNewCardForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Usar novo cartão
              </Button>
            </div>
          )}

          {showNewCardForm && (
            <Card className="p-4 space-y-3">
              <h4 className="font-medium">Novo Cartão</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="newCardNumber">Número do Cartão</Label>
                  <Input
                    id="newCardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={newCardForm.number}
                    onChange={(e) => handleCardFormChange("number", formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="newCardName">Nome no Cartão</Label>
                  <Input
                    id="newCardName"
                    placeholder="Nome como está no cartão"
                    value={newCardForm.holderName}
                    onChange={(e) => handleCardFormChange("holderName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="newCardExpiry">Validade</Label>
                    <Input
                      id="newCardExpiry"
                      placeholder="MM/AA"
                      value={newCardForm.expiryDate}
                      onChange={(e) => handleCardFormChange("expiryDate", formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newCardCvv">CVV</Label>
                    <Input
                      id="newCardCvv"
                      placeholder="000"
                      value={newCardForm.cvv}
                      onChange={(e) => handleCardFormChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="newCardBrand">Bandeira</Label>
                  <Select
                    value={newCardForm.brandId.toString()}
                    onValueChange={(value) => handleCardFormChange("brandId", value)}
                  >
                    <SelectTrigger id="newCardBrand">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowNewCardForm(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={addTemporaryCardPayment} className="flex-1">
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
