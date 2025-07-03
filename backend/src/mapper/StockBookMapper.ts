import { StockBook } from "../domain/entity/StockBook";
import { StockBookOutputDTO } from "../dto/stock-book.dto";
import { BookMapper } from "./BookMapper";

export class StockBookMapper {
    static entityToOutputDTO(stockBook: StockBook): StockBookOutputDTO {
        return new StockBookOutputDTO(
            stockBook.status,
            stockBook.code,
            stockBook.supplier,
            stockBook.costsValue,
            stockBook.book ? BookMapper.entityToOutputDTO(stockBook.book) : null,
            stockBook.entryDate,
            stockBook.id,
            stockBook.saleDate,
            stockBook.getPrice(),
        );
    }
}