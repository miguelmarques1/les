import type { Gender } from "../enums/gender"

export class CustomerModel {
  id?: number
  name: string
  email: string
  document: string
  birthdate: Date
  gender: Gender
  ranking?: number
  code?: string
  phone?: PhoneModel

  constructor(
    name: string,
    email: string,
    document: string,
    birthdate: Date,
    gender: Gender,
    id?: number,
    ranking?: number,
    code?: string,
    phone?: PhoneModel,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.document = document
    this.birthdate = birthdate
    this.gender = gender
    this.ranking = ranking
    this.code = code
    this.phone = phone
  }

  static fromMap(map: any): CustomerModel {
    console.log(map)
    return new CustomerModel(
      map.name,
      map.email,
      map.document,
      new Date(map.birthdate),
      map.gender,
      map.id,
      map.ranking,
      map.code,
      map.phone ? PhoneModel.fromMap(map.phone) : undefined,
    )
  }

  toMap(): Record<string, any> {
    const map: Record<string, any> = {
      id: this.id,
      name: this.name,
      email: this.email,
      document: this.document,
      birthdate: this.birthdate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      gender: this.gender,
    }

    if (this.ranking !== undefined) map.ranking = this.ranking
    if (this.code) map.code = this.code
    if (this.phone) map.phone = this.phone.toMap()

    return map
  }
}

export class PhoneModel {
  type: string
  ddd: string
  number: string

  constructor(type: string, ddd: string, number: string) {
    this.type = type
    this.ddd = ddd
    this.number = number
  }

  static fromMap(map: any): PhoneModel {
    return new PhoneModel(map.type, map.ddd, map.number)
  }

  toMap(): Record<string, any> {
    return {
      type: this.type,
      ddd: this.ddd,
      number: this.number,
    }
  }
}

export interface CustomerRequest {
  name: string
  email: string
  password: string
  gender: Gender
  birthdate: string // YYYY-MM-DD
  document: string
  phone?: {
    type: string
    ddd: string
    number: string
  }
  billing_address?: AddressRequest
  delivery_address?: AddressRequest
}

export interface AddressRequest {
  alias: string
  type: string
  residence_type: string
  street_type: string
  street: string
  number: number | string
  district: string
  zip_code: string
  city: string
  state: string
  country: string
  observations?: string
}

export interface CustomerUpdateRequest {
  name?: string
  gender?: Gender
  birthdate?: string // YYYY-MM-DD
}
