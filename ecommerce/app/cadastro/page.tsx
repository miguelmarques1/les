"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Footer from "@/components/footer"
import RegistrationStepper from "@/components/registration-stepper"
import { Gender } from "@/lib/enums/gender"
import { ResidenceType } from "@/lib/enums/residence-type"
import { useToast } from "@/hooks/use-toast"
import { CustomerRequest } from "@/lib/models/customer-model"
import { AddressRequest } from "@/lib/models/address-model"
import { AddressType } from "@/lib/enums/address-type"
import { customerService } from "@/lib/services"

export default function RegistrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    gender: "",
    fullName: "",
    birthDate: "",
    cpf: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Address fields
    residenceType: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    // Shipping address
    useAsBilling: true,
    shippingAddressName: "",
    shippingResidenceType: "",
    shippingZipCode: "",
    shippingStreet: "",
    shippingNumber: "",
    shippingComplement: "",
    shippingNeighborhood: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "Brasil",
  })

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (name === "cpf") {
      const formattedCpf = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")

      setFormData({ ...formData, [name]: formattedCpf })
      return
    }

    // Format phone
    if (name === "phone") {
      const formattedPhone = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")

      setFormData({ ...formData, [name]: formattedPhone })
      return
    }

    // Format ZIP code
    if (name === "zipCode" || name === "shippingZipCode") {
      const formattedZip = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1")

      setFormData({ ...formData, [name]: formattedZip })

      // If it's a complete ZIP code, simulate fetching address data
      if (formattedZip.length === 9) {
        setTimeout(() => {
          if (name === "zipCode") {
            setFormData((prev) => ({
              ...prev,
              street: "Rua Exemplo",
              neighborhood: "Bairro Teste",
              city: "São Paulo",
              state: "SP",
            }))
          } else {
            setFormData((prev) => ({
              ...prev,
              shippingStreet: "Rua Exemplo",
              shippingNeighborhood: "Bairro Teste",
              shippingCity: "São Paulo",
              shippingState: "SP",
            }))
          }
        }, 500)
      }
      return
    }

    // Check password strength
    if (name === "password") {
      const strength = calculatePasswordStrength(value)
      setPasswordStrength(strength)
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

  // Calculate password strength (0-3)
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1

    return strength
  }

  // Validate step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.gender) newErrors.gender = "Selecione um gênero"
    if (!formData.fullName) newErrors.fullName = "Nome completo é obrigatório"
    if (!formData.birthDate) newErrors.birthDate = "Data de nascimento é obrigatória"
    if (!formData.cpf || formData.cpf.length < 14) newErrors.cpf = "CPF inválido"
    if (!formData.phone || formData.phone.length < 14) newErrors.phone = "Telefone inválido"
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "E-mail inválido"
    if (!formData.password || formData.password.length < 8) newErrors.password = "Senha deve ter no mínimo 8 caracteres"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate step 2
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.residenceType) newErrors.residenceType = "Selecione um tipo de residência"
    if (!formData.zipCode || formData.zipCode.length < 9) newErrors.zipCode = "CEP inválido"
    if (!formData.street) newErrors.street = "Logradouro é obrigatório"
    if (!formData.number) newErrors.number = "Número é obrigatório"
    if (!formData.neighborhood) newErrors.neighborhood = "Bairro é obrigatório"
    if (!formData.city) newErrors.city = "Cidade é obrigatória"
    if (!formData.state) newErrors.state = "Estado é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate step 3
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.shippingAddressName) newErrors.shippingAddressName = "Nome do endereço é obrigatório"
    if (!formData.shippingResidenceType) newErrors.shippingResidenceType = "Selecione um tipo de residência"
    if (!formData.shippingZipCode || formData.shippingZipCode.length < 9) newErrors.shippingZipCode = "CEP inválido"
    if (!formData.shippingStreet) newErrors.shippingStreet = "Logradouro é obrigatório"
    if (!formData.shippingNumber) newErrors.shippingNumber = "Número é obrigatório"
    if (!formData.shippingNeighborhood) newErrors.shippingNeighborhood = "Bairro é obrigatório"
    if (!formData.shippingCity) newErrors.shippingCity = "Cidade é obrigatória"
    if (!formData.shippingState) newErrors.shippingState = "Estado é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      if (formData.useAsBilling) {
        // Complete registration if using billing address as shipping
        await handleCompleteRegistration()
      } else {
        setStep(3)
      }
    } else if (step === 3 && validateStep3()) {
      // Complete registration
      await handleCompleteRegistration()
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/login")
    }
  }

  // Toggle using billing address as shipping
  const handleToggleUseAsBilling = () => {
    setFormData({ ...formData, useAsBilling: !formData.useAsBilling })
  }

  // Handle complete registration
  const handleCompleteRegistration = async () => {
    setIsSubmitting(true)

    try {
      const billingAddressRequest: AddressRequest = {
        alias: "Principal",
        type: AddressType.BILLING,
        street_type: 'Alameda',
        residence_type: formData.residenceType as ResidenceType,
        street: formData.street,
        number: formData.number,
        district: formData.neighborhood,
        zip_code: formData.zipCode.replace(/\D/g, ""),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        observations: formData.complement,
      }

      const customerRequest: CustomerRequest = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        document: formData.cpf.replace(/\D/g, ""),
        birthdate: formData.birthDate,
        gender: formData.gender as Gender,
        phone: formData.phone ? { 
          type: "MOBILE",
          ddd: formData.phone.substring(0, 2),
          number: formData.phone.substring(2)
        } : undefined,
        billing_address: billingAddressRequest,
        delivery_address: formData.useAsBilling ? billingAddressRequest : {
          alias: formData.shippingAddressName,
          type: AddressType.SHIPPING,
          residence_type: formData.shippingResidenceType as ResidenceType,
          street: formData.shippingStreet,
          number: formData.shippingNumber,
          district: formData.shippingNeighborhood,
          zip_code: formData.shippingZipCode.replace(/\D/g, ""),
          city: formData.shippingCity,
          state: formData.shippingState,
          country: formData.shippingCountry,
          street_type: 'Alameda',
          observations: formData.shippingComplement,
        },
      };
      await customerService.register(customerRequest)


      // Store registration completion in session storage for confirmation page
      sessionStorage.setItem("registrationComplete", "true")

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua conta foi criada com sucesso.",
      })

      // Redirect to confirmation page
      router.push("/cadastro/confirmacao")
    } catch (error) {
      const message = (error as Error).message;
      toast({
        title: "Erro no cadastro",
        description: message ?? "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#F5F5DC" }}>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="relative h-16 w-48 mx-auto">
                <h1 className="text-3xl font-bold text-amber-700">Livraria XYZ</h1>
              </div>
            </Link>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#2C3E50" }}>
              Criar uma nova conta
            </h2>

            <RegistrationStepper currentStep={step} totalSteps={formData.useAsBilling ? 2 : 3} />

            <div className="mt-8">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-medium mb-4" style={{ color: "#2C3E50" }}>
                    1/3 - Dados Pessoais
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="fullName" className="flex">
                        Nome Completo <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Maria Silva"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="birthDate" className="flex">
                        Data de Nascimento <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        placeholder="Data de nascimento"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.birthDate && <p className="text-sm text-red-600 mt-1">{errors.birthDate}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cpf" className="flex">
                        CPF <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleChange}
                        maxLength={14}
                        className="mt-1"
                      />
                      {errors.cpf && <p className="text-sm text-red-600 mt-1">{errors.cpf}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex">
                        Telefone <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={15}
                        className="mt-1"
                      />
                      {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex">
                        E-mail <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="exemplo@email.com"
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
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {/* Password strength indicator */}
                      {formData.password && (
                        <div className="mt-1">
                          <div className="flex h-1 overflow-hidden rounded bg-gray-200">
                            <div
                              className={`${
                                passwordStrength === 0
                                  ? "bg-red-500 w-1/3"
                                  : passwordStrength === 1
                                    ? "bg-yellow-500 w-2/3"
                                    : "bg-green-500 w-full"
                              }`}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {passwordStrength === 0
                              ? "Senha fraca"
                              : passwordStrength === 1
                                ? "Senha média"
                                : "Senha forte"}
                          </p>
                        </div>
                      )}
                      {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="flex">
                        Confirmar Senha <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirme sua senha"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        {formData.confirmPassword && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {formData.password === formData.confirmPassword ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Billing Address */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-medium mb-4" style={{ color: "#2C3E50" }}>
                    2/3 - Endereço de Cobrança
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="residenceType" className="flex">
                        Tipo de Residência <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Select
                        value={formData.residenceType}
                        onValueChange={(value) => handleSelectChange("residenceType", value)}
                      >
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
                      <Label htmlFor="neighborhood" className="flex">
                        Bairro <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="neighborhood"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.neighborhood && <p className="text-sm text-red-600 mt-1">{errors.neighborhood}</p>}
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

                  <div className="mt-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useAsBilling"
                        checked={formData.useAsBilling}
                        onChange={handleToggleUseAsBilling}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="useAsBilling" className="ml-2 block text-sm text-gray-700">
                        Usar este endereço como endereço de entrega
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Shipping Address */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-medium mb-4" style={{ color: "#2C3E50" }}>
                    3/3 - Endereço de Entrega
                  </h3>

                  <p className="mb-4 text-gray-600">Cadastre um endereço de entrega diferente.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingAddressName" className="flex">
                        Nome do Endereço <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingAddressName"
                        name="shippingAddressName"
                        placeholder="Ex: Casa da Praia"
                        value={formData.shippingAddressName}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.shippingAddressName && (
                        <p className="text-sm text-red-600 mt-1">{errors.shippingAddressName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="shippingResidenceType" className="flex">
                        Tipo de Residência <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Select
                        value={formData.shippingResidenceType}
                        onValueChange={(value) => handleSelectChange("shippingResidenceType", value)}
                      >
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
                      {errors.shippingResidenceType && (
                        <p className="text-sm text-red-600 mt-1">{errors.shippingResidenceType}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="shippingZipCode" className="flex">
                        CEP <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingZipCode"
                        name="shippingZipCode"
                        placeholder="00000-000"
                        value={formData.shippingZipCode}
                        onChange={handleChange}
                        maxLength={9}
                        className="mt-1"
                      />
                      {errors.shippingZipCode && <p className="text-sm text-red-600 mt-1">{errors.shippingZipCode}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="shippingStreet" className="flex">
                        Logradouro <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingStreet"
                        name="shippingStreet"
                        placeholder="Rua, Avenida, etc."
                        value={formData.shippingStreet}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.shippingStreet && <p className="text-sm text-red-600 mt-1">{errors.shippingStreet}</p>}
                    </div>

                    <div>
                      <Label htmlFor="shippingNumber" className="flex">
                        Número <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingNumber"
                        name="shippingNumber"
                        placeholder="123"
                        value={formData.shippingNumber}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.shippingNumber && <p className="text-sm text-red-600 mt-1">{errors.shippingNumber}</p>}
                    </div>

                    <div>
                      <Label htmlFor="shippingComplement">Complemento</Label>
                      <Input
                        id="shippingComplement"
                        name="shippingComplement"
                        placeholder="Apto, Bloco, etc."
                        value={formData.shippingComplement}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="shippingNeighborhood" className="flex">
                        Bairro <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingNeighborhood"
                        name="shippingNeighborhood"
                        value={formData.shippingNeighborhood}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.shippingNeighborhood && (
                        <p className="text-sm text-red-600 mt-1">{errors.shippingNeighborhood}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="shippingCity" className="flex">
                        Cidade <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.shippingCity && <p className="text-sm text-red-600 mt-1">{errors.shippingCity}</p>}
                    </div>

                    <div>
                      <Label htmlFor="shippingState" className="flex">
                        Estado <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingState"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {errors.shippingState && <p className="text-sm text-red-600 mt-1">{errors.shippingState}</p>}
                    </div>

                    <div>
                      <Label htmlFor="shippingCountry" className="flex">
                        País <span className="text-red-600 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingCountry"
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={handleChange}
                        disabled
                        className="mt-1 bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  {step === 1 ? "Cancelar" : "Voltar"}
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  style={{ backgroundColor: step === 3 ? "#27AE60" : "#2C3E50" }}
                  className="text-white"
                >
                  {isSubmitting
                    ? "Processando..."
                    : step === 3
                      ? "Finalizar Cadastro"
                      : step === 2 && formData.useAsBilling
                        ? "Finalizar Cadastro"
                        : "Próximo"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
