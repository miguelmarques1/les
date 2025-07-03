#!/bin/sh
set -e

# As variáveis de ambiente DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE
# devem ser injetadas no container pelo seu docker-compose.yml
# Ex:
# environment:
#   - DB_HOST=backend-db
#   - DB_PORT=5432
#   - DB_USER=backend
#   - DB_PASSWORD=5cZ7SJq2e88y
#   - DB_DATABASE=les

# Espera o banco de dados ficar disponível
echo "Aguardando banco de dados em ${DB_HOST}:${DB_PORT}..."
while ! nc -z ${DB_HOST} ${DB_PORT}; do
  echo "Aguardando ${DB_HOST}:${DB_PORT}..."
  sleep 1
done
echo "Banco de dados disponível!"

# *** OPCIONAL: Executar Migrações (se você usa um sistema de migração Node.js) ***
# Se você tiver um comando como `npm run migrate` ou `npm run typeorm:migrate`
# Substitua pelo seu comando real de migração Node.js
# echo "Executando database migrations..."
# if ! npm run db:migrate; then # Adapte para o seu comando de migração real
#   echo "Falha ao executar migrations"
#   exit 1
# fi
# echo "Database migrations executadas com sucesso."

# Executa as seeds do banco de dados
echo "Executando database seeds (npm run db:seed)..."
if ! npm run db:seed; then # Certifique-se que este comando está no seu package.json
  echo "Falha ao executar seeds"
  exit 1
fi
echo "Database seeds executadas com sucesso."

# Inicia a aplicação principal
echo "Iniciando aplicação backend..."
exec npm start # Ou `npm run dev` se for ambiente de desenvolvimento, ou `node dist/index.js`