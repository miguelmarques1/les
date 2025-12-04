import { Book } from "../domain/entity/Book"
import type { Category } from "../domain/entity/Category"
import type { PrecificationGroup } from "../domain/entity/PrecificationGroup"
import { type BookInputDTO, BookOutputDTO } from "../dto/book.dto"
import { CategoryMapper } from "./CategoryMapper"
import { PrecificationGroupMapper } from "./PrecificationGroupMapper"

export class BookMapper {
  static entityToOutputDTO(book: Book): BookOutputDTO {
    return new BookOutputDTO(
      book.id,
      book.author,
      book.categories.map((category: Category) => {
        return CategoryMapper.entityToOutputDTO(category)
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
      book.status,
    )
  }

  static inputDTOToEntity(input: BookInputDTO, categories: Category[], precificationGroup: PrecificationGroup): Book {
    return new Book(
      input.author,
      categories,
      input.year,
      input.title,
      input.publisher,
      precificationGroup,
      input.edition,
      input.pages,
      input.synopsis,
      input.height,
      input.width,
      input.weight,
      input.depth,
      input.isbn,
      input.status,
    )
  }
}
