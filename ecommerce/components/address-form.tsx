"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddresses } from "@/lib/hooks/use-addresses"
import { useToast } from "@/hooks/use-toast"
import { AddressType } from "@/lib/enums/address-type"
import { ResidenceType } from "@/lib/enums/residence-type"

interface AddressFormProps {
  onCancel: () => void
  onSuccess: () => void
  editAddress?: any // Opcional, para edição
}

export default function AddressForm({ onCancel, onSuccess, editAddress }: AddressFormProps) {
  const { createAddress, updateAddress } = useAddresses()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    alias: editAddress?.alias || "Principal",
    type: editAddress?.type || AddressType.SHIPPING,
    residenceType: editAddress?.residenceType || "",
    streetType: editAddress?.streetType || "RESIDENTIAL",
    street: editAddress?.street || "",
    number: editAddress?.number || "",
    complement: editAddress?.complement || "",
    district: editAddress?.district || "",
    zipCode: editAddress?.zipCode || "",
    city: editAddress?.city || "",
    state: editAddress?.state || "",
    country: editAddress?.country || "Brasil",
    observations: editAddress?.observations || "",
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

    // Format ZIP code
    if (name === "zipCode") {
      const formattedZip = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1")

      setFormData({ ...formData, [name]: formattedZip })

      // If it's a complete ZIP code, simulate fetching address data
      if (formattedZip.length === 9) {
        setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            street: "Rua Exemplo",
            district: "Bairro Teste",
            city: "São Paulo",
            state: "SP",
          }))
        }, 500)
      }
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

    if (!formData.alias) newErrors.alias = "Nome do endereço é obrigatório"
    if (!formData.residenceType) newErrors.residenceType = "Selecione um tipo de residência"
    if (!formData.zipCode || formData.zipCode.length < 9) newErrors.zipCode = "CEP inválido"
    if (!formData.street) newErrors.street = "Logradouro é obrigatório"
    if (!formData.number) newErrors.number = "Número é obrigatório"
    if (!formData.district) newErrors.district = "Bairro é obrigatório"
    if (!formData.city) newErrors.city = "Cidade é obrigatória"
    if (!formData.state) newErrors.state = "Estado é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (editAddress?.id) {
        // Update existing address
        await updateAddress(
          editAddress.id,
          formData.alias,
          formData.type as AddressType,
          formData.residenceType as ResidenceType,
          formData.streetType,
          formData.street,
          formData.number,
          formData.district,
          formData.zipCode,
          formData.city,
          formData.state,
          formData.country,
          formData.complement,
          formData.observations,
        )

        toast({
          title: "Endereço atualizado",
          description: "O endereço foi atualizado com sucesso.",
        })
      } else {
        // Create new address
        await createAddress(
          formData.alias,
          formData.type as AddressType,
          formData.residenceType as ResidenceType,
          formData.streetType,
          formData.street,
          formData.number,
          formData.district,
          formData.zipCode,
          formData.city,
          formData.state,
          formData.country,
          formData.complement,
          formData.observations,
        )

        toast({
          title: "Endereço adicionado",
          description: "O endereço foi adicionado com sucesso.",
        })
      }

      onSuccess()
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o endereço. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="alias" className="flex">
            Nome do Endereço <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="alias"
            name="alias"
            placeholder="Ex: Casa, Trabalho"
            value={formData.alias}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.alias && <p className="text-sm text-red-600 mt-1">{errors.alias}</p>}
        </div>

        <div>
          <Label htmlFor="type" className="flex">
            Tipo de Endereço <span className="text-red-600 ml-1">*</span>
          </Label>
          <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AddressType.BILLING}>Cobrança</SelectItem>
              <SelectItem value={AddressType.SHIPPING}>Entrega</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
        </div>

        <div>
          <Label htmlFor="residenceType" className="flex">
            Tipo de Residência <span className="text-red-600 ml-1">*</span>
          </Label>
          <Select value={formData.residenceType} onValueChange={(value) => handleSelectChange("residenceType", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ResidenceType.HOUSE}>Casa</SelectItem>
              <SelectItem value={ResidenceType.APARTMENT}>Apartamento</SelectItem>
              <SelectItem value={ResidenceType.COMMERCIAL}>Comercial</SelectItem>
              <SelectItem value={ResidenceType.OTHER}>Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.residenceType && <p className="text-sm text-red-600 mt-1">{errors.residenceType}</p>}
        </div>

        <div>
          <Label htmlFor="zipCode" className="flex">
            CEP <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="zipCode"
            name="zipCode"
            placeholder="00000-000"
            value={formData.zipCode}
            onChange={handleChange}
            maxLength={9}
            className="mt-1"
          />
          {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="street" className="flex">
            Logradouro <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="street"
            name="street"
            placeholder="Rua, Avenida, etc."
            value={formData.street}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.street && <p className="text-sm text-red-600 mt-1">{errors.street}</p>}
        </div>

        <div>
          <Label htmlFor="number" className="flex">
            Número <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="number"
            name="number"
            placeholder="123"
            value={formData.number}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.number && <p className="text-sm text-red-600 mt-1">{errors.number}</p>}
        </div>

        <div>
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            name="complement"
            placeholder="Apto, Bloco, etc."
            value={formData.complement}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="district" className="flex">
            Bairro <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input id="district" name="district" value={formData.district} onChange={handleChange} className="mt-1" />
          {errors.district && <p className="text-sm text-red-600 mt-1">{errors.district}</p>}
        </div>

        <div>
          <Label htmlFor="city" className="flex">
            Cidade <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} className="mt-1" />
          {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
        </div>

        <div>
          <Label htmlFor="state" className="flex">
            Estado <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input id="state" name="state" value={formData.state} onChange={handleChange} className="mt-1" />
          {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
        </div>

        <div>
          <Label htmlFor="country" className="flex">
            País <span className="text-red-600 ml-1">*</span>
          </Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled
            className="mt-1 bg-gray-100"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : editAddress ? "Atualizar Endereço" : "Adicionar Endereço"}
        </Button>
      </div>
    </form>
  )
}
