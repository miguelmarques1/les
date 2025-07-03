export class NotFoundException extends Error {
    readonly statusCode = 404;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}
