import { StockBookOutputDTO } from "./stock-book.dto";

export class ReturnExchangeRequestOutputDTO {
  constructor(
    public id: number,
    public description: string,
    public customer_id: number,
    public status: string,
    public items: StockBookOutputDTO[],
  ) {}
}

export type CreateReturnExchangeRequestInputDTO = {
  customer_id: number;
  description: string;
  order_item_ids: number[];
  type: 'return' | 'exchange';
};
