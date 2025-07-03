import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Coupon } from "./Coupon";
import { Order } from "./Order";
import { Card } from "./Card";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    date: Date;

    @Column()
    cardHolderName: string;

    @Column()
    cardBrand: string;

    @Column()
    cardNumber: string;

    @Column({scale: 3})
    cardCVV: string

    @Column()
    cardExpiryDate: string

    @ManyToOne(() => Order, order => order.transaction, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Coupon, { nullable: true })
    @JoinColumn({ name: 'coupon_id' })
    coupon: Coupon | null;

    constructor(
        amount: number,
        order: Order,
        card: Card,
        coupon: Coupon | null,
        date?: Date
    ) {
        this.amount = amount;
        this.order = order;
        this.cardHolderName = card?.holderName;
        this.cardBrand = card?.brand?.name;
        this.cardNumber = card?.number;
        this.cardCVV = card?.cvv;
        this.cardExpiryDate = card?.expiryDate
        this.coupon = coupon || null;
        this.date = date || new Date();
    }
}
