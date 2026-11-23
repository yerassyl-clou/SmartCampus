# SmartCampus improvement action plan

**Status: Draft measurement protocol · 23 November 2026 · Asia/Almaty (UTC+05:00)**

Final selection depends on Gleb Yurtayev’s ranked Insight Backlog and its 5 Whys evidence. This draft records the measurement method and historical inputs. Action approvals, targets and results are pending. [SIS13-03](https://app.clickup.com/t/z8q7hbx7vx) · [SIS13-10](https://app.clickup.com/t/z8q7hbx7w5) · [Frozen event roster v1.0](https://github.com/yerassyl-clou/SmartCampus/blob/d903dfbb3317fff7fdce856b6643fffc33a1071f/docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md)

## Action record

Create one record per approved high-priority insight. Verify that each I-ID appears in the accepted backlog, that its E-IDs resolve to the frozen roster and that the proposed change addresses its evidenced root cause.

| Record field | Required content |
| --- | --- |
| Traceability | A-ID, accepted I-ID, related E-IDs, linked root cause/5 Whys and evidence for the causal relationship. |
| Scope and impact | Specific change, expected impact, implementation task, and the evidence that would show the change landed. |
| Responsibility | One named team member, an exact deadline in Asia/Almaty and a reviewer. |
| Baseline | Value, unit, window, capture timestamp, source locator, denominator and sample definition where applicable. |
| Target | Numeric value using the same unit and denominator. Note the reason the threshold is realistic. |
| Measurement | Repeatable procedure, source data, baseline and after revisions, collection owner and verification evidence ID. |
| Result and disposition | Measured actual, or partial value and observation checkpoint, or not yet measured. Record implementation and result status separately. |

Select at least three approved actions. Identify two that can be delivered independently, plus a fallback if appropriate. Coordinate scope with [Danaya’s UX implementation](https://app.clickup.com/t/z8q7hbx7w1), [Gleb’s process implementation](https://app.clickup.com/t/z8q7hbx7w4) and [Ratislav’s technical implementation](https://app.clickup.com/t/z8q7hbx7w8). Use [SIS13-09 process metrics](https://app.clickup.com/t/z8q7hbx7w2) and [SIS13-13 technical metrics](https://app.clickup.com/t/z8q7hbx7w7) when the corresponding metric is selected.

## Historical measurement anchors

| E-ID | Recorded measure and scope | How to reuse the evidence | Source |
| --- | --- | --- | --- |
| E-08 | 0/20 completed SIS 10–11 tasks with positive tracked time, sampled on 17 November. | Process context for tracking coverage. If selected, take a new pre-change snapshot of the exact SIS13 task cohort and define whether dated manual records count. Missing records do not establish actual effort. | [Policy publication](https://app.clickup.com/t/z8q7hbw386#comment-1100310000188264) |
| E-09 | Zero GitHub Actions workflows at the 17 November infrastructure sample. The SIS13 main baseline also has zero tracked workflow files. | If selected, capture workflow configuration and an authenticated PR run at the after SHA. A configured workflow and a successful run are separate measurements. | [Infrastructure audit](https://github.com/yerassyl-clou/SmartCampus/blob/8ad73158a9c6961101ec6469835c5aab17cd8642/docs/sis12/INFRA_RESOURCE_LIMITS.md) |
| E-11 | 126 → 127 backend tests passed in the 17 November Python 3.13 comparison, including one new rejection test. | Existing SIS12 guardrail. Probe any proposed new improvement on a pinned baseline with the same scenario before and after. Test totals alone cannot measure provider-call or cost savings. | [Provider test guard evidence](https://github.com/yerassyl-clou/SmartCampus/blob/6645b5ef95e2cb4d00aa4bb6756705ac84475654/docs/sis12/PROVIDER_TEST_OPTIMIZATION.md) |

## Candidate measurement for the deadline shortcut

SIS13-07 reproduced SC-ISS-003 on 23 November against app SHA `6645b5ef95e2cb4d00aa4bb6756705ac84475654`. Both runs reached the fallback while the fictional dashboard exposed six deadlines. SIS13-08 supplies the original before captures. This is a same-day candidate baseline and has no approved I-ID or A-ID yet. The proposed change is a direct link from the welcome suggestion to the existing Course deadlines panel. [Replay and result](https://github.com/yerassyl-clou/SmartCampus/blob/e53a2bef690f3a5dc577435e901f7c42211c3a3d/docs/SIS13/evidence/ux/UX_IMPLEMENTATION.md) · [Capture protocol and originals](https://github.com/yerassyl-clou/SmartCampus/blob/42b93507a09ab39bf146ef628411308ef5ec94b2/docs/SIS13/presentation/UX_ASSET_INDEX.md)

| Measure | Observed baseline | Proposed success threshold | Measured after |
| --- | --- | --- | --- |
| Failed deadline-discovery journeys divided by two valid keyboard attempts | 2/2 (100%). Desktop 1440 × 1000 and mobile 375 × 812 each recorded HTTP 200, `grounded=false`, zero sources and six available deadline records. | 0/2 (0%) if this scope and outcome are approved. Each attempt must surface available deadlines or reach the populated deadlines view as specified by the approved solution. | Not yet measured. |

- Use one fresh Chromium session per viewport with the same fixture, fixed browser clock, provider-free configuration and deadline-discovery intent. Record both commit SHAs and replay commands. Match the keyboard entry point and user intent when the solution changes the interaction.
- Run SIS13-07’s `check-deadline-shortcut.mjs` in welcome mode at the approved after SHA. Require keyboard activation, focus on the deadline panel, all six fixture records and no chat POST during navigation. The sidebar reference passed both baseline layouts. The welcome-mode check failed both baseline layouts as expected. The sidebar result demonstrates feasibility. The welcome-mode result on the implementation SHA supplies the after measure. [Recorded acceptance checks](https://github.com/yerassyl-clou/SmartCampus/blob/e53a2bef690f3a5dc577435e901f7c42211c3a3d/docs/SIS13/evidence/ux/UX_IMPLEMENTATION.md#23-november-continuation-proposed-acceptance-check)
- Record success or failure for each run and retain the observation that supports it. Confirm visible focus and the absence of horizontal overflow as separate checks. If the fixture, local service or setup is invalid, log the invalid run and fix the setup before replacing it. A valid product failure stays in the denominator.
- Publish the two original after captures with their scenario outcomes and calculate the percentage from the observed numerator and denominator. The sample measures this specific journey on two layouts. It does not estimate a population-wide success rate.

## Candidate measurement for board handoff quality

The historical records show a delay in writing acceptance updates (E-05), documented final closure (E-06), a two-task reassignment (E-07) and a gap in positive tracked-time entries (E-08). The 0/20 tracked-time figure belongs to the historical SIS 10-11 cohort. The SIS13-09 process audit and selected SIS13-11 change have no source available in the fetched branch and PR inventory. The following measurement can be used if Gleb’s handoff identifies acceptance traceability as the process scope.

- Snapshot the SIS13 tasks already in Review that have GitHub deliverables before the process change. Record each task ID, scope filter and timestamp. Keep the same cohort at the after checkpoint. When the snapshot has no eligible tasks, mark the paired rate unavailable and name the later eligible sample.
- Count tasks with all four items: named reviewer, linked PR or artifact, reviewed revision, and dated review decision. Divide by the number of eligible tasks, and retain the numerator and denominator. A proposed threshold of 100% coverage requires owner agreement. The SIS13 baseline and actual remain unmeasured.
- Use authenticated board records and source links to score each row. Compare the same time-boxed cohort and fields after the change. A short-window result can show traceability coverage. Measuring review turnaround requires a comparable completed cohort and a longer observation window.

## Candidate measurement for PR verification

E-09 records absent shared CI at the SIS12 audit, and current `main` has no tracked workflow files. E-11 documents an already delivered offline pytest guard. The SIS13-13 technical audit and selected SIS13-14 change have no source available in the fetched branch and PR inventory. Use the procedure below if the technical handoff selects PR automation under SIS13-14/15.

- Record the baseline count of tracked workflow definitions on the fixed `main` SHA: zero. Use this as configuration evidence. For execution coverage, use one representative PR head and score the expected backend pytest and frontend build checks individually. Record how many of the two checks executed and their conclusions. Without a recorded run, report zero observed checks and no pass rate.
- A proposed short-window target is 2/2 required checks executed and passed on the representative after head. Pin the input PR and SHA, workflow/run URL, job conclusions, tool versions and fixture. Run the backend guard with deterministic data and provider access disabled. Compare later runs using the same checks and repo-supported runtime.
- If SIS13-14 selects a different product change, measure its own behavioral outcome on matched before and after revisions. Keep CI as regression evidence. Work already reported in SIS12 requires a new result to count toward SIS13.

## Approval and traceability record

| Candidate scope | Historical evidence | Ranked insight | Action | Work owner to confirm | Before → proposed target → actual | Required handoff |
| --- | --- | --- | --- | --- | --- | --- |
| Deadline shortcut | SC-ISS-003 issue record and SIS13-07 replay. E-ID mapping pending. | Pending SIS13-10 | Pending | Danaya Aliyeva | 2/2 failed → 0/2 if approved → unmeasured | SIS13-07 implementation SHA and SIS13-08 paired captures |
| Board handoff quality | E-05 to E-08 | Pending SIS13-10 and process audit | Pending | Gleb Yurtayev | SIS13 baseline pending → 100% fixed-cohort coverage if approved → unmeasured | SIS13-09/11 scope, dated snapshots and SIS13-12 results |
| PR verification | E-09 and E-11 | Pending SIS13-10 and technical audit | Pending | Ratislav Ovchinnikov | Zero tracked workflows → 2/2 checks passing at the after head if approved → unmeasured | SIS13-13/14 scope, SIS13-15 run and SIS13-16 result |

The named work owners follow the task index. Action owners, exact deadlines, final metrics and stable IDs require approval. Candidate measurements do not authorize changes or meet the requirement for two demonstrated improvements.

## Approval and validation

1. Confirm the SIS13-10 reviewer disposition and pin `INSIGHT_BACKLOG.md` and `FIVE_WHYS.md`. Resolve each chosen I-ID and all referenced E-IDs, then confirm at least three high-priority insights and a supported link from cause to action in each record.
2. For each selected implementation, require a named owner, an exact deadline, a pinned pre-change measure and a feasible target. For a board metric capture the cohort and field criteria before the change. For a technical metric record the case, fixture and replay at the before SHA. Obtain the owners' agreement on two independently measurable delivery actions and the evidence they will return.
3. Confirm baseline, target and after value use the same unit and compare like cohorts or scenarios. Recompute any ratios from raw counts. Label the target as planned, the result as actual only after observation and an unfinished observation window as partial with its next checkpoint.
4. Send the approved I-ID, A-ID, owner, deadline, baseline, target and exact verification method to the implementation task. Record the approval and linked implementation tasks before requesting Review on SIS13-03.

## Matched before and after protocol

Capture the baseline before modifying a live board or product behavior. Keep the scenario, inclusion rules, unit, denominator, fixture, tool version and environment fixed. Record the baseline and after SHAs for code, or dated snapshots with the same filters for process evidence. Link before and after captures with task-scoped EV-IDs and keep secrets and private rating material out of the repository.

Compare each proposed action with the [SIS12 allocation and logging evidence](https://github.com/yerassyl-clou/SmartCampus/blob/736e30c020ac38ff3910bebc3fa9cedfd73a4dcc/docs/sis12/BOARD_BEFORE_AFTER_EVIDENCE.md) and the existing offline guard. Count an overlapping change only when the SIS13 implementation produces a new and evidenced result.

Use `partial` for an actual observation from an unfinished window. Give its verified numerator, denominator and end date. If the full measure cannot mature by 24 November, define a short-term indicator such as coverage of required evidence fields in the same pilot cohort, then record a checkpoint for the full result. A proposed target belongs in the action record’s target field.

**Next checkpoint:** review the SIS13-10 handoff when available, with the 23 November 16:00 Almaty upstream deadline as the scheduled checkpoint. Populate the action records only after the ranked insights and relevant evidence are stable.
