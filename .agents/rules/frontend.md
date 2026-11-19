# Frontend (GATED — read this before touching `client/`)

**Forbidden until the developer ticks Gate G3 (MVP frozen) in `docs/plan/roadmap.md`.**
If G3 is not ticked, do not create components, styles or UI tests.

## What and in which order

Two interfaces (public site + admin console) in ONE React app. Screens, routes, states, error mapping and
client structure: `docs/context/screens.md`. Styling: `docs/context/design-system.md`.
Order: M6a (reader role, API) → M6b (admin console) → M6c (public site). Follow the SDD loop in `workflow.md`.
Cut from the bottom of the priority list in `screens.md` when time is short.

## Rules

- React + Vite. **No UI kit.** Styling = plain CSS + CSS Modules (`*.module.css`) using only the tokens from
  `client/src/styles/tokens.css`; never hard-code colors, radii or spacing.
- Allowed dependencies: `react`, `react-dom`, `react-router-dom`, `@fontsource-variable/inter`,
  `@fontsource/jetbrains-mono` (self-hosted fonts; verify package names at install). Nothing else without asking.
- The client must not require API changes beyond M6a. If it seems to, stop and ask.
- All API calls go through `client/src/api/httpClient.js`, which also maps errors (see `screens.md`).
- Admin token lives in memory (React state); never localStorage/sessionStorage; never log tokens.
- The reader credential comes from `VITE_READER_USERNAME` / `VITE_READER_PASSWORD`; the admin base path from
  `VITE_ADMIN_BASE_PATH` (default `/admin`); the API from `VITE_API_URL`. Provide `client/.env.example`.
- Public nav never links to the admin. Admin routes set `noindex`.
- Studio name and copy come from `client/src/config/site.js`; do not invent brand copy beyond clear placeholders.
- All UI text, file names, component names and comments in English.
- Components: small, one responsibility, 1–3 line header comment.
- Accessibility baseline and contrast rules: `design-system.md` (never use steel/slate for text on dark).
