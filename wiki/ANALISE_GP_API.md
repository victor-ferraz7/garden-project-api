## Análise da implementação do backend `gp-api`

### 1. Visão geral

- **Objetivo**: backend Node.js/Express para gerenciamento de jardins de cultivo (`gardens`), logs de operações (`logs`) e estoque (`inventory`), usando MongoDB.
- **Stack principal**:
  - Runtime: Node.js (CommonJS).
  - Framework HTTP: Express.
  - ODM: Mongoose.
  - Banco: MongoDB (local ou via Docker).
  - Orquestração local: `docker-compose` (serviços `mongo` e `api`).
- **Estado atual**:
  - API funcional com CRUD para os três domínios.
  - Seed completo espelhando o `mockData.js`.
  - Dockerização testada com sucesso (imagem da API builda).
  - `npm audit --omit=dev` sem vulnerabilidades reportadas.

---

### 2. Arquitetura e organização do código

**Estrutura principal de pastas (relevante):**

- `src/server.js`: ponto de entrada. Carrega variáveis de ambiente, conecta ao Mongo (`connectDatabase`) e sobe o servidor na porta `PORT`.
- `src/app.js`: configuração do Express:
  - Middlewares globais: `cors`, `express.json()`.
  - Rota de health check: `GET /health`.
  - Rota de “documentação” mínima da API: `GET /api`.
  - Montagem das rotas:
    - `/api/gardens` → `gardens.routes.js`
    - `/api/logs` → `logs.routes.js`
    - `/api/inventory` → `inventory.routes.js`
  - Handler 404 padrão em JSON.
- `src/config/database.js`: função `connectDatabase` encapsula a conexão Mongoose usando `MONGO_URI` com fallback local.
- `src/models/`: schemas Mongoose e agregador:
  - `Garden.js`, `Log.js`, `InventoryItem.js`, `index.js`.
- `src/controllers/`: lógica de negócio e resposta HTTP:
  - `gardens.controller.js`, `logs.controller.js`, `inventory.controller.js`.
- `src/routes/`: definição de rotas:
  - `gardens.routes.js`, `logs.routes.js`, `inventory.routes.js`.
- `src/seed/`: seed de dados:
  - `mockData.js`: dados gerados dinamicamente a partir de “hoje”.
  - `seed.js`: script que limpa coleções e insere o mock.
- Infra:
  - `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`.
  - `README.md` descrevendo execução local e via Docker.

**Pontos positivos de arquitetura:**

- Separação clara de responsabilidades (models, controllers, routes).
- Uso consistente de `async/await` e tratamento de erros com `try/catch`.
- Conexão centralizada ao Mongo; o app só sobe depois da conexão bem sucedida.
- Rotas REST bem nomeadas, centradas em recursos (`/gardens`, `/logs`, `/inventory`).
- Seed reproduz fielmente o comportamento do mock original, com datas relativas.

---

### 3. Modelagem de dados (Mongoose / MongoDB)

#### 3.1. `Garden` + `Plant` embutida

- **Schema `Garden`**:
  - Campos principais:
    - `id` (string, único, id de negócio).
    - `name` (string).
    - `phase` (enum `["veg", "flower", "nursery", "drying", "mother"]`).
    - `environment` (enum `["indoor", "outdoor", "hydroponic_indoor", "hydroponic_outdoor"]`).
    - `day` (number).
    - `plantsCount` (number; duplicado em relação ao tamanho do array `plants`, mas útil para queries rápidas).
    - `startDate` (Date).
    - `lastWateredDate` (Date ou `null`).
  - Campos adicionais:
    - `stats` (subdocumento): `temp`, `hum`, `tempTarget`, `humTarget`.
    - `imageColor`, `lightType`, `watts`, `photoperiod`, `substrate`.
  - Opções:
    - `timestamps: true`, coleção `gardens`.
  - Índices:
    - `{ phase: 1 }`, `{ environment: 1 }`, `{ startDate: 1 }`, `{ id: 1 }`.

- **Subdocumento `plantSchema`**:
  - `id` (string, obrigatória).
  - `name` (string, obrigatória).
  - `strain` (string).
  - `status` (enum `PLANT_STATUSES = ["healthy", "thirsty"]`, default `healthy`).
  - `ageDays` (number).
  - `origin` (enum `["seed", "clone"]`).
  - `seedBank` (string).
  - `phenotype` (enum `["sativa", "indica", "hybrid", "unknown", ""]`).
  - `potSize` (string).
  - `notes` (string).
  - `_id: false` → subdocumento puramente embutido.

