# Baseline test cases and results

All rows below were observed on `42dcac91995f5cd930af907716962d6e0f99154c` on 10 November 2026. The [test plan](BASELINE_TEST_PLAN.md) records the environment and isolation. Yerassyl ran these suites. The case owner column identifies the follow-up owner. Existing automated assertions are the source of the observed results below.

| Command | Observed result | Evidence |
| --- | --- | --- |
| `python -m pytest backend/tests -vv` | 77 passed, one Starlette TestClient deprecation warning, exit 0 | [Backend log](evidence/baseline/pytest.log) |
| `npm ci` then `npm run build` from `frontend/` | Install and build completed, build exit 0 | [Build log](evidence/baseline/build.log) |
| `npm test` from `frontend/` | 55 passed, exit 0 | [Playwright log](evidence/baseline/playwright.log) |

| ID | Feature / owner | Input and steps | Expected | Observed / outcome | Evidence selector | Related capability |
| --- | --- | --- | --- | --- | --- | --- |
| BL-CHAT-01 | Chat / Ratislav | POST “Assignment 2 deadline” with course 1 and mocked verified quote | Grounded answer with source | Source 1 and exact date quote accepted / PASS | pytest `test_grounded` | Source-backed answer |
| BL-CHAT-02 | Chat / Ratislav | POST a whitespace-only question | 422 | Validation rejected whitespace / PASS | pytest `test_invalid` | Input validation |
| BL-CHAT-03 | Chat / Ratislav | POST question beyond the 4,000-character limit | 422 | Overlong input rejected / PASS | pytest `test_question_length_limit` | Input boundary |
| BL-CHAT-04 | Chat / Ratislav | Simulate provider rate limit on a supported question | Safe 503 category, sanitized response | 503 categorized as rate limit / PASS | pytest `test_diagnostics_are_safe` | Recoverable failure |
| BL-CHAT-05 | Chat / Danaya | Submit a question and intercept HTTP 503 | Preserve history and allow Retry | History retained and Retry worked / PASS | Playwright “HTTP 503 preserves history” | Recoverable failure |
| BL-RET-01 | Retrieval / Ratislav | Search “What is the rule for late database lab work?” | Course rule ranked first | Document 2 ranked first / PASS | pytest `test_retrieval_ranks_evidence` | Course rules |
| BL-RET-02 | Retrieval / Ratislav | Search “assignments 2 requirements” | Singular/plural forms find syllabus | Document 1 ranked first / PASS | pytest `test_retrieval_ranks_evidence` | Coursework |
| BL-RET-03 | Retrieval / Ratislav | Search “Assignment 999” | No false match | Empty source list / PASS | pytest `test_no_weak_matches` | Numeric qualifier |
| BL-RET-04 | Retrieval / Ratislav | Search with course filter and limit, including zero limit | Isolate courses and honor limit | Filter and limits applied / PASS | pytest `test_filters_limits_and_deadline_only_facts` | Source selection |
| BL-RET-05 | Retrieval / Ratislav | POST “When is the Physics exam?” | Safe fallback, no provider call | Ungrounded response with no sources / PASS | pytest `test_missing_info_without_provider` | Missing evidence |
| BL-DASH-01 | Dashboard / Danaya | Load six intercepted records with same-date tie | Chronological order, ID tie-break | Six cards rendered in expected order / PASS | Playwright “GET renders all six” | Deadline browsing |
| BL-DASH-02 | Dashboard / Danaya | Hold response pending | Announce loading, suppress duplicate refresh | Loading visible and refresh unavailable / PASS | Playwright “pending request” | Request state |
| BL-DASH-03 | Dashboard / Danaya | Return empty response then refresh | Empty message and recovery | Empty state displayed and refreshed / PASS | Playwright “empty API response” | Empty state |
| BL-DASH-04 | Dashboard / Danaya | Fail refresh after initial success, then Retry | Keep stale data with warning and recover | Prior rows preserved, notice displayed and Retry recovered / PASS | Playwright “failed refresh” | Recovery |
| BL-DASH-05 | Dashboard / Danaya | View long fixture content at 375px | No horizontal overflow | Cards wrapped within viewport / PASS | Playwright “deadline layout at 375px” | Mobile layout |
| BL-DASH-06 | Dashboard / Danaya | Return invalid calendar date | Reject malformed payload safely | Error state shown / PASS | Playwright “invalid calendar date” | Date validation |

Independent teammate results and exploratory findings can be appended through linked evidence files. Existing dashboard tests intentionally cover rendering all returned rows and do not establish whether the “Upcoming deadlines” label matches the displayed dates.
