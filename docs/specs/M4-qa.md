# M4 — QA suite (professional-context role)

**Branch:** `feat/m4-qa-suite` · **Depends on:** M3 · **Gate:** G3
**Read first:** `rules/testing.md`, skill `write-tests`, `docs/qa/test-plan.md`

## Goal
Executable proof for every row of the test matrix, runnable with a documented sequence.

## Scope (in)
Bruno collection `api-tests/` (folders `main/`, `empty-state/`, `server-error/`, env `local`) covering all
24 required cases + the extras listed in `test-plan.md` · Playwright API smoke in `e2e/api/` (**Should**:
cut first if late) · fill the Result column of `test-plan.md` · `docs/qa/bug-log.md`.

## Out of scope
UI tests, load tests, Jest/Supertest, CI pipeline.

## Tasks
- [x] T1 Bruno collection skeleton + env + login request that stores `{{token}}`
- [x] T2 `main/` cases (200/201/204/400/401/404/409) for all 5 endpoints
- [x] T3 `empty-state/` and `server-error/` folders (500 for all 5 endpoints)
- [x] T4 Run the full pass from `rules/testing.md`; record results
- [ ] T5 Playwright API smoke (`e2e/playwright.config.js`, `e2e/api/smoke.spec.js`) — Should; deferred by the developer (no Playwright in M4)
- [x] T6 Update `test-plan.md` Result column; log any bug found in `bug-log.md`

## Acceptance criteria
- [x] A1 All 24 matrix IDs exist as tests and pass (Bruno summary: 61 requests, 196/196 assertions per pass)
- [x] A2 Every test asserts status code and error `code`/shape
- [x] A3 The whole pass is repeatable twice in a row from `db:reset` with identical results
- [x] A4 Deliberately breaking one behavior makes at least one test fail (a seed row was removed; `LIST-200-01` failed, then `db:reset` restored it)
