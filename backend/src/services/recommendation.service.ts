import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RecommendationResponse, RecommendationsRequest } from '../dto/recommendation.dto';

export class RecommendationService {
    private api: AxiosInstance;

    constructor() {
        const recommendationMSUrl = process.env.RECOMMENDATION_MS_URL;
        this.api = axios.create({
            baseURL: recommendationMSUrl,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public async handle(request: RecommendationsRequest): Promise<RecommendationResponse> {
        try {
            const response: AxiosResponse<RecommendationResponse> = await this.api.post('/recommendations', request);
            return response.data;
        } catch (error: any) {
            throw new Error("Erro ao buscar recomendações");
        }
    }
}