import { PhoneType } from "../domain/enums/PhoneType";

export class PhoneOutputDTO {
    public constructor(
        public id: number,
        public type: string,
        public ddd: string,
        public number: string,
    ) { }
};

export type CreatePhoneInputDTO = {
    type: string;
    ddd: string;
    number: string;
    customerId: number
};

export type UpdatePhoneInputDTO = {
    phoneId: number;
    type: string;
    ddd: string;
    number: string;
    customerId: number
};

export type DeletePhoneInputDTO = {
    phoneId: number;
    customerId: number;
};