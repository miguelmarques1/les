FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./

# Instalar dependências
RUN npm i --legacy-peer-deps

# Copiar o restante dos arquivos
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM node:22-alpine AS runner

WORKDIR /app

# Configurar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do estágio builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Porta exposta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV production
ENV PORT 3000

# Usuário não-root
USER nextjs

# Comando de inicialização
CMD ["npm", "run", "start"]