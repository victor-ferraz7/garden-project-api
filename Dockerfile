# 7.1 — Dockerfile da API
# Base: Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Dependências (cache da camada se package*.json não mudar)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Código da aplicação
COPY src ./src

EXPOSE 3000

ENV NODE_ENV=production
CMD ["npm", "run", "start"]
