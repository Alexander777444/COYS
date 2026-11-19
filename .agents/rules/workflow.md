# Workflow — Spec-Driven Development (SDD) inside a light SDLC

Always applies. Specs are the source of truth; code follows specs, never the opposite.

## Authority order (when two documents disagree)

1. `docs/context/professor-requirements.md`  2. the module spec in `docs/specs/`
3. `docs/context/api-contract.md` and `database-structure.md`  4. `.agents/rules/`  5. existing code.
If you must deviate: stop, say so, propose the change. Approved change → update the document FIRST,
then the code. Architectural changes also get a row in `docs/context/decisions.md`.

## The loop (one module at a time)

| # | Step | You do | Output |
|---|---|---|---|
| 1 | **Specify** | Read the module spec. If something is ambiguous, ask ONE grouped question. If you assume, write it under "Assumptions" in the spec | spec is unambiguous |
| 2 | **Plan** | List files to touch and the order (max 10 lines) | plan in your first reply |
| 3 | **Tasks** | Turn the spec checklist into ordered tasks; tick them in the spec as you finish | checklist |
| 4 | **Implement** | One section at a time; commit after each section (see Git in `AGENTS.md`) | commits |
| 5 | **Verify** | Run every acceptance criterion; paste real command + output. A criterion without evidence is NOT done | evidence |
| 6 | **Document** | Update `roadmap.md` status, `api-contract.md`/OpenAPI/`test-plan.md` if behavior changed | docs in sync |
| 7 | **Report & stop** | Final report (English). Do not start the next module | developer review |

## SDLC mapping (for the defense)

Requirements → `professor-requirements.md` · Design → `code-structure.md`, `database-structure.md`,
`api-contract.md` · Implementation → modules M0–M3 · Testing (QA role) → M4 + `docs/qa/` ·
Documentation → M5 · Maintenance → `docs/qa/bug-log.md`. Deployment is out of MVP scope.

## Gates (a phase cannot start until the previous gate passes — see roadmap)

A gate passes only when the developer ticks it in `docs/plan/roadmap.md` after reviewing.
Agents never tick gates; they only tick module tasks.

## Bugs

Reproduce first (write the failing request/test), fix in the correct layer, re-run the full suite,
log it in `docs/qa/bug-log.md`.

## Context hygiene

Keep documents short and factual. Never paste large outputs into docs. If a doc and the code disagree,
report it; do not silently fix the doc to match buggy code.
