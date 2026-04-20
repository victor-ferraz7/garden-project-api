# Changelog

Todas as mudanças relevantes do projeto são documentadas aqui. O formato segue o espírito de [Keep a Changelog](https://keepachangelog.com/).

---

## [1.0.0] — 2026-04-19

Consolidação da API **multiusuário** com **JWT access + refresh**, **`ownerId`** em agregados, **TypeScript** no código-fonte, **testes em camadas** (Vitest + Playwright) e endurecimento alinhado ao plano em `wiki/PLANO_IMPLEMENTACAO1*.md`.

### Segurança

- **Refresh token persistido com hash** (`hashedToken`, SHA-256 + comparação em tempo constante), em linha com o desenho descrito no plano de schemas; sessão validada em refresh e logout.
- **Autorização por posse**: repositórios e casos de uso filtram por `ownerId` derivado do JWT (`sub`); recurso de outro usuário tende a **404** (ex.: jardim inexistente para aquele dono).
- **Rate limit** nas rotas `/api/auth/*`; **Helmet** e **limite de body** JSON na aplicação HTTP.

### Adicionado

- Modelos **User** e **RefreshToken**; campos **`ownerId`** em **Garden**, **Log** e **InventoryItem** com índices compostos (`ownerId` + `id` de negócio onde aplicável).
- **Ports** `UserRepository` e `RefreshTokenRepository`; assinaturas dos repositórios com **`ownerId`** explícito nos métodos de leitura/escrita.
- **Casos de uso de auth**: registro, login, refresh (rotação), logout; **`CreateLog`** valida posse do jardim via `GardenRepository`.
- **Middleware `authenticate`**, rotas `/api/auth`, proteção de `/api/gardens`, `/api/logs`, `/api/inventory`.
- **Config JWT** via variáveis de ambiente (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, expirações opcionais).
- **`.env.example`** e notas de **migração de dados** no README.
- **Script opcional** `scripts/migrate-owner-id.js` (`npm run migrate:owner-id`) para dados legados sem `ownerId`.
- **TypeScript** em `src/**/*.ts`; build **`npm run build`** → `dist/`; desenvolvimento com **`tsx watch`**.
- **`src/types/express.d.ts`**: tipagem de `req.auth.sub`.
- **Dockerfile** em duas etapas (build TS + imagem runtime só com `dist/`).
- **Testes**
  - **Vitest**: domínio, casos de uso (ports mockadas), infraestrutura (`mongoId`, hash, JWT, middlewares), integração de **repositórios Mongoose** com MongoDB em memória (carregamento via **`dist/*.js`** após `tsc`).
  - **Playwright** (`tests/integration/api.integration.spec.ts`): contratos HTTP do plano §9 (401, refresh, 404 entre usuários, CRUD de jardim); `webServer` com Mongo em memória (`scripts/integration-test-server.mjs`).
- Scripts npm: `test`, `test:watch`, `test:coverage`, `test:all` (Vitest + Playwright).

### Alterado

- **Ponto de entrada**: `main` / `start` passam a usar **`dist/server.js`**; **`seed`** executa **`node dist/seed/seed.js`** (exige **`npm run build`** antes, inclusive em fluxos Docker após imagem com `dist`).
- **Controllers** passam **`actorId: req.auth.sub`** aos casos de uso em rotas protegidas.
- **README**: arquitetura, auth, migração, TypeScript, matriz de testes e comandos.

### Corrigido / Ajustes de DX

- **Playwright**: `testMatch` restrito a `**/api.integration.spec.ts` para não executar suites **Vitest** sob `tests/integration/repositories/`.
- **Logout**: validação de sessão com hash alinhada ao refresh.

### Compatibilidade (breaking)

- Bases existentes sem **`ownerId`** nos documentos de negócio ou sem **`hashedToken`** nos refresh tokens exigem **seed**, **script de migração** ou **nova sessão** (login) conforme o caso.
- Clientes e automação devem usar **`Authorization: Bearer <access>`** nas rotas protegidas e tratar **401** / **404** conforme a política de não enumerar recursos.

---

## Legenda

- **Adicionado** — novas capacidades.
- **Alterado** — mudanças em comportamento ou API existente.
- **Corrigido** — bugs ou regressões.
- **Segurança** — vulnerabilidades ou endurecimento.
- **Compatibilidade (breaking)** — mudanças que exigem ação de quem integra ou opera o sistema.

---

*Versão do pacote alinhada a `package.json` (`1.0.0`). Ajuste a data da seção `[1.0.0]` ao publicar releases formais.*
