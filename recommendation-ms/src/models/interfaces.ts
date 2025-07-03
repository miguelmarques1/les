export type RecommendationsRequest = {
    history: ChatMessage[],
    message: string,
    customerID: number,
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface Recommendation {
    id: string;
    label: string;
    reason: string;
}

export interface RecommendationResponse {
    message: string;
    recommendations: Recommendation[];
}

export interface MCPToolResponse {
    content?: Array<{ type: "text"; text: string; }>;
}
export class Book {
    public constructor(
        public id: number | null,
        public author: string,
        public categories: Category[],
        public year: number,
        public title: string,
        public publisher: string,
        public precification_group: PrecificationGroup,
        public edition: number,
        public pages: number,
        public synopsis: string,
        public height: number,
        public width: number,
        public weight: number,
        public depth: number,
        public isbn: string,
        public status: string,
    ) { }
}

export class Category {
    public constructor(
        public id: number,
        public name: string,
    ) { }
}

export class PrecificationGroup {
    public constructor(
        public id: number,
        public name: string,
        public profit_percentage: number,
    ) { }
}