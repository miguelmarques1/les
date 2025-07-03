import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenAI, mcpToTool } from '@google/genai';
import { RecommendationResponse, RecommendationsRequest } from "../models/interfaces";
import { configDotenv } from "dotenv";

export class RecommendationService {
    private mcpClient: Client;
    private genAI: GoogleGenAI;
    private modelName: string;

    constructor() {
        this.mcpClient = new Client({
            name: "book-data-mcp-client",
            version: "1.0.0"
        });

        const transport = new StdioClientTransport({
            command: "node",
            args: [process.env.MCP_SERVER_SCRIPT_PATH],
            cwd: process.cwd()
        });
        this.mcpClient.connect(transport);

        configDotenv();

        this.genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    }

    public async execute(
        input: RecommendationsRequest,
    ): Promise<RecommendationResponse> {
        try {
            const messages = this.buildMessages(input);

            const response = await this.genAI.models.generateContent({
                model: this.modelName,
                contents: messages,
                config: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                    tools: [mcpToTool(this.mcpClient)],
                }
            });
            console.log(response.text);
            return this.parseResponse(response.text);
        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                message: "Desculpe, estou tendo problemas para recomendar livros no momento.",
                recommendations: []
            };
        }
    }

    private buildMessages(input: RecommendationsRequest): any[] {
        const messages: any[] = [
            {
                role: "user",
                parts: [{
                    text: this.buildPrompt(input)
                }]
            }
        ];

        if (input.history?.length) {
            messages.unshift(...input.history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })));
        }

        return messages;
    }

    private buildPrompt(input: RecommendationsRequest): string {
        return `Você é um assistente especialista em livros. Sua principal função é recomendar livros, mas você também pode responder a perguntas sobre livros e categorias de livros usando as ferramentas disponíveis.
    
    Aqui estão as ferramentas que você pode usar:
    - **get_all_available_books**: Para listar todos os livros disponíveis.
    - **search_books_by_category**: Para buscar livros por um ID de categoria específico.
    - **get_customer_interest_books**: Para encontrar livros de interesse de um cliente.
    - **get_all_categories**: Para listar todas as categorias de livros disponíveis, com seus IDs.

    **Instruções de uso das ferramentas:**
    1. Se o usuário pedir livros de uma categoria específica (ex: "históricos", "fantasia", "ficção"), e você não tiver o ID da categoria, **PRIMEIRO** use a ferramenta 'get_all_categories' para obter a lista de categorias e seus IDs.
    2. Após obter a lista de categorias, identifique o ID da categoria solicitada pelo usuário.
    3. **ENTÃO**, use a ferramenta 'search_books_by_category' com o ID correto para buscar os livros.
    4. Se o usuário apenas pedir "quais são as categorias?" ou "liste todas as categorias", use 'get_all_categories' e forneça a lista de forma clara.
    5. Para outras perguntas que possam ser respondidas por ferramentas (como "todos os livros disponíveis"), use a ferramenta apropriada e forneça a informação diretamente.
    6. Quando for uma solicitação de recomendação, use as ferramentas para buscar informações relevantes antes de formar sua recomendação.

    Sua prioridade é fornecer informações precisas e úteis.
    
    Histórico da conversa:
    ${input.history?.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n') || 'Nenhum'}

    Nova mensagem: "${input.message}"
    
    Quando você fornecer **recomendações de livros**, use o seguinte formato JSON. Para **outras respostas** (como listar categorias ou livros, ou resultados de busca por categoria que não sejam uma recomendação formal), responda de forma natural e clara, sem JSON, apenas com o texto da informação.
    {
      "message": "resposta amigável",
      "recommendations": [
        {
          "id": "id-do-livro",
          "label": "Título - Autor",
          "reason": "razão da recomendação"
        }
      ]
    }`;
    }



    private parseResponse(aiResponse: string): RecommendationResponse {
        try {
            const jsonStart = aiResponse.indexOf('{');
            const jsonEnd = aiResponse.lastIndexOf('}') + 1;
            const jsonString = aiResponse.slice(jsonStart, jsonEnd);

            const parsed = JSON.parse(jsonString);

            return {
                message: parsed.message || "Aqui estão algumas recomendações:",
                recommendations: parsed.recommendations?.map((r: any) => ({
                    id: r.id,
                    label: r.label,
                    reason: r.reason
                })) || []
            };
        } catch (e) {
            return {
                message: aiResponse,
                recommendations: []
            };
        }
    }
}