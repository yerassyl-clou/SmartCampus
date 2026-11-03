# SIS89-04 + SIS89-05 · SmartCampus frontend

React 18 and Vite student workspace with an academic chat and an Upcoming deadlines dashboard. Both consume the existing FastAPI contracts; backend and database code are unchanged.

## Run locally

Use Node.js 20+ from the repository setup instructions:

```sh
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. Run the existing FastAPI backend separately on port 8000 as described in the repository README. The unchanged Vite configuration forwards `/api` to `http://127.0.0.1:8000`.

Normal mode uses `POST /api/chat`, with JSON `{ "question": "..." }`. The reusable `<ChatPanel courseId={...} />` can accept a selected course ID from a future parent; when absent, `course_id` is omitted. There is no fabricated course selector or assumed course ID.

The frontend validates the answer, grounding flag, and source array, renders response text safely through React, and displays available source titles and excerpts. Ungrounded answers have an explicit warning and no source attribution. Missing source details are identified without inventing them. HTTP 422, 503, 501, other HTTP errors, network failures, unreadable responses, and a 30-second timeout produce recoverable errors. Retry resends the failed question without duplicating it in history. History is held in memory for the current page session.

The integrated backend implements grounded chat with SQLite retrieval and a server-side LLM provider. Seed the database with `python database/seed.py` from the repository root and follow `docs/AI_CHAT.md` for provider configuration. No-evidence questions return the documented ungrounded response without a provider call. Missing provider configuration returns HTTP 503, which the interface displays as a recoverable error.

## Explicit development demo

Mock mode is off by default. To opt in for one development server session:

```sh
VITE_USE_MOCK_CHAT=true npm run dev
```

Alternatively, put `VITE_USE_MOCK_CHAT=true` in a local `frontend/.env.local` and restart Vite. This file is ignored and must not be included in the handoff. Windows PowerShell: `$env:VITE_USE_MOCK_CHAT='true'; npm run dev`.

To disable, stop Vite, remove that setting or set it to `false`, and restart. When set in PowerShell, also run `Remove-Item Env:VITE_USE_MOCK_CHAT` before restarting in normal mode.

Demo mode displays a persistent **Demo data · Mock mode** badge, labels assistant messages and sources, and makes no chat API requests. Questions containing `deadline`, `assignment`, or `database` show two fictional sources; other questions show the no-evidence state. Fixtures are isolated in `src/lib/mockChat.js`. API failures never activate demo mode. Production builds disable the mock adapter even when the environment flag is `true`.

## Validation

```sh
npm run build
npx playwright install chromium
npm test
```

Stop any existing Vite servers on ports 5173–5175 before running tests. Playwright starts separate normal-mode, demo-mode, and production-preview servers. The production project deliberately builds with the demo flag enabled to verify the production guard. API responses in the normal-mode tests are intercepted browser fixtures, not evidence of a working LLM backend. No running backend is needed for `npm test`.

The 28 chat browser tests cover:

- Suggestions, blank input, trimmed questions, optional course IDs, and JSON request headers.
- Conversation history, multiple source cards and excerpts, missing details, ungrounded answers, and safe text rendering.
- Loading indicators, duplicate prevention, draft preservation, Enter, Shift+Enter, and IME input.
- HTTP 422/503/501/500, unreachable backend, malformed responses, timeout, retries, and continued use after an error.
- Keyboard focus and live announcements; 1440px, 768px, and 375px layouts, long strings, internal scrolling, and horizontal overflow.
- Explicit demo behavior and the production demo guard.

`npm audit` reports two inherited development-toolchain findings: Vite (high) and its esbuild dependency (moderate). The existing Vite 5 version range is preserved; npm's proposed fix requires a major toolchain upgrade. No UI or production runtime dependency was added. Playwright is the only added test dependency.

## SIS89-04 files

- Modified: `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/package.json`, `frontend/package-lock.json`.
- Added: `frontend/src/components/ChatPanel.jsx`, `frontend/src/components/Icon.jsx`, `frontend/src/lib/chat.js`, `frontend/src/lib/mockChat.js`, `frontend/.gitignore`, `frontend/playwright.config.js`, `frontend/tests/chat.spec.js`, `frontend/tests/demo.spec.js`, `frontend/tests/production.spec.js`, and this README.
- Existing `frontend/src/main.jsx`, `frontend/vite.config.js`, and `frontend/index.html` remain unchanged and are not included.

## SIS89-05 · Upcoming deadlines

Use **Upcoming deadlines** in the sidebar (clock icon on mobile) to reach the
separate dashboard below the chat. The chat remains mounted with its history and
keyboard controls. Each deadline shows course, assignment, date, and source title.

`DeadlinesPanel.jsx` loads `GET /api/deadlines` through the existing relative Vite
proxy on mount. **Refresh** and **Retry** make a new request with `cache: no-store`;
a page reload also fetches again. There is no production deadline fixture or
local-storage snapshot, including in chat demo mode. Errors never create fake records.

`src/lib/deadlines.js` validates the response shape, total, required fields, unique
IDs, and calendar dates. Records sort by ISO date, then ID for stable same-day ties.
Dates render as `Nov 6, 2026` using UTC explicitly and semantic `<time>` elements,
so local timezones cannot move a date to the preceding day. All server records
are shown; no unsupported overdue/upcoming filtering is inferred from date-only data.

