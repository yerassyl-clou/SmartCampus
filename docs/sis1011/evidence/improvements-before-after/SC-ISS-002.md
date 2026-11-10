# SC-ISS-002 — Named-course evidence scope

[SIS1011-07](https://app.clickup.com/t/z8q7hbuc7t) · [Baseline PR #13](https://github.com/yerassyl-clou/SmartCampus/pull/13)

Confirmed P1/high retrieval defect from the team issue log, independently reproduced against main `42dcac91995f5cd930af907716962d6e0f99154c` on 10 November 2026.

Exact input: `When is the Human-Computer Interaction Assignment 2 due?` with no `course_id`. Before: candidates `[1, -1]` belong to Database Systems. A mocked first-candidate selector yielded `grounded=true`, source 1 and `Assignment 2 deadline: 2026-11-06.` with the Database Systems title. Expected: no unrelated evidence. The HCI course has no Assignment 2. Live Groq output was not tested or claimed.

After: candidates `[]`; HTTP 200 with `grounded=false`, empty sources and the existing missing-evidence fallback. The provider is not called. Matching Database Systems questions still return `[1, -1]`; explicit course filters still work. Conflicting explicit/named scope and multiple recognized named courses return no candidates. Course names are matched as complete normalized phrases, case/punctuation insensitive, then removed from ranking tokens so a course mention cannot itself make unrelated content relevant.

Changes: `backend/app/retrieval.py`, `backend/tests/test_course_scope.py`. No ChatResponse schema or quote verification changes. Full course names come from the current database; nicknames, aliases and unknown-course natural-language interpretation remain limitations. Ambiguous multiple named courses intentionally fallback rather than combine results.

Actual checks using isolated fictional SQLite and mocked providers:

- `python -m pytest backend/tests/test_course_scope.py -q` on unchanged implementation: **5 failed, 3 passed**, exit 1. [Before log](SC-ISS-002-before-tests.log).
- `python -m pytest backend/tests -q` after patch: **85 passed**, one Starlette deprecation warning, exit 0. [After log](SC-ISS-002-after-tests.log).
- Re-ran the 12-case baseline probe from PR #13 with the patch applied: **12 PASS**, including AI-10 and AI-12 which failed before. [Exact responses and candidates](SC-ISS-002-after.json). Its revision field records the base; revision_note identifies the applied working patch. The final implementation is the PR head.

Python 3.13; FastAPI 0.162.2; Pydantic 2.14.3; pytest 9.2.0. No live API call, browser screenshot, or production acceptance claimed. Yerassyl should perform the independent SIS1011-08 retest and update the shared issue log after review.
