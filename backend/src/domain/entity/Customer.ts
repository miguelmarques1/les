import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { Gender } from "../enums/Gender";
import { UserStatus } from "../enums/UserStatus";
import { Document } from "../vo/Document";
import { CodeGenerator } from "../services/CodeGenerator";
import { DefaultValidation } from "../validation/DefaultValidation";
import { Password } from "../vo/Password";
import { fromValue } from "../utils/fromValue";
import { Address } from "./Address";
import { Card } from "./Card";
import { Cart } from "./Cart";
import { Phone } from "./Phone";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255 })
    name: string;

    @Column(() => Document)
    document: Document;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ unique: true })
    code: string;

    @Column(() => Password)
    password: Password;

    @Column({ type: 'enum', enum: Gender })
    gender: Gender;

    @Column()
    birthdate: Date;

    @Column({ nullable: true })
    ranking: number | null;

    @OneToMany(() => Address, address => address.customer)
    addresses: Address[];

    @OneToMany(() => Card, card => card.customer)
    cards: Card[];

    @OneToOne(() => Cart, cart => cart.customer)
    cart: Cart;

    @OneToMany(() => Phone, phone => phone.customer)
    phones: Phone[];

    constructor(
        email: string,
        name: string,
        birthdate: string,
        gender: string,
        document: string,
        password: string | null = null,
        code: string | null = null,
        status: string | null = null,
        ranking: number | null = null
    ) {
        this.email = email;
        this.name = name;
        this.document = new Document(document);
        this.birthdate = new Date(birthdate);
        this.gender = fromValue(Gender, gender);
        this.status = status ? fromValue(UserStatus, status) : UserStatus.ACTIVE;
        this.code = code ?? CodeGenerator.generate("CUS");
        this.password = password ? new Password(password) : null;
        this.ranking = ranking;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validate() {
        DefaultValidation.strDefaultLenght(this.name, "Nome deve ter no mínimo 2 caracteres e no máximo 255 caracteres");
        DefaultValidation.strDefaultLenght(this.email, "Email deve ter no mínimo 2 caracteres e no máximo 255 caracteres");
        DefaultValidation.strIsEmail(this.email, "Email inválido");

        DefaultValidation.notNull(this.birthdate, "Data de nascimento não pode ser nula");
        DefaultValidation.dateNotAfterToday(this.birthdate, "Data de nascimento não pode ser no futuro");

        DefaultValidation.notNull(this.status, "Status do usuário não pode ser nulo");
    }
}