**Conformidade com o mock:**

- Fases, ambientes, phenotypes e origens batem com os dados de seed.
- Valores de `status` no mock (`healthy`, `thirsty`) estão cobertos pelo enum.
- `plantsCount` no mock é coerente com o length inicial das listas.

#### 3.2. `Log`

- **Schema `Log`**:
  - Campos sempre presentes:
    - `gardenId` (string, referência ao `Garden.id`).
    - `gardenName` (string, redundante mas útil para leitura histórica).
    - `type` (enum com todos os tipos do mock: `water`, `prune`, `defoliate`, `pest`, `fungi`, `transplant`, `flush`, `note`, `photo`).
    - `note` (string).
    - `date` (Date).
  - Campos opcionais por tipo:
    - Rega: `ph`, `ec`, `water_liters`, `nutrients_ml`, `solution_temp`.
    - Poda/defolia: `training_type`, `intensity`.
    - Pragas/fungos: `product`, `dosage`, `application_mode`, `safety_period`.
  - Opções:
    - `timestamps: true`, coleção `logs`.
  - Índices:
    - `{ gardenId: 1, date: -1 }` (timeline por jardim).
    - `{ type: 1 }` (filtro rápido por tipo).

**Observações:**

- O schema é flexível e permite ter todos os tipos no mesmo collection, com campos opcionais.
- Filtros de data convertem strings para `Date` no controller (`new Date(query.fromDate)`).

#### 3.3. `InventoryItem`

- **Schema `InventoryItem`**:
  - `id` (string, único).
  - `name` (string).
  - `category` (string).
  - `quantity` (number, `min: 0` com mensagem).
  - `unit` (string).
  - `minStock` (number, `min: 0` com mensagem).
  - `notes` (string).
  - `lastUpdated` (Date).
  - Índices em `name` e `category`.

**Conformidade com o mock:**

- O seed ajusta `lastUpdated` para `Date`, alinhado com o schema.
- Nomes, categorias e unidades do mock entram direto.

---

### 4. API REST: rotas, endpoints e padrões

#### 4.1. Jardins (`/api/gardens`)

- **GET `/api/gardens`**
  - Query params suportados:
    - `phase`, `environment` (filtro).
    - `limit`, `skip` (paginação simples).
  - Retorno: lista de jardins ordenados por `startDate` desc.

- **GET `/api/gardens/:id`**
  - Busca por `id` de negócio (`g1`, `g2`, ...).

- **GET `/api/gardens/:id/logs`**
  - Lista logs de um jardim específico, ordenados por `date` desc.
  - Suporta `limit`, `skip`.

- **GET `/api/gardens/:id/plants` e `/api/gardens/:id/plants/:plantId`**
  - Lista ou busca uma planta específica de um jardim.

- **POST `/api/gardens`**
  - Cria um jardim a partir do body.

- **PUT `/api/gardens/:id`**
  - Atualiza um jardim por `id` (business id).

- **DELETE `/api/gardens/:id`**
  - Remove o jardim.

- **POST `/api/gardens/:id/plants`**
  - Adiciona uma planta ao array `plants` e ajusta `plantsCount`.

- **PATCH `/api/gardens/:id/plants/:plantId`**
  - Atualiza parcialmente uma planta específica.

#### 4.2. Logs (`/api/logs`)

- **GET `/api/logs`**
  - Query params:
    - `gardenId`, `type`.
    - `fromDate`, `toDate` (intervalo de datas).
    - `limit`, `skip`.

- **GET `/api/logs/:id`**
  - Busca por `_id` (ObjectId do Mongo).

- **POST `/api/logs`**, **PUT `/api/logs/:id`**, **DELETE `/api/logs/:id`**
  - CRUD básico de logs, com tratamento de `ValidationError` e `CastError`.

#### 4.3. Inventário (`/api/inventory`)

- **GET `/api/inventory`**
  - Query params: `category`, `limit`, `skip`.

- **GET `/api/inventory/low-stock`**
  - Busca itens com `quantity <= minStock` usando `$expr`.

- **GET `/api/inventory/:id`**
  - Busca por id de negócio (`inv1`, etc.).

