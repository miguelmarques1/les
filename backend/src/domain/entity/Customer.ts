import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { Gender } from "../enums/Gender";
import { UserStatus } from "../enums/UserStatus";
import { Document } from "../vo/Document";
import { CodeGenerator } from "../services/CodeGenerator";
import { DefaultValidation } from "../validation/DefaultValidation";
import { fromValue } from "../utils/fromValue";
import { Address } from "./Address";
import { Card } from "./Card";
import { Cart } from "./Cart";
import { Phone } from "./Phone";
import { User } from "./User";

@Entity()
export class Customer extends User {
    @Column(() => Document)
    document: Document;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ unique: true })
    code: string;

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
        super(email, name, password);
        this.birthdate = new Date(birthdate);
        this.gender = fromValue(Gender, gender);
        this.document = new Document(document);
        this.code = code ?? CodeGenerator.generate("CUS");
        this.ranking = ranking;
        this.status = status ? fromValue(UserStatus, status) : UserStatus.ACTIVE;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validateCustomer() {
        this.validate();
        DefaultValidation.notNull(this.birthdate, "Data de nascimento não pode ser nula");
        DefaultValidation.dateNotAfterToday(this.birthdate, "Data de nascimento não pode ser no futuro");
    }
}
