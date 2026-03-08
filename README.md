## gp-api

Backend Node.js/Express para o app de cultivo, com MongoDB para persistência dos dados de jardins, logs e estoque.

### Arquitetura

Este backend segue uma arquitetura em camadas inspirada em Clean Architecture:

- **Domínio (`src/domain`)**:
  - Entidades puras (`garden`, `log`, `inventoryItem`) e erros de domínio (`errors`).
  - Não conhece Express, Mongoose nem MongoDB.

- **Aplicação (`src/application/ports`)**:
  - Portas (interfaces) de repositório: `GardenRepository`, `LogRepository`, `InventoryRepository`.
  - Definem “o que” a aplicação precisa dos dados, não “como” buscar.

- **Casos de uso (`src/use-cases`)**:
  - Implementam regras de negócio e fluxos principais:
    - `gardens`: listar/criar/atualizar/remover jardins, gerenciar plantas.
    - `logs`: listar/criar/atualizar/remover logs.
    - `inventory`: listar/criar/atualizar/remover itens e listar low-stock.
  - Só falam com as ports (repositórios), não com Express nem Mongoose.

- **Infraestrutura (`src/infrastructure`)**:
  - `repositories`: implementações concretas das ports usando Mongoose.
  - `container`: composition root com instâncias de repositórios e casos de uso.
  - `errorMiddleware`: middleware de erro global que traduz erros de domínio/Mongoose para HTTP.

- **Interface HTTP (`src/controllers` + `src/routes`)**:
  - Controllers chamam apenas os casos de uso via `container`.
  - Rotas (`routes`) mapeiam URLs/métodos HTTP para controllers.

Fluxo típico de uma requisição:

`Request HTTP -> Route -> Controller -> Use Case -> Repository (Mongoose) -> MongoDB -> Response`

### Pré-requisitos

- Node.js 18+ e npm
- MongoDB rodando localmente em `mongodb://localhost:27017/growapp` (ou configure `MONGO_URI` em um arquivo `.env`)

### Como rodar em desenvolvimento

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz (opcional) com, por exemplo:

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/growapp
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

2. (Opcional) Popular o banco com dados de seed:

```bash
docker-compose exec api npm run seed
```

3. A API fica disponível em `http://localhost:3000` (health: `GET /health`, documentação: `GET /api`).

4. Parar os containers:

```bash
docker-compose down
```

Os dados do MongoDB são persistidos no volume `mongo-data`. Para remover tudo (incluindo dados): `docker-compose down -v`.