- **POST `/api/inventory`**, **PATCH `/api/inventory/:id`**, **DELETE `/api/inventory/:id`**
  - CRUD básico do estoque.

#### 4.4. Metarrotas

- **GET `/health`**:
  - Retorno `{ "status": "ok" }` se o servidor está no ar.

- **GET `/api`**:
  - JSON com resumo textual dos endpoints (mini “API spec” embutido).

- **Handler 404**:
  - Qualquer rota não encontrada retorna:
    - Status `404`.
    - Corpo `{ error: "Rota não encontrada", path: "<path>" }`.

---

### 5. Dockerização e execução

- **Dockerfile**:
  - Imagem base enxuta (`node:20-alpine`).
  - `npm install --omit=dev`: apenas dependências de produção entram na imagem.
  - Copia somente `package*.json` + `src/`, reduzindo o contexto.
  - `CMD ["npm", "run", "start"]` → ambiente de produção.

- **docker-compose.yml**:
  - Serviço `mongo`:
    - Healthcheck com `mongosh` + `db.adminCommand('ping')`.
  - Serviço `api`:
    - `depends_on` no `mongo` com `condition: service_healthy`.
    - Usa `MONGO_URI=mongodb://mongo:27017/growapp`.

- **.dockerignore**:
  - Ignora `node_modules`, `.env`, `.git`, arquivos de projeto locais, mantendo imagens menores e builds mais rápidos.

---

### 6. Pontos de atenção e melhorias

#### 6.1. Validação de entrada e schema de API

- Hoje a validação está delegada praticamente só ao Mongoose.
- **Melhoria sugerida**:
  - Introduzir uma camada de validação de entrada (ex.: `Joi`, `zod` ou `yup`) nos controllers ou via middlewares de rota:
    - Sanitizar tipos (`number` vs `string`).
    - Validar enums (`phase`, `environment`, `type`).
    - Garantir formatos de data (ISO 8601) antes de fazer `new Date(...)`.
  - Padronizar a resposta de erro com um formato estável, por exemplo:
    - `{ error: { code: "VALIDATION_ERROR", message: "...", details: [...] } }`.

#### 6.2. Segurança da API

- **CORS**:
  - Atualmente `cors()` é usado sem restrição de origem (padrão: aberto).
  - Em produção, ideal **restringir `origin`** para os domínios reais do frontend.

- **Headers e hardening**:
  - Ainda não há uso de `helmet`. Recomenda-se:
    - Adicionar `helmet()` para configurar headers de segurança.
    - Remover `X-Powered-By` padrão do Express.

- **Autenticação/Autorização**:
  - Não há nenhum mecanismo de auth. Se o backend for exposto publicamente:
    - Implementar pelo menos JWT ou outro método (ex.: API Key + IP whitelist).
    - Controlar quem pode criar/editar/deletar recursos.

- **Rate limiting**:
  - Não há limitação de requisições.
  - Sugestão: usar `express-rate-limit` em rotas sensíveis.

- **Injeção e queries perigosas**:
  - Filtros atuais (`gardenId`, `type`, `phase`, `environment`) são simples e não usam operadores arbitrários fornecidos pelo usuário.
  - Mesmo assim, é boa prática:
    - Nunca aceitar objetos de filtro “crus” do cliente.
    - Validar os campos de filtro permitidos explicitamente.

#### 6.3. Consistência e índices

- `Garden` define `id` com `unique: true` **e** `gardenSchema.index({ id: 1 })`, gerando warning de índice duplicado no seed.
  - **Melhoria**: remover o `gardenSchema.index({ id: 1 })` e manter só `unique: true`, ou vice-versa, para evitar warnings.

- `plantsCount` é manualmente mantido em `addPlant` mas não em um eventual endpoint de remoção de planta (que ainda não existe).
  - Se no futuro for criada rota de remoção, lembrar de sincronizar `plantsCount`.

#### 6.4. Tratamento de erros e logging

- Os controllers retornam mensagens de erro em português, com 400/404/500, o que é bom.
- **Melhorias possíveis**:
  - Adotar um logger dedicado (`pino`, `winston`) em vez de `console.log/error`.
  - Padronizar a estrutura de erro (vide seção 6.1).
  - Incluir `requestId`/`correlationId` via middleware para melhor rastreabilidade.

#### 6.5. Estrutura do projeto e extensibilidade

