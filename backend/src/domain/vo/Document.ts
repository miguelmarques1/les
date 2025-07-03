import { BeforeInsert, BeforeUpdate, Column, ValueTransformer } from "typeorm";
import { EntityValidationException } from "../exceptions/EntityValidationException";
import { DefaultValidation } from "../validation/DefaultValidation";

export class Document {
    @Column({ name: 'document_number' })
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validate() {
        const document = this.value;

        DefaultValidation.notNull(document, 'CPF não pode ser nulo');

        const parsedDocument = this.removeNonNumericChars(document);
        DefaultValidation.strHasLength(parsedDocument, 11, 'CPF deve conter exatamente 11 números');
        
        if (/^(\d)\1{10}$/.test(parsedDocument)) {
            throw new EntityValidationException('CPF não pode ter todos os números iguais');
        }

        const numbers = parsedDocument.split('').map(Number);
        const firstVerifierDigit = this.calculateVerifierDigit(numbers.slice(0, 9), 10);
        const secondVerifierDigit = this.calculateVerifierDigit(numbers.slice(0, 10), 11);

        if (`${firstVerifierDigit}${secondVerifierDigit}` !== parsedDocument.substring(9, 11)) {
            throw new EntityValidationException('CPF inválido');
        }
    }

    private calculateVerifierDigit(numbers: number[], verifySequence: number): number {
        const total = numbers.reduce((sum, number, index) => 
            sum + (number * (verifySequence - index)), 0);
        const rest = total % 11;
        return rest < 2 ? 0 : 11 - rest;
    }

    private removeNonNumericChars(value: string): string {
        return value.replace(/\D/g, '');
    }
}