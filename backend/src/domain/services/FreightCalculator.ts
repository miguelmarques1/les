import { Book } from "../entity/Book";

export interface FreightCalculator {
    calculate(book: Book): number;
}