- Atualmente os arquivos de controller estão monolíticos por recurso.
- **Melhoria**:
  - Introduzir camada de “services” se a lógica crescer (ex.: `gardens.service.js`).
  - Facilitar reuso de regras de negócio fora das rotas HTTP (ex.: jobs, filas).

---

### 7. Testes: Jest e testes manuais

#### 7.1. Testes manuais recomendados

Após subir o ambiente (local ou via Docker), é possível testar com Postman/Insomnia/cURL:

1. **Verificar health e documentação da API**:
   - `GET /health` → `{ "status": "ok" }`.
   - `GET /api` → retorna JSON com resumo das rotas.

2. **Fluxo de leitura dos dados seed**:
   - `GET /api/gardens` → deve listar 11 jardins.
   - `GET /api/gardens/g1` → detalhes de “Berçário / Vega”.
   - `GET /api/gardens/g1/logs` → timeline dos logs de `g1`.
   - `GET /api/inventory` → 3 itens de estoque.
   - Filtros: `GET /api/logs?gardenId=g4&type=water`.

3. **CRUD básico**:
   - Criar um novo jardim via `POST /api/gardens` e depois buscar por `GET /api/gardens/:id`.
   - Atualizar campo (`PUT /api/gardens/:id`).
   - Deletar e confirmar que `GET` volta 404.

4. **Erros de validação**:
   - Enviar payload incompleto para `POST /api/gardens` (ex.: sem `name` ou `phase`) e checar que volta 400 com mensagem de validação do Mongoose.

#### 7.2. Plano de ação para testes com Jest

Atualmente o projeto não tem Jest configurado. Plano de implementação:

##### Passo 1 – Dependências de teste

Adicionar dependências de desenvolvimento:

- `jest` (test runner).
- `supertest` (testes de integração HTTP no Express).
- `mongodb-memory-server` (Mongo em memória para testes, opcional mas recomendado).

Script sugerido no `package.json`:

```json
"scripts": {
  "test": "jest --runInBand"
}
```

##### Passo 2 – Configuração básica do Jest

- Criar `jest.config.js` na raiz com algo como:

```js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  clearMocks: true,
};
```

##### Passo 3 – Estrutura de testes

- Criar pasta `__tests__/` com subpastas por domínio:
  - `__tests__/integration/gardens.test.js`
  - `__tests__/integration/logs.test.js`
  - `__tests__/integration/inventory.test.js`
  - (Opcional) `__tests__/unit/models/*.test.js` para testar validações específicas dos schemas.

##### Passo 4 – Setup do Mongo para testes

Opção recomendada:

- Criar `__tests__/utils/testDb.js` usando `mongodb-memory-server`:
  - Inicia um MongoDB em memória antes dos testes.
  - Configura `MONGO_URI` dinamicamente.
  - Conecta Mongoose usando a mesma função `connectDatabase`, ou uma conexão dedicada.
  - Limpa coleções entre testes (`beforeEach`/`afterEach`).

Alternativa:

- Usar um banco de testes real (`growapp_test`) e limpar coleções em `beforeEach`/`afterEach`.

##### Passo 5 – Testes de integração com `supertest`

Exemplos de casos de teste a implementar:

- **Gardens**
  - `GET /api/gardens` retorna 200 e um array.
  - `GET /api/gardens/:id` retorna 404 para id inexistente.
  - `POST /api/gardens` com payload válido cria um documento (verificar no Mongo).
  - `PUT /api/gardens/:id` atualiza campos específicos.
  - `POST /api/gardens/:id/plants` adiciona planta e muda `plantsCount`.

- **Logs**
  - `GET /api/logs` com `gardenId` filtra corretamente.
  - `POST /api/logs` cria log com `type` válido; `type` inválido resulta em 400.

- **Inventory**
  - `GET /api/inventory/low-stock` retorna apenas itens com `quantity <= minStock`.
  - `PATCH /api/inventory/:id` atualiza `quantity` e `lastUpdated`.

##### Passo 6 – Testes unitários (opcional mas recomendado)

- Testar validações de schema Mongoose diretamente:
  - Criar instâncias inválidas e verificar que `validate()` dispara erro esperado (ex.: `quantity` negativa, `phase` fora do enum).

##### Passo 7 – Integração com CI

- Adicionar execução de `npm test` em pipeline de CI (GitHub Actions, GitLab CI, etc.).
- Opcional: rodar também `npm run lint` se for adicionado ESLint.

