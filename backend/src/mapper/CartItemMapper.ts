
import { CartItem } from "../domain/entity/CartItem";
import { CartItemOutputDTO } from "../dto/cart-item.dto";
import { BookMapper } from "./BookMapper";

export class CartItemMapper {
  static entityToOutputDTO(cartItem: CartItem): CartItemOutputDTO {
    const stockBook = cartItem.stockBook;
    return new CartItemOutputDTO(
      stockBook.status,
      stockBook.code,
      stockBook.supplier,
      stockBook.costsValue,
      stockBook.book ? BookMapper.entityToOutputDTO(stockBook.book) : null,
      stockBook.entryDate,
      stockBook.id,
      cartItem.id,
      stockBook.saleDate,
      stockBook.getPrice(),
    );
  }
}
