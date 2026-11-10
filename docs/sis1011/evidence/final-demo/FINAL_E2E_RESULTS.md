# Final browser and API results

**PASS · 10 November 2026 · Chromium 156.0.8078.4 · FastAPI · SQLite · Vite/React**

The complete build, regression and live smoke checks passed again on the published product merge [`47a562a4d9eceec7d42f0637de1fd65154b27b19`](https://github.com/yerassyl-clou/SmartCampus/commit/47a562a4d9eceec7d42f0637de1fd65154b27b19). The screenshots are from the pre-merge tree, which has the same application and artifact files as the merge.

The application ran against a fresh isolated database populated by the repository seed. The browser received responses from the real FastAPI service through Vite. The feedback flow used deterministic deadline listing and no-evidence chat paths. A separate bounded run used the configured Groq provider for seven grounded course questions and one recovery request.

| Check | Observed |
| --- | --- |
| Startup | Vite served React. FastAPI returned HTTP 200 with `{"status":"ok","app":"SmartCampus"}`. SQLite had three courses, six deadlines and six documents. |
| Dashboard | Real GET and keyboard refresh returned HTTP 200. Before showed six upcoming dates. After showed 11, 13, 20 and 27 November as upcoming and 6 and 9 November as past, in chronological order. |
| Chat and sources | Listing returned HTTP 200 with grounded=true and source IDs `[-5,-2,-4,-6]`. An HCI question without matching evidence returned HTTP 200, grounded=false and no sources. |
| Real provider | Seven course questions returned the expected exact evidence and source IDs. The failure/retry case used an unreachable provider for the first request and the configured Groq backend for the successful retry. |
| Feedback | Helpful and Not helpful each returned HTTP 201. The form retained its category, comment and UUID through an aborted network request and a real storage 503. The first response kept its own success state. |
| Restart and invalid requests | Two rows persisted across restart. Duplicate 409 and invalid 422 did not change the rows. |
| Responsive and keyboard | 1440×900, 768×1024 and 375×812, no horizontal overflow. Enter activated Refresh and submitted feedback. Opening the negative form moved focus to its labeled category. |
| Runtime errors | No fatal page JavaScript error. The expected network failure and 503 were exercised intentionally. Uvicorn started, shut down and restarted successfully. |

## Commands

From the repository root:

```bash
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
export SMARTCAMPUS_DB_PATH="$(mktemp /tmp/smartcampus-demo.XXXXXX)"
backend/.venv/bin/python database/seed.py --db "$SMARTCAMPUS_DB_PATH"
backend/.venv/bin/python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

In a second terminal, run `cd frontend && npm ci && npm run dev -- --host 127.0.0.1 --strictPort`, then open `http://127.0.0.1:5173`. The isolated screenshot run used 8004 for FastAPI and 5187/5188 for integrated/baseline Vite, with a temporary API proxy configuration. It held the reference date at noon on 10 November in Asia/Almaty.

Regression commands and results:

- `python -m pytest backend/tests -q` — 126 passed, one Starlette dependency warning. [Log](pytest-regression.log).
- `npm ci && npm run build` — installed the lockfile dependencies and built production assets. The default browser suite also builds the production target. [Build log](frontend-build.log).
- `npm test` — 70 Playwright tests passed. [Log](playwright-regression.log).
- `SMARTCAMPUS_LIVE_TESTS=1 npx playwright test -c playwright.integration.config.js` — 9 passed with the configured server-side Groq credentials. Isolated run used temporary copies of the config/spec with equivalent endpoints on 8010/8011 and Vite on 5197. [Log](playwright-live-provider.log).
- [Actual HTTP and SQLite output](browser-feedback-http-sqlite.log) · [Persistence and schema results](SQLITE_INTEGRATION_RESULTS.md).

## Screenshots

| Evidence | Capture |
| --- | --- |
| Home and navigation | [Desktop](screenshots/smartcampus-desktop.png) · [Tablet](screenshots/smartcampus-768.png) · [Mobile](screenshots/smartcampus-375.png) |
| Dashboard comparison | [Before](screenshots/dashboard-before.png) · [After](screenshots/dashboard-after.png) |
| Received answer and rating controls | [Grounded chat answer](screenshots/chat-feedback-controls.png) |
| Not helpful form | [Desktop](screenshots/feedback-category-desktop.png) · [Tablet](screenshots/feedback-form-768.png) · [Mobile](screenshots/feedback-form-375.png) |
| Retry and success | [Network interruption](screenshots/feedback-network-error.png) · [Storage 503](screenshots/feedback-storage-unavailable.png) · [Saved](screenshots/feedback-saved.png) |
