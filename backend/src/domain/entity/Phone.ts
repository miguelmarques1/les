import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { PhoneType } from "../enums/PhoneType";
import { fromValue } from "../utils/fromValue";
import { DefaultValidation } from "../validation/DefaultValidation";
import { Customer } from "./Customer";

@Entity()
export class Phone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: PhoneType })
    type: PhoneType;

    @Column({ length: 2 })
    ddd: string;

    @Column()
    number: string;

    @ManyToOne(() => Customer, customer => customer.phones)
    customer: Customer;

    constructor(
        type: string,
        ddd: string,
        number: string,
        customer: Customer
    ) {
        this.type = fromValue(PhoneType, type);
        this.ddd = ddd;
        this.number = number;
        this.customer = customer;
    }

    @BeforeInsert()
    @BeforeUpdate()
    validate() {
        DefaultValidation.notNull(this.type, "Tipo de telefone não pode ser nulo");
        DefaultValidation.notNull(this.ddd, "DDD não pode ser nulo");
        DefaultValidation.strHasLength(this.ddd, 2, "DDD deve ter exatamente 2 dígitos");
        DefaultValidation.notNull(this.number, "Número de telefone não pode ser nulo");
        DefaultValidation.strHasMinLength(this.number, 8, "Número de telefone deve ter no mínimo 8 dígitos");
        DefaultValidation.strDefaultLenght(this.number, "Número de telefone inválido");
        DefaultValidation.strWithoutLetters(this.number, "Número de telefone não pode conter letras");
    }
}