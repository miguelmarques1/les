export class AuthOutputDTO {
    public constructor(
        public access_token: string,
    ) {}
};

export type AuthInputDTO = {
    email: string;
    password: string;
};

export type authPayload = {
    id: string;
    role: 'admin' | 'customer';
};