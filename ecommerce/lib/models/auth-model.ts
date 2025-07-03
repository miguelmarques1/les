export class AuthModel {
  accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  static fromMap(map: any): AuthModel {
    return new AuthModel(map.access_token)
  }

  toMap(): Record<string, any> {
    return {
      accessToken: this.accessToken,
    }
  }
}

export interface LoginRequest {
  email: string
  password: string
}
