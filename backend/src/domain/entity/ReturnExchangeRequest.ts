import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ReturnExchangeRequestStatus } from "../enums/ReturnExchangeRequestStatus";
import { ReturnExchangeType } from "../enums/ReturnExchangeRequestType";
import { EntityValidationException } from "../exceptions/EntityValidationException";
import { fromValue } from "../utils/fromValue";
import { Customer } from "./Customer";
import { StockBook } from "./StockBook";

@Entity()
export class ReturnExchangeRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ReturnExchangeRequestStatus })
    status: ReturnExchangeRequestStatus;

    @Column({ type: 'enum', enum: ReturnExchangeType })
    type: ReturnExchangeType;

    @Column('text')
    description: string;

    @ManyToOne(() => Customer)
    customer: Customer;

    @ManyToMany(() => StockBook)
    @JoinTable()
    items: StockBook[];

    constructor(
        type: string,
        status: string,
        items: StockBook[],
        description: string,
        customer: Customer
    ) {
        this.type = fromValue(ReturnExchangeType, type);
        this.status = fromValue(ReturnExchangeRequestStatus, status);
        this.items = items;
        this.description = description;
        this.customer = customer;
    }

    public setStatus(newStatus: ReturnExchangeRequestStatus) {
        this.validateStatusTransition(this.status, newStatus);
        this.status = newStatus;
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

    private validateStatusTransition(
        currentStatus: ReturnExchangeRequestStatus,
        newStatus: ReturnExchangeRequestStatus
    ): void {
        const validTransitions: Record<ReturnExchangeRequestStatus, ReturnExchangeRequestStatus[]> = {
            [ReturnExchangeRequestStatus.EXCHANGE_REQUESTED]: [
                ReturnExchangeRequestStatus.EXCHANGE_ACCEPTED,
                ReturnExchangeRequestStatus.EXCHANGE_REJECTED,
            ],
            [ReturnExchangeRequestStatus.EXCHANGE_ACCEPTED]: [
                ReturnExchangeRequestStatus.EXCHANGE_COMPLETED
            ],
            [ReturnExchangeRequestStatus.EXCHANGE_REJECTED]: [],
            [ReturnExchangeRequestStatus.EXCHANGE_COMPLETED]: [],
            
            [ReturnExchangeRequestStatus.RETURN_REQUESTED]: [
                ReturnExchangeRequestStatus.RETURN_REJECTED,
                ReturnExchangeRequestStatus.RETURN_COMPLETED
            ],
            [ReturnExchangeRequestStatus.RETURN_REJECTED]: [],
            [ReturnExchangeRequestStatus.RETURN_COMPLETED]: [],
        };

        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new EntityValidationException(
                `Transição de status inválida de ${currentStatus} para ${newStatus}`
            );
        }
    }
}