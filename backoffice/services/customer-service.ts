import type { CustomerModel, CustomerRequest, CustomerUpdateRequest } from "../models/customer-model"
import type { ApiService } from "./api-service"

export class CustomerService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async registerCustomer(customer: CustomerRequest): Promise<CustomerModel> {
    return this.apiService.registerCustomer(customer)
  }

  async getCustomerProfile(): Promise<CustomerModel> {
    return this.apiService.getCustomerProfile()
  }

  async updateCustomerProfile(updateData: CustomerUpdateRequest): Promise<CustomerModel> {
    return this.apiService.updateCustomerProfile(updateData)
  }
}
