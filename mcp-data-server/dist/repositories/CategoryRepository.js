"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
class CategoryRepository {
    apiClient;
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    async getAllCategories() {
        try {
            const response = await this.apiClient.get(`/category`);
            return response;
        }
        catch (error) {
            throw new Error('Não foi buscar as categorias');
        }
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=CategoryRepository.js.map