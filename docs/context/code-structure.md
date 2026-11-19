# Code structure (descriptive map — the rules are in `.agents/rules/architecture.md`)

## Request flow

```mermaid
flowchart LR
  C[Client / Bruno / Playwright] --> R[Route]
  R --> A[authenticate]
  A --> V[validate - Zod]
  V --> K[Controller]
  K --> S[Service]
  S --> P[Repository]
  P --> D[(SQLite)]
  A -. error .-> E[errorHandler]
  V -. error .-> E
  S -. error .-> E
  P -. error .-> E
  E --> C
```

## Classes

```mermaid
classDiagram
  class ProjectController { -service  +list() +getById() +create() +replace() +remove() }
  class ProjectService { -repository  +list() +getById() +create() +replace() +remove() }
  class ProjectRepository { -db  +findAll() +findById() +create() +replace() +deleteById() }
  class AuthController { -service  +login() }
  class AuthService { -config  +login() }
  class AppError { +statusCode +code +details }
  AppError <|-- ValidationError
  AppError <|-- UnauthorizedError
  AppError <|-- NotFoundError
  AppError <|-- ConflictError
  ProjectController --> ProjectService
  ProjectService --> ProjectRepository
  AuthController --> AuthService
```

## Sequence: POST with a duplicate slug (409)

```mermaid
sequenceDiagram
  participant C as Client
  participant M as authenticate + validate
  participant K as ProjectController
  participant S as ProjectService
  participant R as ProjectRepository
  participant D as SQLite
  participant E as errorHandler
  C->>M: POST /api/v1/projects (Bearer token, body)
  M->>K: req.validated.body
  K->>S: create(data)
  S->>R: create({ id, ...data })
  R->>D: INSERT (prepared statement)
  D-->>R: SQLITE_CONSTRAINT_UNIQUE
  R-->>E: throw ConflictError
  E-->>C: 409 { error: { code: CONFLICT } }
```

## Folder map

See `.agents/rules/project.md` (Folder layout). Wiring (composition root): `server/src/routes/index.js`
builds `db → ProjectRepository → ProjectService → ProjectController → routes`.

## Where does X live? (quick answers)

| Need | File |
|---|---|
| a new env var | `config/env.js` + `.env.example` |
| a new SQL query | `repositories/ProjectRepository.js` |
| a business rule (exists? generate id) | `services/ProjectService.js` |
| input validation | `models/project.schemas.js` |
| a new HTTP error | `errors/` + mapping in `rules/errors.md` |
