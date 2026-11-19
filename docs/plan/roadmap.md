# Roadmap & status (living document — agents tick TASKS, only the developer ticks GATES)

Today is Wed 2026-11-18. **MVP freeze: Sat 21 (Gate G3). MVP delivery: Mon 23. Frontend: Sun 22, only if G3 passed.**
Presentation date: unconfirmed (see `professor-requirements.md`). Testing list "ready before Friday": ✅ `docs/qa/test-plan.md`.

## Phases and gates

| Phase | Day | Modules | Gate (developer ticks after review) |
|---|---|---|---|
| 0 Foundation | Wed 18 | M0 | [ ] **G0** server runs, DB resets, errors in envelope, `/health` + 404 + 400 JSON work |
| 1 Read + Auth | Thu 19 | M1, M2 | [ ] **G1** login works; GET list/id return 200/400/401/404 |
| 2 Write | Fri 20 | M3 | [ ] **G2** all 5 endpoints return every required code (manual curl evidence) |
| 3 QA + Docs | Sat 21 | M4, M5 | [ ] **G3 = MVP FROZEN** 24 matrix tests green, OpenAPI + Swagger, diagrams, README |
| 4 UX/UI (gated) | Sun 22 | M6a reader role → M6b admin console → M6c public site (`docs/context/screens.md`) | [ ] **G4** admin (A1–A6) + public (W1–W2 at least) + Playwright UI green. Cut from the bottom; skip entirely if G3 is not ticked |
| Delivery | Mon 23 | — | rehearsal in English, final run of the full QA pass, no new features |

If a day slips: cut from the bottom (public W3/W5 → public site → admin P-items → Playwright smoke → extras), never from M0–M5.
Sunday is tight for two interfaces: do M6a first (≈1–2 h), then admin, then public. Monday stays reserved for rehearsal.

## Module tracker

| Module | Spec | Status | Branch |
|---|---|---|---|
| M0 Foundation | `docs/specs/M0-foundation.md` | ⬜ | `feat/m0-foundation` |
| M1 Auth | `docs/specs/M1-auth.md` | ⬜ | `feat/m1-auth` |
| M2 Projects read | `docs/specs/M2-projects-read.md` | ⬜ | `feat/m2-projects-read` |
| M3 Projects write | `docs/specs/M3-projects-write.md` | ⬜ | `feat/m3-projects-write` |
| M4 QA suite | `docs/specs/M4-qa.md` | ⬜ | `feat/m4-qa` |
| M5 Docs | `docs/specs/M5-docs.md` | ⬜ | `feat/m5-docs` |
| M6a Reader role (after G3) | `docs/specs/M6a-reader-role.md` | ⬜ | `feat/m6a-reader-role` |
| M6b Admin console (gated) | `docs/specs/M6b-admin-console.md` | ⬜ | `feat/m6b-admin-console` |
| M6c Public site (gated) | `docs/specs/M6c-public-site.md` | ⬜ | `feat/m6c-public-site` |

Legend: ⬜ todo · 🟡 in progress · 🔎 waiting developer review · ✅ merged by developer.

## Open items (developer / professor)

- [ ] Message to professor: Node + SQLite OK? presentation date? how is req. 10 graded?
- [ ] Rehearse the 10-min talk in English (5 free + 5 Q&A on code)
- [ ] Provide studio name and hero copy for `client/src/config/site.js` (placeholders otherwise)
- [ ] Confirm: admin uses bright workspace panels; danger red as the only extra hue

## Ideas (out of scope — do not build)

(agents append here)
