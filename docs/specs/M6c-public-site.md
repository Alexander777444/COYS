# M6c — Public site (GATED: requires Gate G3 and M6a)

**Branch:** `feat/m6c-public-site` · **Depends on:** M6a, M6b shared layer · **Gate:** G4
**Read first:** `rules/frontend.md`, `docs/context/screens.md`, `docs/context/design-system.md`

## Goal
The studio website (dark marketing skin) rendering PUBLISHED projects from the API as a reader.

## Scope (in)
`readerSession.js` (auto-login with the publishable reader credential, re-login once on 401) · W1 Home · W2 Portfolio ·
W3 Project detail · W4 Not found · Playwright WEB-01…04. W5 only if everything else is done.

## Out of scope
Services/Contact pages, inquiry form, CMS editing, SEO work, analytics, animations beyond 200ms transitions.

## Assumptions
Studio name and hero copy are placeholders in `config/site.js`; the developer will replace them.

## Tasks
- [ ] T1 reader session + public layout (nav pill, footer) · [ ] T2 W1 Home · [ ] T3 W2 Portfolio + pagination
- [ ] T4 W3 Detail + W4 · [ ] T5 Polish (375px, hover glow, states) · [ ] T6 `e2e/ui/site.spec.js` (WEB-01…04) · [ ] T7 (optional) W5

## Acceptance criteria
- [ ] A1 Home shows hero + up to 3 featured published projects · [ ] A2 Portfolio shows exactly the 3 PUBLISHED seeds
- [ ] A3 No DRAFT/ARCHIVED data is ever visible (check network responses) · [ ] A4 API stopped → friendly error
- [ ] A5 Usable at 375px and 1280px · [ ] A6 `npx playwright test ui/site` passes
