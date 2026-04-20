# Detalhe técnico — Schemas Mongoose, assinaturas por arquivo e PRs

Este documento complementa [PLANO_IMPLEMENTACAO1.md](./PLANO_IMPLEMENTACAO1.md). Assume as decisões **F0** já travadas:

- **`ownerId`:** `ObjectId`, ref `User`, armazenado como no documento; **`JWT sub`** = `user._id.toString()`.
- **Unicidade:** `Garden.id` e `InventoryItem.id` são **únicos por usuário**: índice composto `{ ownerId: 1, id: 1 }` (remove `unique: true` isolado no campo `id`).
- **`Log`:** inclui **`ownerId`** (denormalizado) para consultas rápidas e isolamento no repositório sem join obrigatório.
- **Padrão de execução:** todos os casos de uso expõem `async execute(input)` onde `input` inclui **`actorId`** (string) em operações autenticadas; controllers leem `req.auth.sub`.

---

## 1. Schemas Mongoose novos e alterados

### 1.1 `src/models/User.js` (novo)

```javascript
// Campos principais
{
  email: String,        // único, lowercase trim
  passwordHash: String, // bcrypt / argon2
  createdAt, updatedAt  // timestamps: true
}
// Índice: { email: 1 } unique
```

- Não persistir `password` em claro.
- Opcional: `emailVerified: Boolean`, `lastLoginAt: Date`.

### 1.2 `src/models/RefreshToken.js` (novo)

```javascript
{
  userId: ObjectId ref User, required, index
  jti: String,              // único — id do token de refresh
  hashedToken: String,      // hash do segredo enviado ao cliente (ou só hash opaco)
  expiresAt: Date,          // TTL index recomendado
  revokedAt: Date,          // default null
  replacedByJti: String,    // null até rotação
  createdFromIp: String,    // opcional
  userAgent: String         // opcional
}
// Índices: { jti: 1 } unique; { userId: 1, revokedAt: 1 }; expireAfterSeconds em expiresAt (documentação Mongo TTL)
```

### 1.3 `src/models/Garden.js` (alterar)

- Adicionar:

```javascript
ownerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true,
},
```

- Remover `unique: true` de `id` se existir; adicionar:

```javascript
gardenSchema.index({ ownerId: 1, id: 1 }, { unique: true });
```

- Manter índices simples em `phase` / `environment` / `startDate` se ainda forem usados para analytics globais; para listagens **sempre** filtradas por `ownerId`, considere índice composto `{ ownerId: 1, startDate: -1 }` em substituição ou adição.

### 1.4 `src/models/Log.js` (alterar)

- Adicionar `ownerId` (mesmo tipo que em `Garden`), **required**, indexado.
- Índice composto sugerido: `{ ownerId: 1, gardenId: 1, date: -1 }` (substitui ou complementa `{ gardenId: 1, date: -1 }` conforme padrões de query).

### 1.5 `src/models/InventoryItem.js` (alterar)

- Adicionar `ownerId` (igual `Garden`).
- `inventoryItemSchema.index({ ownerId: 1, id: 1 }, { unique: true });`
- Ajustar `id`: remover `unique: true` solto no campo.

---

## 2. Ports (`src/application/ports/`)

Convenção: último parâmetro **`ownerId`** (string `sub` ou `ObjectId` — recomenda-se **string no use case**, conversão para `ObjectId` só no repositório).

### 2.1 `gardenRepository.js`

| Método (atual) | Nova assinatura |
|----------------|-----------------|
| `findAll(filter)` | `findAll(filter, ownerId)` |
| `findById(id)` | `findById(id, ownerId)` |
| `create(garden)` | `create(garden)` — `garden.ownerId` já definido pelo caso de uso |
| `update(id, update)` | `update(id, update, ownerId)` |
| `delete(id)` | `delete(id, ownerId)` |
| `addPlant(gardenId, plant)` | `addPlant(gardenId, plant, ownerId)` |
| `updatePlant(gardenId, plantId, update)` | `updatePlant(gardenId, plantId, update, ownerId)` |
| `deletePlant(gardenId, plantId)` | `deletePlant(gardenId, plantId, ownerId)` |

### 2.2 `logRepository.js`

