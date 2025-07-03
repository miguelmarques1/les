export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  recommendations?: RecommendationItem[]
}

export interface ChatResponse {
  message: string
  recommendations?: RecommendationItem[]
}

export interface RecommendationItem {
  id: string
  label: string
  reason: string
}

export type RecommendationsInputDTO = {
  history: ChatMessage[]
  message: string
  customerID?: number
}
