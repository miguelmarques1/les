import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { CartItem } from "./CartItem";
import { Customer } from "./Customer";
import { DefaultFreightCalculator } from "../services/DefaultFreightCalculator";
import { FreightCalculator } from "../services/FreightCalculator";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => CartItem, item => item.cart, { cascade: true })
    items: CartItem[];

    @OneToOne(() => Customer, customer => customer.cart)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    constructor(items?: CartItem[], customer?: Customer) {
        this.items = items;
        if (customer) this.customer = customer;
    }

    public addItem(item: CartItem): void {
        this.items.push(item);
    }

    public addItems(items: CartItem[]): void {
        this.items.push(...items);
    }

    public removeItem(item: CartItem): void {
        this.items = this.items.filter(i => i !== item);
    }

    public getFreight(freightCalculator: FreightCalculator = new DefaultFreightCalculator()): number {
        return this.items.reduce((freight, item) => {
            return freight + freightCalculator.calculate(item.stockBook.book);
        }, 0);
    }

    public getTotal(): number {
        let total = 0;
        for(let item of this.items) {
            total += Number(item.stockBook.getPrice());
        }

        return total;
    }
}