import { CreateAddressInputDTO } from "./address.dto";
import { CreatePhoneInputDTO } from "./phone.dto";

export class CustomerOutputDTO {
    public constructor(
        public id: number,
        public name: string,
        public email: string,
        public gender: string,
        public birthdate: Date,
        public document: string,
        public ranking: number,
        public code: string, 
        public status: string,
    ) { }
};


export type CreateCustomerInputDTO = {
    name: string;
    email: string;
    password: string;
    gender: string;
    birthdate: string;
    document: string;
    phone: CreatePhoneInputDTO;
    billing_address: CreateAddressInputDTO;
    delivery_address: CreateAddressInputDTO;
};

export type UpdateCustomerInputDTO = {
    name: string;
    birthdate: string;
    gender: string;
}

export type DeleteCustomerInputDTO = {
    password: string;
    customerId: number,
}