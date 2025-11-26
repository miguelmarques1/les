import { CategoryOutputDTO } from "../dto/category.dto";
import { Category } from "../domain/entity/Category";
import { CategoryMapper } from "../mapper/CategoryMapper";
import { BookCategoryOverviewOutputDTO } from "../dto/dashboard.dto";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { Repository } from "typeorm";
import { Book } from "../domain/entity/Book";
import { StockBook } from "../domain/entity/StockBook";

export interface CategoryServiceInterface {
  index(): Promise<CategoryOutputDTO[]>;
  overview(startDate?: Date, endDate?: Date): Promise<BookCategoryOverviewOutputDTO[]>;
}

export class CategoryService implements CategoryServiceInterface {
  private categoryRepository: Repository<Category>;
  private bookRepository: Repository<Book>;
  private stockBookRepository: Repository<StockBook>;

  constructor(repositoryFactory: RepositoryFactory) {
    this.categoryRepository = repositoryFactory.getCategoryRepository();
    this.bookRepository = repositoryFactory.getBookRepository();
    this.stockBookRepository = repositoryFactory.getStockBookRepository();
  }

  private getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async overview(startDate?: Date, endDate?: Date): Promise<BookCategoryOverviewOutputDTO[]> {
    const categories = await this.categoryRepository.find({
      relations: {
        books: true,
      }
    });

    let query = this.stockBookRepository.createQueryBuilder("stockBook")
      .where("stockBook.status = :status", { status: "SOLD" });

    if (startDate) {
      query = query.andWhere("stockBook.saleDate >= :startDate", { startDate });
    }

    if (endDate) {
      query = query.andWhere("stockBook.saleDate <= :endDate", { endDate });
    }

    const soldBooksCount = await query.getCount();

    const output: BookCategoryOverviewOutputDTO[] = [];

    for (let category of categories) {
      // Count sold books by category within the date range
      let categoryQuery = this.stockBookRepository.createQueryBuilder("stockBook")
        .innerJoinAndSelect("stockBook.book", "book")
        .innerJoinAndSelect("book.categories", "categories")
        .where("stockBook.status = :status", { status: "SOLD" })
        .andWhere("categories.id = :categoryId", { categoryId: category.id });

      if (startDate) {
        categoryQuery = categoryQuery.andWhere("stockBook.saleDate >= :startDate", { startDate });
      }

      if (endDate) {
        categoryQuery = categoryQuery.andWhere("stockBook.saleDate <= :endDate", { endDate });
      }

      const categoryBookCount = await categoryQuery.getCount();
      const percentage = soldBooksCount > 0 ? categoryBookCount / soldBooksCount : 0;

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
