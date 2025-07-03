import { AfterLoad, BeforeInsert, BeforeUpdate, Column, ValueTransformer } from "typeorm";
import { EntityValidationException } from "../exceptions/EntityValidationException";

export class ISBN {
    @Column({ name: 'isbn_code' })
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    private removeCharacters(isbn: string): string {
        return isbn.replace("ISBN ", "").replace(/-/g, "");
    }

    @BeforeInsert()
    @BeforeUpdate()
    validate() {
        if (!this.value.startsWith("ISBN ")) {
            throw new EntityValidationException("Invalid ISBN");
        }
        
        const parsedValue = this.removeCharacters(this.value);
        const isValid = parsedValue.length === 10 
            ? this.tenDigitsValidation(parsedValue) 
            : this.thirteenDigitsValidation(parsedValue);
            
        if (!isValid) {
            throw new EntityValidationException("Invalid ISBN");
        }
    }

    private thirteenDigitsValidation(value: string): boolean {
        let total = 0;
        for (let i = 0; i < 13; i++) {
            const digit = parseInt(value[i], 10);
            total += digit * (i % 2 === 0 ? 1 : 3);
        }
        return total % 10 === 0;
    }

    private tenDigitsValidation(value: string): boolean {
        let total = 0;
        for (let i = 0; i < 10; i++) {
            const digit = parseInt(value[i], 10);
            total += digit * (10 - i);
        }
        return total % 11 === 0;
    }
}