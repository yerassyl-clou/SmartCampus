# Deadline dashboard UX baseline

[SIS1011-03](https://app.clickup.com/t/z8q7hbuc7n) · 10 November 2026 · baseline `42dcac91995f5cd930af907716962d6e0f99154c`

Chromium 156.0.8078.4 via Playwright, Node 22.14.0, Python 3.12.1. The browser used Asia/Almaty with the product clock fixed at noon on 10 November. Vite proxied to local FastAPI and a freshly seeded SQLite database containing fictional courses. No AI provider was contacted.

| Case | Steps and expected outcome | Observed | Result and evidence |
|---|---|---|---|
| UX-01 | Load the dashboard with real GET /api/deadlines. Show six records in chronological order with course and source labels. | HTTP 200, six dates in order, all course and source labels present. | PASS · [browser log](danaya-dashboard-browser.log) |
| UX-02 | Hold the response in Playwright. Announce loading and disable Refresh during the request. | Loading announced, Refresh disabled until records arrive. | PASS · [fixture log](danaya-dashboard-playwright.log) |
| UX-03 | Return an empty fixture. Show a clear empty state and enabled Refresh. | No cards, explanatory text, Refresh enabled. | PASS · [fixture log](danaya-dashboard-playwright.log) |
| UX-04 | Intercept with HTTP 503, network failure, or invalid JSON, then return valid data on Retry. | Readable errors, no private debug details, six cards after retry. | PASS · [fixture log](danaya-dashboard-playwright.log) |
| UX-05 | Tab to Refresh and press Enter at 1440, 768 and 375 px. Expect another successful GET. | Focus reached Refresh and Enter produced HTTP 200 at each width. | PASS · [browser log](danaya-dashboard-browser.log) |
| UX-06 | Open the live seeded dashboard at all three widths. Expect no horizontal page overflow. | All three widths fit and preserved labels. | PASS · [1440](dashboard-1440.png), [768](dashboard-768.png), [375](dashboard-375.png) |
| UX-07 | Compare displayed dates to the fixed local date. Expired work should be distinguished from upcoming work. | Nov 6 and Nov 9 were shown under Upcoming deadlines along with Nov 11, 13, 20 and 27. A student could treat expired work as still upcoming. | FAIL · [SC-ISS-001, P1](https://github.com/yerassyl-clou/SmartCampus/pull/7) · [1440 px screenshot](dashboard-1440.png) |

## Reproduction

1. Run `python database/seed.py --db <temporary-path>`, then start FastAPI on port 8000 with `SMARTCAMPUS_DB_PATH` pointing at the seed.
2. From `frontend`, run `npm ci` and `npm run dev -- --host 127.0.0.1 --port 5183 --strictPort`. In a separate shell in that directory run `node ../docs/sis1011/evidence/baseline/dashboard-probe.mjs`. The probe exited 0 and explicitly recorded the known UX failure.
3. Run `npm test -- --project=deadlines` from `frontend`. The intercepted HTTP suite exited 0 with 20 passes. It validates client states and does not establish backend behavior. The Chromium probe covers the live local API path.

The PNGs capture the actual dashboard section after keyboard refresh. The source and date labels come from the fictional seed. [SIS1011-06](https://app.clickup.com/t/z8q7hbuc7r) tracks the separate fix.