| Método (atual) | Nova assinatura |
|----------------|-----------------|
| `findAll(filter)` | `findAll(filter, ownerId)` |
| `findByMongoId(idMongo)` | `findByMongoId(idMongo, ownerId)` |
| `create(log)` | `create(log)` — `log.ownerId` setado no caso de uso |
| `update(idMongo, update)` | `update(idMongo, update, ownerId)` |
| `delete(idMongo)` | `delete(idMongo, ownerId)` |

### 2.3 `inventoryRepository.js`

| Método (atual) | Nova assinatura |
|----------------|-----------------|
| `findAll(filter)` | `findAll(filter, ownerId)` |
| `findById(id)` | `findById(id, ownerId)` |
| `create(item)` | `create(item)` — `item.ownerId` no payload interno |
| `update(id, update)` | `update(id, update, ownerId)` |
| `delete(id)` | `delete(id, ownerId)` |
| `findLowStock()` | `findLowStock(ownerId)` |

### 2.4 Novas ports (novos arquivos)

- `src/application/ports/userRepository.js` — `findByEmail`, `findById`, `create`, `updatePassword?`
- `src/application/ports/refreshTokenRepository.js` — `create`, `findValidByJti`, `revoke`, `revokeAllForUser`, rotação

---

## 3. Repositórios Mongoose (`src/infrastructure/repositories/`)

### 3.1 `GardenRepositoryMongo.js`

- Em **todas** as queries (`find`, `findOne`, `findOneAndUpdate`, `findOneAndDelete`), incluir `{ ownerId }` no filtro (converter `ownerId` string → `ObjectId` uma vez por método).
- `create`: garantir que `garden.ownerId` está presente (não confiar no cliente HTTP — o caso de uso injeta).

### 3.2 `LogRepositoryMongo.js`

- `buildMongoFilter`: além dos filtros existentes, **sempre** `mongoFilter.ownerId = ownerId` (ObjectId).
- `findByMongoId`, `update`, `delete`: incluir `ownerId` no critério `_id` + `ownerId`.

### 3.3 `InventoryRepositoryMongo.js`

- Mesmo padrão que Garden: todo acesso filtra por `ownerId`.
- `findLowStock`: `{ ownerId, $expr: ... }`.

### 3.4 Novos repositórios

- `UserRepositoryMongo.js`
- `RefreshTokenRepositoryMongo.js`

### 3.5 `src/infrastructure/repositories/index.js`

- Exportar implementações novas.

---

## 4. Casos de uso — assinatura `execute(input)` por arquivo

**Regra:** `input.actorId` é obrigatório para rotas protegidas. O controller faz `execute({ ...body/params/query, actorId: req.auth.sub })`.

### 4.1 Gardens (`src/use-cases/gardens/`)

| Arquivo | `input` esperado (campos relevantes) |
|---------|--------------------------------------|
| `ListGardens.js` | `{ phase?, environment?, limit?, skip?, actorId }` |
| `GetGardenById.js` | `{ id, actorId }` |
| `CreateGarden.js` | `{ ...camposGarden, actorId }` — **remove** `ownerId` do body se vier; define `ownerId` = `actorId` antes do `create` |
| `UpdateGarden.js` | `{ id, update, actorId }` |
| `DeleteGarden.js` | `{ id, actorId }` |
| `GetGardenPlants.js` | `{ gardenId, actorId }` |
| `GetGardenPlantById.js` | `{ gardenId, plantId, actorId }` |
| `AddPlantToGarden.js` | `{ gardenId, plant, actorId }` |
| `UpdateGardenPlant.js` | `{ gardenId, plantId, update, actorId }` |
| `DeleteGardenPlant.js` | `{ gardenId, plantId, actorId }` |

Todas as chamadas ao repositório passam `input.actorId` como `ownerId` (ou renomeiam internamente para clareza).

### 4.2 Logs (`src/use-cases/logs/`)

| Arquivo | `input` esperado |
|---------|------------------|
| `ListLogs.js` | `{ gardenId?, type?, fromDate?, toDate?, limit?, skip?, actorId }` |
| `GetLogById.js` | `{ id, actorId }` |
| `CreateLog.js` | `{ ...camposLog, actorId }` — **antes** de persistir: validar que o jardim `input.gardenId` pertence a `actorId` (ver §4.4); setar `ownerId` = `actorId` no objeto `log` |
| `UpdateLog.js` | `{ id, update, actorId }` |
| `DeleteLog.js` | `{ id, actorId }` |

