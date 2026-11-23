# M5 — Documentation

**Branch:** `feat/m5-docs` · **Depends on:** M3 · **Gate:** G3
**Read first:** `api-contract.md`, `errors.md`, `code-structure.md`, `database-structure.md`

## Goal
OpenAPI YAML served by Swagger UI, valid diagrams, README ready for the professor.

## Scope (in)
`docs/openapi.yaml` (OpenAPI 3.0.3: bearer security scheme, all 7 endpoints, every status code with the
error schema and an example) · Swagger UI at `/api-docs` mounted **before** `helmet()` (helmet's CSP breaks
Swagger UI otherwise) · confirm the 4 Mermaid diagrams render · README (run, test, structure, how the QA role was applied).

## Out of scope
Generating code from OpenAPI, Redoc, extra docs.

## Tasks
- [x] T1 `openapi.yaml` · [x] T2 Swagger UI wiring (`yaml` package parses the file) · [x] T3 README · [x] T4 diagram check (static syntax check; GitHub render not executed in this environment)

## Acceptance criteria
- [ ] A1 `/api-docs` loads; "Authorize" with a login token makes "Try it out" work for all endpoints (automated check: `/api-docs` returns 200 HTML and serves parsed `swaggerDoc`; manual "Authorize"/"Try it out" click-through still needs developer review)
- [x] A2 Each operation documents exactly the codes from `professor-requirements.md` (plus documented extras: `PUT 409`, `ROUTE_NOT_FOUND` as a real 404 code, and 401 `WWW-Authenticate`/token-error examples)
- [x] A3 `docs/openapi.yaml` parsed with the `yaml` package (`YAML.parse`) and the served Swagger init script was parsed as JSON; no external validator was run via `npx`
- [ ] A4 Mermaid diagrams render on GitHub (static syntax sanity-checked locally; full GitHub render not verified in this environment)

## Verification notes
- YAML parsed with `server/node_modules/yaml` and served spec extracted from `/api-docs/swagger-ui-init.js`.
- Swagger UI mounted before `helmet()` in `server/src/app.js`; `/health` still returns helmet headers, and `/api-docs` returns 200 HTML without CSP.
- Bruno main pass from fresh `db:reset`: 46/46 requests, 145/145 assertions, PASS.
- Mismatch check: OpenAPI status codes match the professor table and observed Bruno/code behavior; no business-logic code changes made.
