# Improvement regression QA and Before/After

[SIS1011-08 — Improvement Regression QA & Before/After](https://app.clickup.com/t/z8q7hbuc7u)

**Technical acceptance PASS · 10 November 2026.** Baseline `42dcac91995f5cd930af907716962d6e0f99154c`. Both changes ran together through real Chromium, FastAPI and SQLite with fictional course data. Board acceptance is tracked separately.

| Retest | Expected | Baseline observation | Integrated observation |
| --- | --- | --- | --- |
| IMP-DASH-01 / SC-ISS-001 / [PR #18](https://github.com/yerassyl-clou/SmartCampus/pull/18) | Campus dates before today belong in Past. Today remains Upcoming. Keep course, date and source labels. | Both expired dates appeared in the same Upcoming list as four future dates. | 6 and 9 November appeared under Past. 11, 13, 20 and 27 November appeared under Upcoming. Both groups were ordered and all six records remained available. |
| IMP-RET-01 / SC-ISS-002 / [PR #14](https://github.com/yerassyl-clou/SmartCampus/pull/14) | The named HCI course cannot use Database Systems material. A matching Database Systems control still gets evidence. | HCI query admitted Database Systems IDs `[1,-1]`. | Same query returned no candidates. Real POST returned 200 with grounded=false and zero sources. Database Systems control still returned `[1,-1]`. |

## Coverage

- Dashboard Before/After used the same dataset and fixed browser time, 10 November at 12:00 Asia/Almaty, at 1440×900. The timezone boundary regression used Los Angeles browser time and the Asia/Almaty calendar. Loading, empty, invalid and failed data states, refresh, retry, stable date sorting and responsive layout passed. Real keyboard refresh returned 200.
- Retrieval tests covered explicit course filtering, named-course scope, verified excerpts, wrong source rejection and safe fallback. The seven real Groq question checks confirmed expected exact phrases and source references. The unmatched HCI case took the backend fallback path without a provider request.
- Complete integrated regression passed 126 backend tests, 70 default browser tests and nine live browser tests. SC-ISS-003 remains deferred in the backlog.

[Before](evidence/final-demo/screenshots/dashboard-before.png) · [After](evidence/final-demo/screenshots/dashboard-after.png) · [Candidate ID replay](evidence/improvements-before-after/SC-ISS-002-final-replay.log) · [Commands and full results](evidence/final-demo/FINAL_E2E_RESULTS.md)
