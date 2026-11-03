# SIS89-04 · SmartCampus chat frontend

React 18 and Vite chat interface for Danaya's frontend workstream. This change does not implement the deadline dashboard or change the backend or shared API contract.

## Run locally

Use Node.js 20+ from the repository setup instructions:

```sh
cd frontend
npm install
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

The 28 browser tests cover:

- Suggestions, blank input, trimmed questions, optional course IDs, and JSON request headers.
- Conversation history, multiple source cards and excerpts, missing details, ungrounded answers, and safe text rendering.
- Loading indicators, duplicate prevention, draft preservation, Enter, Shift+Enter, and IME input.
- HTTP 422/503/501/500, unreachable backend, malformed responses, timeout, retries, and continued use after an error.
- Keyboard focus and live announcements; 1440px, 768px, and 375px layouts, long strings, internal scrolling, and horizontal overflow.
- Explicit demo behavior and the production demo guard.

`npm audit` reports two inherited development-toolchain findings: Vite (high) and its esbuild dependency (moderate). The existing Vite 5 version range is preserved; npm's proposed fix requires a major toolchain upgrade. No UI or production runtime dependency was added. Playwright is the only added test dependency.

## Files in the handoff

- Modified: `frontend/src/App.jsx`, `frontend/src/styles.css`, `frontend/package.json`, `frontend/package-lock.json`.
- Added: `frontend/src/components/ChatPanel.jsx`, `frontend/src/components/Icon.jsx`, `frontend/src/lib/chat.js`, `frontend/src/lib/mockChat.js`, `frontend/.gitignore`, `frontend/playwright.config.js`, `frontend/tests/chat.spec.js`, `frontend/tests/demo.spec.js`, `frontend/tests/production.spec.js`, and this README.
- Existing `frontend/src/main.jsx`, `frontend/vite.config.js`, and `frontend/index.html` remain unchanged and are not included.

## Integration and review

Integrated on `feature/sis89-frontend` after fast-forwarding to main commit
`fc0cd495eee721f80ff347a3c37c88f6258b3951`. The backend, database, API contract,
Vite proxy, and existing frontend entry point are preserved. Only SIS89-04 chat
files belong to this change; the SIS89-05 deadline dashboard is separate.

The authoritative frontend archive was reconciled with main. The lockfile keeps
main's platform metadata and adds the Playwright test dependencies. Test output,
screenshots, dependencies, local environment files, and build artifacts are excluded
from Git. The task is submitted for review after push; no PR is created in this step.

## Verification on November 3, 2026

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
