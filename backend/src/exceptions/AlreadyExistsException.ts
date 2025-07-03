export class AlreadyExistsException extends Error {
    readonly statusCode = 409;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AlreadyExistsException.prototype);
    }
}
