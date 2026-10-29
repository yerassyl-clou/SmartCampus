# Working agreement and setup

## Timeline
- Fri 30 Oct: scaffold, API contract, team sync
- Mon 2 Nov: SQLite mock records + React chat UI
- Tue 3 Nov: retrieval/deadlines and grounded LLM chat + dashboard
- Wed 4 Nov: integration, QA, Daily Report, Burndown, live demo

## Running locally
Run the backend and frontend separately as described in README. For optional real LLM calls store the key only in `backend/.env`.

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
