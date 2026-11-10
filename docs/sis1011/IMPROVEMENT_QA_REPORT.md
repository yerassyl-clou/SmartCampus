# Improvement regression QA and Before/After

[SIS1011-08 — Improvement Regression QA & Before/After](https://app.clickup.com/t/z8q7hbuc7u)

**State: baseline verified, fixed revisions pending.** The precheck found no reviewable UI or backend fix PR. Baseline is `42dcac91995f5cd930af907716962d6e0f99154c`. All data is fictional. [Baseline matrix and suites](https://github.com/yerassyl-clou/SmartCampus/pull/6) · [Issue log and actual Before evidence](https://github.com/yerassyl-clou/SmartCampus/pull/7)

| Retest | Issue and owner | Observed Before | Fixed revision and observed After |
| --- | --- | --- | --- |
| IMP-DASH-01 | SC-ISS-001, [Danaya / SIS1011-06](https://app.clickup.com/t/z8q7hbuc7r) | Chromium at 1440×1000 and Asia/Almaty on 10 Nov 2026 rendered 6 and 9 Nov under Upcoming with four future dates. | Pending UI PR and commit. Retest blocked. |
| IMP-RET-01 | SC-ISS-002, [Ratislav / SIS1011-07](https://app.clickup.com/t/z8q7hbuc7t) | On the fictional DB, “When is the Human-Computer Interaction Assignment 2 due?” returned Database Systems sources 1 and -1 with no course ID. Explicit course 3 returned none. | Pending backend PR and commit. Retest blocked. |

## Retest procedure

1. Fetch both PRs by their head SHAs. Read their diff and test changes, then combine the heads on an isolated checkout. Record individual and integrated SHAs, any file conflicts and any interface issues. Keep `main` unchanged during the review.
2. For IMP-DASH-01, seed the same data. Fix the reference date to 10 November 2026 in Asia/Almaty. Compare the dashboard heading, date labels and ordering. Exercise yesterday, today and tomorrow. Confirm all six rows remain available with sources and that 375px, 768px and desktop views, refresh and retry work. Capture the same viewport before and after.
3. For IMP-RET-01, repeat the mismatched course question and the matching Database Systems control. Verify explicit course filters, absence of unrelated IDs in the mismatched case, no provider invocation for a zero-match fallback, and preservation of safe error and exact-quote validation. Compare retrieval IDs and HTTP responses using a deterministic provider.
4. Run `python -m pytest backend/tests -vv`, `npm ci`, `npm run build` and `npm test`. Inspect app compatibility via real seeded FastAPI/SQLite and capture logs or screenshots in `evidence/improvements-before-after/`.
5. Record actual result, outcome, PR, commit and evidence per issue. Update the Issue Log once its source branch is available for a coordinated edit. Leave both issues open until their retests pass.

**Acceptance pending.** The baseline evidence can be reviewed now. Both fix PRs and their matching After evidence are required for acceptance.
