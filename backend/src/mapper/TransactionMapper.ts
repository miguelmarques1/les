import type { Transaction } from "../domain/entity/Transaction"
import type { Coupon } from "../domain/entity/Coupon"
import { CouponMapper } from "./CouponMapper"
import { TransactionOutputDTO, TransactionCardOutputDTO, CardPaymentOutputDTO } from "../dto/transaction.dto"
import type { CardPayment } from "../domain/entity/CardPayment"

export class TransactionMapper {
  static entityToOutputDTO(transaction: Transaction): TransactionOutputDTO {
    const cardPayments = transaction.cardPayments?.map((cp) => TransactionMapper.cardPaymentToDTO(cp)) || []

    return new TransactionOutputDTO(
      transaction.id,
      transaction.amount,
      cardPayments,
      transaction.date,
      transaction.coupon ? CouponMapper.entityToOutputDTO(transaction.coupon as Coupon) : undefined,
    )
  }

  private static cardPaymentToDTO(cardPayment: CardPayment): CardPaymentOutputDTO {
    const maskedNumber = "************" + cardPayment.cardNumber.slice(-4)
    const cardDTO = new TransactionCardOutputDTO(
      maskedNumber,
      cardPayment.cardHolderName,
      cardPayment.cardExpiryDate,
      cardPayment.cardBrand,
    )

    return new CardPaymentOutputDTO(cardPayment.id, cardPayment.amount, cardDTO)
  }
}
