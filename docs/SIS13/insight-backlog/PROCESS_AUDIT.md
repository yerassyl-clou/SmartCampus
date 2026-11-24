# SIS13-09 ClickUp process and workflow audit

**Owner:** Gleb Yurtayev  
**Reviewer:** Yerassyl Babayev  
**Audit cutoff:** 24 November 2026, Asia/Almaty

## Scope and inclusion rule

The sample uses project tasks with a GitHub or ClickUp evidence URL and a recorded before/after date in the frozen SIS13 sources. Historical work in the 7–20 November window is separate from the 23–24 November follow-up. The pilot task SIS13-08 is the single eligible process-pilot cohort item.

## Reproducible metrics

| Metric | Numerator | Denominator | Rule |
|---|---:|---:|---|
| Complete acceptance record | 1 | 1 | A comment contains task, decision, reviewer, revision SHA and deadline. |
| PR trigger coverage | 2 passed jobs | 2 intended jobs | Count only hosted job conclusions on the same pull request head. |
| Checklist-only compliance | Verified in repository | Not measured | Counts checklists/documents, not elapsed work time. |

No elapsed-time or actual-effort result is claimed from board timestamps: 0/20 historical tasks had positive tracked time in the supplied evidence.

## Findings

1. **E-05/E-06:** Connector quota and connector interruption delayed ClickUp closure work, but the final closure was later traceable.
2. **E-07:** 165 planned minutes were reassigned in two tasks. Reassignment is not actual effort.
3. **E-08:** A human time-logging protocol existed, but pilot adoption was not established in the historical sample.
4. **A-03:** The process candidate is revision-pinned acceptance traceability for one live task. Baseline 0/1; target 1/1; actual 1/1 is reported only for the documented, verified after comment.

## Blocker visibility

Blockers become visible when a dated task/comment identifies the missing dependency and owner. The evidence gap is that live ClickUp mutation and comment history cannot be re-run in this repository session; exact board screenshots and authenticated API responses remain external evidence.

## Evidence

- [Frozen event register](../event-timeline/EVENT_EVIDENCE_REGISTER.md)
- [Action plan](../improvement-plan/ACTION_PLAN.md)
- [Improvement summary](../implementation/IMPROVEMENT_SUMMARY.md)
- [Board and contribution evidence](https://github.com/yerassyl-clou/SmartCampus/pull/26)
- [Time-tracking protocol](https://github.com/yerassyl-clou/SmartCampus/pull/27)

## Limitations

This is a source-grounded audit, not an authenticated live-board export. No due/closed timestamps were invented. Board clock, retry window and future follow-up remain `partial` until an authorized reviewer supplies the live record.
