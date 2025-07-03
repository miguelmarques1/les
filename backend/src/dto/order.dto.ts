import { StockBookOutputDTO } from "./stock-book.dto";
import { TransactionOutputDTO } from "./transaction.dto";

export class OrderOutputDTO {
    constructor(
        public readonly id: number,
        public readonly address: OrderAddressOutputDTO,
        public readonly status: string,
        public readonly items: StockBookOutputDTO[],
        public readonly transaction: TransactionOutputDTO,
    ) { }
}

export type OrderAddressOutputDTO = {
    alias: string,
    type: string,
    residence_type: string,
    street_type: string,
    street: string,
    number: string,
    district: string,
    zip_code: string,
    city: string,
    state: string,
    country: string,
    observations?: string,
};

export type CreateOrderInputDTO = {
    coupon_code?: string;
    card?: OrderCardInputDTO;
    card_id?: number;
    customer_id: number;
    address_id: number;
};

export type OrderCardInputDTO = {
    number: string;
    holderName: string;
    cvv: string;
    expiryDate: string;
    brandId: number;
}

export type UpdateOrderStatusInputDTO = {
    order_id: number;
    status: string;
};
