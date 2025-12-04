import { ReturnExchangeRequest } from "../domain/entity/ReturnExchangeRequest";
import { ReturnExchangeRequestOutputDTO } from "../dto/return-exchange-request.dto";
import { StockBookMapper } from "./StockBookMapper";

export class ReturnExchangeRequestMapper {

  static entityToOutputDTO(
    entity: ReturnExchangeRequest
  ): ReturnExchangeRequestOutputDTO {
    const items = entity.items.map(StockBookMapper.entityToOutputDTO);
    return new ReturnExchangeRequestOutputDTO(
      entity.id,
      entity.description,
      entity.customer.id,
      entity.status,
      items,
    );
  }
}
