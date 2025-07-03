import { Transaction } from "../domain/entity/Transaction";
import { Coupon } from "../domain/entity/Coupon";
import { CouponMapper } from "./CouponMapper";
import { TransactionOutputDTO, TransactionCardOutputDTO } from "../dto/transaction.dto";

export class TransactionMapper {
  static entityToOutputDTO(transaction: Transaction): TransactionOutputDTO {
    const cardDTO = this.parseCard(transaction);

    return new TransactionOutputDTO(
      transaction.id,
      transaction.amount,
      cardDTO,
      transaction.date,
      transaction.coupon ? CouponMapper.entityToOutputDTO(transaction.coupon as Coupon) : undefined,
    );
  }

  private static parseCard(transaction: Transaction): TransactionCardOutputDTO {
    const maskedNumber = "************" + transaction.cardNumber.slice(-4);
    return new TransactionCardOutputDTO(
      maskedNumber,
      transaction.cardHolderName,
      transaction.cardExpiryDate,
      0,
    );
  }
}
