# New feature testing and acceptance

[SIS1011-16 — New Feature Testing Report & Acceptance](https://app.clickup.com/t/z8q7hbuc8g) · [CR-001](CHANGE_REQUEST_DOCUMENT.md) · [Implemented API contract](FEEDBACK_API_CONTRACT.md)

**Technical acceptance PASS · 10 November 2026.** Real Chromium, FastAPI and the production SQLite helper. The baseline returned HTTP 404 for feedback and had no feedback table. [Baseline proof](evidence/feedback-feature/baseline-availability.log).

| ID | Expected | Executed result |
| --- | --- | --- |
| NFT-01 | Helpful saves one row without category. | PASS. Real browser POST returned 201, id 1, visible saved state and stored helpful rating. |
| NFT-02 | Not helpful requires an allowed category. | PASS. Real browser stored missing_information. Route tests accepted all four supported values and rejected missing or invalid values. |
| NFT-03 | Optional plain-text comment. Accept 500 code points and reject 501. | PASS. The browser retained and stored the submitted sample comment. Route and UI tests exercised blank, 500/501, markup and normalization cases. |
| NFT-04 | Reject malformed UUID, non-v4 UUID, invalid types and rating. | PASS. Backend validation tests and live HTTP 422 probes produced zero invalid writes. |
| NFT-05 | One record per UUID, even on retry or concurrent requests. | PASS. Browser kept one UUID per answer. API replay after restart returned 409. Canonicalization and concurrent duplicate tests preserved the first row. |
| NFT-06 | Failure produces an accessible error and retry without a false save. | PASS. Aborted request and real SQLite unavailability both preserved the negative form. The real 503 included `feedback_unavailable`. Restoring the test file and retrying saved once. |
| NFT-07 | Upgrade, restart and fictional reseed preserve feedback. | PASS. Two browser-created rows survived actual Uvicorn restart. Separate baseline upgrade preserved all course rows and repeat fixture seed preserved existing feedback. |
| NFT-08 | Real UI → API → SQLite, with feedback associated with the correct answer. | PASS. Distinct UUIDs and matching signed source IDs were verified against each request and each row. The listing's source IDs were `[-5,-2,-4,-6]`. The fallback submitted `[]`. |
| NFT-09 | Existing deadlines and chat remain compatible. | PASS. Existing OpenAPI chat properties, real deadline routes, deterministic chat and separate real Groq checks passed. |
| NFT-10 | Keyboard, responsive layout, announcements and retry. | PASS. The real browser opened and submitted the form with Enter, focused the category and retried at 375×812. State, accessibility labels and in-flight guard passed the default suite. |

The assistant responses used real deterministic backend paths backed by the seeded database. A separate test run used live Groq for grounded questions and recovery. The feature stores anonymous feedback for review by the fictional client. It does not expose a public feedback reader. A client-generated UUID identifies the displayed answer within the session and supports deduplication. It does not authenticate the user or prove answer ownership.

The integration fix removed duplicate test DDL and routed validation tests through the production helper. Its SQLite connection now closes after each operation. The integrated browser suite also corrected a test that expected one global deadline order after the UI introduced two ordered groups.

[HTTP and SQLite log](evidence/final-demo/browser-feedback-http-sqlite.log) · [Actual storage 503](evidence/final-demo/screenshots/feedback-storage-unavailable.png) · [Mobile form](evidence/final-demo/screenshots/feedback-form-375.png) · [Saved state](evidence/final-demo/screenshots/feedback-saved.png) · [SQLite results](evidence/final-demo/SQLITE_INTEGRATION_RESULTS.md)
