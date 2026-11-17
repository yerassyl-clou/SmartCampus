# SIS12 Before/After Board Evidence and QA Review

**Evidence date:** 17 November 2026 (Asia/Almaty); task snapshot and comment captures are the pre-publication baseline  
**Scope:** SIS12-01 and SIS12-06 deliverables, with SIS12-07 and SIS12-09 referenced read-only as evidence of other board changes.  
**Board records:** [SIS12-01](https://app.clickup.com/t/z8q7hbw321), [SIS12-06](https://app.clickup.com/t/z8q7hbw37w), [SIS12-07](https://app.clickup.com/t/z8q7hbw37x), [SIS12-09](https://app.clickup.com/t/z8q7hbw386).

## Reassignment evidence

| Task | Before | Change | After | Source | Proven / planned |
|---|---|---|---|---|---|
| SIS12-06 — QA evidence verification and before-after board proof | Yerassyl; 90 planned minutes | Reassigned to Danaya on 17 Nov 2026 | Danaya; 90 planned minutes | [Task](https://app.clickup.com/t/z8q7hbw37w); ClickUp comment `1100310000188262` (17 Nov 2026, 11:09:16 Asia/Almaty); authenticated ClickUp task and comment reads (17 Nov 2026) | Change, prior owner, estimate and current owner are documented by the comment and authenticated task read. |
| SIS12-07 — Financial and report cross-review (read-only reference) | Yerassyl; 75 planned minutes | Reassigned to Gleb on 17 Nov 2026 | Gleb; 75 planned minutes | [Task](https://app.clickup.com/t/z8q7hbw37x); ClickUp comment `1100310000188263` (17 Nov 2026, 11:09:18 Asia/Almaty); authenticated ClickUp task and comment reads (17 Nov 2026) | Change and current owner are documented; this task is cited only as board evidence and was not edited here. |
| SIS12-01 — Resource inventory and historical evidence register | Reported as Yerassyl; 60 planned minutes | Reassigned to Danaya on 17 Nov 2026 | Danaya; 60 planned minutes | [Task](https://app.clickup.com/t/z8q7hbw321); authenticated ClickUp task read (17 Nov 2026); supplied SIS12 brief | Current owner and 60-minute estimate are verified in the task read. The prior owner and transfer date are stated in the brief only; the captured comment read is empty and no independent activity-history snapshot is available. Lower confidence for the transition details. |

The captured after-state shows SIS12-01 and SIS12-06 assigned to Danaya and SIS12-07 assigned to Gleb. All three were **To do** in the pre-publication snapshot. The SIS12-01 comment capture returned zero comments; the SIS12-06 and SIS12-07 captures contain the dated reassignment comments above. These task links provide view access to the task records; no genuine before/after board screenshots were captured, so none are reproduced here. The status in this snapshot predates the coordinator's planned publication and any subsequent Review updates.

## Allocation counts and effort

Counts below treat the shared SIS12-08 presentation as one project task and count it once under Danaya under the supplied brief’s presentation-lead reporting convention. The live board itself co-assigns 08 to all four members and does not establish a sole lead. The nine-task denominator is SIS12-01 through SIS12-09. Excluding shared SIS12-08, the final distribution covers eight individually owned tasks.

| Board point | Yerassyl | Danaya | Ratislav | Gleb | Denominator / note |
|---|---:|---:|---:|---:|---|
| Before the two earlier reassignments | 5 | 1 | 2 | 1 | 9; shared presentation counted once under Danaya |
| After SIS12-06 → Danaya and SIS12-07 → Gleb | 3 | 2 | 2 | 2 | 9; shared presentation counted once under Danaya |
| After SIS12-01 → Danaya | 2 | 3 | 2 | 2 | 9; shared presentation counted once under Danaya |
| Final individual ownership, excluding shared SIS12-08 | 2 | 2 | 2 | 2 | 8 individually owned tasks |

Counting the shared presentation once under Danaya, the nine-task distribution changed from 5/1/2/1 to 3/2/2/2 and then to 2/3/2/2 for Yerassyl, Danaya, Ratislav, and Gleb. Excluding the shared presentation, final individual ownership is balanced at two tasks per member. The three transfers represent 225 planned minutes: 90 for SIS12-06, 75 for SIS12-07, and 60 for SIS12-01. This moves 225 planned minutes away from Yerassyl, with 150 assigned to Danaya and 75 to Gleb, while total planned project effort remains unchanged. Actual human hours have not been measured in the available SIS12 evidence, so utilization rates, productivity gains, and project-hour savings cannot be claimed. The logging protocol is documented on SIS12-09, but pilot adoption and subsequent variance review remain future checks.

## QA and optimization evidence review

- **SIS12-01:** the assignment is verified in the captured task read; the task was To do and its captured comment list is empty. The [resource inventory](RESOURCE_INVENTORY.md) covers the four required resource classes, source confidence, historical evidence, and owner follow-ups; coordinator validation passed for its table structure, arithmetic, board ownership reconciliation, and referenced repository paths before publication.
- **SIS12-06:** the assignment and dated reassignment comment are verified; the task was To do in the captured snapshot. This evidence file records the board trail; it does not establish task acceptance or a new product test run.
- **Task reallocation optimization:** implemented as board changes on 17 Nov according to the available task snapshot and reassignment comments. The SIS12-01 transition has lower confidence because its earlier owner is not independently visible in the captured ClickUp evidence.
- **Time-logging optimization:** the read-only SIS12-09 comment `1100310000188264` documents publication of a logging protocol on 17 Nov at 11:09:20 Asia/Almaty. Its baseline says historical SIS10–11 task `time_spent=0` values mean missing tracking records, not zero work. Adoption and actual-time completeness for the SIS12 pilot have not yet been verified.
- The checked repository extract contains existing SIS10–11 acceptance and QA artifacts, including the [final acceptance report](https://github.com/yerassyl-clou/SmartCampus/blob/3e1807417c497330b24ea6b22c6eec9b3ce16589/docs/sis1011/FINAL_ACCEPTANCE_REPORT.md) and [runtime evidence](https://github.com/yerassyl-clou/SmartCampus/blob/3e1807417c497330b24ea6b22c6eec9b3ce16589/docs/sis1011/evidence/final-demo/FINAL_E2E_RESULTS.md). The GitHub plugin independently confirmed [PR #22](https://github.com/yerassyl-clou/SmartCampus/pull/22) as merged product integration and [PR #25](https://github.com/yerassyl-clou/SmartCampus/pull/25) as merged historical board-closure documentation. The reported 126 backend, 70 standard-browser, and 9 live tests are historical acceptance evidence from 10 Nov, not tests run for this SIS12 review.
- The official SIS12 rubric and combined SIS12 report draft were not available for direct inspection in this workspace review. The supplied brief identifies the draft's 3/2/2/2 allocation and 91%/88% projections as stale after the SIS12-01 reassignment; the project manager should recalculate and correct those report figures. The full report, official rubric, and live board screenshots remain unverified sources for this review.

## Document QA result

Coordinator checks passed on 17 November: seven Markdown tables have consistent column counts, linked repository files exist in the reviewed main snapshot, all 20 historical task IDs match the closure register, and current nine-task ownership reconciles to eight individual assignments plus one shared task. Planned-hour totals, the 225-minute transfer, the 150/75-minute recipient split, the 32-hour capacity assumption, and the due timestamp were checked separately. This is evidence/document QA; application tests were not rerun and historical results retain their 10 November date. Deliverables are submitted for Review; acceptance and measured human effort remain required before Done.

## Evidence limitations

The evidence is based on authenticated ClickUp task and comment reads on 17 November 2026; those reads show current assignees/statuses and available comments, not a time-stamped historical board image. Direct task links and available comment IDs are supplied for user verification. There is no independent activity-history export for the SIS12-01 reassignment, no captured visual board before-state, and no measured actual human-time data for SIS12 tasks. No claim of completed work, accepted deliverables, or realized workload/productivity improvement follows from the reassignment records alone.
