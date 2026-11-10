# Answer feedback UI verification

[SIS1011-15](https://app.clickup.com/t/z8q7hbuc8e) · baseline `42dcac91995f5cd930af907716962d6e0f99154c` · [contract PR #15](https://github.com/yerassyl-clou/SmartCampus/pull/15) · [route PR #16](https://github.com/yerassyl-clou/SmartCampus/pull/16)

Received assistant answers in the live-mode UI, including safe fallbacks, get one UUID v4 and per-answer feedback controls. Source cards remain intact. The frontend forwards only validated nonzero signed integer source IDs. Demo-mode scripted answers do not send feedback. The browser needs a secure context for UUID generation (localhost or HTTPS).

| Check | Actual result |
|---|---|
| `npm run build` | Exit 0. [Build log](danaya-feedback-build.log). |
| `FEEDBACK_EVIDENCE=../docs/sis1011/evidence/feedback-feature npm test -- --project=chat --project=deadlines --project=feedback` from `frontend` | Exit 0. 66 passed: 33 Chat, 20 Dashboard, 13 Feedback. Feedback assertions cover signed IDs, valid UUIDs, no student controls, pending and duplicate protection, category and optional comment, Unicode 500/501, 422/503/network/malformed 201/409, retries with an identical payload, independent fallback answers and keyboard at three widths. [Playwright log](danaya-feedback-playwright.log). |
| Chromium through Vite to the real PR #16 FastAPI feedback route | The actual POST and retry both returned HTTP 503 with `feedback_unavailable`. Both used the same UUID and signed source IDs. The UI displayed retry and never showed success. Chat was an intercepted fixture. [Browser log](danaya-feedback-route.log) and [503 screenshot](danaya-feedback-route-503.png). |
| Production SQLite persistence, restart, and reseed | Pending SIS1011-13 and independent SIS1011-16 integrated acceptance. The PR #16 route was still unmerged and the production storage helper was unavailable when checked. A fixture 201 and the real 503 do not show a saved row. |

## Browser evidence

- [Before, baseline answer without rating controls](danaya-feedback-before.png) and [after, same answer with controls](danaya-feedback-answer.png). Both used the same fictional Chat fixture and a 1440 px Chromium viewport on 10 November 2026.
- Issue form: [375 px](danaya-feedback-375.png), [768 px](danaya-feedback-768.png), [1440 px](danaya-feedback-1440.png). Screenshots show the actual React form under controlled HTTP fixtures.
- The [real-route probe](feedback-route-browser.mjs) expects the baseline Vite server at 5183 and the feature Vite server at 5185 proxying to a loopback FastAPI instance from PR #16. The test deliberately checks the route without the production store. Start both servers and run `node ../docs/sis1011/evidence/feedback-feature/feedback-route-browser.mjs` from the feature's `frontend` directory.

## Combined check after the storage PR became available

On 10 November 2026 we tested an isolated checkout with [route PR #16](https://github.com/yerassyl-clou/SmartCampus/pull/16) at `feb354f`, [UI PR #19](https://github.com/yerassyl-clou/SmartCampus/pull/19) at `b2d8ea5` and [storage PR #20](https://github.com/yerassyl-clou/SmartCampus/pull/20) at `f780d58`. This later run supersedes the earlier storage-availability row for the combined checkout. The branches remain independently reviewable.

| Check | Actual result |
|---|---|
| Browser → Vite → real FastAPI → real SQLite | Helpful and Not helpful each returned **201**, rendered saved state and produced distinct response UUIDs with signed source IDs `[1, -1]`. Only the fictional Chat response was intercepted. [Screenshot](danaya-feedback-saved.png) and [browser/storage log](danaya-feedback-persistence.log). |
| Restart and repeat seed | Both rows retained their rating, category, comment, timestamp and signed IDs. All six seeded deadlines remained available. |
| Duplicate and invalid requests after restart | Same UUID → **409**. Invalid UUID → **422**. Exactly two rows remained. |
| Combined backend regression as published | **83 passed, 35 setup errors.** PR #16's test harness creates a table that PR #20's seed already creates. [Summary](danaya-feedback-combined-summary.log). |
| Local diagnostic only | Removing the duplicate CREATE TABLE from the test fixture and giving its test-only INSERT an explicit `CURRENT_TIMESTAMP` resolved the collision: **118 passed**, one existing Starlette deprecation warning. This change was made in a disposable checkout and is not part of the UI PR. |

To reproduce the browser path, start from PR #20's tree, overlay the four route/test paths changed by PR #16 (`backend/app/main.py`, `backend/app/feedback_schemas.py`, `backend/app/routes/feedback.py`, `backend/tests/test_feedback.py`), then overlay the `frontend/` tree at the UI commit above. Install the existing backend and frontend dependencies. From the combined checkout run `FEEDBACK_OUTPUT=/absolute/isolated/evidence bash docs/sis1011/evidence/feedback-feature/run-feedback-persistence.sh` using the accompanying [Chromium probe](feedback-persistence-browser.mjs). Ports 8004 and 5187 must be free. The script seeds a disposable DB, runs the browser probe, restarts the API, checks retained rows and removes the temporary database. No live LLM or production dataset is required.

SIS1011-15 frontend acceptance is ready for review. Ratislav and Gleb should reconcile the backend test fixture before merge. Yerassyl owns the independent SIS1011-16 acceptance run.
