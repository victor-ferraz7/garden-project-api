# Plano de implementação — Autenticação e autorização (JWT + refresh + claims)

Contexto: **gp-api** hoje não tem modelo de usuário nem `ownerId` nos documentos; jardins usam `id` string de negócio, logs usam `gardenId`, estoque usa `id` string. O plano abaixo assume **multiusuário** (cada recurso pertence a um usuário identificado pelo **`sub`** do JWT).

---

## 1. Decisão de arquitetura (o que adotar)

| Opção | Quando faz sentido |
|--------|---------------------|
| **JWT access + refresh (implementação própria)** | Controle total, stack já é Node/Mongo, equipe pequena, sem dependência de IdP pago no curto prazo. |
| **OAuth2 / OpenID (Auth0, Cognito, Keycloak, Clerk)** | SSO, MFA, compliance, menos código de auth “sensível”. |
| **API Gateway + JWT validado no gateway** | Vários serviços atrás do gateway; a API valida só assinatura ou confia no header injetado (com cuidado com spoofing). |

**Recomendação para este repositório:** **JWT access + refresh com rotação**, persistência de **refresh tokens** no Mongo (ou Redis depois), **claims mínimos** no access token, e **autorização por posse** (`userId` / `ownerId`) nos agregados. OAuth2 pode ser **fase 2** (substituir login por “Sign in with Google” mantendo o mesmo `sub` interno).

**Motivo alinhado ao código atual:** o projeto já tem camadas (controllers → use cases → repos); a autorização encaixa melhor como **regra explícita nos casos de uso** ou **serviço de autorização** injetado, sem misturar tudo no middleware.

---

## 2. Modelo de identidade e dados

### 2.1 Entidade `User`

- Campos sugeridos: `email` (único, normalizado), `passwordHash` (bcrypt/argon2), `createdAt`, opcional `emailVerified`.
- **Não** armazenar senha em texto; usar **Argon2id** ou **bcrypt** (custo adequado).

### 2.2 Vínculo recurso → usuário

- Adicionar **`ownerId`** (string ou ObjectId consistente com `User._id`) em:
  - **Garden** (obrigatório em create; índice composto `{ ownerId: 1, id: 1 }` se `id` for único por usuário, ou único global `id` + `ownerId` dependendo do produto).
  - **Log:** ou `ownerId` redundante **ou** validação transitiva: “log só existe se `gardenId` pertence ao `ownerId`” (preferível **uma fonte de verdade**: inferir pelo jardim na escrita; em leitura filtrar por jardins do usuário ou indexar `ownerId` no log para performance).
  - **InventoryItem:** mesmo padrão (`ownerId`).

**Decisão de produto a travar antes de codar:**

- **`id` de jardim/estoque é único global ou por usuário?**  
  - Se o cliente gera `id`: recomendo **único por `(ownerId, id)`** ou migrar para `id` gerado no servidor.  
  - Se mantiver `id` global único: qualquer usuário poderia adivinhar outro `id` — aí **autorização obrigatória em todo GET/PUT/DELETE** por `ownerId`.

### 2.3 Refresh token

- Coleção `RefreshToken`: `userId`, `jti` (id único do token), `hashedToken` (hash do valor aleatório enviado ao cliente), `expiresAt`, `revokedAt`, `replacedBy` (rotação), `userAgent`/`ip` opcional para auditoria.
- Política: **rotação a cada refresh**; invalidar cadeia em caso de reuso (detecção de roubo).

---

## 3. Contrato dos tokens (claims mínimos)

**Access JWT (curta duração, ex.: 10–15 min)**

- `sub`: id do usuário (string estável).
- `typ`: `"access"`.
- Opcional: `email` **somente se necessário** no BFF; ideal é **não** colocar PII se não for usada em toda request.

**Refresh JWT ou opaco (7–30 dias)**

- Se JWT: claims `sub`, `typ: "refresh"`, `jti`; validade longa; validação cruzada com o que está no Mongo (revogação).
- **Entrega ao cliente:** preferir **httpOnly + Secure + SameSite** cookie para refresh; access token pode ser **memória** no front ou header `Authorization` (trade-off com XSS).

---

## 4. Superfície HTTP (rotas novas)

