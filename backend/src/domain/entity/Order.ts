import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationId,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { OrderStatus } from "../enums/OrderStatus";
import { fromValue } from "../utils/fromValue";
import { Customer } from "./Customer";
import { Transaction } from "./Transaction";
import { StockBook } from "./StockBook";
import { EntityValidationException } from "../exceptions/EntityValidationException";
import { Address } from "./Address";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @ManyToOne(() => Customer)
  customer: Customer;

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @ManyToMany(() => StockBook)
  @JoinTable()
  items: StockBook[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Transaction, transaction => transaction.order)
  @JoinColumn()
  transaction: Transaction;

  @Column({ nullable: true, length: 100 })
  addressAlias: string | null;

  @Column({ type: 'varchar' })
  addressType: string;

  @Column({ type: 'varchar' })
  residenceType: string;

  @Column({ length: 255 })
  streetType: string;

  @Column({ length: 255 })
  street: string;

  @Column({ length: 20 })
  number: string;

  @Column({ length: 255 })
  district: string;

  @Column({ length: 9 })
  zipcode: string;

  @Column({ length: 255 })
  city: string;

  @Column({ length: 255 })
  state: string;

  @Column({ length: 255 })
  country: string;

  @Column({ nullable: true, type: 'text' })
  observations?: string | null;

  constructor(
    items: StockBook[],
    customer: Customer,
    address: Address,
    status: string = 'PROCESSING'
  ) {
    this.items = items;
    this.customer = customer;
    this.status = fromValue(OrderStatus, status);

    this.addressAlias = address?.alias;
    this.addressType = address?.type;
    this.residenceType = address?.residenceType;
    this.streetType = address?.streetType;
    this.street = address?.street;
    this.number = address?.number;
    this.district = address?.district;
    this.zipcode = address?.zipcode;
    this.city = address?.city;
    this.state = address?.state;
    this.country = address?.country;
    this.observations = address?.observations || null;
  }

  public addItem(item: StockBook) {
    this.items.push(item);
  }

  public addItems(items: StockBook[]) {
    this.items = [...this.items, ...items];
  }

  public removeItem(item: StockBook) {
    this.items = this.items.filter(i => i.id !== item.id);
  }

  public setStatus(newStatusStr: string) {
    const newStatus = fromValue(OrderStatus, newStatusStr);
    this.validateStatusTransition(this.status, newStatus);
    this.status = newStatus;
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PROCESSING]: [OrderStatus.APPROVED, OrderStatus.REJECTED, OrderStatus.CANCELED],
      [OrderStatus.APPROVED]: [OrderStatus.SHIPPING, OrderStatus.CANCELED],
      [OrderStatus.REJECTED]: [],
      [OrderStatus.CANCELED]: [],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.SHIPPING]: [OrderStatus.SHIPPED]
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new EntityValidationException(
        `Transição de status inválida de ${currentStatus} para ${newStatus}`
      );
    }
  }
}
