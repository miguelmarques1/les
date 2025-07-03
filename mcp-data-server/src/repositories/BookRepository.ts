import { Book } from '../models/interfaces';
import * as axios from 'axios';
import { ApiClient } from '../utils/ApiClient';

export class BookRepository {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    public async getAllBooksByIds(ids: number[]): Promise<Book[]> {
        try {
            const response = await this.apiClient.post<Book[]>(`/book/getByIds`, {
                ids: ids,
            });
            
            return response;
        } catch (error) {
            throw new Error('Não foi possível buscar os livros');
        }
    }

    public async getCustomerInterestBooks(customerID: number): Promise<Book[]> {
        try {
            const response = await this.apiClient.get<Book[]>(`/book/interest/${customerID}`);
            
            return response;
        } catch (error) {
            throw new Error('Não foi possível buscar os livros de interesse');
        }
    }

    public async getAllBooks(): Promise<Book[]> {
        try {
            const response = await this.apiClient.get<Book[]>(`/book`);
            console.log(response);
            return response;
        } catch (error) {
            throw new Error((error as Error).message ?? 'Não foi possível buscar os livros');
        }
    }

    public async searchBooksByCategory(categoryID: number): Promise<Book[]> {
        try {
            const response = await this.apiClient.get<Book[]>(`/book/category/${encodeURIComponent(categoryID)}`);
            
            return response;
        } catch (error) {
            throw new Error(`Não foi possível buscar os livros da categoria "${categoryID}"`);
        }
    }

    public async getBookById(bookId: number): Promise<Book | undefined> {
        try {
            const response = await this.apiClient.get<Book>(`/book/${bookId}`);
            
            return response;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return undefined;
            }
            throw new Error(`Não foi possível buscar o livro com ID "${bookId}"`);
        }
    }
}