1. `POST /api/auth/register` — email + senha; retorna **apenas** access (e set-cookie refresh se adotar cookie).
2. `POST /api/auth/login` — mesmo contrato.
3. `POST /api/auth/refresh` — lê refresh (body ou cookie); emite novo par; rotação.
4. `POST /api/auth/logout` — revoga refresh atual (e opcionalmente todos do usuário).
5. (Opcional) `POST /api/auth/logout-all` — revogar todos os refresh tokens do `sub`.

**Proteção:** rate limit agressivo em `login`/`register`/`refresh`.

---

## 5. Integração na arquitetura existente

### 5.1 Middleware Express

- `authenticate`: valida access JWT, popula `req.auth = { sub, ... }`.
- **Não** decidir “pode editar este jardim?” só no middleware genérico; delegar a **use case + repositório** com filtro `ownerId`.

### 5.2 Controllers / use cases

- Passar `actorId` (do `req.auth.sub`) para **todos** os casos de uso que leem/escrevem dados sensíveis.
- Alterar assinaturas: `execute(input, context)` ou `execute({ ...input, actorId })` — escolher um padrão e aplicar em massa.
- Repositórios: métodos `findByIdAndOwner(id, ownerId)`, `findAll(filter, ownerId)`, etc., para **nunca** retornar documento de outro usuário (defense in depth além do use case).

### 5.3 Rotas existentes

- Aplicar `authenticate` em:
  - `/api/gardens/*`
  - `/api/logs/*` (incluindo aninhado em gardens se existir)
  - `/api/inventory/*`
- Manter **`/health`** e decidir se **`GET /api`** (documentação) fica público ou protegido.

---

## 6. Migração de dados

1. Script de migração: criar usuário “legado” ou exigir **primeiro login** que “reivindica” dados (só se houver dados em produção sem dono).
2. Se ambiente só tem seed de dev: **recriar seed** com `ownerId` fixo de um usuário seed.
3. Índices Mongo após adicionar `ownerId`.

---

## 7. Segurança operacional (junto da auth)

- **HTTPS** obrigatório em produção.
- **CORS** restrito às origens do app; se usar cookie refresh, CORS + credenciais precisam estar corretos.
- **Helmet**, **limite de body**, **rate limit** nas rotas de auth.
- Em **erro 500**, não vazar stack; logs só no servidor.

---

## 8. Fases de entrega (sprints lógicas)

| Fase | Entregável | Critério de pronto |
|------|------------|---------------------|
| **F0** | Decisões travadas | Modelo de unicidade de `Garden.id` / `InventoryItem.id`; cookie vs header para refresh; durações dos tokens. |
| **F1** | User + hash + register/login | Usuário criado, senha nunca em claro no log; testes de integração mínimos. |
| **F2** | JWT access + refresh persistido + refresh rotação | Logout revoga; reuso de refresh detectável (opcional mas recomendado). |
| **F3** | `ownerId` em schemas + migração/seed | Todos os documentos de exemplo com dono. |
| **F4** | Middleware + refatoração use cases/repos | Nenhuma rota de negócio acessível sem token válido; impossível ler jardim de outro `sub` por URL. |
| **F5** | Endurecimento | Rate limit, Helmet, CORS, mensagens de erro genéricas em prod. |

---

## 9. Testes mínimos a exigir antes de “pronto”

- Login com credenciais erradas → 401, sem vazar se email existe.
- Access expirado → 401; refresh válido → novo access.
- Acesso a recurso de outro `sub` → **404** (preferível a 403 para não enumerar recursos) ou **403** se política do produto for transparente.
- CRUD completo de um jardim isolado por `ownerId`.

---

## 10. Dependências npm sugeridas

- `jsonwebtoken` ou `jose` (preferível **jose** para APIs modernas e menos footguns).
- `bcrypt` ou `@node-rs/argon2`.
- Opcional: `express-rate-limit`, `helmet`, validação com `zod` nos bodies de auth.

---

## 11. Detalhamento de schema e PRs (execução)

O detalhamento de **schemas Mongoose**, **alteração de assinaturas** (ports, repositórios, cada caso de uso, `container`, controllers) e **checklist por PR** está em:

**[PLANO_IMPLEMENTACAO1_SCHEMA_E_PRS.md](./PLANO_IMPLEMENTACAO1_SCHEMA_E_PRS.md)**