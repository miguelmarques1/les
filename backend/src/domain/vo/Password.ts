import { BeforeInsert, BeforeUpdate, Column, ValueTransformer } from "typeorm";
import { encrypt } from "../../helpers/encrypt";
import { DefaultValidation } from "../validation/DefaultValidation";

export class Password {
    @Column({
        name: 'password_hash'
    })
    value: string;

    constructor(value: string) {
        if(!value) {
            return
        }
        if (this.isEncrypted(value)) {
            this.value = value;
            return;
        }

        this.value = value;
    }

    private isEncrypted(value: string): boolean {
        return value?.startsWith("$2b$") || value?.startsWith("$2a$");
    }

    public compare(plainPassword: string): boolean {
        return encrypt.comparepassword(plainPassword, this.value);
    }
 
    @BeforeInsert()
    @BeforeUpdate()
    private validate() {
        DefaultValidation.notNull(this.value, 'Senha é obrigatória');
        DefaultValidation.strHasMinLength(this.value, 8, 'Senha deve ter no mínimo 8 caracteres');
        DefaultValidation.strIsValidPassword(this.value, 'Senha deve ser composta por letras maiúsculas e minúsculas e caracteres especiais');
        this.value = encrypt.encryptpass(this.value);
    }
}