Loading disables concurrent refresh and announces progress. Empty data has a
clear message. HTTP, network, malformed data, and 15-second timeout errors offer
Retry. A failed refresh retains previous data with an explicit stale-data notice.
Desktop, tablet, and mobile use three, two, and one card columns respectively.

### Real backend startup (PowerShell, from repository root)

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
.\.venv\Scripts\python.exe database/seed.py
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```

In another terminal: `cd frontend`, `npm ci`, then `npm run dev`. The dashboard
works without LLM credentials. Chat provider setup remains in `docs/AI_CHAT.md`.
The fictional seed contains six records across three courses. To test data changes
safely, seed a separate database with `python database/seed.py --db <test-path>`
and set `SMARTCAMPUS_DB_PATH` to its absolute path before starting FastAPI.

### SIS89-05 validation and evidence (November 3, 2026)

- `npm ci`, `npx playwright install chromium`, `npm run build`: passed.
- `npm test`: **48 passed**: all 28 chat/demo/production regressions plus 20 deadline
  cases. New cases cover six records, ordering/ties, loading/empty/errors/Retry,
  malformed records, refresh/reload, retained stale data, timeout, text safety,
  negative UTC offset, and 1440/768/375px layouts. Fixtures live only in tests.
- Existing backend tests: **22 passed** from `backend/` against a separate empty
  test database via `SMARTCAMPUS_DB_PATH` (the legacy deadlines test expects no seed).
- Real unmodified FastAPI + Vite + separately seeded SQLite: HTTP 200, `total: 6`,
  all six records rendered in chronological order with all required fields.
- A temporary change to deadline 6's title/date appeared after Refresh and reload;
  the record was restored and re-fetched. Committed seed fixtures were not edited.
- Real no-evidence chat returned 200 while the dashboard was populated. No browser
  runtime errors or horizontal overflow at 1440/768/375px during integration QA.
- Saved and reviewed `SIS89-05-desktop.png`, `SIS89-05-mobile.png`, and tablet/full-page
  variants outside Git. Desktop/mobile evidence is attached to
  [SIS89-05 in ClickUp](https://app.clickup.com/t/z8q7hbpzkt) and linked in the PR.

New source files: `src/components/DeadlinesPanel.jsx`, `src/lib/deadlines.js`.
Updated: `src/App.jsx`, `src/styles.css`, this README, Playwright configuration,
chat test isolation, and new `tests/deadlines.spec.js`. No dependency changes.

The branch contains both SIS89-04 and SIS89-05 commits for a combined PR to main.
Backend/database/API contract and existing Vite proxy are preserved. No generated
screenshots, local databases, environments, test output, or credentials belong in Git.
Live LLM-provider success is still unverified locally; this does not block the
deadline endpoint, which does not call an LLM. Inherited Vite/esbuild audit findings
remain outside this frontend feature scope.

## Earlier SIS89-04 verification (November 3, 2026)

- `npm ci`, `npx playwright install chromium`, and `npm run build` succeeded.
- `npm test`: 28 Chromium tests passed, including 1440px, 768px, and 375px layouts.
- Existing backend suite: 22 tests passed from `backend/`, with
  `SMARTCAMPUS_DB_PATH` pointing to a separate empty-schema test database.
  Its health/deadlines test assumes no seed data; using the seeded application
  database makes that pre-existing test fail. Running pytest from the repository
  root also fails to import `app`; use the documented backend working directory.
- Unmodified FastAPI backend and seeded SQLite were tested through the Vite proxy:
  health 200, six deadlines, no-evidence chat 200 with `grounded: false`, and
  course-evidence chat 503 because provider configuration is absent locally.
  The UI displayed the safe error and retained history. No live LLM answer is claimed.
- Explicit development demo returned labeled fictional sources; production demo
  guard passed. Desktop/mobile screenshots were captured separately from Git.
- No browser runtime errors occurred during the live local integration checks.

Before full provider acceptance, configure the server-side provider and repeat
live grounded-answer QA. The inherited Vite/esbuild audit findings remain; a
major toolchain upgrade is outside this frontend implementation slice.

## SIS89-08 current integration verification

See [SIS89-08 QA report](../docs/SIS89_08_QA_REPORT.md) for current test counts and real Groq results. Historical SIS89-04/05 entries above remain historical evidence. Root pytest imports and the legacy local-empty-database assumption are repaired by the shared test configuration and isolated fixtures. Safe backend error categories now distinguish configuration, authentication, rejection, rate limits, timeout, invalid output, and unavailable course data without exposing provider bodies. UI layout and CSS are preserved.

`playwright.integration.config.js` is an explicit live-provider suite, separate from `npm test`; enable only with `SMARTCAMPUS_LIVE_TESTS=1` and a valid server-side key. It starts actual FastAPI instances, seeded SQLite, and Vite. Its failure case redirects the browser request to a real FastAPI instance configured with an unreachable local provider, then retries against the live backend. Generated `test-results-live/` evidence stays ignored.
