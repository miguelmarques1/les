FROM node:22-alpine

WORKDIR /app

# Primeiro copia apenas o necessário para instalação
COPY package*.json ./
COPY tsconfig.json ./
COPY src/data-source.ts ./src/

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

# Comando de inicialização modificado
CMD ["sh", "-c", "npm run start"]