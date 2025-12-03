export class TransactionModel {
  id?: number
  amount: number
  cardPayments: CardPaymentModel[]
  date: Date

  constructor(amount: number, cardPayments: CardPaymentModel[], date: Date, id?: number) {
    this.id = id
    this.amount = amount
    this.cardPayments = cardPayments
    this.date = date
  }

  static fromMap(map: any): TransactionModel {
    return new TransactionModel(
      Number(map.amount),
      map.card_payments ? map.card_payments.map((cp: any) => CardPaymentModel.fromMap(cp)) : [],
      new Date(map.date),
      map.id,
    )
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      amount: this.amount,
      card_payments: this.cardPayments.map((cp) => cp.toMap()),
      date: this.date.toISOString(),
    }
  }

  getTotalAmount(): number {
    return this.cardPayments.reduce((sum, cp) => sum + cp.amount, 0)
  }
}

export class CardPaymentModel {
  id?: number
  amount: number
  card: TransactionCardModel

  constructor(amount: number, card: TransactionCardModel, id?: number) {
    this.id = id
    this.amount = amount
    this.card = card
  }

  static fromMap(map: any): CardPaymentModel {
    return new CardPaymentModel(Number(map.amount), TransactionCardModel.fromMap(map.card), map.id)
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      amount: this.amount,
      card: this.card.toMap(),
    }
  }
}

export class TransactionCardModel {
  number: string
  holderName: string
  expiryDate: string
  brand: string

  constructor(number: string, holderName: string, expiryDate: string, brand: string) {
    this.number = number
    this.holderName = holderName
    this.expiryDate = expiryDate
    this.brand = brand
  }

  static fromMap(map: any): TransactionCardModel {
    return new TransactionCardModel(map.number, map.holder_name, map.expiry_date, map.brand)
  }

  toMap(): Record<string, any> {
    return {
      number: this.number,
      holder_name: this.holderName,
      expiry_date: this.expiryDate,
      brand: this.brand,
    }
  }

  getLastFourDigits(): string {
    return this.number.slice(-4)
  }

  getBrandName(): string {
    return this.brand || "Cartão"
  }
}
