import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Coupon } from "./Coupon"
import { Order } from "./Order"
import { CardPayment } from "./CardPayment"

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number

  @Column()
  date: Date

  @ManyToOne(
    () => Order,
    (order) => order.transaction,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @ManyToOne(() => Coupon, { nullable: true })
  @JoinColumn({ name: "coupon_id" })
  coupon: Coupon | null

  @OneToMany(
    () => CardPayment,
    (cardPayment) => cardPayment.transaction,
    {
      cascade: true,
    },
  )
  cardPayments: CardPayment[]

  constructor(amount: number, order: Order, coupon: Coupon | null, date?: Date) {
    this.amount = amount
    this.order = order
    this.coupon = coupon || null
    this.date = date || new Date()
  }
}
