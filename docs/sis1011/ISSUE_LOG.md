# SmartCampus issue log

[SIS1011-05 — Consolidated Issue Log & Prioritization](https://app.clickup.com/t/z8q7hbuc7q)

All three issues were reproduced on `42dcac91995f5cd930af907716962d6e0f99154c` with fictional data on 10 November 2026. Browser checks used real Chromium → FastAPI → SQLite with a loopback-only provider configuration. [Probe output](evidence/baseline/issue-probes.log). These are new SIS 10–11 findings. The [SIS 8–9 QA report](../SIS89_08_QA_REPORT.md) covers earlier resolved work separately.

| Priority | Issue | Type / severity | User impact | Owner / task | Status |
| --- | --- | --- | --- | --- | --- |
| P1 | SC-ISS-002 | Retrieval defect / high | An unrelated course becomes eligible evidence for a deadline question | [Ratislav, SIS1011-07](https://app.clickup.com/t/z8q7hbuc7t) | Confirmed, selected. Fix PR and retest pending. |
| P1 | SC-ISS-001 | Dashboard usability defect / medium | Past dates appear under “Upcoming deadlines”, misleading a student planning upcoming work | [Danaya, SIS1011-06](https://app.clickup.com/t/z8q7hbuc7r) | Confirmed, selected. Fix PR and retest pending. |
| P2 | SC-ISS-003 | Chat onboarding usability defect / low | The built-in deadline prompt leads to a dead end although seeded deadline data is available | [Yerassyl, SIS1011-09 backlog](https://app.clickup.com/t/z8q7hbuc7v), proposed UI follow-up | Confirmed, deferred. Fix PR and retest pending. |

P1 items affect the correctness of deadlines or the evidence used to answer coursework questions. P2 is recoverable through the dashboard or a supported question.

## SC-ISS-001 · Past dates listed as upcoming

- **Reproduce (IMP-DASH-01)** Seed the baseline DB. Open the dashboard in Chromium using Asia/Almaty and a 10 November 2026 reference date. Inspect the dates in the “Upcoming deadlines” region.
- **Expected** Dates before the reference day should be labeled as past or listed separately. Dates on the reference day belong with upcoming items.
- **Actual** The same upcoming list contains 6 and 9 November alongside 11, 13, 20 and 27 November. The first two lack a past label. [Baseline screenshot](evidence/baseline/SC-ISS-001-dashboard-before.png)
- **Fix acceptance** Keep the same six records reachable and source-labeled. Separate or clearly label expired records using inclusive Asia/Almaty date-only comparisons. Retest with yesterday, today and tomorrow plus existing BL-DASH-01 and BL-DASH-05 coverage. Capture Before/After with identical date and viewport.

## SC-ISS-002 · Explicit course name does not constrain retrieval

- **Reproduce (IMP-RET-01)** Seed the baseline DB and call `search_course_materials("When is the Human-Computer Interaction Assignment 2 due?")` without a course ID. Repeat with `course_id=3` as the control.
- **Expected** With no matching assignment in the named course, return no candidates or a clarification path. A deadline from a different course must not support the answer.
- **Actual** The unscoped query returns Database Systems syllabus source `1` and deadline source `-1`. Explicit `course_id=3` returns no sources. This confirms irrelevant candidate selection. The live provider's final answer was outside this probe. [Retrieval output](evidence/baseline/issue-probes.log)
- **Fix acceptance** Respect a recognized course in the question when the request lacks a course ID, or return a safe fallback when course scope cannot be resolved. Verify the mismatch returns no unrelated evidence, the same Database Systems question still finds its evidence, explicit course filters still work, and BL-RET-01/02/04/05 stay green. Capture candidate IDs and API results with a deterministic provider.

## SC-ISS-003 · Built-in deadline suggestion returns a fallback

- **Reproduce (EXP-CHAT-01)** With the seeded baseline app, choose “Find the right information” and submit the prefilled “Where can I find information about course deadlines?”
- **Expected** A built-in starter should surface the available fictional deadlines or direct the student to the dashboard.
- **Actual** The API returns HTTP 200 with `grounded=false`, `sources=[]` and the missing-evidence fallback. The UI shows the no-evidence warning while the adjacent dashboard displays six deadlines. [Baseline screenshot](evidence/baseline/SC-ISS-003-chat-shortcut-before.png)
- **Proposed follow-up** Prefill a supported listing intent or link to the dashboard. Retest the actual built-in interaction on a seeded DB. Keep safe fallback for unsupported questions.

[Baseline test matrix and case IDs](https://github.com/yerassyl-clou/SmartCampus/blob/5b4c39627f5f08b367681fa2500fc81c63102762/docs/sis1011/TEST_CASES_AND_RESULTS.md) · [Independent improvement verification, SIS1011-08](https://app.clickup.com/t/z8q7hbuc7u)
