# SmartCampus baseline audit and test plan

[SIS1011-01 — Baseline Audit & Test Plan](https://app.clickup.com/t/z8q7hbuc7k)

## Baseline

- Revision `42dcac91995f5cd930af907716962d6e0f99154c`, fetched from `origin/main` on 10 November 2026.
- macOS 27.2 (arm64), Python 3.12.1, pytest 9.2.0, Node 24.18.0, npm 11.16.0 and Playwright Chromium. [Environment record](evidence/baseline/environment.txt)
- React/Vite chat and deadline dashboard use a FastAPI service. The backend fixture seeds three fictional courses, six deadlines and six course excerpts into a temporary SQLite file per test. Retrieval uses deterministic ranking and source excerpts. The browser suite intercepts API responses for UI assertions and includes separate demo and production-guard projects.
- Scope covers AI Chat, Knowledge Retrieval and the Deadline Dashboard. Live Groq and full browser-to-real-backend integration were outside this baseline run. The historical SIS 8–9 QA report is background only.

## How to reproduce

1. Check out the baseline SHA in an isolated worktree. Install `backend/requirements.txt` in a Python virtual environment.
2. Run `python -m pytest backend/tests -vv`. The fixture substitutes test provider settings, and the provider-dependent cases mock the provider.
3. In `frontend/`, run `npm ci`, `npm run build` and `npm test`. Install the pinned Playwright Chromium build with `npx playwright install chromium` if needed. Leave local provider credentials out of the worktree and keep ports 5173–5175 free.
4. For dashboard checks against the real API, seed a temporary DB with `python database/seed.py --db <temporary-path>` and set `SMARTCAMPUS_DB_PATH` for the local FastAPI process. Record the reference date in Asia/Almaty for deadline checks. Use a stub for any provider-dependent check.

## Record and hand off results

Use the [shared case matrix](TEST_CASES_AND_RESULTS.md). Record the checked revision, exact input, expected and actual behaviour, outcome, owner, evidence and issue ID if applicable. Use the same input, date and viewport for Before/After comparisons. Store evidence under `evidence/baseline/` with the case ID in new filenames. Keep credentials, local DBs and real student information outside evidence.

Ratislav owns the independent [Chat and Retrieval runs](https://app.clickup.com/t/z8q7hbuc7m). Danaya owns the independent [Dashboard and UX runs](https://app.clickup.com/t/z8q7hbuc7n). Use scoped evidence files in separate branches while this shared matrix is in review, then link the observed results.
