# SIS 8–9 Acceptance & test plan

Status: **planning template**. Record real test runs; do not claim 'passed' until executed.

| ID | Scenario | Expected result | Actual | Status | Evidence |
|---|---|---|---|---|---|
| TC01 | GET /api/health | 200 and status ok | | Not run | |
| TC02 | GET /api/deadlines | 6+ fictional seeded records in chronological order | | Not run | |
| TC03 | POST /api/chat on a known deadline | Grounded response with traceable source | | Not run | |
| TC04 | POST /api/chat on unknown info | Clear fallback; grounded=false; no invented answer | | Not run | |
| TC05 | Disconnect/unconfigure LLM API | Safe error without key disclosure | | Not run | |
| TC06 | Narrow browser window | Chat & deadlines usable | | Not run | |

Write automated pytest tests with mocked LLM (no paid network calls in CI). Do a separately recorded manual live LLM smoke test only if a valid team key is available. Attach screenshots/PR links to the ClickUp task.
