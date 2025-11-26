import { PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { DefaultValidation } from "../validation/DefaultValidation";
import { Password } from "../vo/Password";

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255 })
    name: string;

    @Column(() => Password)
    password: Password;

    constructor(
        email: string,
        name: string,
        password: string | null = null,
    ) {
        this.email = email;
        this.name = name;
        this.password = password ? new Password(password) : null;
    }

    @BeforeInsert()
    @BeforeUpdate()
    protected validate() {
        DefaultValidation.strDefaultLenght(this.name, "Nome deve ter no mínimo 2 caracteres e no máximo 255 caracteres");
        DefaultValidation.strDefaultLenght(this.email, "Email deve ter no mínimo 2 caracteres e no máximo 255 caracteres");
        DefaultValidation.strIsEmail(this.email, "Email inválido");
    }
}
