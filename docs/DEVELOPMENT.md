# Working agreement and setup

## Timeline
- Fri 30 Oct: scaffold, API contract, team sync
- Mon 2 Nov: SQLite mock records + React chat UI
- Tue 3 Nov: retrieval/deadlines and grounded LLM chat + dashboard
- Wed 4 Nov: integration, QA, Daily Report, Burndown, live demo

## Running locally
Run the backend and frontend separately as described in README. For real course-question LLM calls store the key only in `backend/.env`.

## Developer guidelines
- One owner per ClickUp task. Branches are grouped by workstream; every commit references `SIS89-XX`.
- Maintain the API contract in `docs/API_CONTRACT.md`; resolve disagreements before implementation.
- Never merge incomplete features silently; 501 stubs should only disappear after full implementation.
- PR description includes task link, changes, acceptance evidence, test command and limitations.
- Use fictional mock syllabus/course data and source labels, not real personal student data.
- Commit actual work from the real author account. Project scaffolding commits do not prove that another teammate did the implementation.
- Daily updates: date, completed tasks, active tasks, blocked tasks, owner, PR link. Burndown decreases only after accepted Done tasks.

## Suggested pull request template
Title: `SIS89-02: seed fictional course records`
Body: task link; files changed; what was built; how to run; tests/screenshot; blockers; checked acceptance criteria.

## Integration checks

Seed from the repository root before launching: `python3 database/seed.py`. Expected counts: 3 courses, 6 deadlines, 6 documents. Preserve existing `backend/.env`; `.env.example` shows the three required Groq settings. Relative database environment paths resolve from `backend/`.

With the backend virtual environment active, run `python -m pytest backend/tests -q` from root (or `python -m pytest -q` from backend/). The root pytest configuration supplies imports; fixtures isolate data and credentials. From frontend/, use `npm ci`, `npm run build`, `npx playwright install chromium`, and `npm test`. Live browser tests require a separate explicit command in [SIS89-08 QA](SIS89_08_QA_REPORT.md). Stop servers occupying 8000/8001/5173–5175 before these tests; they manage their own processes.
