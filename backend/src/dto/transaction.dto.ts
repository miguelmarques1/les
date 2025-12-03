import type { CouponOutputDTO } from "./coupon.dto"

export class CardPaymentOutputDTO {
  constructor(
    public id: number,
    public amount: number,
    public card: TransactionCardOutputDTO,
  ) {}
}

export class TransactionCardOutputDTO {
  constructor(
    public number: string,
    public holder_name: string,
    public expiry_date: string,
    public brand: string,
  ) {}
}

export class TransactionOutputDTO {
  constructor(
    public id: number,
    public amount: number,
    public card_payments: CardPaymentOutputDTO[],
    public date: Date,
    public coupon?: CouponOutputDTO,
  ) {}
}

export type UpdateTransactionInputDTO = {
  transaction_id: number
  status: "APPROVED" | "DENIED"
  message: string
}
