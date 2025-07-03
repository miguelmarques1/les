import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { StockBookStatus } from "../enums/StockBookStatus";
import { fromValue } from "../utils/fromValue";
import { CodeGenerator } from "../services/CodeGenerator";
import { DefaultValidation } from "../validation/DefaultValidation";
import { EntityValidationException } from "../exceptions/EntityValidationException";
import { Book } from "./Book";

@Entity()
export class StockBook {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column()
    entryDate: Date;

    @Column()
    supplier: string;

    @Column('decimal', { precision: 10, scale: 2 })
    costsValue: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    higherCostsValue: number | null;

    @Column({ type: 'enum', enum: StockBookStatus, default: StockBookStatus.AVAILABLE })
    status: StockBookStatus;

    @Column({ nullable: true })
    saleDate: Date | null;

    @ManyToOne(() => Book, { eager: true })
    @JoinColumn({ name: 'book_id' })
    book: Book;

    constructor(
        entryDate: Date,
        supplier: string,
        costsValue: number,
        book: Book,
        status?: string,
        higherCostsValue?: number,
        saleDate?: Date,
        code?: string
    ) {
        this.entryDate = entryDate;
        this.supplier = supplier;
        this.costsValue = costsValue;
        this.book = book;
        this.status = status ? fromValue(StockBookStatus, status) : StockBookStatus.AVAILABLE;
        this.higherCostsValue = higherCostsValue || null;
        this.saleDate = saleDate || null;
        this.code = code || CodeGenerator.generate("BOK");
    }

    public sold() {
        this.status = StockBookStatus.SOLD;
        this.saleDate = new Date();
    }

    public getPrice(): number {
        if (!this.book) return 0;

        const higherCost = Number(this.higherCostsValue || this.costsValue);
        const profitPercentage = Number(this.book.precificationGroup.profitPercentage);
        return higherCost + (higherCost * (profitPercentage / 100));
    }

    @BeforeInsert()
    @BeforeUpdate()
    validate() {
        DefaultValidation.notNull(this.entryDate, "A data de entrada não pode ser nula");
        DefaultValidation.notNull(this.supplier, "O fornecedor não pode ser nulo");
        DefaultValidation.notNull(this.costsValue, "O valor de custo não pode ser nulo");
        DefaultValidation.numNotNegative(this.costsValue, "O valor de custo não pode ser negativo");
        DefaultValidation.dateNotAfterToday(this.entryDate, "A data de entrada não pode ser no futuro");

        if (this.status === StockBookStatus.SOLD && !this.saleDate) {
            throw new EntityValidationException(
                "A data de venda deve ser informada para livros vendidos"
            );
        }
    }
}