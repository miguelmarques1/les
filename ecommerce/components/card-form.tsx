"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCards } from "@/lib/hooks/use-cards"
import { useBrands } from "@/lib/hooks/use-brands"
import { useToast } from "@/hooks/use-toast"

interface CardFormProps {
  onCancel: () => void
  onSuccess: () => void
}

export default function CardForm({ onCancel, onSuccess }: CardFormProps) {
  const { createCard } = useCards()
  const { brands, isLoading: isBrandsLoading } = useBrands()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    number: "",
    holderName: "",
    expiryDate: "",
    brandId: "",
    cvv: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Format card number
    if (name === "number") {
      const formattedNumber = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim()

      setFormData({ ...formData, [name]: formattedNumber })
      return
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedDate = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(?=\d)/, "$1/")
        .slice(0, 5)

      setFormData({ ...formData, [name]: formattedDate })
      return
    }

    // Format CVV
    if (name === "cvv") {
      const formattedCvv = value.replace(/\D/g, "").slice(0, 4)

      setFormData({ ...formData, [name]: formattedCvv })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.number || formData.number.replace(/\s/g, "").length < 16) {
      newErrors.number = "Número do cartão inválido"
    }

    if (!formData.holderName) {
      newErrors.holderName = "Nome no cartão é obrigatório"
    }

    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = "Data de validade inválida"
    } else {
      const [month, year] = formData.expiryDate.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
        newErrors.expiryDate = "Mês inválido"
      } else if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Cartão expirado"
      }
    }

    if (!formData.brandId) {
      newErrors.brandId = "Selecione a bandeira do cartão"
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await createCard(
        formData.number.replace(/\s/g, ""),
        formData.holderName,
        formData.expiryDate,
        Number.parseInt(formData.brandId),
        formData.cvv,
      )

      toast({
        title: "Cartão adicionado",
        description: "O cartão foi adicionado com sucesso.",
      })

      onSuccess()
    } catch (error) {
      console.error("Error saving card:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cartão. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="number" className="flex">
            Número do Cartão <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="number"
            name="number"
            placeholder="0000 0000 0000 0000"
            value={formData.number}
            onChange={handleChange}
            maxLength={19}
            className="mt-1"
          />
          {errors.number && <p className="text-sm text-red-600 mt-1">{errors.number}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="holderName" className="flex">
            Nome no Cartão <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="holderName"
            name="holderName"
            placeholder="Como aparece no cartão"
            value={formData.holderName}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.holderName && <p className="text-sm text-red-600 mt-1">{errors.holderName}</p>}
        </div>

        <div>
          <Label htmlFor="expiryDate" className="flex">
            Validade <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/AA"
            value={formData.expiryDate}
            onChange={handleChange}
            maxLength={5}
            className="mt-1"
          />
          {errors.expiryDate && <p className="text-sm text-red-600 mt-1">{errors.expiryDate}</p>}
        </div>

        <div>
          <Label htmlFor="cvv" className="flex">
            CVV <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="cvv"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            onChange={handleChange}
            maxLength={4}
            className="mt-1"
          />
          {errors.cvv && <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="brandId" className="flex">
            Bandeira <span className="text-red-600 ml-1">*</span>
          </Label>
          <Select value={formData.brandId} onValueChange={(value) => handleSelectChange("brandId", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {isBrandsLoading ? (
                <SelectItem value="loading" disabled>
                  Carregando...
                </SelectItem>
              ) : brands.length > 0 ? (
                brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="1">Visa</SelectItem>
                  <SelectItem value="2">Mastercard</SelectItem>
                  <SelectItem value="3">American Express</SelectItem>
                  <SelectItem value="4">Elo</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          {errors.brandId && <p className="text-sm text-red-600 mt-1">{errors.brandId}</p>}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Adicionar Cartão"}
        </Button>
      </div>
    </form>
  )
}
