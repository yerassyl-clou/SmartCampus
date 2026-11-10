# SIS 10–11 submission checklist

[SIS1011-20 — Final QA, Merge Review & Submission Checklist](https://app.clickup.com/t/z8q7hbuc8r) · [Playbook submission matrix](https://app.clickup.com/1100310000007240/v/dc/z8q7hb2y28-698/z8q7hb2y28-118)

**Decision: final acceptance pending.** This checklist records a preflight on 10 November 2026. GitHub `main` was at `42dcac91995f5cd930af907716962d6e0f99154c`. The SIS PRs available at the check were Yerassyl's documentation and QA drafts. The last successful team ClickUp snapshot showed the dependencies in To Do. Later reads and writes hit the MCP daily cap, so this is a snapshot.

## Required outputs

| # | Deliverable and owner | Coverage and gate |
| --- | --- | --- |
| 1 | Test Cases and Testing Results · Yerassyl, Ratislav, Danaya | Baseline plan, 16 case IDs across three features and executed logs in [PR #6](https://github.com/yerassyl-clou/SmartCampus/pull/6). [SIS1011-02](https://app.clickup.com/t/z8q7hbuc7m) and [SIS1011-03](https://app.clickup.com/t/z8q7hbuc7n) independent evidence pending. |
| 2 | Updated Issue Log · Yerassyl | Three confirmed issues and two selected fixes in [PR #7](https://github.com/yerassyl-clou/SmartCampus/pull/7). Final fix statuses depend on regression QA. |
| 3 | Technical Debt List · Gleb | Pending `TECHNICAL_DEBT_LIST.md` and two or more evidence-backed items. [SIS1011-04](https://app.clickup.com/t/z8q7hbuc7p) |
| 4 | Improved Product / MVP · Danaya, Ratislav, Yerassyl | Baseline evidence and retest steps in [draft PR #10](https://github.com/yerassyl-clou/SmartCampus/pull/10). Await two distinct fix PRs and matched After results. [UI](https://app.clickup.com/t/z8q7hbuc7r) · [Backend](https://app.clickup.com/t/z8q7hbuc7t) |
| 5 | Updated User Stories and Product Backlog · Yerassyl, Gleb | Criteria, priorities and CR-001 traceability in [PR #9](https://github.com/yerassyl-clou/SmartCampus/pull/9). ClickUp synchronization and impact cross-check pending. [SIS1011-11](https://app.clickup.com/t/z8q7hbuc88) |
| 6 | Change Request Document · Yerassyl | CR-001-A recorded as an academic implementation decision in [PR #8](https://github.com/yerassyl-clou/SmartCampus/pull/8). No signed client commitment. Delivery acceptance remains pending. |
| 7 | Change Impact Analysis · Gleb | Pending `CHANGE_IMPACT_ANALYSIS.md`, five dimensions and estimates. [SIS1011-11](https://app.clickup.com/t/z8q7hbuc88) |
| 8 | Implemented New Feature · Gleb, Ratislav, Danaya | Await [contract](https://app.clickup.com/t/z8q7hbuc89), [SQLite](https://app.clickup.com/t/z8q7hbuc8b), [FastAPI](https://app.clickup.com/t/z8q7hbuc8d) and [React](https://app.clickup.com/t/z8q7hbuc8e). Baseline has no route or feedback table. |
| 9 | New Feature Testing Report · Yerassyl | NFT-01–10 planned, baseline availability probe executed in [draft PR #11](https://github.com/yerassyl-clou/SmartCampus/pull/11). Integrated outcomes and demo evidence pending. |
| 10 | Commercial Offer · Gleb | Pending `COMMERCIAL_OFFER.md`. Verify six required elements, costing arithmetic, timing, payment and warranty against the impact analysis. [SIS1011-17](https://app.clickup.com/t/z8q7hbuc8j) |
| 11 | Simplified Fixed-Price Contract · Gleb | Pending `FIXED_PRICE_CONTRACT.md`. Reconcile fictional parties, exact scope, milestones, installments, total fixed price and acceptance terms with the offer. Separate one-off implementation and recurring fees. [SIS1011-18](https://app.clickup.com/t/z8q7hbuc8m) |
| 12 | Presentation and actual screenshots or video · Danaya, all four presenters | Pending English deck, integrated demo evidence, speaker notes and four-person rehearsal. Baseline screenshots exist in [PR #7](https://github.com/yerassyl-clou/SmartCampus/pull/7). [SIS1011-19](https://app.clickup.com/t/z8q7hbuc8p) |

## Executed preflight

- Combined documentation PRs #6–#9 in an isolated local checkout at `bfd1a69e5fbb6d648e766ee593040d58cca7eeae`. All four applied without conflicts. The changed paths are confined to `docs/sis1011/`. [Backend and changed-path log](evidence/final-demo/precheck-backend.log)
- `python database/seed.py --db <temporary-path>` produced three courses, six deadlines and six documents. `python -m pytest backend/tests -q` passed 77 tests with one deprecation warning. `npm ci` and `npm run build` succeeded. `npm test` passed 55 Playwright tests. These are baseline application regressions on a documentation-only combined revision. [Frontend log](evidence/final-demo/precheck-frontend.log)
- Compared backlog PB-103 and CR-001-A for scope, implementation status and outstanding acceptance. Impact, offer and contract figures cannot be reconciled until their artifacts exist.
- Reviewed the baseline screenshots and checked the docs and evidence paths. The integrated Feedback demo, Before/After pair for each fix and final deck are outstanding.

## Remaining review and merge gates

1. Review incoming PRs against the latest `main`. Compare exact heads, file scope, credentials checks and test evidence. Watch for overlap in `ISSUE_LOG.md` across 05/08 and backlog updates across 09/11. Confirm that 13–15 agree on the persistence helper, UUID, validation, source IDs and HTTP states.
2. Test both fixes and Feedback together in isolation. Include fresh seed, upgrade from an existing seeded database, restart, reseed, real browser-to-database evidence and full regressions. Reconcile the documentation with observed outcomes.
3. Verify all 12 outputs in English, reconcile commercial figures and rehearse the ten-minute presentation with all four presenters.
4. Obtain Yerassyl's explicit merge authorization for each reviewed PR. Verify the accepted revision on `main`, then have Yerassyl finalize the ClickUp statuses.
