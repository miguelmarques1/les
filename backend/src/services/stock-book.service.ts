import { BookDetailsOutputDTO, type StockBookOutputDTO, type StockEntryInputDTO } from "../dto/stock-book.dto"
import { BookState } from "../domain/enums/BookState"
import { StockBook } from "../domain/entity/StockBook"
import { StockBookStatus } from "../domain/enums/StockBookStatus"
import { StockBookMapper } from "../mapper/StockBookMapper"
import { Repository } from "typeorm"
import { Book } from "../domain/entity/Book"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { BookRepository } from "../repositories/BookRepository"
import { NotFoundException } from "../exceptions/NotFoundException"
import { PrecificationGroupMapper } from "../mapper/PrecificationGroupMapper"

export interface StockBookServiceInterface {
  index(query?: string): Promise<BookDetailsOutputDTO[]>
  show(bookId: number): Promise<BookDetailsOutputDTO>
  store(input: StockEntryInputDTO): Promise<void>
  find(id: number): Promise<StockBook>
  findQuantity(bookId: number, quantity: number): Promise<StockBookOutputDTO[]>
  update(stockBookId: number, status: StockBookStatus): Promise<StockBookOutputDTO>
}

export class StockBookService implements StockBookServiceInterface {
  private bookRepository: Repository<Book> & typeof BookRepository
  private stockBookRepository: Repository<StockBook>

  constructor(repositoryFactory: RepositoryFactory) {
    this.stockBookRepository = repositoryFactory.getStockBookRepository()
    this.bookRepository = repositoryFactory.getBookRepository()
  }

  public async update(stockBookId: number, status: StockBookStatus): Promise<StockBookOutputDTO> {
    const stockBook = await this.stockBookRepository.findOne({
      where: {
        id: stockBookId,
      }
    });
    stockBook.status = status;
    stockBook.saleDate = status === StockBookStatus.SOLD ? new Date() : null;
    const result = await this.stockBookRepository.save(stockBook);

    return StockBookMapper.entityToOutputDTO(result)
  }

  public async findQuantity(bookId: number, quantity: number): Promise<StockBookOutputDTO[]> {
    const stockBooks = await this.stockBookRepository.find({
      take: quantity,
      where: {
        book: {
          id: bookId,
        }
      },
      relations: {
        book: true,
      }
    })
    if (stockBooks.length < quantity) {
      throw new NotFoundException("Sem estoque")
    }

    const output = stockBooks.map(StockBookMapper.entityToOutputDTO)

    return output
  }

  public async find(id: number): Promise<StockBook> {
    const stockBook = await this.stockBookRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        book: {
          categories: true,
          precificationGroup: true,
          stockBooks: false,
        },
      }
    })

    return stockBook
  }

  public async show(bookId: number): Promise<BookDetailsOutputDTO> {
    const book = await this.bookRepository.findOne({
      where: {
        id: bookId,
      },
      relations: {
        precificationGroup: true,
        categories: true,
        stockBooks: true,
      }
    })

    return this.bookToBookDetailsOutputDTO(book)
  }

  public async store(input: StockEntryInputDTO): Promise<void> {
    const book = await this.bookRepository.findOne({
      where: {
        id: input.book_id,
      }
    })
    for (let i = 0; i < input.quantity; i++) {
      const stockBook = new StockBook(new Date(), input.supplier, input.costs_value, book, StockBookStatus.AVAILABLE)

      await this.stockBookRepository.save(stockBook)
    }

    return
  }

  public async index(query?: string): Promise<BookDetailsOutputDTO[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book')
      .innerJoinAndSelect('book.precificationGroup', 'precificationGroup')
      .innerJoinAndSelect('book.categories', 'categories')
      .leftJoinAndSelect('book.stockBooks', 'stockBooks')
      .where('book.status = :status', { status: BookState.ACTIVE });

    if (query) {
      queryBuilder.andWhere(
        '(book.title LIKE :query OR book.author LIKE :query OR book.publisher LIKE :query)',
        { query: `%${query}%` }
      );
    }

    const books = await queryBuilder.getMany();

    return books.map(book => {
      return this.bookToBookDetailsOutputDTO(book);
    });
  }


  private bookToBookDetailsOutputDTO(book: Book): BookDetailsOutputDTO {
    const stockCount = book.stockBooks.length;
    const highestCost = Number(book.stockBooks.reduce((max, sb) => {
      const cost = sb.costsValue;
      return cost > max ? cost : max;
    }, 0));

    const profit = Number(book.precificationGroup.profitPercentage);
    const bookPrice = highestCost + (highestCost * (profit / 100));
    const dto = new BookDetailsOutputDTO(
      book.id,
      book.author,
      book.categories,
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
      bookPrice,
      stockCount,
    );

    return dto
  }
}
