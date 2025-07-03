FROM node:22-alpine

WORKDIR /app

# Primeiro copia apenas o necessário para instalação
COPY package*.json ./
COPY tsconfig.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Comando de inicialização modificado
CMD ["npm", "run", "dev"]
