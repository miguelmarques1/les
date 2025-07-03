import type { AddressType } from "../enums/address-type"
import type { ResidenceType } from "../enums/residence-type"
import type { AddressModel } from "../models/address-model"
import type { ApiService } from "./api-service"

export class AddressService {
  private apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  async getAddresses(): Promise<AddressModel[]> {
    return await this.apiService.getAddresses()
  }

  async createAddress(
    alias: string,
    type: AddressType,
    residenceType: ResidenceType,
    streetType: string,
    street: string,
    number: string | number,
    district: string,
    zipCode: string,
    city: string,
    state: string,
    country: string,
    complement?: string,
    observations?: string,
  ): Promise<AddressModel> {
    return await this.apiService.createAddress({
      alias,
      type,
      residence_type: residenceType,
      street_type: streetType,
      street,
      number,
      district,
      zip_code: zipCode,
      city,
      state,
      country,
      complement,
      observations,
    })
  }

  async updateAddress(
    id: number,
    alias: string,
    type: AddressType,
    residenceType: ResidenceType,
    streetType: string,
    street: string,
    number: string | number,
    district: string,
    zipCode: string,
    city: string,
    state: string,
    country: string,
    complement?: string,
    observations?: string,
  ): Promise<AddressModel> {
    return await this.apiService.updateAddress(id, {
      alias,
      type,
      residence_type: residenceType,
      street_type: streetType,
      street,
      number,
      district,
      zip_code: zipCode,
      city,
      state,
      country,
      complement,
      observations,
    })
  }

  async deleteAddress(id: number): Promise<void> {
    await this.apiService.deleteAddress(id)
  }
}
