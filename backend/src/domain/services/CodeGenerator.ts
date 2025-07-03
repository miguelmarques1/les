import { randomUUID } from "crypto";

export class CodeGenerator {
    public static generate(prefix: string): string {
        return `${prefix}-${randomUUID().toUpperCase()}`;
    }
}