"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCustomerRegistration } from "@/lib/hooks/use-customer-registration"
import { Gender } from "@/lib/enums/gender"
import { ResidenceType } from "@/lib/enums/residence-type"
import { AddressType } from "@/lib/enums/address-type"

export default function CustomerRegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { register, isLoading, error } = useCustomerRegistration()
  
  const [formData, setFormData] = useState({
    // Personal information
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthdate: "",
    document: "",
    phone: {
      type: "mobile",
      ddd: "",
      number: ""
    },
    
    // Billing address
    billingAlias: "Principal",
    billingResidenceType: "",
    billingStreetType: "RESIDENTIAL",
    billingStreet: "",
    billingNumber: "",
    billingComplement: "",
    billingDistrict: "",
    billingZipCode: "",
    billingCity: "",
    billingState: "",
    billingCountry: "Brasil",
    billingObservations: "",
    
    // Delivery address
    useAsBilling: true,
    deliveryAlias: "Entrega",
    deliveryResidenceType: "",
    deliveryStreetType: "RESIDENTIAL",
    deliveryStreet: "",
    deliveryNumber: "",
    deliveryComplement: "",
    deliveryDistrict: "",
    deliveryZipCode: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryCountry: "Brasil",
    deliveryObservations: ""
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = formData.useAsBilling ? 2 : 3
  
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
    
    // Format CPF
    if (name === "document") {
      const formattedCpf = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
      
      setFormData({ ...formData, [name]: formattedCpf })
      return
    }
    
    // Format phone number
    if (name === "phone.ddd" || name === "phone.number") {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        phone: {
          ...formData.phone,
          [child]: value
        }
      })
      return
    }
    
    // Format ZIP code
    if (name === "billingZipCode" || name === "deliveryZipCode") {
      const formattedZip = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1")
      
      setFormData({ ...formData, [name]: formattedZip })
      
      // If it's a complete ZIP code, simulate fetching address data
      if (formattedZip.length === 9) {
        setTimeout(() => {
          if (name === "billingZipCode") {
            setFormData((prev) => ({
              ...prev,
              billingStreet: "Rua Exemplo",
              billingDistrict: "Bairro Teste",
              billingCity: "São Paulo",
              billingState: "SP",
            }))
          } else {
            setFormData((prev) => ({
              ...prev,
              deliveryStreet: "Rua Exemplo",
              deliveryDistrict: "Bairro Teste",
              deliveryCity: "São Paulo",
              deliveryState: "SP",
            }))
          }
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
  
  // Toggle using billing address as shipping
  const handleToggleUseAsBilling = () => {
    setFormData({ ...formData, useAsBilling: !formData.useAsBilling })
  }
  
  // Validate step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name) newErrors.name = "Nome completo é obrigatório"
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "E-mail inválido"
    if (!formData.password || formData.password.length < 8) newErrors.password = "Senha deve ter no mínimo 8 caracteres"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem"
    if (!formData.gender) newErrors.gender = "Selecione um gênero"
    if (!formData.birthdate) newErrors.birthdate = "Data de nascimento é obrigatória"
    if (!formData.document || formData.document.length < 14) newErrors.document = "CPF inválido"
    if (!formData.phone.ddd || formData.phone.ddd.length !== 2) newErrors["phone.ddd"] = "DDD inválido"
    if (!formData.phone.number || formData.phone.number.length < 8) newErrors["phone.number"] = "Número inválido"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Validate step 2
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.billingResidenceType) newErrors.billingResidenceType = "Selecione um tipo de residência"
    if (!formData.billingZipCode || formData.billingZipCode.length < 9) newErrors.billingZipCode = "CEP inválido"
    if (!formData.billingStreet) newErrors.billingStreet = "Logradouro é obrigatório"
    if (!formData.billingNumber) newErrors.billingNumber = "Número é obrigatório"
    if (!formData.billingDistrict) newErrors.billingDistrict = "Bairro é obrigatório"
    if (!formData.billingCity) newErrors.billingCity = "Cidade é obrigatória"
    if (!formData.billingState) newErrors.billingState = "Estado é obrigatório"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Validate step 3
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.deliveryResidenceType) newErrors.deliveryResidenceType = "Selecione um tipo de residência"
    if (!formData.deliveryZipCode || formData.deliveryZipCode.length < 9) newErrors.deliveryZipCode = "CEP inválido"
    if (!formData.deliveryStreet) newErrors.deliveryStreet = "Logradouro é obrigatório"
    if (!formData.deliveryNumber) newErrors.deliveryNumber = "Número é obrigatório"
    if (!formData.deliveryDistrict) newErrors.deliveryDistrict = "Bairro é obrigatório"
    if (!formData.deliveryCity) newErrors.deliveryCity = "Cidade é obrigatória"
    if (!formData.deliveryState) newErrors.deliveryState = "Estado é obrigatório"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      if (formData.useAsBilling) {
        handleSubmit()
      } else {
        setCurrentStep(3)
      }
    } else if (currentStep === 3 && validateStep3()) {
      handleSubmit()
    }
  }
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Prepare billing address
      const billingAddress = {
        alias: formData.billingAlias,
        type: AddressType.BILLING,
        residence_type: formData.billingResidenceType as ResidenceType,
        street_type: formData.billingStreetType,
        street: formData.billingStreet,
        number: formData.billingNumber,
        district: formData.billingDistrict,
        zip_code: formData.billingZipCode.replace(/\D/g, ""),
        city: formData.billingCity,
        state: formData.billingState,
        country: formData.billingCountry,
        complement: formData.billingComplement || undefined,
        observations: formData.billingObservations || undefined
      }
      
      // Prepare delivery address if different
      let deliveryAddress = undefined
      if (!formData.useAsBilling) {
        deliveryAddress = {
          alias: formData.deliveryAlias,
          type: AddressType.SHIPPING,
          residence_type: formData.deliveryResidenceType as ResidenceType,
          street_type: formData.deliveryStreetType,
          street: formData.deliveryStreet,
          number: formData.deliveryNumber,
          district: formData.deliveryDistrict,
          zip_code: formData.deliveryZipCode.replace(/\D/g, ""),
          city: formData.deliveryCity,
          state: formData.deliveryState,
          country: formData.deliveryCountry,
          complement: formData.deliveryComplement || undefined,
          observations: formData.deliveryObservations || undefined
        }
      }
      
      // Prepare phone
      const phone = {
        type: formData.phone.type,
        ddd: formData.phone.ddd,
        number: formData.phone.number
      }
      
      // Register customer
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.gender,
        formData.birthdate,
        formData.document.replace(/\D/g, ""),
        phone,
        billingAddress,
        deliveryAddress
      )
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua conta foi criada e você já está logado.",
      })
      
      // Redirect to home page
      router.push("/")
    } catch (err) {
      toast({
        title: "Erro no cadastro",
        description: error || "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Registration Steps */}
      <div className="flex items-center justify-between mb-6">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                i + 1 === currentStep
                  ? "bg-amber-500 text-white"
                  : i + 1 < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {i + 1 < currentStep ? "✓" : i + 1}
            </div>

            {/* Step label */}
            <div className="ml-2 hidden sm:block">
              <p className={`text-sm ${i + 1 === currentStep ? "font-medium text-amber-700" : "text-gray-600"}`}>
                {i + 1 === 1 ? "Dados Pessoais" : i + 1 === 2 ? "Endereço de Cobrança" : "Endereço de Entrega"}
              </p>
            </div>

            {/* Connector line */}
            {i + 1 < totalSteps && (
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${i + 1 < currentStep ? "bg-green-500" : "bg-gray-200"}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Dados Pessoais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="flex">
                Nome Completo <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="email" className="flex">
                E-mail <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Label htmlFor="password" className="flex">
                Senha <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="flex">
                Confirmar Senha <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <div>
              <Label htmlFor="gender" className="flex">
                Gênero <span className="text-red-600 ml-1">*</span>
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>Masculino</SelectItem>
                  <SelectItem value={Gender.FEMALE}>Feminino</SelectItem>
                  <SelectItem value={Gender.OTHER}>Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
            </div>
            
            <div>
              <Label htmlFor="birthdate" className="flex">
                Data de Nascimento <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.birthdate && <p className="text-sm text-red-600 mt-1">{errors.birthdate}</p>}
            </div>
            
            <div>
              <Label htmlFor="document" className="flex">
                CPF <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="document"
                name="document"
                placeholder="000.000.000-00"
                value={formData.document}
                onChange={handleChange}
                maxLength={14}
                className="mt-1"
              />
              {errors.document && <p className="text-sm text-red-600 mt-1">{errors.document}</p>}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Label htmlFor="phone.ddd" className="flex">
                  DDD <span className="text-red-600 ml-1">*</span>
                </Label>
                <Input
                  id="phone.ddd"
                  name="phone.ddd"
                  placeholder="00"
                  value={formData.phone.ddd}
                  onChange={handleChange}
                  maxLength={2}
                  className="mt-1"
                />
                {errors["phone.ddd"] && <p className="text-sm text-red-600 mt-1">{errors["phone.ddd"]}</p>}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="phone.number" className="flex">
                  Número <span className="text-red-600 ml-1">*</span>
                </Label>
                <Input
                  id="phone.number"
                  name="phone.number"
                  placeholder="00000-0000"
                  value={formData.phone.number}
                  onChange={handleChange}
                  maxLength={9}
                  className="mt-1"
                />
                {errors["phone.number"] && <p className="text-sm text-red-600 mt-1">{errors["phone.number"]}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Billing Address */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Endereço de Cobrança</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billingResidenceType" className="flex">
                Tipo de Residência <span className="text-red-600 ml-1">*</span>
              </Label>
              <Select value={formData.billingResidenceType} onValueChange={(value) => handleSelectChange("billingResidenceType", value)}>
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
              {errors.billingResidenceType && <p className="text-sm text-red-600 mt-1">{errors.billingResidenceType}</p>}
            </div>
            
            <div>
              <Label htmlFor="billingZipCode" className="flex">
                CEP <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="billingZipCode"
                name="billingZipCode"
                placeholder="00000-000"
                value={formData.billingZipCode}
                onChange={handleChange}
                maxLength={9}
                className="mt-1"
              />
              {errors.billingZipCode && <p className="text-sm text-red-600 mt-1">{errors.billingZipCode}</p>}
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="billingStreet" className="flex">
                Logradouro <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="billingStreet"
                name="billingStreet"
                placeholder="Rua, Avenida, etc."
                value={formData.billingStreet}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.billingStreet && <p className="text-sm text-red-600 mt-1">{errors.billingStreet}</p>}
            </div>
            
            <div>
              <Label htmlFor="billingNumber" className="flex">
                Número <span className="text-red-600 ml-1">*</span>
              </Label>
              <Input
                id="billingNumber"
                name="billingNumber"
                placeholder="123"
                value={formData.billingNumber}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.billingNumber && <p className="text-sm text-red-600 mt-1">{errors.billingNumber}</p>}
            </div>
            
            <div>
              <Label htmlFor="billingComplement">Complemento</Label>
              <Input
                id="billingComplement"
                name="billingComplement"\
