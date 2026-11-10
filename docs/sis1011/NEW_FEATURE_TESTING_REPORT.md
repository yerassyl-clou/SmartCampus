# New feature testing and acceptance

[SIS1011-16 — New Feature Testing Report & Acceptance](https://app.clickup.com/t/z8q7hbuc8g) · [CR-001 and simulated approval](https://github.com/yerassyl-clou/SmartCampus/pull/8)

**State: integration blocked.** No reviewable heads for [SQLite / Gleb](https://app.clickup.com/t/z8q7hbuc8b), [FastAPI / Ratislav](https://app.clickup.com/t/z8q7hbuc8d) or [React / Danaya](https://app.clickup.com/t/z8q7hbuc8e) were present during the repository check. Reconcile with the [API contract task](https://app.clickup.com/t/z8q7hbuc89) before running integrated tests.

## Executed precheck

On baseline `42dcac91995f5cd930af907716962d6e0f99154c` with a freshly seeded temporary SQLite DB, FastAPI TestClient returned 404 for a valid-looking Helpful POST, and the SQLite schema contained the original course tables with no feedback table. This confirms the baseline state before CR-001. [Precheck log](evidence/feedback-feature/baseline-availability.log)

## Integration scenarios

Run on exact combined PR heads and a fresh fictional DB using real Chromium, local FastAPI and SQLite. Record OS, runtime, browser version, head SHAs, DB setup and command outcomes. Use a deterministic provider for source-backed chat or the deterministic chat listing and fallback. Keep separate logs and screenshots named by test ID under `evidence/feedback-feature/`.

| ID | Input and steps | Expected result | Actual / status |
| --- | --- | --- | --- |
| NFT-01 | Rate a received answer Helpful with no category. | HTTP 201 and visible saved status. One row has rating helpful. | Awaiting integration / Not run |
| NFT-02 | Choose Not helpful and Incorrect information. Repeat on separate answers for the other three categories. | Accepted category value is stored on each answer UUID. | Awaiting integration / Not run |
| NFT-03 | Submit negative feedback with a blank comment and another with 500 plain-text characters. Repeat with 501 via API. | Blank and 500 accepted, submitted text persists, 501 rejected with 422. | Awaiting integration / Not run |
| NFT-04 | POST invalid rating, malformed UUID and a non-v4 UUID, independently. | 422 per invalid payload and no row. | Awaiting integration / Not run |
| NFT-05 | Attempt a second UI submission after save and replay the exact UUID via API. | UI prevents resend. Replay returns 409. SQLite still contains one row for the UUID. | Awaiting integration / Not run |
| NFT-06 | Run against a DB path made unavailable after loading the page. Attempt submit, restore DB and retry. | Safe 503, visible recovery, no phantom success, one record after retry. | Awaiting integration / Not run |
| NFT-07 | Save feedback, restart FastAPI using the same DB and repeat seed. Inspect the row after each step. Also test upgrade of a copy of the baseline seeded DB. | Feedback and course rows survive, and migration supports the original schema. | Awaiting integration / Not run |
| NFT-08 | From the real browser submit feedback on an answer, record HTTP request/response and query SQLite by response UUID. | UI shows saved after 201. Stored rating, category, comment, source IDs and creation timestamp match. | Awaiting integration / Not run |
| NFT-09 | Ask a supported question and an unsupported question, browse and refresh seeded deadlines, and run both suites. | Existing verified sources, fallback, deadline results and regression suites remain healthy. | Awaiting integration / Not run |
| NFT-10 | At 375px, use Tab/Enter to open the form, select a category and submit. Repeat with recoverable failure. | Visible focus, labels and announced outcome, with usable retry and no overflow. | Awaiting integration / Not run |

**Acceptance pending.** Record failures and exact retests before recommending acceptance. An intercepted browser test can verify state handling, while proof of storage requires a real response and a SQLite row. Client-generated UUIDs and unauthenticated submissions remain MVP limitations.
