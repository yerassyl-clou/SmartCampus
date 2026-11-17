# SIS 10–11 Workload Matrix and SIS 12 Plan

**Evidence snapshot:** 17 November 2026. Historical window: 4–17 November 2026 inclusive (14 calendar days). ClickUp task detail, metrics, and assignment records in the verified source export are the basis for estimates and current assignments. This report distinguishes planned estimates, capacity assumptions, and unmeasured actual effort.

## Historical allocation (SIS 10–11)

Historical tasks were all marked Done. Every task was created 9 November, due 10 November, and has a ClickUp start date and formal close date of 10 November; they are active within the selected window. Those are task lifecycle events, **not verified effort dates**. Actual work may have occurred on other dates. Task records report `time_spent: null` (not a measured zero). The earlier brief and policy comment reported 0; the latest raw source is null. Both show no positive observed value in these fields, neither establishes zero human work, and no claim is made about other possible logs.

The live [SIS12-02 description](https://app.clickup.com/t/z8q7hbw36q) explicitly prescribes **8 hours per person across 4–17 November**. This is the source for the 480-minute denominator used below. It is a capacity assumption, not verified availability, contractual capacity, or attendance; the earlier 4-hours-per-week source behind that instruction was not located. The denominator was not independently measured. Utilization below is planned estimate divided by that assumed capacity.

| Member / role | SIS 10–11 assigned tasks (estimate minutes) | Planned | Assumed capacity | Planned utilization | Label |
|---|---|---:|---:|---:|---|
| Yerassyl Babayev — PM / integration and QA | 01 (45), 05 (50), 08 (75), 09 (45), 10 (50), 16 (105), 20 (115) | 485 min / 8 h 05 m | 480 min / 8 h | 101.0% | >100% overloaded |
| Danaya Aliyeva — frontend / UX and presentation evidence | 03 (55), 06 (105), 15 (145), 19 (105) | 410 min / 6 h 50 m | 480 min / 8 h | 85.4% | balanced |
| Gleb — database / commercial documentation | 04 (75), 11 (55), 13 (145), 17 (70), 18 (65) | 410 min / 6 h 50 m | 480 min / 8 h | 85.4% | balanced |
| Ratislav — backend / AI and API | 02 (60), 07 (105), 12 (40), 14 (130) | 335 min / 5 h 35 m | 480 min / 8 h | 69.8% | <70% underused* |
| **Team** | **20 tasks** | **1,640 min / 27 h 20 m** | **1,920 min / 32 h** | **85.4%** | **planned only** |

\*The threshold label follows the supplied rule mechanically. This is not evidence of spare real capacity: estimates are not actual effort, and capacity is assumed. Skills and dependency constraints can prevent reassignment even when aggregate planned utilization looks lower.

## Task-level estimate evidence

All rows below were marked Done in the 17 November source snapshot. “Start → closed” records the ClickUp lifecycle dates, not actual labor dates. Estimates are the task `time_estimate` values; raw `time_spent` was null for every row. Links resolve to the source tasks.

| Task | Assignee | Estimate | Start → closed | ClickUp |
|---|---|---:|---|---|
| SIS1011-01 Baseline Audit & Test Plan | Yerassyl | 45 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7k) |
| SIS1011-02 AI Chat & Retrieval Testing | Ratislav | 60 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7m) |
| SIS1011-03 Deadline Dashboard & UX Testing | Danaya | 55 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7n) |
| SIS1011-04 Database & Technical Debt Audit | Gleb | 75 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7p) |
| SIS1011-05 Consolidated Issue Log & Prioritization | Yerassyl | 50 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7q) |
| SIS1011-06 Frontend Product Improvement | Danaya | 105 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7r) |
| SIS1011-07 Backend/AI Product Improvement | Ratislav | 105 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7t) |
| SIS1011-08 Improvement Regression QA & Before/After | Yerassyl | 75 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7u) |
| SIS1011-09 Updated User Stories & Product Backlog | Yerassyl | 45 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7v) |
| SIS1011-10 Client Change Request CR-001 & Simulated Approval | Yerassyl | 50 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc7w) |
| SIS1011-11 Change Impact Analysis & Backlog Approval | Gleb | 55 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc88) |
| SIS1011-12 Feedback API & Data Contract | Ratislav | 40 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc89) |
| SIS1011-13 Feedback Database & Persistence | Gleb | 145 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8b) |
| SIS1011-14 Feedback API Implementation | Ratislav | 130 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8d) |
| SIS1011-15 Feedback UI Implementation | Danaya | 145 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8e) |
| SIS1011-16 New Feature Testing Report & Acceptance | Yerassyl | 105 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8g) |
| SIS1011-17 Commercial Offer for Fictional University Client | Gleb | 70 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8j) |
| SIS1011-18 Simplified Fixed-Price Contract | Gleb | 65 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8m) |
| SIS1011-19 Presentation & Screenshot/Video Evidence | Danaya | 105 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8p) |
| SIS1011-20 Final QA, Merge Review & Submission Checklist | Yerassyl | 115 min | 10 Nov → 10 Nov | [task](https://app.clickup.com/t/z8q7hbuc8r) |

## Interpretation and delivery impact

The estimate-based plan places the PM at 101% of the assumed two-week capacity, making review, integration, and final QA a plausible bottleneck; because the capacity is only an assumption, this is a planning signal rather than a measured overload. Frontend and persistence/API implementation estimates are concentrated in Danaya and Ratislav respectively, so specialist tasks are not freely interchangeable. Integration and acceptance depend on upstream implementation and evidence, creating a potential queue if those handoffs arrive late. All twenty historical task records lack a measured `time_spent` value, so estimate accuracy, overtime, and true actual-versus-plan variance cannot be determined. The project has evidence of delivery in [PR #22](https://github.com/yerassyl-clou/SmartCampus/pull/22), [PR #25](https://github.com/yerassyl-clou/SmartCampus/pull/25), and the [acceptance report](../sis1011/FINAL_ACCEPTANCE_REPORT.md), which records 126 backend, 70 standard browser, and 9 live tests on 10 November; those are historical recorded results, not freshly rerun results. Without time and dependency timestamps, quality or schedule impact cannot be causally attributed to utilization percentages.

## Current SIS 12 planned allocation (separate cycle)

The following are current individual assignments and estimates after SIS12-01 moved to Danaya. The prior owner and transfer date are stated in the supplied task brief; current assignment is verified, but no independent assignment-history export was available. All nine SIS12 tasks were created 17 November and due 17 November. In the source snapshot, SIS12-01 and SIS12-06 were in Review; the other seven (02, 03, 04, 05, 07, 08, 09) were To do. These lifecycle states do not establish time spent. No actuals are available in the source (`time_spent: null` for all 29 task records). For a comparable 14-day scenario only, the same 480-minute denominator prescribed for the historical window is shown; this is a comparator, not a forecast or committed next-cycle allocation. The time-tracking protocol separately uses a four-hour, seven-day pilot assumption.

| Member | Current assigned SIS 12 tasks | Planned | 480-min scenario utilization | Label |
|---|---|---:|---:|---|
| Yerassyl | 02 (90), 09 (60) | 150 min / 2 h 30 m | 31.3% | <70% underused |
| Danaya | 01 (60), 06 (90) | 150 min / 2 h 30 m | 31.3% | <70% underused |
| Ratislav | 03 (90), 04 (100) | 190 min / 3 h 10 m | 39.6% | <70% underused |
| Gleb | 05 (100), 07 (75) | 175 min / 2 h 55 m | 36.5% | <70% underused |
| **Individual total** | **8 individually assigned tasks** | **665 min / 11 h 05 m** | — | — |
| **Shared SIS12-08** | **co-assigned to all four; count once at project level** | **120 min / 2 h** | — | **No individual attribution** |
| **Project total including shared task once** | **9 tasks** | **785 min / 13 h 05 m** | — | — |

The live source estimate for [SIS12-04](https://app.clickup.com/t/z8q7hbw371) is 100 minutes. A task listing in the supplied brief says 90 minutes, but individual allocations sum to 665 minutes only when the verified 100-minute estimate is used (with Ratislav’s pair totaling 190 minutes). Do not infer that the shared presentation consumed 120 minutes for each assignee; actual attribution requires logs.

## Evidence and limitations

The source includes assignment IDs and `users.type=assigned`, estimate values in task metrics, lifecycle dates, task status, and task links. Current task IDs are [SIS12-01](https://app.clickup.com/t/z8q7hbw321), [02](https://app.clickup.com/t/z8q7hbw36q), [03](https://app.clickup.com/t/z8q7hbw36w), [04](https://app.clickup.com/t/z8q7hbw371), [05](https://app.clickup.com/t/z8q7hbw376), [06](https://app.clickup.com/t/z8q7hbw37w), [07](https://app.clickup.com/t/z8q7hbw37x), [08](https://app.clickup.com/t/z8q7hbw37y), [09](https://app.clickup.com/t/z8q7hbw386). Historical PR evidence is linked above. Source retrieval details and boundaries are recorded in [PM_EVIDENCE_INDEX.md](PM_EVIDENCE_INDEX.md); no time-entry API result is used here. Actual dates and effort, task-estimate calibration, member availability, and attributable shared-presentation effort remain unverified.
