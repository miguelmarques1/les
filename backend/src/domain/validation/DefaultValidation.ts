import { EntityValidationException } from "../exceptions/EntityValidationException";

export class DefaultValidation {
    public static notNull(value: any, exceptMessage: string) {
        if(!value) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strDefaultLenght(value: string, exceptMessage: string) {
        if(value.length < 2 || value.length > 255) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strHasLength(value: string, length: number, exceptMessage: string) {
        if(value.length !== length) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strHasMinLength(value: string, length: number, exceptMessage: string) {
        if(value.length < length) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static numNotNegative(value: number, exceptMessage: string) {
        if(value < 0) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static dateNotAfterToday(value: Date, exceptMessage: string) {
        let today = new Date();
        if(today.getTime() < value.getTime()) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static numIsInteger(value: number, exceptMessage: string) {
        if(!Number.isInteger(value)) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strIsEmail(value: string, exceptMessage: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strIsValidPassword(value: string, exceptMessage: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(value)) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strWithoutLetters(value: string, exceptMessage: string) {
        const noLettersRegex = /^[^a-zA-Z]*$/;
        if (!noLettersRegex.test(value)) {
            throw new EntityValidationException(exceptMessage);
        }
    }
}