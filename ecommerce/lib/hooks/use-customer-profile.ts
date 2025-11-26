"use client"

import { useState, useEffect } from "react"
import type { CustomerModel } from "../models/customer-model"
import { customerService } from "../services"
import { useAuth } from "../contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function useCustomerProfile() {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<CustomerModel | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await customerService.getProfile()
      setProfile(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch customer profile:", err)
      setError("Falha ao carregar o perfil do cliente")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [isAuthenticated])

  const updateProfile = async (name?: string, gender?: string, birthdate?: string) => {
    setIsLoading(true)
    try {
      const updatedProfile = await customerService.updateProfile(name, gender, birthdate)
      setProfile(updatedProfile)
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
      return updatedProfile
    } catch (err) {
      console.error("Failed to update profile:", err)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProfile = async(password: string) => {
    setIsLoading(true);
    try {
      const success = await customerService.deleteProfile(password);
      if(!success) {
        throw new Error("Falha ao desativar a conta");
      }

      toast({
        title: 'Sucesso',
        description: 'Sua conta foi desativada com sucesso.',
      });
    } catch(err) {
      console.error("Failed to delete profile:", err)
      toast({
        title: "Erro",
        description: (err as Error).message ??  "Não foi possível desativar a sua conta.",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false);
    }
  }

  return { profile, isLoading, error, updateProfile, refreshProfile: fetchProfile }
}
