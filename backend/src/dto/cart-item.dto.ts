import { BookOutputDTO } from "./book.dto";

export class CartItemOutputDTO {
    public constructor(
        public status: string,
        public code: string,
        public supplier: string,
        public costs_value: number,
        public book_details: BookOutputDTO | null,
        public entry_date: Date,
        public id: number,
        public cart_item_id: number,
        public sale_date: Date | null = null,
        public unit_price: number | null = null,
    ) { }
}

export type AddCartItemInputDTO = {
    book_id: number;
    quantity: number;
    cart_id: number;
};