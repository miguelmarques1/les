export interface Card {
    number: string;
    holderName: string;
    cvv: string;
    expiryDate: string;
}

export interface TransactionMessage {
    id: number;
    amount: number;
    card: Card;
}