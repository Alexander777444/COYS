# M6b — Admin console (GATED: requires Gate G3)

**Branch:** `feat/m6b-admin-console` · **Depends on:** G3 (M6a not required) · **Gate:** G4
**Read first:** `rules/frontend.md`, `docs/context/screens.md`, `docs/context/design-system.md`, `docs/context/api-contract.md`

## Goal
Bright-workspace admin UI that exercises all 5 graded endpoints.

## Scope (in)
Shared layer (tokens, base styles, fonts, NavPill, Button, Input, Tag, SegmentedControl, WorkspacePanel, dialogs, states,
`httpClient`) · screens A1–A6 · admin route guard · configurable admin base path · Playwright ADMIN-01…11.

## Out of scope
Public pages, API changes, state libraries, UI kits, dark/light toggle, i18n.

## Assumptions
(agent writes any assumption here before coding)

## Tasks
- [ ] T1 Vite cleanup; install allowed deps; copy tokens; `base.css`; `config/site.js`; `.env.example`
- [ ] T2 Shared components + `httpClient` error mapping · [ ] T3 Admin layout, route guard, A6
- [ ] T4 A1 Login · [ ] T5 A2 List + A3 Detail · [ ] T6 A4 Form · [ ] T7 A5 Delete modal
- [ ] T8 Polish: focus styles, 375px layout, empty/error states · [ ] T9 `e2e/ui/admin.spec.js` (ADMIN-01…11)

## Acceptance criteria
- [ ] A1 Fresh `db:reset`: login → list (5) → detail works · [ ] A2 create, edit, delete work; duplicate slug shows inline 409
- [ ] A3 API stopped → friendly error with Retry · [ ] A4 `/admin/projects` without token → login
- [ ] A5 Usable at 375px and 1280px; contrast rules in `design-system.md` respected
- [ ] A6 `cd e2e && npx playwright test ui/admin` passes
