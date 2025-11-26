import type { CustomerModel, CustomerRequest, CustomerUpdateRequest } from "../models/customer-model"
import type { ApiService } from "./api-service"

export class CustomerService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async register(
    request: CustomerRequest,
  ): Promise<CustomerModel> {
    return await this.apiService.registerCustomer(request)
  }

  async getProfile(): Promise<CustomerModel> {
    return await this.apiService.getCustomerProfile()
  }

  async updateProfile(name?: string, gender?: string, birthdate?: string): Promise<CustomerModel> {
    const updateData: CustomerUpdateRequest = {}

    if (name) updateData.name = name
    if (gender) updateData.gender = gender as any
    if (birthdate) updateData.birthdate = birthdate

    return await this.apiService.updateCustomerProfile(updateData)
  }

  async deleteProfile(password: string) {
    if(!password) {
      throw new Error("A senha deve ser enviada");
    }

    return await this.apiService.deleteCustomerProfile(password);
  }
}
