import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { StockBook } from "./StockBook";
import { Cart } from "./Cart";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    entryDate: Date;

    @ManyToOne(() => Cart, cart => cart.items)
    @JoinColumn({ name: 'cartId' })
    cart: Cart;

    @ManyToOne(() => StockBook)
    @JoinColumn({ name: 'stockBookId' })
    stockBook: StockBook;

    constructor(
        cart: Cart,
        stockBook: StockBook,
        entryDate?: Date,
        id?: number
    ) {
        if (entryDate) this.entryDate = entryDate;
        if (id) this.id = id;
        this.cart = cart;
        this.stockBook = stockBook;
    }
}