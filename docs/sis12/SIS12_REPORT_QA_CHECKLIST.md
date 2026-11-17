# SIS12 Report QA Checklist

**Review date:** 17 November 2026  
**Reviewer:** Gleb  
**Scope:** evidence cross-check for the official SIS12 assignment summary in
the task brief. This is not the final report or presentation.

| Rubric area | Required evidence | Result | Missing evidence / responsible owner |
|---|---|---|---|
| Part 1 — resource inventory | [RESOURCE_INVENTORY.md](RESOURCE_INVENTORY.md), [INFRA_RESOURCE_LIMITS.md](INFRA_RESOURCE_LIMITS.md) | PARTIAL | Existing inventory covers four categories; account quotas/costs and some human capacity remain unknown. PM/owners. |
| Part 1 — limits and costs | Infrastructure measurements and official pricing links in [INFRA_RESOURCE_LIMITS.md](INFRA_RESOURCE_LIMITS.md) | PARTIAL | GitHub/ClickUp/Groq account-specific plans, quotas, and charges require authorized owner evidence. Yerassyl/Ratislav. |
| Part 2 — team matrix | Existing board evidence and PM workload matrix referenced by PR #27 | PARTIAL | Human available hours and actual SIS12 time are not measured; PM must confirm current matrix and avoid treating estimates as actuals. Yerassyl. |
| Part 2 — imbalance analysis | [BOARD_BEFORE_AFTER_EVIDENCE.md](BOARD_BEFORE_AFTER_EVIDENCE.md) and PM workload documentation | PARTIAL | Reallocation is documented, but measured productivity/utilization change is unavailable. Yerassyl. |
| Part 3 — planned vs actual human work | Time-tracking protocol and owner logs | BLOCKED | No measured human logs in this workspace; do not use null/zero time fields as zero labor. Yerassyl/PM and all owners. |
| Part 3 — planned vs actual non-human resources | [INFRA_RESOURCE_LIMITS.md](INFRA_RESOURCE_LIMITS.md) and evidence logs | PASS | Three non-human rows have reproducible actual measurements; differences are N/A where no numeric plan exists. |
| Part 3 — financial reconciliation | [FINANCIAL_RESOURCE_REVIEW.md](FINANCIAL_RESOURCE_REVIEW.md) | PARTIAL | Illustrative `$1,177`/`$200` figures are reconciled, but actual account charges are unknown. Yerassyl/Ratislav. |
| Part 4 — implemented resource controls | Existing board evidence plus repository/test evidence | PARTIAL | Board reallocation/time-policy evidence exists; final acceptance of controls and pilot adoption are not verified. Yerassyl. |
| Part 4 — before/after board proof | [BOARD_BEFORE_AFTER_EVIDENCE.md](BOARD_BEFORE_AFTER_EVIDENCE.md) | PARTIAL | Task/comment records exist; genuine visual before/after screenshots were not captured in this review. Danaya/PM. |
| Part 4 — direct board links | Links in [RESOURCE_INVENTORY.md](RESOURCE_INVENTORY.md) and board evidence | PASS | Direct task links and captured comment IDs are present. |
| Contributions table | Final report contribution section | BLOCKED | Combined final report was not available for inspection. Yerassyl/PM. |
| Final 6–10 page PDF | Final PDF file and preview | BLOCKED | No final SIS12 PDF was available in the reviewed workspace; page count/preview not assessed. Yerassyl/PM. |
| 5–7 minute presentation | SIS12-08 presentation artifact and rehearsal evidence | BLOCKED | Presentation task is explicitly deferred and was not edited or verified here. All four/PM. |

## Verified checks

- Repository is public; default branch is `main`.
- GitHub Actions workflow count is 0 as of 17 November 2026.
- Temporary SQLite fixture measured at 36,864 bytes with 3/6/6 rows and no
  foreign-key errors.
- Seed repeated successfully.
- Backend suite: 126 passed in 1.22s wall time.
- Frontend build: passed in 0.59s wall time.

## Required actions before final acceptance

1. PM obtains authorized GitHub/ClickUp billing and quota evidence.
2. Ratislav supplies dated Groq usage/rate-limit/cost evidence or marks it
   unavailable in the final report.
3. Team records actual human hours using the documented protocol.
4. PM recalculates workload/utilization after the latest reassignments.
5. Yerassyl supplies the final 6–10-page PDF, preview, contribution table,
   and presentation evidence.
