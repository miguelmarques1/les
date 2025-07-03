import { BookOutputDTO } from "./book.dto";
import { CategoryOutputDTO } from "./category.dto";
import { PrecificationGroupOutputDTO } from "./precification-group.dto";

export class StockBookOutputDTO {
    public constructor(
        public status: string,
        public code: string,
        public supplier: string,
        public costs_value: number,
        public book_details: BookOutputDTO | null,
        public entry_date: Date,
        public id: number,
        public sale_date: Date | null = null,
        public unit_price: number | null = null,
        public order_item_id?: number,
    ) { }
}

export class BookDetailsOutputDTO {
    public constructor(
        public id: number | null,
        public author: string,
        public categories: CategoryOutputDTO[],
        public year: number,
        public title: string,
        public publisher: string,
        public precification_group: PrecificationGroupOutputDTO,
        public edition: number,
        public pages: number,
        public synopsis: string,
        public height: number,
        public width: number,
        public weight: number,
        public depth: number,
        public isbn: string,
        public status: string,
        public price: number,
        public stock_count: number,
    ) { }
}

export type StockEntryInputDTO = {
    book_id: number;
    supplier: string;
    quantity: number;
    costs_value: number;
};