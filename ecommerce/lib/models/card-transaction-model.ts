export class CardTransactionModel {
  id: number
  holderName: string
  lastFourDigits: string

  constructor(id: number, holderName: string, lastFourDigits: string) {
    this.id = id
    this.holderName = holderName
    this.lastFourDigits = lastFourDigits
  }

  static fromMap(map: any): CardTransactionModel {
    return new CardTransactionModel(map.id, map.holder_name, map.last_four_digits)
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      holder_name: this.holderName,
      last_four_digits: this.lastFourDigits,
    }
  }
}
