export interface RecommendationsRequest {
  message: string;
  history: { role: 'user' | 'model'; content: string }[];
  customerID: number,
}

export interface Recommendation {
  id: string;
  label: string;
  reason: string;
}

export interface RecommendationResponse {
  message: string;
  recommendations: Recommendation[];
}