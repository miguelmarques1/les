"use client"

import { useState, useCallback } from "react"
import type { ChatMessage, ChatResponse } from "../models/chat-model"
import { useAuth } from "../contexts/auth-context"
import { apiService } from "../services"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const sendMessage = useCallback(
    async (content: string) => {
      // Adicionar mensagem do usuário
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await apiService.sendChatMessage(content, messages);


        // Adicionar mensagem do bot
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          isUser: false,
          timestamp: new Date(),
          recommendations: response.recommendations,
        }

        setMessages((prev) => [...prev, botMessage])
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error)

        // Adicionar mensagem de erro
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Desculpe, ocorreu um erro. Tente novamente.",
          isUser: false,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isAuthenticated, user],
  )

  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    isAuthenticated,
  }
}
