# SIS 12 Resource Optimization Plan — PM Controls

**Scope:** PM-owned controls and allocation facts only. This file does not claim implementation or results for work owned by other team members. SIS12-08 is a shared 120-minute project estimate counted once, not once per assignee.

## Current planned allocation

The board contains nine SIS 12 tasks, all with a due date of 17 November 2026. The following estimates are planned human effort, not actual time or committed workload for 17–24 November, nor a measure of remaining effort. The seven-day period is a hypothetical planning scenario only; it does not change or extend any task deadline. Current assignments are based on the verified board snapshot; SIS12-01's current assignee is verified as Danaya, but its reassignment history was not available in this source snapshot.

| Owner | Current individually assigned work | Planned hours | Hypothetical 7-day capacity assumption | Illustrative ratio only |
|---|---|---:|---:|---:|
| Yerassyl | [SIS12-02](https://app.clickup.com/t/z8q7hbw36q) 90 min; [SIS12-09](https://app.clickup.com/t/z8q7hbw386) 60 min | 2.50 | 4.00 h (assumption) | 62.5% |
| Danaya | [SIS12-01](https://app.clickup.com/t/z8q7hbw321) 60 min; [SIS12-06](https://app.clickup.com/t/z8q7hbw37w) 90 min | 2.50 | 4.00 h (assumption) | 62.5% |
| Ratislav | [SIS12-03](https://app.clickup.com/t/z8q7hbw36w) 90 min; [SIS12-04](https://app.clickup.com/t/z8q7hbw371) 100 min | 3.17 | 4.00 h (assumption) | 79.2% |
| Gleb | [SIS12-05](https://app.clickup.com/t/z8q7hbw376) 100 min; [SIS12-07](https://app.clickup.com/t/z8q7hbw37x) 75 min | 2.92 | 4.00 h (assumption) | 72.9% |
| Shared project effort | [SIS12-08](https://app.clickup.com/t/z8q7hbw37y) 120 min; actual contributor attribution requires logs | 2.00 | Not allocated per person | N/A |
| **Total** | Individual tasks 665 min plus shared presentation once (120 min) | **13.08 h** | **16.00 h individual assumed capacity** | **69.3% individual planned load** (shared effort excluded) |

Calculations use minutes divided by 60; display is rounded to two decimals. The individual planned estimates sum to 665 minutes (11.08 h); the 120-minute presentation estimate is counted once at project level, for 785 minutes (13.08 h) total. The 4 hours/person/week denominator (16 hours across four people) is a hypothetical planning scenario derived from an earlier capacity assumption, not verified November availability, remaining time, or a commitment that these tasks will be worked during 17–24 November. Ratios (including 665 ÷ 960 = 69.3%, with shared effort excluded) are illustrative arithmetic only, not utilization or a statement of actual workload. No task deadline is extended. The shared presentation has no owner-level allocation until actual contributors are known.

### Assignment change trail and comparison

Before the SIS12-06 and SIS12-07 transfers, the individual distribution was Yerassyl 375 min, Danaya 0 min, Ratislav 190 min, and Gleb 100 min. After those two transfers it was 210, 90, 190, and 175 minutes respectively. The supplied brief says SIS12-01 was subsequently moved from Yerassyl to Danaya; its current assignee is verified, but the reassignment history is not present in the current source snapshot. The resulting current planned distribution is 150, 150, 190, and 175 minutes (665 minutes total). The brief identifies dated transfer comments `1100310000188262` (SIS12-06) and `1100310000188263` (SIS12-07), and says Danaya's PR 26 contains related evidence; the coordinator reviewed both files in [PR #26](https://github.com/yerassyl-clou/SmartCampus/pull/26), which independently documents those comments; the comment endpoints were not reread in this run. These changes redistribute planned estimates. They do not establish time saved, improved throughput, or a measured outcome.

## Implemented PM controls and resource improvements

| Control | Implemented evidence | Intended resource effect | Measured result |
|---|---|---|---|
| Time observability policy | Dated SIS12-09 comment `1100310000188264`, published 17 Nov 2026 11:09:20 Asia/Almaty; [task](https://app.clickup.com/t/z8q7hbw386) | Capture human effort and variance so future allocation uses evidence | Adoption and time saved unknown; pilot review scheduled 24 Nov 2026 18:00 Asia/Almaty |
| SIS12-06 / SIS12-07 reassignment | Dated ClickUp transfer comments `1100310000188262` and `1100310000188263`; current assignments verified | Move 165 planned minutes from PM to the owners responsible for QA and financial/report cross-review | Actual workload impact unknown until time logs and delivery evidence are reviewed |
| SIS12-01 assignment to Danaya | Current board assignment verified; changed after the earlier transfers | Move 60 planned minutes from PM to the inventory/evidence owner | Actual workload impact unknown; no time saved is claimed |

The exact current bulk snapshot shows `time_spent=null` for all 20 SIS 10–11 tasks; an earlier task-detail read reported `time_spent=0` for 20/20, as stated in the SIS12-09 policy comment. Neither representation proves zero effort; the time-entry API read was denied. The SIS12-09 policy comment describes the control and target behavior; nine task estimates and current ownership show setup, while actual pilot adoption remains unknown. Do not claim a 9/9 logging success rate before observed records exist.

## PM checkpoint and measures

The first same-day exception checkpoint is **planned for 17 November 2026, 23:00 Asia/Almaty** (not yet performed or calendar-booked). The hypothetical seven-day planning window is `[17 Nov 00:00, 24 Nov 00:00)`; it does not alter the 17 November task deadlines and does not imply assigned work or remaining effort in that later interval. The PM review is planned for **24 November 2026, 18:00 Asia/Almaty**, without a calendar event. The PM will use the [Time-Tracking Protocol](TIME_TRACKING_PROTOCOL.md), preserve original estimates, and report:

1. Measured-log adoption: eligible tasks with at least one measured human segment divided by eligible tasks whose work began; show `n/N` and report N/A if N is zero.
2. Completion-record coverage: completed eligible tasks with an end record divided by completed eligible tasks by the cutoff.
3. Comparable planned-versus-actual variance: actual human minutes minus planned minutes only for tasks with same-scope estimate and actual; measured and estimated actuals reported separately.
4. Capacity: sum of person-level logged human hours divided by confirmed available hours for the same period. If availability remains unconfirmed, label any 4 h/week denominator as an assumption, not verified capacity.
5. Exceptions and owners: missing starts/ends, scope changes, estimates without basis, and overloaded/underused indicators with follow-up dates.

Success targets for this pilot control are: **9/9 tasks** have an estimate before work starts (estimate setup observed on the board; owner confirmation pending); **at least 90%** start-record coverage among eligible tasks started; **100%** completion/end-record coverage among eligible tasks completed by cutoff; **4/4** owners confirm their actual availability basis; and the PM publishes the variance/exception review by **24 November 2026, 18:00 Asia/Almaty**. Coverage and capacity-confirmation numerators/denominators are unknown until observed; targets are not reported results.

Classification thresholds: planned or measured utilization above 100% is **overloaded**; below 70% is **underused**; 70–100% is **balanced**. For task variance, flag at 30 minutes or 20% (whichever threshold is reached first), and flag missing records on completed work. These are review triggers, not individual performance ratings.

## Limits and ownership

No actual human-time values are established for SIS12 in the supplied snapshot (`time_spent` is null on the current task records). The 4-hour weekly capacity is historical planning context only and must be confirmed by each owner before it is used as factual availability. Resource/product usage values owned by Ratislav or Gleb, and QA evidence owned by Danaya, are outside this PM section; report them only from their deliverables. No teammate is credited with completing an audit, and no presentation work is claimed as completed.
