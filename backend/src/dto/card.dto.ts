export class CardOutputDTO {
    public constructor(
        public id: number,
        public number: string,
        public holder_name: string,
        public expiry_date: string,
        public brand_id: number,
        public customer_id: number,
    ) { }
};

export type CreateCardInputDTO = {
    number: string;
    holder_name: string;
    brand_id: number;
    expiry_date: string,
    cvv: string;
    customer_id: number;
};

export type DeleteCardInputDTO = {
    cardId: number;
    customerId: number;
};
