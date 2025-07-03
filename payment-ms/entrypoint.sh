#!/bin/sh
set -e

# Configuração do banco a partir das variáveis do compose
DB_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

# Espera o banco ficar disponível
echo "Aguardando banco de dados em ${DB_HOST}:${DB_PORT}..."
while ! nc -z ${DB_HOST} ${DB_PORT}; do
  sleep 1
done

# Executa migrations
echo "Executando database migrations..."
if ! migrate -path ./migration -database "${DB_URL}" up; then
  echo "Falha ao executar migrations"
  exit 1
fi

# Inicia a aplicação
echo "Iniciando serviço de pagamentos..."
exec ./payment-ms