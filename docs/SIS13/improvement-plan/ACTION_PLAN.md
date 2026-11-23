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

## Matched before and after protocol

Capture the baseline before modifying a live board or product behavior. Keep the scenario, inclusion rules, unit, denominator, fixture, tool version and environment fixed. Record the baseline and after SHAs for code, or dated snapshots with the same filters for process evidence. Link before and after captures with task-scoped EV-IDs and keep secrets and private rating material out of the repository.

Compare each proposed action with the [SIS12 allocation and logging evidence](https://github.com/yerassyl-clou/SmartCampus/blob/736e30c020ac38ff3910bebc3fa9cedfd73a4dcc/docs/sis12/BOARD_BEFORE_AFTER_EVIDENCE.md) and the existing offline guard. Count an overlapping change only when the SIS13 implementation produces a new and evidenced result.

Use `partial` for an actual observation from an unfinished window. Give its verified numerator, denominator and end date. If the full measure cannot mature by 24 November, define a short-term indicator such as coverage of required evidence fields in the same pilot cohort, then record a checkpoint for the full result. A proposed target belongs in the action record’s target field.

**Next checkpoint:** review the SIS13-10 handoff when available, with the 23 November 16:00 Almaty upstream deadline as the scheduled checkpoint. Populate the action records only after the ranked insights and relevant evidence are stable.
