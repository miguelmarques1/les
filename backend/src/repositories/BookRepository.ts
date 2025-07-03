import { Repository } from "typeorm";
import { Book } from "../domain/entity/Book";
import { Category } from "../domain/entity/Category";

export const BookRepository = {
  async findUserInterestBooks(this: Repository<Book>, userId: number): Promise<Book[]> {
    const books = await this.createQueryBuilder("book")
      .innerJoinAndSelect("book.precificationGroup", "precificationGroup")
      .innerJoin("book.stockBooks", "stockBook")
      .leftJoin("stockBook.book", "stockBookBook")
      .where(qb => {
        const subQueryOrder = qb.subQuery()
          .select("stockBookOrder.id")
          .from("order_items_stock_book", "orderStock")
          .innerJoin("order", "order", "order.id = orderStock.orderId")
          .innerJoin("stock_book", "stockBookOrder", "stockBookOrder.id = orderStock.stockBookId")
          .where("order.customerId = :userId")
          .getQuery();

        const subQueryCart = qb.subQuery()
          .select("cartStock.id")
          .from("cart_item", "cartItem")
          .innerJoin("cart", "cart", "cart.id = cartItem.cartId")
          .innerJoin("stock_book", "cartStock", "cartStock.id = cartItem.stockBookId")
          .where("cart.customer_id = :userId")
          .getQuery();

        return `stockBook.id IN ${subQueryOrder} OR stockBook.id IN ${subQueryCart}`;
      })
      .setParameter("userId", userId)
      .getMany();

    for (const book of books) {
      const categories = await this.createQueryBuilder("book")
        .relation(Book, "categories")
        .of(book)
        .loadMany<Category>();
      book.categories = categories;
    }

    return books;
  }
}
