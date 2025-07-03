"use client"

import { useState } from "react"
import { returnExchangeService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"
import type { ReturnExchangeModel } from "../models/return-exchange-model"

export function useReturnExchange() {
  const [requests, setRequests] = useState<ReturnExchangeModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getMyRequests = async () => {
    setIsLoading(true)
    try {
      const data = await returnExchangeService.getMyRequests()
      console.log(data);
      setRequests(data)
      return data
    } catch (error) {
      console.error("Failed to fetch return/exchange requests:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas solicitações de troca/devolução.",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

//   const getRequestById = async (id: number) => {
//     setIsLoading(true)
//     try {
//       const data = await returnExchangeService.getRequestById(id)
//       return data
//     } catch (error) {
//       console.error(`Failed to fetch return/exchange request with id ${id}:`, error)
//       toast({
//         title: "Erro",
//         description: "Não foi possível carregar os detalhes da solicitação.",
//       })
//       return null
//     } finally {
//       setIsLoading(false)
//     }
//   }

  const createRequest = async (description: string, orderItemIds: number[], type: "exchange" | "return") => {
    setIsLoading(true)
    try {
      const data = await returnExchangeService.createRequest(description, orderItemIds, type)
      await getMyRequests() // Refresh the list
      toast({
        title: "Solicitação enviada",
        description: `Sua solicitação de ${type === "exchange" ? "troca" : "devolução"} foi enviada com sucesso.`,
      })
      return data
    } catch (error) {
      console.error("Failed to create return/exchange request:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua solicitação. Tente novamente.",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const cancelRequest = async (requestId: number) => {
    setIsLoading(true)
    try {
      const updatedRequest = await returnExchangeService.updateStatus(requestId, "EXCHANGE_CANCELLED")
      // Update the local state
      getMyRequests();
      toast({
        title: "Solicitação cancelada",
        description: "Sua solicitação foi cancelada com sucesso.",
      })
      return updatedRequest
    } catch (error) {
      console.error("Failed to cancel return/exchange request:", error)
      toast({
        title: "Erro",
        description: "Não foi possível cancelar sua solicitação. Tente novamente.",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    requests,
    isLoading,
    getMyRequests,
    // getRequestById,
    createRequest,
    cancelRequest,
  }
}
