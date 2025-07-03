export class CouponOutputDTO {
    constructor(
        public readonly id: number,
        public readonly code: string,
        public readonly discount: number,
        public readonly type: string,
        public readonly status: string,
        public readonly expiryDate: Date
    ) { }
}

export type CreateCouponInputDTO = {
    code: string;
    discount: number;
    type: string;     
    status: string;     
    expiryDate: Date;
};