---

### 8. Vulnerabilidades e segurança

#### 8.1. Dependências (npm audit)

- Foi executado:
  - `npm audit --omit=dev`
  - **Resultado**: `found 0 vulnerabilities`.

#### 8.2. Superfície de ataque do código

- **Entrada de dados**:
  - A maior parte dos dados vem do body (JSON) e de query strings.
  - Os filtros de busca são restritos a campos específicos (phase, environment, type, gardenId, category, datas), reduzindo risco de injeção de operadores Mongo.

- **Boas práticas já presentes**:
  - Uso de Mongoose evita uso direto de queries string-concatenadas.
  - As coleções não expõem diretamente operações arbitrárias (sem endpoints genéricos tipo `/query`).

- **Pontos de melhoria relacionados a segurança**:
  - Ver seção 6.2 (CORS, helmet, rate limiting, autenticação).
  - Adotar sanitização de entradas se no futuro houver campos livres críticos (ex.: campos usados em HTML/UIs).

#### 8.3. Configurações e segredos

- `.env.example` está presente; `.env` real é ignorado via `.dockerignore` e (provavelmente) `.gitignore` (não listado, mas esperado).
- **Recomendação**:
  - Garantir que `.env` não seja commitado.
  - Gerenciar segredos em ambiente (Docker, CI/CD) e não em código.

---

### 9. “Design system” e padrões de design aplicados

Não há frontend neste repositório, então o “design system” se aplica ao **design da API e do código**:

#### 9.1. Padrões de design de API

- **RESTful básico**:
  - Recursos em plural (`/gardens`, `/logs`, `/inventory`).
  - Verbos HTTP coerentes:
    - `GET` para leitura, `POST` para criação, `PUT`/`PATCH` para atualização, `DELETE` para remoção.

- **Nomenclatura consistente**:
  - `gardens`, `logs`, `inventory` refletem os domínios de negócio.
  - Sub-recursos com path hierárquico:
    - `/gardens/:id/plants` (coleção de plantas de um jardim).
    - `/gardens/:id/logs` (timeline de logs).

- **Formato de resposta JSON**:
  - Sucesso: objetos ou arrays JSON simples.
  - Erros: `{ error: "<mensagem>" }` e, em alguns casos, campos adicionais (ex.: `path` no 404 global).

- **Paginação**:
  - Padrão simples usando `limit` e `skip` em query string em endpoints de listagem.

#### 9.2. Padrões de código

- **Estilo**:
  - CommonJS (`require` / `module.exports`).
  - Uso consistente de `async/await`.
  - Mensagens e nomes em português, coerentes com o domínio do app.

- **Organização em camadas**:
  - Models (Mongoose) → Controllers (regras de negócio e HTTP) → Routes (declaração de endpoints) → App/Server (bootstrap).

- **Tratamento de erros**:
  - `try/catch` em todos os handlers async.
  - Status HTTP adequados na maioria dos casos:
    - `200`/`201` em sucesso.
    - `400` para erros de validação.
    - `404` para recurso não encontrado.
    - `500` para erros inesperados.

#### 9.3. Padrões de infraestrutura

- Dockerfile enxuto com foco em produção.
- `docker-compose` com healthcheck e volume nomeado.
- Seed separado, chamável via `npm run seed` (e via Docker).

---

### 10. Resumo executivo

- A implementação atual fornece um **backend bem estruturado, dockerizado, com modelos consistentes e seed completo**, pronto para integrar com um frontend que antes dependia de `mockData.js`.
- **Principais pontos fortes**:
  - Separação de camadas, modelos bem próximos do domínio.
  - Docker e seed funcionando na prática.
  - Nenhuma vulnerabilidade conhecida nas dependências de produção (via `npm audit`).
- **Principais frentes de melhoria**:
  - Adicionar **validação de entrada e contrato de API** (Joi/zod) e padronizar respostas de erro.
  - Endurecer a **segurança** (CORS restrito, helmet, rate limiting, autenticação/autorização).
  - Implementar **testes automatizados com Jest + Supertest + Mongo em memória**, seguindo o plano descrito.
  - Refinar detalhes de índices (`Garden.id`) e logging.

Seguindo o plano de testes e as melhorias sugeridas de segurança e validação, o projeto tende a ficar robusto o suficiente para ambiente de produção ou para servir como base sólida de evolução.

