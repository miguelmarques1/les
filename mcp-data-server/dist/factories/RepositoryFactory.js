"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryFactory = void 0;
const BookRepository_1 = require("../repositories/BookRepository");
const CategoryRepository_1 = require("../repositories/CategoryRepository");
const ApiClient_1 = require("../utils/ApiClient");
class RepositoryFactory {
    baseUrl;
    apiClient;
    constructor() {
        this.baseUrl = process.env.MAIN_BACKEND_API_URL || 'http://localhost:3000/api';
        this.apiClient = new ApiClient_1.ApiClient(this.baseUrl);
    }
    getBookRepository() {
        return new BookRepository_1.BookRepository(this.apiClient);
    }
    getCategoryRepository() {
        return new CategoryRepository_1.CategoryRepository(this.apiClient);
    }
}
exports.RepositoryFactory = RepositoryFactory;
//# sourceMappingURL=RepositoryFactory.js.map