### 4.3 Inventory (`src/use-cases/inventory/`)

| Arquivo | `input` esperado |
|---------|------------------|
| `ListInventoryItems.js` | `{ category?, limit?, skip?, actorId }` |
| `GetInventoryItemById.js` | `{ id, actorId }` |
| `CreateInventoryItem.js` | `{ ...camposItem, actorId }` — injeta `ownerId` |
| `UpdateInventoryItem.js` | `{ id, update, actorId }` |
| `DeleteInventoryItem.js` | `{ id, actorId }` |
| `ListLowStockItems.js` | `{ actorId }` |

### 4.4 Dependência extra em `CreateLog`

Para validar `gardenId` sem duplicar acesso direto ao Mongoose:

- **Opção A (recomendada):** injetar `GardenRepository` em `CreateLog` e chamar `findById(gardenId, actorId)`; se `null`, lançar `NotFoundError` (mesmo comportamento que recurso inexistente para o caller).
- **Opção B:** port `GardenAccessPort` com um único método `assertGardenOwned(gardenId, actorId)`.

Atualizar `src/infrastructure/container.js` para passar o segundo construtor em `CreateLog`.

---

## 5. `src/infrastructure/container.js`

- Instanciar `UserRepositoryMongo`, `RefreshTokenRepositoryMongo`.
- Instanciar casos de uso de auth (RegisterUser, LoginUser, RefreshTokens, LogoutUser — nomes ilustrativos).
- Ao construir `CreateLog`, passar `(logRepository, gardenRepository)`.
- Demais casos de uso: mesma ordem atual, apenas construtores que passarem a precisar de mais deps já refletidos nos arquivos acima.

---

## 6. Controllers (`src/controllers/`)

| Controller | Alteração |
|------------|-----------|
| `gardens.controller.js` | Em cada handler, `actorId: req.auth.sub` no objeto passado a `execute`. |
| `logs.controller.js` | Idem; `listByGardenId` também precisa de `actorId`. |
| `inventory.controller.js` | Idem. |

**Auth controllers (novo):** `auth.controller.js` — `register`, `login`, `refresh`, `logout` (sem `actorId` em register/login; refresh/logout usam cookie ou body + opcionalmente access para identificar sessão).

---

## 7. Rotas e middleware (`src/routes/`, `src/app.js`)

- Novo: `src/routes/auth.routes.js` — **sem** `authenticate` em register/login; refresh/logout conforme desenho.
- Novo: `src/infrastructure/authenticate.js` (ou `src/middleware/authenticate.js`) — valida JWT access, define `req.auth = { sub }`.
- `gardens.routes.js`, `logs.routes.js`, `inventory.routes.js` — aplicar `router.use(authenticate)` **antes** das rotas protegidas **ou** passar middleware rota a rota.
- `gardens.routes.js`: rota aninhada `/:id/logs` continua protegida pelo mesmo `authenticate` da API.

---

## 8. `src/models/index.js`

- Exportar `User`, `RefreshToken`; reexportar constantes se necessário.

---

## 9. Seed e migração

- `src/seed/mockData.js` / `seed.js`: incluir `ownerId` fixo (ObjectId de um usuário seed criado no mesmo seed).
- Script de migração one-off (opcional): `scripts/migrate-owner-id.js` para dados legados.

---

## 10. Checklist por PR

### PR-1 — Modelos e contrato de dados (sem exigir JWT ainda)

- [ ] Adicionar `User.js`, `RefreshToken.js` em `src/models/`.
- [ ] Alterar `Garden.js`, `Log.js`, `InventoryItem.js` com `ownerId` + índices compostos.
- [ ] Atualizar `src/models/index.js`.
- [ ] Atualizar `src/seed/*` com usuário seed + `ownerId` em todos os mocks.
- [ ] Documentar quebra de compatibilidade do DB em README ou `wiki/`.
- [ ] Rodar seed local e validar índices no Mongo.

**Gate:** aplicação ainda pode subir **sem** proteger rotas (transição); ou feature-flag `REQUIRE_AUTH=false`.

---

### PR-2 — Ports + repositórios com `ownerId` (gardens + inventory)

