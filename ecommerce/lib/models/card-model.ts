export class CardModel {
  id?: number
  number: string
  holderName: string
  expiryDate: string
  brandId: number
  cvv?: string
  lastFourDigits?: string

  constructor(
    number: string,
    holderName: string,
    expiryDate: string,
    brandId: number,
    id?: number,
    cvv?: string,
    lastFourDigits?: string,
  ) {
    this.id = id
    this.number = number
    this.holderName = holderName
    this.expiryDate = expiryDate
    this.brandId = brandId
    this.cvv = cvv
    this.lastFourDigits = lastFourDigits || number.slice(-4)
  }

  static fromMap(map: any): CardModel {
    return new CardModel(
      map.number,
      map.holder_name,
      map.expiry_date,
      map.brand_id,
      map.id,
      map.cvv,
      map.last_four_digits,
    )
  }

  toMap(): Record<string, any> {
    const map: Record<string, any> = {
      id: this.id,
      number: this.number,
      holder_name: this.holderName,
      expiry_date: this.expiryDate,
      brand_id: this.brandId,
    }

    if (this.cvv) {
      map.cvv = this.cvv
    }

    if (this.lastFourDigits) {
      map.last_four_digits = this.lastFourDigits
    }

    return map
  }
}

export interface CardRequest {
  number: string
  holder_name: string
  expiry_date: string
  brand_id: number
  cvv: string
}
