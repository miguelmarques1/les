"use client"

import { useState, useEffect } from "react"
import type { AddressModel } from "../models/address-model"
import { addressService } from "../services"
import type { AddressType } from "../enums/address-type"
import type { ResidenceType } from "../enums/residence-type"
import { useAuth } from "../contexts/auth-context"

export function useAddresses() {
  const { isAuthenticated } = useAuth()
  const [addresses, setAddresses] = useState<AddressModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAddresses = async () => {
    if (!isAuthenticated) {
      setAddresses([])
      setIsLoading(false)
      return
    }

    try {
      const data = await addressService.getAddresses()
      setAddresses(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch addresses:", err)
      setError("Falha ao carregar os endereços")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [isAuthenticated])

  const createAddress = async (
    alias: string,
    type: AddressType,
    residenceType: ResidenceType,
    streetType: string,
    street: string,
    number: string | number,
    district: string,
    zipCode: string,
    city: string,
    state: string,
    country: string,
    complement?: string,
    observations?: string,
  ) => {
    setIsLoading(true)
    try {
      const newAddress = await addressService.createAddress(
        alias,
        type,
        residenceType,
        streetType,
        street,
        number,
        district,
        zipCode,
        city,
        state,
        country,
        complement,
        observations,
      )
      setAddresses([...addresses, newAddress])
      fetchAddresses();
      return newAddress
    } catch (err) {
      console.error("Failed to create address:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateAddress = async (
    id: number,
    alias: string,
    type: AddressType,
    residenceType: ResidenceType,
    streetType: string,
    street: string,
    number: string | number,
    district: string,
    zipCode: string,
    city: string,
    state: string,
    country: string,
    complement?: string,
    observations?: string,
  ) => {
    setIsLoading(true)
    try {
      const updatedAddress = await addressService.updateAddress(
        id,
        alias,
        type,
        residenceType,
        streetType,
        street,
        number,
        district,
        zipCode,
        city,
        state,
        country,
        complement,
        observations,
      )
      setAddresses(addresses.map((addr) => (addr.id === id ? updatedAddress : addr)))
      fetchAddresses();
      return updatedAddress
    } catch (err) {
      console.error("Failed to update address:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAddress = async (id: number) => {
    setIsLoading(true)
    try {
      await addressService.deleteAddress(id)
      setAddresses(addresses.filter((addr) => addr.id !== id))
      fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { addresses, isLoading, error, createAddress, updateAddress, deleteAddress }
}
