import type { AddressType } from "../enums/address-type"
import type { ResidenceType } from "../enums/residence-type"

export class AddressModel {
  id?: number
  alias: string
  type: AddressType
  residenceType: ResidenceType
  streetType: string
  street: string
  number: string
  complement?: string
  district: string
  zipCode: string
  city: string
  state: string
  country: string
  observations?: string

  constructor(
    alias: string,
    type: AddressType,
    residenceType: ResidenceType,
    streetType: string,
    street: string,
    number: string,
    district: string,
    zipCode: string,
    city: string,
    state: string,
    country: string,
    id?: number,
    complement?: string,
    observations?: string,
  ) {
    this.id = id
    this.alias = alias
    this.type = type
    this.residenceType = residenceType
    this.streetType = streetType
    this.street = street
    this.number = number
    this.complement = complement
    this.district = district
    this.zipCode = zipCode
    this.city = city
    this.state = state
    this.country = country
    this.observations = observations
  }

  static fromMap(map: any): AddressModel {
    return new AddressModel(
      map.alias,
      map.type,
      map.residence_type,
      map.street_type,
      map.street,
      map.number.toString(),
      map.district,
      map.zip_code,
      map.city,
      map.state,
      map.country,
      map.id,
      map.complement,
      map.observations,
    )
  }

  toMap(): Record<string, any> {
    const map: Record<string, any> = {
      id: this.id,
      alias: this.alias,
      type: this.type,
      residence_type: this.residenceType,
      street_type: this.streetType,
      street: this.street,
      number: this.number,
      district: this.district,
      zip_code: this.zipCode,
      city: this.city,
      state: this.state,
      country: this.country,
    }

    if (this.complement) map.complement = this.complement
    if (this.observations) map.observations = this.observations

    return map
  }
}

export interface AddressRequest {
  alias: string
  type: AddressType
  residence_type: ResidenceType
  street_type: string
  street: string
  number: number | string
  district: string
  zip_code: string
  city: string
  state: string
  country: string
  complement?: string
  observations?: string
}
