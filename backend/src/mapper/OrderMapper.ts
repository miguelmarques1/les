import { Order } from "../domain/entity/Order";
import { OrderAddressOutputDTO, OrderOutputDTO } from "../dto/order.dto";
import { StockBookMapper } from "./StockBookMapper";
import { TransactionMapper } from "./TransactionMapper";

export class OrderMapper {
  static entityToOutputDTO(order: Order) {
    const items = order.items.map((item) => {
      const output = StockBookMapper.entityToOutputDTO(item)
      output.order_item_id = item.id;
      return output;
    });
    const orderAddr = OrderMapper.orderAddressDTO(order);

    return new OrderOutputDTO(
      order.id,
      orderAddr,
      order.status,
      items,
      TransactionMapper.entityToOutputDTO(order.transaction),
    )
  }

  private static orderAddressDTO(order: Order): OrderAddressOutputDTO {
    return {
      alias: order.addressAlias,
      type: order.addressType,
      residence_type: order.residenceType,
      street_type: order.streetType,
      street: order.street,
      number: order.number,
      district: order.district,
      zip_code: order.zipcode,
      city: order.city,
      state: order.state,
      country: order.country,
      observations: order.observations || null,
    }
  }
}
