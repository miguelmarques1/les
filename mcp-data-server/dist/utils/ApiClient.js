"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiClient {
    axiosInstance;
    constructor(baseURL) {
        this.axiosInstance = axios_1.default.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Método GET com suporte a parâmetros
     * @param url Endpoint da API
     * @param params Parâmetros da requisição (opcional)
     * @returns Promise com os dados da resposta
     */
    async get(url, params) {
        try {
            const response = await this.axiosInstance.get(url, { params });
            console.log(response);
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Método POST com suporte a corpo da requisição
     * @param url Endpoint da API
     * @param data Corpo da requisição (opcional)
     * @returns Promise com os dados da resposta
     */
    async post(url, data) {
        try {
            const response = await this.axiosInstance.post(url, data);
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    handleResponse(response) {
        if (response.data.error) {
            throw new Error(response.data.message || 'API returned an error');
        }
        return response.data.data;
    }
    handleError(error) {
        if (error.response != undefined) {
            if (error.response) {
                throw new Error(error.response.data.message || `API request failed with status ${error.response.status}`);
            }
            else if (error.request) {
                throw new Error('No response received from the API');
            }
        }
        throw new Error(error.message || 'API request failed');
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=ApiClient.js.map