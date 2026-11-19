# Decisions (ADR log)

Add a row for every architectural change. Format: decision → why (this is what we defend).

| # | Date | Decision | Why |
|---|---|---|---|
| 1 | 2026-11-18 | The API is the project; the website is a later client (headless CMS) | The professor grades a REST API with CRUD and a DB |
| 2 | 2026-11-18 | Node.js + Express 5, plain JavaScript (ES Modules + classes) | One language end to end; the developer already masters it; classes satisfy OOP |
| 3 | 2026-11-18 | SQLite file via `better-sqlite3` | Relational + SQL like MySQL; zero setup; reset = recreate a file (repeatable QA); DBeaver opens it |
| 4 | 2026-11-18 | Cloudflare D1 deferred | D1 is only reachable from Workers: moving there means moving the whole server; same SQLite dialect keeps the path open |
| 5 | 2026-11-18 | Relational (not NoSQL) | Fixed structure; the DB itself enforces `UNIQUE slug` (→ 409, safe under concurrency) and `CHECK status` |
| 6 | 2026-11-18 | Raw SQL in repositories, no ORM | The Q&A is about the code: showing the SQL proves understanding |
| 7 | 2026-11-18 | Zod validation | Produces every 400 in one place |
| 8 | 2026-11-18 | JWT, single user from env, no roles/403 | Enough to produce 401 everywhere; users table and roles are post-MVP |
| 9 | 2026-11-18 | Invalid data → **400** (never 422); oversize body → **400** | 422 and 413 are not in the professor's table |
| 10 | 2026-11-18 | PUT (full replacement) | Allowed by the professor; PATCH is a future improvement |
| 11 | 2026-11-18 | PUT with a slug used by another project → 409 | Not in the professor's PUT list; documented as an extra |
| 12 | 2026-11-18 | Role QA: Bruno (contract suite, 24 cases) + Playwright (API smoke now, UI after MVP) | Bruno was shown in class; Playwright covers automation and later UI |
| 13 | 2026-11-18 | SDD workflow, context stored in the repo as MD | The developer does not depend on any chat; any agent can resume from the files |
| 14 | 2026-11-18 | Git: agent commits per section on a feature branch, never pushes/merges | Developer reviews every diff before it reaches `main` |
| 15 | 2026-11-18 | Frontend gated behind Gate G3 | The professor grades the API; UX/UI must not endanger the MVP |
| 16 | 2026-11-18 | Demo runs locally; AWS/Cloudflare deploy are future work | Demo must not depend on internet; deployment is not graded |
| 17 | 2026-11-18 | The frontend is an admin console, not the public website | The API requires auth on every endpoint and has one user; a public site would need a read-only credential (future) |
| 18 | 2026-11-18 | Everything in the repo is English (files, code, docs, UI text, agent reports) | Professor requirement for code; presentation in English gives +10 points |
| 19 | 2026-11-18 | `react-router-dom` is the only extra client dependency; token kept in memory | Real URLs make Playwright flows testable; memory storage avoids XSS-exposed tokens in localStorage |
| 20 | 2026-11-18 | Two interfaces (public site + admin console) in one React app, two route trees | The API is the studio's headless CMS; the admin proves graded CRUD, the site proves the purpose; shared components save time |
| 21 | 2026-11-18 | Visual style: LaunchDarkly style from styles.refero.design, implemented as tokens + plain CSS/CSS Modules (no UI kit) | The reference is a style, not a library; keeps dependencies minimal and the code explainable |
| 22 | 2026-11-18 | Admin = bright white workspace panels on the dark shell; public = dark marketing skin | The style's own rule (real product UI is bright); better readability for tables/forms |
| 23 | 2026-11-18 | Fixed defects in the provided tokens (invalid `#0e0e0`, range-valued layout tokens, placeholder fonts); steel/slate banned for text on dark; one extra hue (danger) allowed | Computed contrast: steel 2.51:1 and slate 3.45:1 fail AA; errors must be distinguishable |
| 24 | 2026-11-18 | Public site uses a publishable `reader` credential (read-only, PUBLISHED only) shipped in the bundle; module M6a after G3 | The API requires auth on every endpoint; a browser app cannot keep a secret, so the credential must be harmless by design |
| 25 | 2026-11-18 | Secret-looking admin base path is cosmetic only; security = login + API checks | URLs leak and client code is public |
| 26 | 2026-11-18 | Better Auth deferred to after delivery (will replace `AuthService`/`authenticate`) | Adds ESM/handler-order/CLI-migration/error-format work and hides logic from the code Q&A; valuable once real users and roles exist |
| 27 | 2026-11-18 | Fonts self-hosted with `@fontsource` (Inter, JetBrains Mono) | Demo must work offline; Söhne is licensed |
