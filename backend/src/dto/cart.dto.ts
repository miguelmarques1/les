import { StockBookOutputDTO } from "./stock-book.dto";

export class CartOutputDTO {
    public constructor(
        public id: number,
        public items: StockBookOutputDTO[],
        public total: number,
        public freight_value: number,
    ) { }
}

export type AddToCartInputDTO = {
    book_id: number;
    quantity: number;
    customer_id: number;
};