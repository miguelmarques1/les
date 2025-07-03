import { Card } from "../domain/entity/Card";
import { CardOutputDTO } from "../dto/card.dto";

export class CardMapper {
  static entityToOutputDTO(card: Card): CardOutputDTO {
    const maskedNumber = "************" + card.number.slice(-4);
    return new CardOutputDTO(
      card.id!,
      maskedNumber,
      card.holderName,
      card.expiryDate,
      card.brand.id,
      card.customer.id,
    );
  }
}
