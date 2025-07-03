import { BookOutputDTO } from "../dto/book.dto";
import { BookState } from "../domain/enums/BookState";
import { BookMapper } from "../mapper/BookMapper";
import { In, Repository } from "typeorm";
import { Book } from "../domain/entity/Book";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { StockBook } from "../domain/entity/StockBook";
import { BookRepository } from "../repositories/BookRepository";

export interface BookServiceInterface {
  index(query?: string, status?: BookState): Promise<BookOutputDTO[]>;
  show(bookId: number): Promise<BookOutputDTO>;
  lowStockCount(): Promise<number>;
  itemsCount(): Promise<number>;
  getByIds(ids: number[]): Promise<BookOutputDTO[]>;
  getCustomerInterest(customerId: number): Promise<BookOutputDTO[]>;
  getBooksByCategory(categoryId: number): Promise<BookOutputDTO[]>;
}

export class BookService implements BookServiceInterface {
  private bookRepository: Repository<Book> & typeof BookRepository;

  constructor(repositoryFactory: RepositoryFactory) {
    this.bookRepository = repositoryFactory.getBookRepository();
  }

  public async getByIds(ids: number[]): Promise<BookOutputDTO[]> {
    const books = await this.bookRepository.find({
      where: {
        id: In(ids),
      },
      relations: {
        precificationGroup: true,
        categories: true,
      }
    });
    return books.map(book => BookMapper.entityToOutputDTO(book));
  }

  public async getCustomerInterest(customerId: number): Promise<BookOutputDTO[]> {
    const books = await this.bookRepository.findUserInterestBooks(customerId);
    return books.map(book => BookMapper.entityToOutputDTO(book));
  }

  public async getBooksByCategory(categoryId: number): Promise<BookOutputDTO[]> {
    const books = await this.bookRepository.find({
      where: {
        categories: {
          id: categoryId,
        }
      },
      relations: {
        precificationGroup: true,
        categories: true,
        stockBooks: true
      }
    });
    return books.map(book => BookMapper.entityToOutputDTO(book));
  }

  public async lowStockCount(): Promise<number> {
    const lowStockCount = await this.bookRepository.find({
      relations: {
        stockBooks: true,
      },
    });
    const lowStockBooks = lowStockCount.filter((book) => book.stockBooks.length < 5);
    return lowStockBooks.length;
  }

  public async itemsCount(): Promise<number> {
    return await this.bookRepository.count();
  }

  public async show(bookId: number): Promise<BookOutputDTO> {
    console.log(bookId);
    const book = await this.bookRepository.findOne({
      where: {
        id: bookId,
      },
      relations: {
        precificationGroup: true,
        categories: true,
      }
    });

    console.log(book);
    return BookMapper.entityToOutputDTO(book);
  }

  public async index(query?: string, status?: BookState): Promise<BookOutputDTO[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.precificationGroup', 'precificationGroup')
      .leftJoinAndSelect('book.categories', 'categories')
      .leftJoinAndSelect('book.stockBooks', 'stockBooks');

    if (query) {
      queryBuilder.where(
        '(book.title LIKE :query OR book.author LIKE :query OR book.publisher LIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('book.status = :status', { status });
    }

    const books = await queryBuilder.getMany();

    return books.map(book => BookMapper.entityToOutputDTO(book));
  }
}
