export class EntityValidationException extends Error {
    readonly statusCode = 422;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, EntityValidationException.prototype);
    }
}
