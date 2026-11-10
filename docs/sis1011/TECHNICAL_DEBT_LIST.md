# SIS1011-04 — Technical Debt List

Status: evidence-based review of the `origin/main` baseline on 2026-11-10.
All data and examples in this document remain fictional.

## Scope and evidence method

Reviewed the SQLite schema/seed path, backend dependency manifest, frontend
manifest, tests, and repository automation files. The checks below were run
against the repository rather than inferred from the task description.

## Prioritized debt

| Priority | Debt | Evidence | Impact | Remediation | Estimate |
|---|---|---|---|---|---|
| P1 | The seed command is a destructive reset for course data. | `database/seed.py` deletes `documents`, `deadlines`, and `courses` before inserting the fixture rows (lines 21–23). | Running the fixture loader against a database containing manually maintained course rows removes those rows. This is safe for the current fictional-only workflow but unsafe if the same file later becomes shared or operational. | Split fixture loading from production migrations; require an explicit reset flag for destructive reseeding; add a test proving unrelated operational tables survive. | 4–8 hours |
| P1 | Backend dependency versions are ranges without a committed Python lockfile. | `backend/requirements.txt` uses open lower/upper ranges such as `fastapi>=0.115,<1` and `openai>=1.50,<3`; no tracked `requirements*.lock` or `poetry.lock` exists. | A fresh install can resolve different transitive versions and change API/provider behavior, reducing reproducibility of QA and deployment. | Generate and review a Python lockfile or constraints file, update it intentionally, and run CI against the locked set. | 3–6 hours |
| P2 | There is no tracked CI workflow for the documented backend/frontend checks. | Repository inspection found no `.github/workflows/` file, while `docs/DEVELOPMENT.md` documents pytest, frontend build, and Playwright commands. | Regressions can pass locally but remain undetected before review; test claims depend on each developer's environment. | Add a GitHub Actions workflow for seeded-isolated pytest, frontend build, and a separately configured browser job; publish artifacts on failure. | 4–8 hours |

## Highest-risk order

1. **P1 destructive seed behavior** is the immediate data-integrity risk if the
   local SQLite file gains non-fixture records.
2. **P1 dependency drift** is the immediate reproducibility risk for backend
   and provider integration.
3. **P2 missing CI** increases the probability that both risks regress unnoticed.

## Debt versus regression bugs

These are technical debt items, not confirmed regressions in the current
fictional workflow:

- The seed reset is intentional for repeatable sample data and current tests
  pass; the debt is that its safety boundary is not explicit.
- Dependency ranges install successfully in the checked environment; the debt
  is lack of deterministic resolution, not a proven broken dependency.
- The current test commands are documented and can run locally; the debt is
  the absence of an automated shared gate.

No production secrets, real student data, or live university-system data were
used or found during this audit.

## Evidence commands

```text
backend/.venv/bin/python -m pytest backend/tests -q
git ls-files '.github/workflows/*' 'backend/*lock*' '*requirements*.lock' '*poetry.lock'
```

The actual output is recorded in
`docs/sis1011/evidence/technical-debt-probe.log`.
