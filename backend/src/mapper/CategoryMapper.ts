import { Category } from "../domain/entity/Category";
import { CategoryOutputDTO } from "../dto/category.dto";

export class CategoryMapper {
  static entityToOutputDTO(category: Category): CategoryOutputDTO {
    return new CategoryOutputDTO(
      category.id,
      category.name,
    );
  }
}