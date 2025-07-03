import { Cart } from "../domain/entity/Cart";
import { CartOutputDTO } from "../dto/cart.dto";
import { CartItemMapper } from "./CartItemMapper";
import { StockBookMapper } from "./StockBookMapper";

export class CartMapper {
  static entityToOutputDTO(cart: Cart) {
    const cartItems = cart.items.map((item) => CartItemMapper.entityToOutputDTO(item));
    return new CartOutputDTO(
      cart.id,
      cartItems,
      cart.getTotal(),
      cart.getFreight(),
    );
  }
}
