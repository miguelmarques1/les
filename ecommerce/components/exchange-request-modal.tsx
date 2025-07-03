"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useReturnExchange } from "@/lib/hooks/use-return-exchange"
import Image from "next/image"
import { StockBookModel } from "@/lib/models/stock-book-model"

interface ExchangeRequestModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: number
  orderItems: StockBookModel[]
}

export default function ExchangeRequestModal({ isOpen, onClose, orderId, orderItems }: ExchangeRequestModalProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [description, setDescription] = useState("")
  const [requestType, setRequestType] = useState<"exchange" | "return">("exchange")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createRequest } = useReturnExchange()

  const handleItemToggle = (itemId: number) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert("Por favor, selecione pelo menos um item para solicitar troca/devolução.")
      return
    }

    if (!description.trim()) {
      alert("Por favor, descreva o motivo da solicitação.")
      return
    }

    setIsSubmitting(true)
    try {
      await createRequest(description, selectedItems, requestType)
      onClose()
    } catch (error) {
      console.error("Error submitting exchange/return request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Solicitar {requestType === "exchange" ? "Troca" : "Devolução"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant={requestType === "exchange" ? "default" : "outline"}
              onClick={() => setRequestType("exchange")}
            >
              Troca
            </Button>
            <Button variant={requestType === "return" ? "default" : "outline"} onClick={() => setRequestType("return")}>
              Devolução
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Selecione os itens:</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
              {orderItems.map((item) => (
                <div key={item.orderItemId} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                  <Checkbox
                    id={`item-${item.orderItemId}`}
                    checked={selectedItems.includes(item.orderItemId ?? 0)}
                    onCheckedChange={() => handleItemToggle(item.orderItemId ?? 0)}
                  />
                  <div className="relative h-12 w-8 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=200&text=${encodeURIComponent(item.bookDetails.title)}`}
                      alt={item.bookDetails.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <label
                    htmlFor={`item-${item.orderItemId}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                  >
                    <div>{item.bookDetails.title}</div>
                    <div className="text-xs text-gray-500">{item.bookDetails.author}</div>
                    <div className="text-xs">R$ {item.unitPrice.toFixed(2)}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Motivo da {requestType === "exchange" ? "troca" : "devolução"}:
            </label>
            <Textarea
              id="description"
              placeholder={`Descreva o motivo da ${requestType === "exchange" ? "troca" : "devolução"}...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="text-xs text-gray-500">
            <p>
              {requestType === "exchange"
                ? "Ao solicitar uma troca, você concorda com os termos e condições de troca da nossa loja."
                : "Ao solicitar uma devolução, você concorda com os termos e condições de devolução da nossa loja."}
            </p>
            <p className="mt-1">
              {requestType === "exchange"
                ? "O prazo para análise da solicitação de troca é de até 3 dias úteis."
                : "O prazo para análise da solicitação de devolução é de até 7 dias úteis."}
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || selectedItems.length === 0 || !description.trim()}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
