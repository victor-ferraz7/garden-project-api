# Pull Request — `feat/finalize-backend` → `develop` (ou `main`)

**Abrir PR:** [Create pull request (GitHub)](https://github.com/victor-ferraz7/garden-project-api/pull/new/feat/finalize-backend)

## Título sugerido

```
feat!: API multi-tenant, TypeScript, testes e Docker
```

## Resumo

Entrega alinhada ao plano de implementação: **autenticação JWT** (access + refresh com hash), **isolamento por `ownerId`** em jardins, inventário e logs, **código em TypeScript** com build para `dist/`, **testes** (Vitest por camada + Playwright HTTP), **Docker** multi-stage e **documentação** (README, CHANGELOG, wiki, `.env.example`, script de migração `ownerId`).

## Breaking changes

- Rotas de negócio passam a exigir **Bearer**; registo/login/refresh em **`/api/auth`**.
- Dados existentes precisam de **`ownerId`** (ver `scripts/migrate-owner-id.js` e README).

## Commits (ordem)

| Commit     | Descrição breve                          |
|-----------|-------------------------------------------|
| `9bc316f` | feat!: auth multi-tenant, `ownerId`, TS  |
| `fa2488c` | test: Vitest, Playwright, scripts `dist` |
| `edb46c8` | build(docker): imagem e compose         |
| `23c996a` | docs: README, CHANGELOG, wiki, env       |

## Como validar localmente

```bash
npm ci
npm run build
npm test
npm run test:all   # inclui Playwright, se configurado
```

## Checklist (opcional no GitHub)

- [ ] Variáveis em `.env` / secrets no repositório não commitados
- [ ] Migração `ownerId` aplicada ou planeado em ambientes com dados antigos
- [ ] CI (se existir) a correr `build` + `test`

---

*Documento gerado para colar no corpo do PR; pode editar o título e o branch base no GitHub.*
