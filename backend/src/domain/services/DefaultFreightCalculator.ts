import { Book } from "../entity/Book";
import { FreightCalculator } from "./FreightCalculator";

export class DefaultFreightCalculator implements FreightCalculator {
    private static readonly MIN_FREIGHT_COST = 10;

    calculate(book: Book): number {
        const volume = (book.height * book.width * book.depth) / 100; 
        const freight = volume * book.weight * 0.1; 

        return Math.max(freight, DefaultFreightCalculator.MIN_FREIGHT_COST);
    }
}
