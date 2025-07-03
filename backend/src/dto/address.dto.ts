import { AddressType } from "../domain/enums/AddressType";

export class AddressOutputDTO {
    public constructor(
        public id: number,
        public alias: string,
        public type: string,
        public residence_type: string,
        public street_type: string,
        public street: string,
        public number: string,
        public district: string,
        public zip_code: string,
        public city: string,
        public state: string,
        public country: string,
        public customerId: number,
        public observations?: string,
    ) {}
};

export type CreateAddressInputDTO = {
    alias: string;
    type: string;
    residence_type: string;
    street_type: string;
    street: string;
    number: string;
    district: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
    observations?: string;
    customerId: number;
};


export type UpdateAddressInputDTO = {
    alias: string;
    type: string;
    residence_type: string;
    street_type: string;
    street: string;
    number: string;
    district: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
    observations?: string;
    customerId: number;
    addressId: number;
};

export type DeleteAddressInputDTO = {
    customerId: number;
    addressId: number;
}