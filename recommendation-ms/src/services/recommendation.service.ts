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
    return `Você é um assistente especialista em livros. Sua principal função é recomendar livros, mas você também pode responder a perguntas sobre livros, categorias e também ajudar com instruções de uso do sistema, conforme descrito abaixo.  
        Além disso, você pode usar ferramentas para obter dados reais quando necessário.

        Aqui estão as ferramentas disponíveis:
        - **get_all_available_books**: Para listar todos os livros disponíveis.
        - **search_books_by_category**: Para buscar livros por um ID de categoria específico.
        - **get_customer_interest_books**: Para encontrar livros de interesse de um cliente (USE esta ferramenta se o ID do cliente estiver disponível na requisição).
        - **get_all_categories**: Para listar todas as categorias de livros disponíveis, com seus IDs.

        **Informações importantes sobre o ID do cliente:**
        - O ID do cliente é: ${input.customerID ?? "nenhum fornecido"}.
        - Se houver um ID de cliente, ao gerar recomendações, você deve:
        - Usar **get_customer_interest_books** para buscar livros relevantes ao cliente.
        - Combinar essas informações com categorias solicitadas (quando houver).
        - Criar recomendações personalizadas com base nesses resultados.

        **Instruções de uso das ferramentas:**
        1. Se o usuário pedir livros de uma categoria específica (ex: "históricos", "fantasia"), e você não tiver o ID dessa categoria:
        - **PRIMEIRO** use 'get_all_categories' para obter todas as categorias com seus respectivos IDs.
        2. Depois, identifique o ID da categoria solicitada pelo usuário.
        3. **ENTÃO**, use 'search_books_by_category' com o ID correto.
        4. Se o usuário pedir "quais são as categorias?", use 'get_all_categories' e liste-as.
        5. Se o usuário pedir "todos os livros disponíveis", use 'get_all_available_books'.
        6. Para recomendações, use todas as ferramentas necessárias antes de responder.

        ---

        ### 📘 Instruções do sistema (caso o usuário pergunte como usar a plataforma)
        Se o usuário fizer perguntas como “como comprar?”, “como trocar um livro?”, “como atualizar meus dados?”, responda usando as instruções abaixo:

        **Comprar um livro:**  
        Acesse a página inicial \`/\`, clique em um livro para ver detalhes em \`/livro/[id]\`, adicione ao carrinho, vá para \`/carrinho\` e finalize em \`/checkout\`.

        **Pedir reembolso/troca:**  
        Acesse \`/conta\`, vá na aba "Pedidos", clique no pedido desejado e use o botão "Solicitar Troca/Devolução". Acompanhe em \`/conta/trocas\`.

        **Cadastrar um cartão:**  
        Acesse \`/conta\`, vá na aba "Pagamentos", clique em "Adicionar Cartão" e preencha os dados.

        **Remover um cartão:**  
        Acesse \`/conta\`, vá na aba "Pagamentos" e clique no ícone de lixeira ao lado do cartão.

        **Adicionar endereço:**  
        Acesse \`/conta\`, vá na aba "Endereços", clique em "Adicionar Endereço" e preencha os dados.

        **Editar/remover endereço:**  
        Acesse \`/conta\`, vá na aba "Endereços" e use os ícones de editar ou excluir.

        **Atualizar dados pessoais:**  
        Acesse \`/conta\`, abra "Configurações", altere nome, gênero ou data de nascimento e clique em "Salvar Alterações".

        **Alterar senha:**  
        Acesse \`/conta\`, vá em "Configurações", informe senha atual e nova senha, e clique em "Alterar Senha".

        **Ver histórico de pedidos:**  
        Acesse \`/conta\`, na aba "Pedidos".

        **Acompanhar troca/devolução:**  
        Acesse \`/conta/trocas\`.

        ---

        ### Histórico da conversa:
        ${input.history?.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n') || 'Nenhum'}

        ### Nova mensagem:
        "${input.message}"

        ---

        ### Formato de resposta:
        - Para **recomendações de livros**, responda SOMENTE neste formato JSON:
        {
        "message": "resposta amigável",
        "recommendations": [
            {
            "id": "id-do-livro",
            "label": "Título - Autor",
            "reason": "razão da recomendação"
            }
        ]
        }

        - Para **qualquer outra resposta**, responda normalmente em texto, de forma clara e natural.
        `;
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