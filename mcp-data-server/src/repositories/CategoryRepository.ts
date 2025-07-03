import * as axios from 'axios';
import { Category } from '../models/interfaces';
import { ApiClient } from '../utils/ApiClient';

export class CategoryRepository {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            const response = await this.apiClient.get<Category[]>(`/category`);
            
            return response;
        } catch (error) {
            throw new Error('Não foi buscar as categorias');
        }
    }
}