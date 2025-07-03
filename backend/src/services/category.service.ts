import { CategoryOutputDTO } from "../dto/category.dto";
import { Category } from "../domain/entity/Category";
import { CategoryMapper } from "../mapper/CategoryMapper";
import { BookCategoryOverviewOutputDTO } from "../dto/dashboard.dto";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { Repository } from "typeorm";
import { Book } from "../domain/entity/Book";

export interface CategoryServiceInterface {
  index(): Promise<CategoryOutputDTO[]>;
  overview(): Promise<BookCategoryOverviewOutputDTO[]>;
}

export class CategoryService implements CategoryServiceInterface {
  private categoryRepository: Repository<Category>;
  private bookRepository: Repository<Book>;

  constructor(repositoryFactory: RepositoryFactory) {
    this.categoryRepository = repositoryFactory.getCategoryRepository();
    this.bookRepository = repositoryFactory.getBookRepository();
  }

  private getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async overview(): Promise<BookCategoryOverviewOutputDTO[]> {
    const categories = await this.categoryRepository.find({
      relations: {
        books: true,
      }
    });

    const booksCount = await this.bookRepository.count();

    const output: BookCategoryOverviewOutputDTO[] = [];

    for (let category of categories) {
      const categoryBookCount = category.books.length;
      const percentage = booksCount > 0 ? categoryBookCount / booksCount : 0;

      const dto = new BookCategoryOverviewOutputDTO(
        category.id.toString(),
        category.name,
        percentage * 100,
        categoryBookCount,
        this.getRandomColor()
      );

      output.push(dto);
    }

    return output;
  }


  public async index(): Promise<CategoryOutputDTO[]> {
    const categories = await this.categoryRepository.find();

    const output = [];
    categories.forEach(category => {
      const dto = CategoryMapper.entityToOutputDTO(category);
      output.push(dto);
    });

    return output;
  }
}
