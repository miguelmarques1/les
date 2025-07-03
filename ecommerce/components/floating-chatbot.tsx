"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, BookOpen, Trash2, MessageCircle, Minus, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { useChat } from "../lib/hooks/use-chat"
import { useCart } from "../lib/contexts/cart-context"
import type { ChatMessage } from "../lib/models/chat-model"

interface FloatingChatbotProps {
  onBookClick?: (bookId: number) => void
}

export default function FloatingChatbot({ onBookClick }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const { messages, isLoading, sendMessage, clearChat, isAuthenticated } = useChat()
  const { addToCart } = useCart()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading || !isAuthenticated) return

    console.log('trying to send message');
    console.log(inputValue);

    await sendMessage(inputValue.trim())
    setInputValue("")
  }

  const handleAddToCart = async (bookId: number) => {
    try {
      await addToCart(bookId, 1)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
    }
  }

  const handleBookLinkClick = (bookId: string) => {
    const numericId = Number.parseInt(bookId)
    if (onBookClick) {
      onBookClick(numericId)
    } else {
      // Fallback para navegação direta
      window.open(`/livro/${bookId}`, "_blank")
    }
  }

  const renderMessage = (message: ChatMessage) => {
    return (
      <div key={message.id} className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}>
        {!message.isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-amber-100">
              <Bot className="h-4 w-4 text-amber-600" />
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`max-w-[80%] ${message.isUser ? "order-first" : ""}`}>
          <div
            className={`rounded-lg px-3 py-2 ${
              message.isUser ? "bg-amber-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            <p className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Recomendações de livros (novo formato) */}
          {message.recommendations && message.recommendations.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="p-3 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <button onClick={() => handleBookLinkClick(recommendation.id)} className="text-left w-full">
                      <h4 className="font-medium text-sm text-amber-600 hover:text-amber-700 underline">
                        {recommendation.label}
                      </h4>
                    </button>
                    <p className="text-xs text-gray-600">{recommendation.reason}</p>
                    <Button
                      size="sm"
                      className="mt-2 h-7 text-xs"
                      onClick={() => handleAddToCart(Number.parseInt(recommendation.id))}
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {message.isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-600 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        {isOpen && (
          <Card className="absolute bottom-16 right-0 w-80 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-amber-500" />
                Chatbot
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-gray-600 mb-4 text-sm">
                Faça login para conversar com nosso assistente de recomendações de livros!
              </p>
              <Button className="w-full">Fazer Login</Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botão flutuante */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-600 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat expandido */}
      {isOpen && (
        <Card
          className={`absolute bottom-0 right-0 shadow-2xl transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
          }`}
        >
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-amber-500" />
              Chatbot
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8" title="Limpar conversa">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
                title={isMinimized ? "Expandir" : "Minimizar"}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8" title="Fechar">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Conteúdo do chat */}
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[436px]">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map(renderMessage)}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-amber-100">
                          <Bot className="h-4 w-4 text-amber-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input de mensagem */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
