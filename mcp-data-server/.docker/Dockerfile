FROM node:22-alpine

WORKDIR /app

# Copia arquivos necessários para instalar dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila o projeto
RUN npm run build

# Cria o diretório compartilhado e copia o bundle
RUN mkdir -p /mcp-data-server-build \
 && cp dist/index.js /mcp-data-server-build/
