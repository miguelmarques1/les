import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeUpdate, BeforeInsert } from "typeorm";
import { Brand } from "./Brand";
import { Customer } from "./Customer";
import { DefaultValidation } from "../validation/DefaultValidation";
import { EntityValidationException } from "../exceptions/EntityValidationException";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 16 })
    number: string;

    @Column()
    holderName: string;

    @Column({ length: 4 })
    cvv: string;

    @Column()
    expiryDate: string;

    @ManyToOne(() => Customer, customer => customer.cards)
    customer: Customer;

    @ManyToOne(() => Brand)
    brand: Brand;

    constructor(
        number: string,
        holderName: string,
        cvv: string,
        customer: Customer,
        expiryDate: string,
        brand: Brand
    ) {
        this.number = number;
        this.holderName = holderName;
        this.cvv = cvv;
        this.customer = customer;
        this.expiryDate = expiryDate;
        this.brand = brand;
    }

    @BeforeInsert()
    @BeforeUpdate()
    validate() {
        DefaultValidation.strDefaultLenght(
            this.holderName,
            "Nome do titular não pode ser vazio"
        );

        DefaultValidation.strHasLength(
            this.number,
            16,
            "Número do cartão deve ter 16 dígitos"
        );

        DefaultValidation.strWithoutLetters(
            this.number,
            "Número do cartão deve conter apenas números"
        );

        DefaultValidation.strWithoutLetters(
            this.cvv,
            "CVV deve conter apenas números"
        );
    }
}