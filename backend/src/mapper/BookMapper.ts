import { Book } from "../domain/entity/Book";
import { Category } from "../domain/entity/Category";
import { BookOutputDTO } from "../dto/book.dto";
import { CategoryMapper } from "./CategoryMapper";
import { PrecificationGroupMapper } from "./PrecificationGroupMapper";

export class BookMapper {
    static entityToOutputDTO(book: Book): BookOutputDTO {
        return new BookOutputDTO(
            book.id,
            book.author,
            book.categories.map((category: Category) => {
                return CategoryMapper.entityToOutputDTO(category);
            }),
            book.year,
            book.title,
            book.publisher,
            PrecificationGroupMapper.entityToOutputDTO(book.precificationGroup),
            book.edition,
            book.pages,
            book.synopsis,
            book.height,
            book.width,
            book.weight,
            book.depth,
            book.isbn.value,
            book.status
        );
    }
}