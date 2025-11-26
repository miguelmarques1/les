import { DataSource, Or, QueryRunner, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Address } from "../domain/entity/Address";
import { Card } from "../domain/entity/Card";
import { Customer } from "../domain/entity/Customer";
import { Admin } from "../domain/entity/Admin";
import { Phone } from "../domain/entity/Phone";
import { Brand } from "../domain/entity/Brand";
import { Category } from "../domain/entity/Category";
import { Book } from "../domain/entity/Book";
import { StockBook } from "../domain/entity/StockBook";
import { PrecificationGroup } from "../domain/entity/PrecificationGroup";
import { Cart } from "../domain/entity/Cart";
import { CartItem } from "../domain/entity/CartItem";
import { Coupon } from "../domain/entity/Coupon";
import { Order } from "../domain/entity/Order";
import { Transaction } from "../domain/entity/Transaction";
import { ReturnExchangeRequest } from "../domain/entity/ReturnExchangeRequest";
import { DBTransaction } from "../repositories/DBTransaction";
import { OrderRepository } from "../repositories/OrderRepository";
import { BookRepository } from "../repositories/BookRepository";

export class RepositoryFactory {
  private dataSource: DataSource;
  private queryRunner: QueryRunner;

  constructor(dataSource: DataSource = AppDataSource) {
    this.dataSource = dataSource;
    this.queryRunner = dataSource.createQueryRunner();
  }

  private async startTransaction(): Promise<void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }
  private async commitTransaction(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  private async rollbackTransaction(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  createTransaction(): DBTransaction {
    return new DBTransaction(
      this.startTransaction.bind(this),
      this.commitTransaction.bind(this),
      this.rollbackTransaction.bind(this)
    );
  }

  getReturnExchangeRequestRepository(): Repository<ReturnExchangeRequest> {
    return this.dataSource.getRepository(ReturnExchangeRequest);
  }

  getOrderRepository(): Repository<Order> & typeof OrderRepository {
    return this.dataSource.getRepository(Order).extend(OrderRepository);
  }

  getTransactionRepository(): Repository<Transaction> {
    return this.dataSource.getRepository(Transaction);
  }

  getCouponRepository(): Repository<Coupon> {
    return this.dataSource.getRepository(Coupon);
  }

  getCartItemRepository(): Repository<CartItem> {
    return this.dataSource.getRepository(CartItem);
  }

  getCartRepository(): Repository<Cart> {
    return this.dataSource.getRepository(Cart);
  }

  getPrecificationGroupRepository(): Repository<PrecificationGroup> {
    return this.dataSource.getRepository(PrecificationGroup);
  }

  getStockBookRepository(): Repository<StockBook> {
    return this.dataSource.getRepository(StockBook);
  }

  getBookRepository(): Repository<Book> & typeof BookRepository {
    return this.dataSource.getRepository(Book).extend(BookRepository);
  }

  getCategoryRepository(): Repository<Category> {
    return this.dataSource.getRepository(Category);
  }

  getBrandRepository(): Repository<Brand> {
    return this.dataSource.getRepository(Brand);
  }

  getCardRepository(): Repository<Card> {
    return this.dataSource.getRepository(Card);
  }

  getAddressRepository(): Repository<Address> {
    return this.dataSource.getRepository(Address);
  }

  getPhoneRepository(): Repository<Phone> {
    return this.dataSource.getRepository(Phone);
  }

  getCustomerRepository(): Repository<Customer> {
    return this.dataSource.getRepository(Customer);
  }

  getAdminRepository(): Repository<Admin> {
    return this.dataSource.getRepository(Admin);
  }
}
