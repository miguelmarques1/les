import { CouponOutputDTO } from "./coupon.dto";

export class TransactionCardOutputDTO {
    constructor(
        public number: string,
        public holder_name: string,
        public expiry_date: string,
        public brand_id: number,
    ) { }
}

export class TransactionOutputDTO {
    constructor(
        public id: number,
        public amount: number,
        public card: TransactionCardOutputDTO,
        public date: Date,
        public coupon?: CouponOutputDTO,
    ) { }
}

export type UpdateTransactionInputDTO = {
    transaction_id: number,
    status: "APPROVED" | "DENIED",
    message: string,
}