- [ ] Atualizar `gardenRepository.js` e `inventoryRepository.js` (assinaturas).
- [ ] Implementar filtros em `GardenRepositoryMongo.js` e `InventoryRepositoryMongo.js`.
- [ ] Refatorar **todos** os use cases de `gardens/*` e `inventory/*` para `actorId` + chamadas ao repo com `ownerId`.
- [ ] Ajustar `container.js`.
- [ ] Controllers ainda podem passar `actorId` fixo de teste **ou** stub middleware — preferível já ler `req.auth` com stub em teste de integração.

**Gate:** testes manuais ou automatizados com `actorId` explícito nas chamadas ao container.

---

### PR-3 — Logs + validação de jardim em `CreateLog`

- [ ] Atualizar `logRepository.js` + `LogRepositoryMongo.js`.
- [ ] Refatorar `logs/*` use cases com `actorId`.
- [ ] `CreateLog`: injetar `GardenRepository`, validar posse do `gardenId`, setar `ownerId` no log.
- [ ] `container.js`: wiring de `CreateLog`.
- [ ] Controllers de logs com `actorId`.

**Gate:** não é possível criar log para `gardenId` de outro usuário.

---

### PR-4 — JWT, middleware, rotas protegidas

- [ ] Dependências: `jose` (ou `jsonwebtoken`), bcrypt/argon2.
- [ ] `src/config/auth.js` — secrets, issuer, audience, tempos de vida (via env).
- [ ] Casos de uso + repos: register/login/refresh/logout.
- [ ] `auth.routes.js` + `auth.controller.js`.
- [ ] `authenticate` middleware; aplicar em `gardens`, `logs`, `inventory`.
- [ ] `app.js`: montar `/api/auth`; CORS com credenciais se usar cookie de refresh.
- [ ] Remover stub / flag `REQUIRE_AUTH` se existir.

**Gate:** sem token, `GET /api/gardens` → 401; com token do usuário A, não acessa recurso do B (404).

---

### PR-5 — Endurecimento e DX

- [ ] Rate limit em `/api/auth/*`.
- [ ] `helmet`, `express.json({ limit })`.
- [ ] Ajuste `errorMiddleware` para 500 genérico em produção.
- [ ] Atualizar `GET /api` JSON de documentação com auth.
- [ ] Testes de integração mínimos descritos em PLANO_IMPLEMENTACAO1 §9.

---

## 11. Resumo de arquivos tocados (checklist única)

**Novos (típico):**

- `src/models/User.js`
- `src/models/RefreshToken.js`
- `src/application/ports/userRepository.js`
- `src/application/ports/refreshTokenRepository.js`
- `src/infrastructure/repositories/UserRepositoryMongo.js`
- `src/infrastructure/repositories/RefreshTokenRepositoryMongo.js`
- `src/infrastructure/authenticate.js` (ou `src/middleware/authenticate.js`)
- `src/use-cases/auth/*.js` (vários)
- `src/controllers/auth.controller.js`
- `src/routes/auth.routes.js`
- `src/config/auth.js`

**Alterados:**

- `src/models/Garden.js`, `Log.js`, `InventoryItem.js`, `index.js`
- `src/application/ports/gardenRepository.js`, `logRepository.js`, `inventoryRepository.js`
- `src/infrastructure/repositories/GardenRepositoryMongo.js`, `LogRepositoryMongo.js`, `InventoryRepositoryMongo.js`, `index.js`
- `src/use-cases/gardens/*.js` (10 arquivos)
- `src/use-cases/logs/*.js` (5 arquivos)
- `src/use-cases/inventory/*.js` (6 arquivos)
- `src/infrastructure/container.js`
- `src/controllers/gardens.controller.js`, `logs.controller.js`, `inventory.controller.js`
- `src/routes/gardens.routes.js`, `logs.routes.js`, `inventory.routes.js`
- `src/app.js`, `package.json`, `.env.example`
- `src/seed/seed.js`, `src/seed/mockData.js`

---

## 12. Nota sobre `ObjectId` vs string

- **JWT `sub`:** string.
- **Use cases:** trabalhar com `actorId` string.
- **Repositório:** converter com `mongoose.Types.ObjectId(actorId)` em um helper `toObjectId(actorId)` com try/catch → `ValidationError` se inválido (não deve ocorrer se JWT for gerado pelo sistema).

---

Documento gerado para execução incremental; ordem dos PRs pode fundir PR-2+PR-3 se a equipe preferir um único PR maior de domínio.
