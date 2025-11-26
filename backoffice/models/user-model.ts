export interface UserData {
  id: number
  name: string
  email: string
  cpf: string
  phone: string
  birth_date: string
  gender: string
  created_at: string
  updated_at: string
}

export class UserModel {
  id: number
  name: string
  email: string
  cpf: string
  phone: string
  birthDate: Date
  gender: string
  createdAt: Date
  updatedAt: Date

  constructor(
    id: number,
    name: string,
    email: string,
    cpf: string,
    phone: string,
    birthDate: Date,
    gender: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.cpf = cpf
    this.phone = phone
    this.birthDate = birthDate
    this.gender = gender
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromMap(map: any): UserModel {
    return new UserModel(
      map.id,
      map.name,
      map.email,
      map.cpf,
      map.phone,
      new Date(map.birth_date),
      map.gender,
      new Date(map.created_at),
      new Date(map.updated_at),
    )
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      phone: this.phone,
      birth_date: this.birthDate.toISOString(),
      gender: this.gender,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    }
  }
}
