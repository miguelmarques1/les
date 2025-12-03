import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Transaction } from "./Transaction"
import type { Card } from "./Card"

@Entity()
export class CardPayment {
  @PrimaryGeneratedColumn()
  id: number

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number

  @Column()
  cardHolderName: string

  @Column()
  cardBrand: string

  @Column()
  cardNumber: string

  @Column({ length: 4 })
  cardCVV: string

  @Column()
  cardExpiryDate: string

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.cardPayments,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "transaction_id" })
  transaction: Transaction

  constructor(amount: number, card: Card, transaction?: Transaction) {
    this.amount = amount
    this.cardHolderName = card?.holderName
    this.cardBrand = card?.brand?.name
    this.cardNumber = card?.number
    this.cardCVV = card?.cvv
    this.cardExpiryDate = card?.expiryDate
    this.transaction = transaction
  }
}
