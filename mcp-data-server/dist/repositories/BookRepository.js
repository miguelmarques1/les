"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
class BookRepository {
    apiClient;
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    async getAllBooksByIds(ids) {
        try {
            const response = await this.apiClient.post(`/book/getByIds`, {
                ids: ids,
            });
            return response;
        }
        catch (error) {
            throw new Error('Não foi possível buscar os livros');
        }
    }
    async getCustomerInterestBooks(customerID) {
        try {
            const response = await this.apiClient.get(`/book/interest/${customerID}`);
            return response;
        }
        catch (error) {
            throw new Error('Não foi possível buscar os livros de interesse');
        }
    }
    async getAllBooks() {
        try {
            const response = await this.apiClient.get(`/book`);
            console.log(response);
            return response;
        }
        catch (error) {
            throw new Error(error.message ?? 'Não foi possível buscar os livros');
        }
    }
    async searchBooksByCategory(categoryID) {
        try {
            const response = await this.apiClient.get(`/book/category/${encodeURIComponent(categoryID)}`);
            return response;
        }
        catch (error) {
            throw new Error(`Não foi possível buscar os livros da categoria "${categoryID}"`);
        }
    }
    async getBookById(bookId) {
        try {
            const response = await this.apiClient.get(`/book/${bookId}`);
            return response;
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                return undefined;
            }
            throw new Error(`Não foi possível buscar o livro com ID "${bookId}"`);
        }
    }
}
exports.BookRepository = BookRepository;
//# sourceMappingURL=BookRepository.js.map