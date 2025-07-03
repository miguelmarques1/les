import { BookRepository } from "../repositories/BookRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ApiClient } from "../utils/ApiClient";

export class RepositoryFactory {
    private baseUrl: string;
    private apiClient: ApiClient;

    constructor() {
        this.baseUrl = process.env.BACKEND_URL || 'http://backend:3000/api';
        this.apiClient = new ApiClient(this.baseUrl);
    }

    public getBookRepository(): BookRepository {
        return new BookRepository(this.apiClient);
    }

    public getCategoryRepository(): CategoryRepository {
        return new CategoryRepository(this.apiClient);
    }
}