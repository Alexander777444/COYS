# AGENTS.md — COYS (Studio Portfolio API)

Entry point for every coding agent. All context lives in this repo (`.agents/` and `docs/`),
never in a chat. If something is not written here, ask the developer; do not guess.

## Project in one paragraph

REST API (Node.js + Express 5, plain JavaScript ES Modules, SQLite) that manages the portfolio
projects of a software studio. University final project graded on: 5 web services, correct HTTP
status codes, OOP, resource-oriented design, OpenAPI YAML, diagrams, and a professional-context
role (**QA**). **Priority: the MVP the professor requires, and nothing else, by Monday.**
UX/UI + frontend only after the MVP gate passes (see `docs/plan/roadmap.md`).
The developer is learning and must explain every line: clarity beats cleverness.

## Start of every session (mandatory)

1. Read `.agents/rules/workflow.md`, `project.md`, `architecture.md`.
2. Read `docs/plan/roadmap.md` → find the current module and its spec in `docs/specs/`.
3. Read the extra files listed in the router for your task.
4. Reply first with: files read, current module, and your short plan. Then work.

## Router

| Task | Also read |
|---|---|
| Config, wiring, scripts | `project.md`, `docs/context/code-structure.md` |
| Database / repository / seeds | `rules/database.md`, `docs/context/database-structure.md` |
| Errors | `rules/errors.md`, `docs/context/api-contract.md` |
| Auth | `rules/auth.md`, `rules/errors.md` |
| Any endpoint | `docs/context/api-contract.md`, `rules/errors.md`, skill `create-module` |
| Tests (Bruno / Playwright) | `rules/testing.md`, `docs/qa/test-plan.md`, skill `write-tests` |
| OpenAPI, diagrams, README | `docs/context/api-contract.md`, `docs/context/code-structure.md` |
| Frontend (only after MVP gate) | `rules/frontend.md`, `docs/context/screens.md`, `docs/context/design-system.md` |
| Anything the professor graded | `docs/context/professor-requirements.md` |

Rules: `.agents/rules/*.md` · Skills: `.agents/skills/<name>/SKILL.md`.

## Hard rules

- **Language: everything is English** — folder names, file names, code, comments, commit messages, API messages,
  UI text, documentation and your reports. No Spanish anywhere in the repo.
- **Plain JavaScript.** No TypeScript, ORM or new framework. Dependencies: only `project.md` allowed list.
- **Scope:** do exactly the current spec. No extras, no unrequested refactors. Out-of-scope ideas →
  write them under "Ideas" in `docs/plan/roadmap.md`, do not build them.
- **Git (strict):**
  - Work on a branch named `feat/<module>-<short-name>` (e.g. `feat/m2-projects-read`). Never commit on `main`.
  - Commit locally **per section** (one logical piece = one commit), Conventional Commits in English
    (`feat(db): add projects migration`). Each commit must leave the server startable.
  - **Never** `git push`, `merge`, `rebase`, `reset --hard`, `commit --amend` on shared history,
    force anything, delete branches, create tags, or change git config.
  - Stage files explicitly (`git add <path>`), never `git add .`. Never commit `.env` or `*.sqlite`.
  - If unrelated uncommitted changes exist, stop and ask.
  - After the last commit, STOP. The developer reviews the diff and decides about push/merge.
- **Secrets:** never hard-code or print credentials/tokens.
- **Teaching comments:** each file starts with a 1–3 line comment (what it is, why it exists).
  Comment non-obvious decisions (the *why*), not syntax.

## Final report (English)

1. **What I built** (1–3 lines) · 2. **Files** (one line each: what it does and why it exists) ·
3. **Flow** of a request through what was built · 4. **Key concepts** (max 3, each with a simple analogy) ·
5. **How to verify** (exact commands and their real output) · 6. **Doubts / what I did not do** ·
7. **Commits created** (list) · 8. **3 questions the professor could ask**, with short answers.

## Definition of done

Server starts · spec acceptance criteria verified with real output · `docs/context/api-contract.md`,
`docs/qa/test-plan.md` and OpenAPI updated if behavior changed · roadmap status updated ·
nothing outside the spec touched · report delivered.
