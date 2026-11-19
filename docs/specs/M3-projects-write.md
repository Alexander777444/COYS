# M3 — Projects: write endpoints

**Branch:** `feat/m3-projects-write` · **Depends on:** M2 · **Gate:** G2
**Read first:** skill `create-module`, `api-contract.md`, `database.md`, `errors.md`

## Goal
`POST`, `PUT`, `DELETE` on `/api/v1/projects` with every required code, incl. 409.

## Scope (in)
Body schemas (strict; POST and PUT share the same shape) · repository `create/replace/deleteById`
(slug UNIQUE → `ConflictError`) · service (`crypto.randomUUID()`, existence → 404) · controller
(201 + `Location`, 200, 204 no body) · routes.

## Out of scope
PATCH, soft delete, bulk operations, other resources.

## Tasks
- [ ] T1 Schemas · [ ] T2 Repository · [ ] T3 Service · [ ] T4 Controller + routes

## Acceptance criteria
- [ ] A1 POST valid → 201, `Location` header, body with generated `id`; omitted optionals take defaults
- [ ] A2 POST missing title / bad slug format / bad URL / unknown field / `id` in body / broken JSON → 400
- [ ] A3 POST existing slug (`portfolio-website`) → 409 `CONFLICT`
- [ ] A4 POST no token → 401
- [ ] A5 PUT valid → 200, `updatedAt` changed, `createdAt` unchanged; PUT with its own slug → 200
- [ ] A6 PUT bad body → 400 · PUT `…00ff` valid body → 404 · PUT bad uuid → 400 · no token → 401
- [ ] A7 PUT slug belonging to another project → 409 (documented extra)
- [ ] A8 DELETE existing → 204 empty body; same id again → 404; bad uuid → 400; no token → 401
- [ ] A9 With `db:break`: POST/PUT/DELETE → 500 (then `db:reset`)
