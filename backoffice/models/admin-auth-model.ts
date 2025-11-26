export interface AdminAuthRequest {
  email: string
  password: string
}

export interface AdminAuthData {
  access_token: string
}

export class AdminAuthModel {
  accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  static fromMap(map: any): AdminAuthModel {
    return new AdminAuthModel(map.access_token)
  }

  toMap(): Record<string, any> {
    return {
      access_token: this.accessToken,
    }
  }
}
