export class UnauthorizedException extends Error {
    readonly statusCode = 401;
    
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}
