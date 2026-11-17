# SIS 12 Time-Tracking Protocol

**Owner:** Yerassyl Babayev (project manager)  
**Proposed observation window:** 17–24 November 2026, seven calendar days, half-open interval `[2026-11-17 00:00, 2026-11-24 00:00)` Asia/Almaty. This is a hypothetical control window, not committed remaining work; all SIS12 tasks remain due 17 November 2026 and no deadline extension is implied.  
**Next review checkpoint:** 24 November 2026, 18:00 Asia/Almaty (planned control point; not a calendar booking or meeting already held).  
**Control publication evidence:** [SIS12-09 ClickUp task](https://app.clickup.com/t/z8q7hbw386), policy comment `1100310000188264`, dated 17 Nov 2026 11:09:20 Asia/Almaty.

## Purpose and scope

Record actual human effort consistently enough to compare it with task estimates and make capacity decisions. This procedure applies to SIS 12 work. It does not infer effort from task status, due dates, commits, test duration, or AI activity. AI model/runtime duration is excluded from human minutes; human time spent prompting, reviewing, editing, and validating is included when the person actually performs that work.

## Required task setup

Before starting work, the owner records one planned estimate in minutes and the estimate date. The estimate is the planned human effort for the defined task scope, not elapsed calendar time. If scope changes materially, preserve the original estimate and add a dated revised estimate with a short reason; do not overwrite history. Current SIS 12 task estimates are already present on the board, but estimate authorship/confirmation should be checked by each task owner.

At work start, create a ClickUp time entry if available to the owner. Otherwise add a dated start comment and use the manual log below. Start a new segment after a substantial interruption or when switching tasks. A break is not work time: end/pause the segment before the break and start a new segment after it. Do not reconstruct missing entries as measured time after the fact; a retrospective estimate must be labeled `estimated` with its basis.

At task completion or at the end of each work session, record the segment end, duration in human minutes, evidence/artifact, and status. Use measured time only when captured contemporaneously by a timer or reliable time entry. If duration is reconstructed, label it `estimated` and state the method. Round consistently to the nearest five minutes. Never enter AI execution time as human work.

### Manual segment log template

Copy one row per work segment. Keep the log in the task description/comment or the project’s approved local work log.

| Date (Asia/Almaty) | Task ID | Owner | Estimate (min) | Segment start | Break/pause start–end | Segment end | Human minutes | Basis (`measured` / `estimated`) | Work/evidence link | Note |
|---|---|---|---:|---|---|---|---:|---|---|---|
| YYYY-MM-DD | SIS12-XX | Name | 0 | HH:MM | HH:MM–HH:MM or none | HH:MM | 0 | measured / estimated | PR, doc, test evidence | brief scope/result |

**Start comment template:** `START — YYYY-MM-DD HH:MM Asia/Almaty; SIS12-XX; planned estimate: N human minutes; starting scope: …; timer/log: ClickUp or manual.`

**End comment template:** `END — YYYY-MM-DD HH:MM Asia/Almaty; SIS12-XX; human actual: N minutes (measured|estimated; basis: …); breaks excluded: …; evidence: …; remaining/changed scope: ….`

For an estimated segment, replace the basis with a concise method such as `estimated from contemporaneous session notes; 2 × 25-minute work blocks, breaks excluded`. Evidence can be a document, PR, test result, or review artifact; it corroborates deliverables, not time by itself.

## PM variance and capacity checkpoint

At the checkpoint, the PM exports or reads available time entries and logs once, then records the review date and data cutoff. For every task with a comparable estimate and actual human effort:

- `variance_minutes = actual human minutes − planned estimate minutes`;
- `variance_percent = variance_minutes / planned estimate minutes × 100` when estimate is positive;
- label the actual basis (`measured` or `estimated`) and keep these categories separate in summaries;
- record exceptions: no start/end record, estimate missing, scope changed, or owner unavailable.

Compare planned versus actual only for the same task scope and coverage. Report numerator and denominator explicitly, for example `measured-log adoption = tasks with at least one measured human segment / eligible tasks whose work began during the pilot`. Also report completion coverage (`tasks with an end record / eligible tasks completed by cutoff`) separately. Tasks not started are not missing-log failures. If the denominator is zero, report `N/A — no eligible tasks`, not 0%. Do not mix estimated actuals into a measured-actual variance average; show estimated cases separately.

For a person and period, calculate logged human effort as the sum of their non-overlapping segments, excluding breaks. Compare it with confirmed available hours for the same period only:

`utilization = logged human hours / confirmed available human hours × 100%`.

If availability is not confirmed, state the denominator as an assumption and label the utilization indicative. Capacity remaining is `available hours − planned assigned hours`; negative values signal planned overload. A task estimate is not actual effort and must not be substituted in the utilization numerator.

## Thresholds and response

Use these consistent indicators for indicative or confirmed utilization: **overloaded** above 100%; **underused** below 70%; **balanced** from 70% through 100%. These labels describe the chosen denominator and period, not individual performance. For task variance, flag for PM review at an absolute variance of at least 30 minutes or 20%, whichever threshold is reached first, and for any missing record on completed work. A flag triggers a scope/dependency/capacity discussion and an action owner; it is not an automatic estimate change or performance judgment.

## Baseline, implementation, and adoption status

The exact current bulk snapshot has `time_spent=null` for all 20 historical SIS 10–11 tasks. An earlier task-detail read, reflected in the published SIS12-09 policy comment, reported `time_spent=0` for 20/20. These are distinct representations of missing/zero-valued accessible fields, not verified zero human effort. A separate time-entry API read was denied, so other logs may exist. A dated policy comment was published on SIS12-09 on 17 November. All nine SIS 12 tasks have planned estimates, and current task assignments were updated; this shows setup, not adoption. **Pilot actual-log adoption is unknown until eligible work and logs are reviewed.** No retroactive time entries are created by this protocol.

## First review schedule and owners

The first checkpoint is planned for **17 November 2026, 23:00 Asia/Almaty** to inspect same-day activity and exceptions; it is not a completed review or an external calendar booking. The seven-day pilot review is planned for **24 November 2026, 18:00 Asia/Almaty**. The PM owns extracting task estimates, calculating coverage and variances, documenting exceptions, and assigning follow-up. Each task owner owns truthful start/end records and evidence. Pilot success targets are: all nine SIS12 tasks retain an estimate before their work starts (setup currently observed as 9/9; estimate-owner confirmation remains pending); at least 90% start-record coverage among eligible tasks whose work begins; 100% end-record coverage among eligible tasks completed by the cutoff; availability confirmed by all four owners (4/4); and the PM records the variance/exception review by 24 November 18:00. Numerators and denominators for adoption, end coverage, and capacity confirmations are unknown until observed at review. The dates are planned control points only; no meeting or calendar event was created. No deadline extension is implied: SIS12 task due dates remain 17 November 2026.
