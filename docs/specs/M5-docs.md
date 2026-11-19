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
- [ ] T1 `openapi.yaml` · [ ] T2 Swagger UI wiring (`yaml` package parses the file) · [ ] T3 README · [ ] T4 diagram check

## Acceptance criteria
- [ ] A1 `/api-docs` loads; "Authorize" with a login token makes "Try it out" work for all endpoints
- [ ] A2 Each operation documents exactly the codes from `professor-requirements.md` (plus documented extras)
- [ ] A3 Pasting `openapi.yaml` into an OpenAPI validator shows no errors (state which validator)
- [ ] A4 Mermaid diagrams render on GitHub
