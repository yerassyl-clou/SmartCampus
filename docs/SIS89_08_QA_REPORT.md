# SIS89-08 — Integration and QA evidence

**Result: READY WITH LIMITATIONS.** The MVP is technically ready for a live demonstration with the tested Groq configuration. All required product scenarios passed. The initial implementation-run record below is preserved; the final publication verification at the end records the latest rerun and authorization state. SIS89-08 stays **In Progress** until approved integration and ClickUp evidence publication. SIS89-09 is separate and is not declared complete.

Task: [SIS89-08 — End-to-End Integration & Testing](https://app.clickup.com/t/z8q7hbpzm0). Reporting date: **November 3, 2026, Asia/Almaty** (client task context). These are results from this execution, not invented historical daily activity.

## Tested version and environment

- Repository: `yerassyl-clou/SmartCampus`.
- Branch: `main`; baseline `35958eb14e335c6393737617e5b5c3c179edd4e7` plus the local SIS89-08 changes described below.
- `git fetch origin` succeeded; initial `HEAD...origin/main` comparison: **0 ahead / 0 behind**.
- Existing uncommitted `frontend/index.html` formatting was preserved. No branch was switched because the initial worktree was dirty.
- macOS / Darwin arm64; Python 3.12.1; Node 24.18.0; npm 11.16.0.
- FastAPI 0.162.0; Uvicorn 0.54.0; Pydantic 2.14.2; OpenAI SDK 2.54.0; pytest 9.2.0; httpx 0.28.1; Vite 5.4.21; Chromium through Playwright.
- Real provider: Groq, `https://api.groq.com/openai/v1`, `openai/gpt-oss-120b`. No credentials appear in this report or generated evidence.
- SQLite seed unchanged: **3 courses / 6 deadlines / 6 document excerpts**. Dates remain November 6, 9, 11, 13, 20, and 27, 2026, in chronological order.
- Windows/Linux runtime and other browser engines were not tested. The Windows timezone-data dependency is declared for the new Asia/Almaty reference-date calculation.

## Confirmed original problems and fixes

| Problem | Reproduced evidence / root cause | Files / fix | Verification |
|---|---|---|---|
| Supported questions return 503 | `What is the deadline for Assignment 2?` returned 503, `The AI service is not configured...`. Local dotenv contained only `GROQ_API_KEY`; the adapter reads `OPENAI_API_KEY` and requires `OPENAI_MODEL`. | Corrected ignored `backend/.env` using the existing local key; clarified README and AI setup. No secret or model answer added to tracked code. | Real Groq probe succeeded before adapter changes; TC-01–07 and Retry passed afterward. |
| Generic 503 hides distinct service failures | Generic adapter handling merged provider rejection, invalid output and other failures; frontend discarded the safe diagnostic distinction. A missing parsed response was treated as no-information fallback. | `services/llm.py`, `schemas.py`, `routes/chat.py`, `frontend/src/lib/chat.js`: safe categories/status-only logging, strict evidence validation, fixed frontend message allowlist, invalid output → 503. | Authentication, rejection, rate limit, timeout, connection/service error, malformed output and configuration tests; 7 added browser cases. No raw provider body is displayed or logged. |
| General deadline query returns fallback despite six rows | `what deadlines i have` returned 200 ungrounded fallback. Exact token matching misses `deadlines`; no database listing path existed. | `routes/chat.py`: conservative full-query deadline-list grammar, actual stored rows, fictional/non-personal label, chronological order, optional course filter. Upcoming uses inclusive Asia/Almaty current date printed in answer. | TC-08; five query forms, course filters, and reference-date boundary/empty-result tests. |
| Weak retrieval includes unrelated material | Baseline `When is the Physics exam?` retrieved documents 3/4/5 via common words; `Assignment 999` retrieved document 1; `deadline` matched but `deadlines` did not. | `retrieval.py`: remove function words, normalize small plural vocabulary, require substantive overlap and matching numeric identifiers. | Ranking, singular/plural, no-weak-match and unknown-course tests; TC-09/10 avoid provider entirely. |
| Deadline-only facts hidden by weak document hits | Baseline midterm-project-proposal query retrieved documents 3/4/5 and never searched its actual deadline row because document matching returned early. | `retrieval.py`: rank both tables together, preserve document-first ties, use negative deadline IDs to avoid collisions with positive document IDs. | Regression requires deadline `-2` and `2026-11-13`; source IDs remain unique. |
| Database path depends on launch directory; missing schema looks empty | Baseline resolves `.env.example` relative path from cwd and silently returns empty lists for missing tables, potentially creating an empty SQLite file. | `db.py`, `main.py`, `retrieval.py`: resolve environment-relative paths from backend/, do not create databases on read, close helper connections, controlled data-unavailable 503. Initialized empty data still yields 200 empty. | Missing, empty-schema, corrupt, cwd-independence and health tests. |
| Pytest depends on local application state | Root command failed imports (`No module named app`). Backend-directory run after seeding: **21 passed / 1 failed**, because the legacy deadline test expected the actual local DB to be empty. | `pytest.ini`, shared `conftest.py`, `test_health.py`, `test_chat.py`, new data/integration tests. Replace ambient-state assumption with explicit initialized-empty fixture coverage; isolate all DBs and credentials. | **77 passed**, including both seeded and initialized-empty behavior. No test skipped or weakened to hide a failure. |
| Setup/docs stale | README described a scaffold/optional OpenAI integration, omitted seeding from quick start; database guide had a teammate-specific path, old 3-test expectation, and obsolete chat-501 claim. | README, database README, development/API/AI/test-plan docs, frontend current-verification addendum. Preserve historical frontend records. | Clean dependency installation, seeding, pytest, and frontend build in a temporary clone with the local patch. |

**Not confirmed as defects:** Groq structured-output compatibility (the existing SDK parse call worked); SQLite seed/schema/foreign keys/row counts; existing JSON success contracts; chat Send/Enter/Shift+Enter/loading/duplicate prevention/Retry/layout; deadline navigation/refresh. These behaviors passed testing. No broad UI redesign, schema rewrite, or provider replacement was performed.

The PR review was based on current merged code and merged commit history plus GitHub metadata/discussions for [PR #1](https://github.com/yerassyl-clou/SmartCampus/pull/1), [PR #3](https://github.com/yerassyl-clou/SmartCampus/pull/3), and [PR #4](https://github.com/yerassyl-clou/SmartCampus/pull/4). All three were confirmed merged; connector discussion results were empty. PR #3's historical 22-test/manual-success claims were treated as historical, not current verification. PR #4 disclosed that its live LLM success was unverified. PR #2 was not reintroduced. The two supplied private ChatGPT links exposed no readable conversation content; no historical feedback was assumed.

## Commands and actual outcomes

Commands below use the existing backend virtual environment. Root pytest now works directly.

| Executed check | Actual outcome | Provider |
|---|---|---|
| `python3 database/seed.py` | PASS: `courses=3, deadlines=6, documents=6`; repeated-seed test also passed | None |
| `backend/.venv/bin/python -m pip install -r backend/requirements.txt` | PASS; installed dependencies available | None |
| `backend/.venv/bin/python -m pytest backend/tests -q` | PASS: **77 passed**, one existing Starlette/httpx deprecation warning | Mocked; no paid calls |
| `cd frontend && npm ci` | PASS; lockfile installation | None |
| `npm run build` | PASS: 33 modules transformed; production bundle generated | None |
| `npx playwright install chromium` | PASS | None |
| `npm test` (original suite, first run) | PASS: **48 passed (14.1s)** | Intercepted API fixtures; explicit development demo separate |
| `npm test` (expanded suite) | PASS: **55 passed (15.6s)** | Intercepted API fixtures; no live-provider claim |
| Explicit live integration command below | PASS: **9 passed (13.9s)**, covers TC-01 through TC-12 | 7 real course-answer calls + 1 real Retry; deterministic SQLite/no-match paths; unreachable local provider for failure |
| Existing adapter diagnostic probe | PASS: real `EvidenceSelection(sufficient=True, quotes=[source 1, Assignment 2 deadline: 2026-11-06.])` | Real Groq, before adapter code changes |
| Conflicting-evidence probe | PASS: supplied a temporary conflicting `Assignment 2 deadline: 2026-11-07.` alongside retrieved seed evidence; response `sufficient=false, quotes=[]` | Real Groq; original SQLite unchanged |
| Clean install | PASS: temporary local clone of baseline + working patch, fresh backend venv/dependency install, seed, **77 pytest passes**, `npm ci`, production build | No local credentials copied; tests mocked |
| `git diff --check` / secret review | PASS; final local review recorded below | None |

Real Groq usage for this task was limited to **11 requests**: one compatibility diagnosis, seven course scenarios, one Retry recovery, one conflict probe, and a final direct HTTP retest of the original failing question. Normal automated suites cannot use the local key. No screenshots or logs contain credentials.

Clean-install scope: a fresh local clone, not a new remote branch or published commit. Local implementation changes were copied over that clone before verification; `.env`, node_modules, databases, and virtual environments were not copied. Fresh dependencies and a new sample database were created there. This validates installation independently of the existing workspace's installed packages. Cross-platform installation is documented but only macOS was executed.

## TC-01 through TC-12 — actual API/browser results

Each course test submitted the exact question through the real React UI, asserted the HTTP response, rendered answer and source, and used FastAPI retrieval/quote validation with the real configured Groq model. These were not browser-response fixtures.

| ID | Question / action | Expected | Actual result | Provider | Status |
|---|---|---|---|---|---|
| TC-01 | When is Assignment 2 due? | November 6, 2026; Database Systems syllabus | 200, grounded=true; `2026-11-06`; source document 1, correct syllabus visible | Real Groq | PASS |
| TC-02 | What should I submit for Assignment 2? | Normalized schema and query plan | 200, grounded=true; `normalized schema and query plan`; source 1; screenshot inspected | Real Groq | PASS |
| TC-03 | What is the rule for late database lab work? | Three calendar days with short explanation | 200, grounded=true; exact rule; source 2, Mock Database Systems course rules | Real Groq | PASS |
| TC-04 | When is the risk register review due? | November 9, 2026 | 200, grounded=true; `2026-11-09`; source 3, correct syllabus | Real Groq | PASS |
| TC-05 | What must the risk register include? | Owner for each identified risk | 200, grounded=true; `an owner for each identified risk`; source 3 | Real Groq | PASS |
| TC-06 | When is the usability test plan due? | November 11, 2026 | 200, grounded=true; `2026-11-11`; source 5, correct syllabus | Real Groq | PASS |
| TC-07 | What should the usability test plan describe? | Participants, tasks, success measures | 200, grounded=true; `participants, tasks, and success measures`; source 5 | Real Groq | PASS |
| TC-08 | What deadlines do I have? | Six sample deadlines without personal enrollment claim | 200, grounded=true; six stored rows/sources, chronological; explicitly fictional and not a personal schedule | No LLM; real SQLite | PASS |
| TC-09 | What is the rector's personal phone number? | Safe fallback, no invented contact | 200, grounded=false; exact contract fallback and no sources | No LLM; no matching evidence | PASS |
| TC-10 | When is the Physics exam? | Safe fallback | 200, grounded=false; exact contract fallback and no sources | No LLM; no matching evidence | PASS |
| TC-11 | Actual provider connection failure, then Retry | Controlled error, usable app | Separate real FastAPI instance with test-only credential and unreachable localhost provider returned 503/category unavailable; UI showed safe error; Retry through main backend returned grounded November 6 answer without duplicating question | Actual network failure; recovery uses real Groq | PASS |
| TC-12 | Open/refresh Upcoming deadlines | Six correct records | All six dates and records rendered from FastAPI/SQLite; navigation, refresh, retained chat history and 1440/768/375px overflow checks passed | No LLM; real SQLite | PASS |

A final direct real-Groq HTTP request for `What is the deadline for Assignment 2?` also returned 200, grounded=true, `2026-11-06`, and the correct syllabus after configuration repair. The normal backend/frontend were left running on ports 8000/5173 for review.

Direct HTTP API integration also checked `/api/health` (exact JSON), `/api/deadlines` (6), `?course_id=1` (2), `?course_id=999` (0), `/api/chat` (`Show all deadlines`: 6), and failure-backend `/api/chat` (503 safe category). Course-question API payloads and status were asserted in the real browser tests; they were not counted as additional duplicate live requests.

The 55 mocked browser tests cover Send, Enter, Shift+Enter/IME, blank input, duplicate submission blocking, source rendering, long messages, repeated requests/history, loading, HTTP/network/JSON/timeout errors, Retry, deadline loading/empty/stale/refresh states, keyboard access and responsive layouts. No working frontend feature was replaced with mock mode for integration testing.

Screenshots are local, ignored evidence under `frontend/test-results-live/`:

- `integration-TC-02-REAL-Gro-c5a1e--I-submit-for-Assignment-2-/TC-02-real-groq.png`
- `integration-TC-03-REAL-Gro-90092-for-late-database-lab-work-/TC-03-real-groq.png`
- `integration-TC-08-09-10-12-f64d8-resh-fallback-responsive-UI/real-sqlite-{1440,768,375}.png`

Desktop TC-02 and mobile SQLite evidence were opened and visually inspected. The UI appearance/CSS was preserved. Original images under `tests/` are historical teammate evidence and were not represented as new screenshots.

## SIS89-08 acceptance checklist

| Criterion | Status | Evidence / qualification |
|---|---|---|
| Documented install/start works | PASS | Fresh local clone + patch installation/build; real servers started by live test |
| SQLite seed works | PASS | 3/6/6, repeatability and foreign keys tested |
| Health works | PASS | Exact response in pytest and direct integration HTTP |
| Deadlines API correct | PASS | Dates/order/filter/unknown/empty/invalid/missing-data cases |
| React communicates with FastAPI | PASS | Actual Vite → FastAPI browser tests |
| Supported questions correctly grounded | PASS | TC-01–07, real Groq and verified SQLite quotations |
| Real Groq verified | PASS | 8 browser requests plus diagnosis/conflict probes |
| General deadline queries | PASS | TC-08 and date-boundary/filter tests |
| Missing information safe | PASS | TC-09/10 and no-provider assertions |
| Provider failures controlled | PASS | TC-11 actual connection failure, mocked other categories |
| Backend automated tests | PASS | 77 |
| Frontend production build | PASS | Main workspace and clean install |
| Browser automated tests | PASS | 55 fixture tests + 9 integration tests |
| At least five genuine scenarios recorded | PASS | Twelve case IDs above |
| Known limitations documented | PASS | Below |
| Evidence ready for ClickUp | PASS | This report, screenshots and exact update below |
| All nine ClickUp tasks/comments fully audited | BLOCKED | Daily connector limit prevented SIS89-09 and task-comment retrieval |
| Evidence actually attached/commented in ClickUp | BLOCKED | Connector daily limit; no successful write claimed |
| Approved code integration and SIS89-08 Done | NOT VERIFIED | Intentionally pending user review; no commit/push/PR/merge authorized |

## ClickUp and GitHub reconciliation

Read actual task descriptions, owners, statuses and dependencies for:

| Task | Owner | Observed status | Reconciliation |
|---|---|---|---|
| [SIS89-01 — Setup & API Contract](https://app.clickup.com/t/z8q7hbpzkn) | Yerassyl | Done | Scaffold/contract in main; setup documentation gaps repaired locally. Historical completion evidence/comments were not audited. |
| [SIS89-02 — SQLite & Mock Data](https://app.clickup.com/t/z8q7hbpzkp) | Gleb | Done | PR #1 merged; seed/data/foreign-key requirements verified. No evidence warrants reopening it. |
| [SIS89-03 — Retrieval & Deadlines](https://app.clickup.com/t/z8q7hbpzkq) | Gleb | Done | PR #1 merged; endpoint works; confirmed retrieval/database error gaps repaired under SIS89-08. Add integration evidence; do not silently rewrite status/history. |
| [SIS89-04 — React Chat](https://app.clickup.com/t/z8q7hbpzkr) | Danaya | Done | PR #4 merged; browser regressions pass. Current real-provider evidence is supplied here. |
| [SIS89-05 — Deadline Dashboard](https://app.clickup.com/t/z8q7hbpzkt) | Danaya | Done | PR #4 merged; six real backend rows and refresh verified. |
| [SIS89-06 — Chat & LLM](https://app.clickup.com/t/z8q7hbpzkv) | Ratislav | Done | PR #3 merged; real Groq criterion independently repeated successfully after local config correction. |
| [SIS89-07 — Grounding & Fallback](https://app.clickup.com/t/z8q7hbpzkw) | Ratislav | Done | PR #3 merged; source/quote guards, missing data and real conflict refusal verified; local diagnostic hardening belongs to SIS89-08. |
| [SIS89-08 — Integration & Testing](https://app.clickup.com/t/z8q7hbpzm0) | Yerassyl | In Progress | Appropriate until approved integration and evidence publication; do not mark Done now. |
| [SIS89-09 — Reports & Review](https://app.clickup.com/t/z8q7hbpzm1) | Yerassyl per supplied brief; not independently verified | NOT VERIFIED | Read failed: daily MCP call limit reached. Current owner/status/comments not independently verified. Local report/burndown CSV actual values remain blank; do not infer completion. |

SIS89-08's actual configured dependencies point to SIS89-03/04/05/06/07, matching its description. SIS89-09 depends on SIS89-08 in the returned SIS89-08 dependency data. Other retrieved task dependencies are consistent with setup → data → retrieval and chat → grounding. Task comment evidence and task-embedded PR links were not independently read because the connector exhausted its **100-call daily limit** during the ninth task read; this is a connector/account limit, not application failure. No ClickUp task status, date or comment was changed. No daily activity/burndown values were fabricated.

### Exact prepared SIS89-08 update (not posted)

> SIS89-08 WIP — local integration and QA completed; code remains uncommitted pending Yerassyl's review.
>
> Reproduced supported-chat 503: backend/.env used GROQ_API_KEY only, while the app needs OPENAI_API_KEY and OPENAI_MODEL. Corrected ignored local configuration with the existing credential; the current Groq structured parse adapter works and was preserved.
>
> Fixed general sample-deadline chat listings, singular/plural and weak-keyword retrieval, deadline-only evidence, database path consistency and missing/uninitialized-data errors, provider diagnostic categories/strict output handling, and pytest isolation/root imports. Preserved current UI and fictional seed.
>
> Verified: seed 3 courses/6 deadlines/6 documents; 77 pytest tests; frontend production build; 55 mocked Chromium regression tests; 9 actual FastAPI/SQLite browser integration tests covering TC-01–TC-12. TC-01–07 and Retry used real Groq openai/gpt-oss-120b. General lists/fallback used actual SQLite without LLM. An actual unreachable provider returned controlled 503; Retry recovered against live Groq. A separate real conflict probe safely declined conflicting dates. Clean dependency install/build passed in a temporary clone with the local patch and no copied credentials.
>
> Changed backend db/retrieval/chat/deadline/error/validation code and tests; frontend safe error mapping and browser tests; setup/API/AI/data/test documentation. Full file list, commands, exact outcomes and local screenshot paths: docs/SIS89_08_QA_REPORT.md. Existing merged PRs: #1, #3, #4. No new PR exists because commit/push/PR/merge awaits authorization.
>
> Proposed status: keep In Progress until reviewed changes are approved and integrated. Product is locally ready for live demo; ClickUp's daily MCP limit prevented full SIS89-09/comment audit and evidence publication. No status/history corrections were made. SIS89-09 remains separate; no historical daily progress or burndown values were invented.

## Repeat the setup and demo

From repository root on macOS/Linux:

```bash
python3 database/seed.py
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
# If backend/.env is absent, copy .env.example there; preserve existing settings.
# Locally set OPENAI_API_KEY to your Groq key, OPENAI_MODEL=openai/gpt-oss-120b,
# OPENAI_BASE_URL=https://api.groq.com/openai/v1.
backend/.venv/bin/python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

Second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open **http://localhost:5173**. Ensure the `Demo data · Mock mode` badge is absent. Keep `VITE_USE_MOCK_CHAT` unset or false. Windows: use `python` to create the environment and `backend\.venv\Scripts\python.exe` for backend commands; install declared requirements including Windows timezone data. PowerShell can copy the example with `Copy-Item .env.example backend/.env` only when it is absent.

Demo: open Upcoming deadlines (six sample rows), then ask the successfully tested questions:

1. `When is Assignment 2 due?`
2. `What should I submit for Assignment 2?`
3. `What is the rule for late database lab work?`
4. `What deadlines do I have?`
5. `When is the Physics exam?`

The other four successful course questions are listed exactly in TC-04–07. `Show all deadlines`, `What assignments are due?`, and `List upcoming deadlines` are also covered by deterministic tests; upcoming filtering is defined above.

### Repeat automated verification

Stop existing test-port servers first. From root:

```bash
backend/.venv/bin/python -m pytest backend/tests -q
cd frontend
npm run build
npx playwright install chromium
npm test
```

### Repeat live integration (makes paid provider requests)

Seed first and configure the real Groq key only in backend/.env. Stop servers on 8000/8001/5173. From repository root:

```bash
source backend/.venv/bin/activate
cd frontend
SMARTCAMPUS_LIVE_TESTS=1 npx playwright test --config=playwright.integration.config.js --output=test-results-live
```

Windows PowerShell: activate `backend\.venv\Scripts\Activate.ps1`, enter frontend/, set `$env:SMARTCAMPUS_LIVE_TESTS='1'`, and run the same `npx playwright test ...` command. The live config refuses to run without explicit opt-in and starts/stops its own two FastAPI servers and Vite. Eight successful live requests are expected per complete browser run; no automatic retries. The failure server uses a test-only key and localhost port 9. No real key is sent there. TC-11 redirects browser transport to that actual failure backend, then removes the redirect for live Retry. It does not fabricate an API answer.

To manually demonstrate service failure, stop the normal backend and start it with `OPENAI_BASE_URL=http://127.0.0.1:9/v1`, `OPENAI_API_KEY=test-only`, and `OPENAI_MODEL=test-model` as process environment overrides. Ask Assignment 2: controlled 503. Restart with normal local dotenv configuration and use Retry. Never present this failure simulation or the development mock as a live successful Groq answer.

## Local changes and proposed review

Modified application/configuration files:

- `backend/app/db.py`, `backend/app/main.py`, `backend/app/retrieval.py`.
- `backend/app/routes/chat.py`, `backend/app/routes/deadlines.py`, `backend/app/schemas.py`, `backend/app/services/llm.py`, `backend/requirements.txt`.
- `backend/tests/test_chat.py`, `backend/tests/test_health.py`.
- `frontend/src/lib/chat.js`, `frontend/tests/chat.spec.js`, `frontend/.gitignore`.
- `README.md`, `database/README.md`, `docs/API_CONTRACT.md`, `docs/AI_CHAT.md`, `docs/DEVELOPMENT.md`, `docs/TEST_PLAN.md`, `frontend/README.md`.

Added files:

- `pytest.ini`, `backend/tests/conftest.py`, `backend/tests/test_data.py`, `backend/tests/test_integration.py`.
- `frontend/playwright.integration.config.js`, `frontend/tests/integration.spec.js`.
- `docs/SIS89_08_QA_REPORT.md` (this report).

Deleted files: none. Existing user change preserved: `frontend/index.html`. Ignored local changes: backend/.env configuration, generated seeded database, installed dependencies/build output, screenshots/test output. No API key moved into the frontend or tracked files. No `.env` or DB is tracked. Final `git status`: 21 modified files (20 task modifications plus the preserved user edit), 7 new files, no deletions. `git diff --check` passed; secret-value scanning of all changed/new files passed; the index is empty. No staged changes, commits, pushes, PRs, merges, tags or remote mutations were made.

No current merge conflict is present; the baseline matched origin/main at fetch. A future remote update can introduce conflicts, especially in shared retrieval/chat/docs files; no speculative conflict resolution was attempted.

Suggested commit after approval: `SIS89-08: fix integration and verify grounded Groq chat`.

Proposed PR title: **SIS89-08: complete integration fixes and end-to-end QA**.

Proposed PR description:

> Supported chat failed locally because the Groq credential used a dotenv name the adapter did not read. General deadline questions also fell back despite six stored rows, and weak retrieval could miss deadline-only facts or send unrelated evidence. This change documents/fixes configuration, adds deterministic fictional deadline listings, improves keyword retrieval, and distinguishes database/provider service errors while preserving the existing UI and quote-grounding architecture.
>
> Validation: 77 isolated backend tests; frontend build; 55 fixture-based Chromium tests; 9 real-backend browser tests covering TC-01–TC-12, including seven real Groq course answers and live Retry. Fresh installation/build and a real conflicting-evidence refusal verified. Evidence and reproducible commands: docs/SIS89_08_QA_REPORT.md. ClickUp SIS89-08 stays In Progress until approved integration and evidence publication; SIS89-09 reporting remains separate.

## Remaining limitations and readiness

- **Review/integration is pending by instruction.** This local result is not yet the approved main-branch delivery; do not mark SIS89-08 Done.
- **ClickUp daily connector limit** blocks the remaining SIS89-09/task-comment audit and posting/attaching evidence. Retry after the account limit resets. No application fix is needed for this external blocker.
- Live-provider success was verified with the local credential/model/network at execution. Future authentication, quotas or outages can still cause the controlled service error. Semantic ambiguity handling still depends on the LLM; one real conflict probe passed, not a proof for every possible phrasing. Retrieval remains intentionally simple and English-oriented. Extractive answers can repeat an overlapping fact when both a document and a deadline row are cited.
- Automated UI verification uses Chromium only; no screen-reader or other-engine certification. Upcoming uses runtime Asia/Almaty calendar date; dashboard continues to show all stored sample rows as designed.
- Existing npm install reports **one moderate and one high development-toolchain advisory**; no forced major Vite upgrade was made within this SIS89-08 integration scope. Existing Starlette/httpx test warning remains non-failing.
- Report/burndown CSVs remain untouched. SIS89-09 needs genuine reporting evidence from its owner; test success does not complete it.

No remaining reproduced application defect blocks the six agreed local demo scenarios. Final acceptance still requires user review, authorized code integration, and ClickUp evidence publication.

## Final publication verification — November 3, 2026

The user authorized creating `feature/sis89-final-integration`, committing only SIS89-08 files, pushing, and opening a PR targeting main. **Merging still requires separate explicit approval.** The earlier local/uncommitted and authorization statements in this report describe the initial implementation run, not a prohibition on this newly authorized publishing step.

Final review confirmed `main` at `35958eb14e335c6393737617e5b5c3c179edd4e7` matched fetched `origin/main` (0 ahead / 0 behind). The pre-existing `frontend/index.html` formatting is excluded from publication and its byte hash is preserved. No code outside the SIS 8–9 MVP was added. Gleb's detailed database guide is retained with focused corrections; Ratislav's structured parsing and grounding architecture and Danaya's UI/CSS remain in place. Original contributor commits/history are preserved.

Executed again for finalization:

| Check | Actual final result |
|---|---|
| `backend/.venv/bin/python -m pytest backend/tests -q` | **77 passed**, one existing non-failing Starlette/httpx warning |
| `cd frontend && npm run build` | PASS; 33 modules transformed |
| `npm test` | **55 passed (14.9s)**; intercepted API fixtures, not live-model evidence |
| `PATH="$PWD/../backend/.venv/bin:$PATH" SMARTCAMPUS_LIVE_TESTS=1 npx playwright test --config=playwright.integration.config.js --output=test-results-live` | **9 passed (24.5s)**; actual FastAPI/SQLite/React integration, seven real Groq course responses plus live Retry |
| SQLite read-only verification | **3 courses / 6 deadlines / 6 documents**; foreign-key check clean; dates Nov 6/9/11/13/20/27 |
| Diff/credential review | PASS; no key values or secret patterns in changed/new reviewable files; dotenv/database/build/test output excluded |

The live rerun added **8 real Groq requests** to the initial run's 11. Missing-information and deadline-listing cases used SQLite without an LLM; TC-11 used an actual unreachable local provider before recovering against real Groq. No mocked test is represented as live-provider verification. Test-managed servers shut down afterward.

During final publication preparation, GitHub CLI was unavailable. The user subsequently selected the GitHub connector in response to the publishing-method question, so finalization uses local git and the connected GitHub app on `feature/sis89-final-integration`. Only the reviewed SIS89-08 files belong in the commit; `frontend/index.html` remains a separate local user change. No merge or ClickUp update is authorized before the user's separate merge approval. The initial ClickUp-limit observation is historical; no new ClickUp task reads or writes were attempted during this finalization run.
