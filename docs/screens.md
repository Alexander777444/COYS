# Screens — two interfaces in one React app (only after Gate G3)

The COYS API is the **headless CMS backend of the studio's website**. We build both of its clients:

| Interface | Base path | Purpose | Surface |
|---|---|---|---|
| **Public site** | `/` | The studio website: shows PUBLISHED portfolio projects | dark marketing skin |
| **Admin console** | `/admin` (configurable) | Manage content; proves the 5 graded CRUD endpoints | bright workspace on dark shell |

Styling: `docs/context/design-system.md`. One React app, two route trees, shared components. All UI text is English.
The studio's name and copy live in `client/src/config/site.js` (placeholders until the developer supplies them).

## Access control (be honest in the defense)

| Interface | Credential | Enforcement |
|---|---|---|
| Public | A **publishable reader credential** (role `reader`, module M6a): read-only and sees PUBLISHED projects only. It ships in the browser bundle on purpose; leaking it exposes nothing that is not already public | the **API**: reader writes → 403; reader never receives DRAFT/ARCHIVED |
| Admin | Admin login (screen A1) | the **API** (401/403). The UI route guard is only convenience |

The admin base path comes from `VITE_ADMIN_BASE_PATH` (default `/admin`; may be a secret-looking segment such as
`/admin-7f3k9q`). That is **obscurity, not security**: URLs leak and the client code is public. Real protection =
login + API checks. The public nav never links to the admin; admin pages set `<meta name="robots" content="noindex">`.

## Priorities and cut order

P1 = must · P2 = should · P3 = nice. **Cut from the bottom** if time runs out.
Order of work: shared layer → admin P1 → admin P2 (full CRUD) → public P1 → public P2 → P3.

## Public site screens

| ID | Route | Screen | API | Pri |
|---|---|---|---|---|
| W1 | `/` | Home: nav pill, two-line hero (white + violet), CTA "View portfolio", featured grid (first 3 published), footer | `GET /projects?limit=3` | P1 |
| W2 | `/portfolio` | Portfolio: responsive 3-column card grid, pagination (`limit=9`) | `GET /projects?limit&offset` | P1 |
| W3 | `/portfolio/:id` | Project detail: title, description, technology tags, project/repository links | `GET /projects/{id}` | P2 |
| W4 | `*` | Not found | — | P1 |
| W5 | `/` section | "Content delivered by API": code block showing a real JSON response (explains the headless CMS) | same call as W1 | P3 |

States for every data screen: loading (skeleton) · empty ("No projects published yet") · error with Retry
(friendly, never raw server text). Detail URLs use the `id` (the contract has no by-slug endpoint; future improvement).
Services and Contact pages need future resources (`/services`, `/inquiries`) and are NOT in scope.

## Admin console screens

| ID | Route (relative to admin base) | Screen | API | Pri |
|---|---|---|---|---|
| A1 | `/login` | Login | `POST /auth/login` | P1 |
| A2 | `/projects` | List: segmented status filter, table, pagination (20), "New project" | `GET /projects?status&limit&offset` | P1 |
| A3 | `/projects/:id` | Detail with Edit / Delete | `GET /projects/{id}` | P1 |
| A4 | `/projects/new`, `/projects/:id/edit` | Create / edit form | `POST`, `GET`+`PUT` | P1 |
| A5 | modal on A3 | Delete confirmation | `DELETE /projects/{id}` | P1 |
| A6 | `*` | Not found | — | P1 |

Admin CRUD (A4, A5) is P1 because proving the graded endpoints is the admin's whole purpose.
Admin base redirects to `/projects`; no token → `/login`.

```
+----------------------------------------------------------------+
|  ( COYS Admin   Projects                    New project  Sign out )   <- nav pill (dark)
|                                                                  |
|  +-- white workspace panel --------------------------------------+
|  |  ( All ) ( Draft ) ( Published ) ( Archived )   <- segmented  |
|  |  Title             Status        Technologies      Updated    |
|  |  Portfolio Site    [PUBLISHED]   Node.js React     Jan 5      |
|  |  ...                                                          |
|  |  Showing 1–5 of 5                      [Previous] [Next]      |
|  +---------------------------------------------------------------+
+----------------------------------------------------------------+
```

### Screen details

- **A1 Login:** username + password, "Sign in" (disabled while submitting). 401 → "Invalid username or password";
  400 → field messages; 500/network → friendly retry. Token kept in memory (React state), never localStorage.
- **A2 List:** row opens A3; changing the filter resets `offset` to 0; status badge always shows text;
  states loading / empty (with New project) / error (Retry).
- **A3 Detail:** all fields; links open in a new tab with `rel="noopener noreferrer"`; 404 → "Project not found".
- **A4 Form:** fields and limits exactly as `api-contract.md`; technologies = comma-separated input → array; slug
  auto-suggested from the title until edited; client checks mirror server rules (server is the authority);
  400 `details` → under each field; 409 → under slug "This slug is already in use"; edit pre-fills via GET and sends
  **all** fields with PUT; success → A3; submit disabled while sending; data kept on failure.
- **A5 Delete:** "Delete '<title>'? This cannot be undone."; 204 → back to A2 with a confirmation message;
  404 → "Already deleted"; focus trapped, Esc cancels.

## API error → UI mapping (one place: `client/src/api/httpClient.js`)

| API result | UI behavior |
|---|---|
| 400 `VALIDATION_ERROR` | field-level messages from `error.details` |
| 401 (admin) | clear token, go to admin login, "Your session expired" |
| 401 (public reader) | silently log in again once; if it fails, friendly error state |
| 403 | "You do not have permission" (should not happen in the UI) |
| 404 `NOT_FOUND` | not-found state of that screen |
| 409 `CONFLICT` | slug field message |
| 500 / network failure | friendly message + Retry; never raw server text |

## Client structure (English names)

```
client/src/
  config/      site.js (studio name, nav links, API url, admin base path)
  styles/      tokens.css · base.css
  api/         httpClient.js · authApi.js · projectsApi.js
  auth/        AdminAuthContext.jsx · readerSession.js
  components/  NavPill · Button · Input · Tag · Card · SegmentedControl · Pagination · ConfirmDialog
               ErrorMessage · LoadingIndicator · StatusBadge · WorkspacePanel      (each with *.module.css)
  site/        HomePage · PortfolioPage · ProjectPage · NotFoundPage
  admin/       AdminLayout · LoginPage · ProjectsListPage · ProjectDetailPage · ProjectFormPage · NotFoundPage
  App.jsx (route trees) · main.jsx
```

## Playwright UI tests (`e2e/ui/`; also listed in `docs/qa/test-plan.md`)

| ID | Flow |
|---|---|
| ADMIN-01 | login success → lands on list |
| ADMIN-02 | wrong password → error message |
| ADMIN-03 | list shows the 5 seeded projects |
| ADMIN-04 | status filter shows only PUBLISHED (3) |
| ADMIN-05 | open detail from list |
| ADMIN-06 | create a project → appears in detail |
| ADMIN-07 | duplicate slug → inline 409 message |
| ADMIN-08 | edit a project → updated value shown |
| ADMIN-09 | delete with confirmation → gone from list |
| ADMIN-10 | no token → redirected to admin login |
| ADMIN-11 | API stopped → friendly error, not a blank page |
| WEB-01 | home renders hero and at most 3 featured projects |
| WEB-02 | portfolio shows exactly the 3 PUBLISHED seeds (no DRAFT/ARCHIVED) |
| WEB-03 | open a project from a card |
| WEB-04 | API stopped → friendly error |
