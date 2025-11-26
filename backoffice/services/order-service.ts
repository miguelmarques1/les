import type { OrderModel, OrderRequest } from "../models/order-model"
import type { ApiService } from "./api-service"

export class OrderService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async createOrder(request: OrderRequest): Promise<OrderModel> {
    return this.apiService.createOrder(request)
  }

  async getOrders(): Promise<OrderModel[]> {
    return this.apiService.getOrders()
  }

  async getAllOrders(): Promise<OrderModel[]> {
    return this.apiService.getAllOrders()
  }

  async getOrderById(id: number): Promise<OrderModel> {
    return this.apiService.getOrderById(id)
  }

  async updateOrderStatus(id: number, status: string): Promise<OrderModel> {
    return this.apiService.updateOrderStatus(id, status)
  }
}
