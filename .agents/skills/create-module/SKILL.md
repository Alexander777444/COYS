---
name: create-module
description: Build or extend a backend module (resource) in COYS following the layered OOP architecture — schemas, repository, service, controller, routes, wiring. Use for any endpoint work (modules M2, M3, or a future resource).
---

# create-module

Use for any backend module. A "module" = one resource with its 5 pieces. Follow the SDD loop in
`.agents/rules/workflow.md`; the spec in `docs/specs/` defines what is in scope.

## Read first
`docs/context/api-contract.md` · `rules/architecture.md` · `rules/errors.md` · `rules/database.md` ·
`docs/context/database-structure.md` · `rules/auth.md` (middleware order).

## Steps (one commit per step)

1. **Schemas** `models/<resource>.schemas.js` — Zod: `idParamsSchema` (`z.uuid()`), `listQuerySchema`
   (`z.coerce.number()` for limit/offset, enum for status), `bodySchema` (`.strict()`), exported by name.
   Messages in English. Rules come ONLY from `api-contract.md`.
2. **Repository** `repositories/<Resource>Repository.js` — class, `#db` injected, prepared statements,
   `toX(row)` mapper, async methods, UNIQUE → `ConflictError`. Nothing else.
3. **Service** `services/<Resource>Service.js` — class, `#repository` injected; generates ids
   (`crypto.randomUUID()`), turns "not found" into `NotFoundError`. No SQL, no `req/res`.
4. **Controller** `controllers/<Resource>Controller.js` — class with arrow-function methods; reads
   `req.validated`, calls ONE service method, sets status (`201` + `Location`, `204` with `res.end()`).
   No `try/catch` (Express 5 forwards rejections).
5. **Routes** `routes/<resource>.routes.js` exports `create<Resource>Routes(controller, authenticate)`;
   each route is `router.METHOD(path, authenticate, validate({...}), controller.method)` — always in that order.
6. **Wiring** — add the module in `routes/index.js` (composition root): repository → service → controller → routes.
7. **Verify** with curl using a real token and paste output:

```bash
TOKEN=$(curl -s localhost:3000/api/v1/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"<from .env>"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
curl -i localhost:3000/api/v1/projects -H "Authorization: Bearer $TOKEN"
curl -i localhost:3000/api/v1/projects/not-a-uuid -H "Authorization: Bearer $TOKEN"      # 400
curl -i localhost:3000/api/v1/projects/00000000-0000-4000-8000-0000000000ff -H "Authorization: Bearer $TOKEN"  # 404
curl -i localhost:3000/api/v1/projects                                                   # 401
```
8. **Sync docs** — if behavior changed: `api-contract.md`, `test-plan.md`, tick the spec, update `roadmap.md`.

## Checklist before reporting
- [ ] No SQL outside the repository · [ ] no business rules in the controller · [ ] constructor injection
- [ ] every status code in the spec verified with evidence · [ ] error envelope identical everywhere
- [ ] each new file starts with a 1–3 line purpose comment · [ ] no extra dependency, no extra endpoint
