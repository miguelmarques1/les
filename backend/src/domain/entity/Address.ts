import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeUpdate, BeforeInsert } from "typeorm";
import { AddressType } from "../enums/AddressType";
import { ResidenceType } from "../enums/ResidenceType";
import { fromValue } from "../utils/fromValue";
import { DefaultValidation } from "../validation/DefaultValidation";
import { Customer } from "./Customer";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number | null;

    @Column({ nullable: true, length: 100 })
    alias: string | null;

    @Column({ type: 'enum', enum: AddressType })
    type: AddressType;

    @Column({ type: 'enum', enum: ResidenceType })
    residenceType: ResidenceType;

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

    @ManyToOne(() => Customer, customer => customer.addresses)
    customer: Customer;

    @Column({ nullable: true, type: 'text' })
    observations?: string | null;

    constructor(
        alias: string | null,
        type: string,
        residenceType: string,
        streetType: string,
        street: string,
        number: string,
        district: string,
        zipcode: string,
        city: string,
        state: string,
        country: string,
        customer: Customer,
        observations?: string | null,
        id: number | null = null,
    ) {
        this.id = id;
        this.alias = alias;
        this.type = fromValue(AddressType, type);
        this.residenceType = fromValue(ResidenceType, residenceType);
        this.streetType = streetType;
        this.street = street;
        this.number = number;
        this.district = district;
        this.zipcode = zipcode;
        this.city = city;
        this.state = state;
        this.country = country;
        this.customer = customer;
        this.observations = observations;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validate() {
        DefaultValidation.notNull(this.streetType, "O tipo de rua não pode ser nulo.");
        DefaultValidation.strDefaultLenght(this.streetType, "O tipo de rua deve ter entre 2 e 255 caracteres.");

        DefaultValidation.notNull(this.street, "O nome da rua não pode ser nulo.");
        DefaultValidation.strDefaultLenght(this.street, "O nome da rua deve ter entre 2 e 255 caracteres.");

        DefaultValidation.notNull(this.number, "O número da residência não pode ser nulo");
        DefaultValidation.strWithoutLetters(this.number, "O número da residência deve ser válido.")

        DefaultValidation.notNull(this.district, "O bairro não pode ser nulo.");
        DefaultValidation.strDefaultLenght(this.district, "O bairro deve ter entre 2 e 255 caracteres.");

        DefaultValidation.notNull(this.zipcode, "O CEP não pode ser nulo.");
        DefaultValidation.strHasMinLength(this.zipcode, 8, "O CEP deve conter exatamente 8 caracteres.");

        DefaultValidation.notNull(this.city, "A cidade não pode ser nula.");
        DefaultValidation.strDefaultLenght(this.city, "A cidade deve ter entre 2 e 255 caracteres.");

        DefaultValidation.notNull(this.state, "O estado não pode ser nulo.");

        DefaultValidation.notNull(this.country, "O país não pode ser nulo.");
        DefaultValidation.strDefaultLenght(this.country, "O país deve ter entre 2 e 255 caracteres.");
    }
}