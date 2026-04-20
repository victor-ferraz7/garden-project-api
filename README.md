## gp-api

Backend Node.js/Express para o app de cultivo, com MongoDB para persistência dos dados de jardins, logs e estoque. O código-fonte está em **TypeScript** (`src/**/*.ts`); o build gera JavaScript em `dist/` (`npm run build`, `npm start`).

### Arquitetura

Este backend segue uma arquitetura em camadas inspirada em Clean Architecture:

- **Domínio (`src/domain`)**:
  - Entidades puras (`garden`, `log`, `inventoryItem`) e erros de domínio (`errors`).
  - Não conhece Express, Mongoose nem MongoDB.

- **Aplicação (`src/application/ports`)**:
  - Portas (interfaces) de repositório: `GardenRepository`, `LogRepository`, `InventoryRepository`, `UserRepository`, `RefreshTokenRepository`.
  - Definem “o que” a aplicação precisa dos dados, não “como” buscar.

- **Casos de uso (`src/use-cases`)**:
  - Implementam regras de negócio e fluxos principais:
    - `gardens`: listar/criar/atualizar/remover jardins, gerenciar plantas.
    - `logs`: listar/criar/atualizar/remover logs.
    - `inventory`: listar/criar/atualizar/remover itens e listar low-stock.
    - `auth`: registro, login, refresh e logout (JWT access + refresh com sessão em MongoDB).
  - Só falam com as ports (repositórios), não com Express nem Mongoose.

- **Infraestrutura (`src/infrastructure`)**:
  - `repositories`: implementações concretas das ports usando Mongoose.
  - `container`: composition root com instâncias de repositórios e casos de uso.
  - `authenticate`: middleware JWT (Bearer) para rotas de negócio.
  - `errorMiddleware`: middleware de erro global que traduz erros de domínio/Mongoose para HTTP.

- **Interface HTTP (`src/controllers` + `src/routes`)**:
  - Controllers chamam apenas os casos de uso via `container`.
  - Rotas (`routes`) mapeiam URLs/métodos HTTP para controllers.

Fluxo típico de uma requisição:

`Request HTTP -> Route -> Controller -> Use Case -> Repository (Mongoose) -> MongoDB -> Response`

### Pré-requisitos

- Node.js 20+ e npm (alinhado ao `Dockerfile`)
- MongoDB rodando localmente em `mongodb://localhost:27017/growapp` (ou configure `MONGO_URI` em um arquivo `.env`)
- Variáveis `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` (mínimo 16 caracteres cada) — ver `.env.example`

### Testes (Clean Architecture / produção)

A pirâmide segue a separação de camadas: **domínio** e **casos de uso** com dependências mockadas; **adaptadores** (repositórios Mongoose) contra MongoDB em memória; **API HTTP** de ponta a ponta.

| Camada | Ferramenta | Pastas | O que valida |
|--------|------------|--------|--------------|
| Domínio | Vitest | `tests/unit/domain/` | Erros de domínio, fábricas puras (`createGarden`, etc.) |
| Casos de uso | Vitest | `tests/unit/use-cases/` | Regras com ports mockadas (auth, jardins, logs, estoque) |
| Infraestrutura | Vitest | `tests/unit/infrastructure/` | `mongoId`, hash de refresh, JWT, `errorMiddleware`, `authenticate` |
| Repositórios (integração) | Vitest | `tests/integration/repositories/` | Filtros `ownerId`, hashes de refresh, usuário |
| API (E2E HTTP) | Playwright | `tests/integration/api.integration.spec.ts` | [PLANO §9](wiki/PLANO_IMPLEMENTACAO1.md): 401, refresh, 404 entre usuários, CRUD |

Os testes Vitest carregam o código compilado em **`dist/`** (após `tsc`), para que os `require` do Node resolvam como em produção.

```bash
npm run test              # build + Vitest (unitário + repos)
npm run test:coverage     # idem + relatório coverage/
npm run test:integration  # Playwright (API; ver abaixo)
npm run test:all          # Vitest + Playwright
```

**Playwright (PR-5 / contrato HTTP):** login inválido sem vazar email, access expirado + refresh, recurso de outro usuário (404), CRUD de jardim. Na primeira máquina: `npx playwright install chromium`. O runner sobe Mongo em memória e a API na porta **3999** (`scripts/integration-test-server.mjs`, `playwright.config.ts`).

### Migração de dados e compatibilidade

Versões atuais exigem `ownerId` em `gardens`, `logs` e `inventoryItems`, e documentos de refresh com `hashedToken`. Bancos criados antes dessa mudança não são compatíveis sem migração: em desenvolvimento, use `npm run seed` após subir o Mongo (apaga e recria coleções com um usuário demo). Para dados legados sem `ownerId`, existe um script opcional em `scripts/migrate-owner-id.js` (defina `MIGRATE_OWNER_ID` com o ObjectId do proprietário alvo).

### Autenticação

- `POST /api/auth/register` — `{ email, password }` (senha mín. 8 caracteres).
- `POST /api/auth/login` — retorna `accessToken` e `refreshToken`.
- Demais rotas em `/api/gardens`, `/api/logs`, `/api/inventory` exigem cabeçalho `Authorization: Bearer <accessToken>`.
- Recursos possuem `ownerId` vinculado ao `sub` do JWT; o seed cria o usuário `seed@growapp.local` / `seedseed` (sobrescreva com `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` se quiser).

### Como rodar em desenvolvimento

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz (recomendado) — copie de `.env.example` e defina segredos JWT, por exemplo:

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/growapp
JWT_ACCESS_SECRET=sua-chave-access-min-16-chars
JWT_REFRESH_SECRET=sua-chave-refresh-min-16-chars
```

3. Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

4. Verifique o status do servidor:

Abra no navegador ou via HTTP:

```bash
GET http://localhost:3000/health
```

Se tudo estiver ok, a resposta será:

```json
{ "status": "ok" }
```

### Rodar com Docker (passo 7)

1. Suba o ambiente (MongoDB + API):

```bash
docker-compose up -d
```

2. (Opcional) Popular o banco com dados de seed (a imagem já contém `dist/`; o comando executa `node dist/seed/seed.js`):

```bash
docker-compose exec api npm run seed
```

Em desenvolvimento local, rode `npm run build` antes do primeiro `npm run seed` (ou sempre que mudar o TypeScript do seed).

3. A API fica disponível em `http://localhost:3000` (health: `GET /health`, documentação: `GET /api`).

4. Parar os containers:

```bash
docker-compose down
```

Os dados do MongoDB são persistidos no volume `mongo-data`. Para remover tudo (incluindo dados): `docker-compose down -v`.

