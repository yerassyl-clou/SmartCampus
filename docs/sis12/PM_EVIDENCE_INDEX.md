# SIS12 PM Evidence Index

Prepared 17 November 2026 (Asia/Almaty). Scope: [SIS12-02](https://app.clickup.com/t/z8q7hbw36q) and [SIS12-09](https://app.clickup.com/t/z8q7hbw386). This index records the evidence used for the PM deliverables, not completion of the whole SIS12 submission.

## Verified source register

| Source / action | Result | Boundary |
|---|---|---|
| GitHub plugin identity | `yerassyl-clou`, user ID `145484861`, primary connection `link_6ace8aae52a88191bff7ad46b9fe168c` | Verified with `get_user_login` before remote writes. |
| ClickUp plugin identity | `Babayev Yerassyl`, ID `308552668`, primary connection `link_6aea2e59ad0c819191e3ace260fd3560` | Verified with `clickup_get_user`; timezone Asia/Almaty. No alternate account used. |
| GitHub latest-main read | [`3e1807417c497330b24ea6b22c6eec9b3ce16589`](https://github.com/yerassyl-clou/SmartCampus/commit/3e1807417c497330b24ea6b22c6eec9b3ce16589) matched local HEAD before work | PM branch starts from this verified baseline. Existing unrelated working changes were preserved. |
| ClickUp filtered task read | 58 records; `has_more=false`; selected all 20 SIS10–11 and nine SIS12 records | Current assignees, status, closure and due fields; no independent historical assignee activity export. |
| ClickUp bulk `task.get_many` | All 29 requested records found; original estimates obtained from `data.time_mgmt.time_estimate` in milliseconds | The monolith schema nests time fields. Top-level null projections were not interpreted as absent estimates. Assignment uses `users[type=assigned]`, not creator/owner/watchers. |
| Current raw effort field | `data.time_mgmt.time_spent=null` in all 29 records | Earlier brief/policy reported normalized `time_spent=0` in the 20 historical details. Both observations show no positive tracked value in these fields; neither establishes actual human effort or absence of other logs. Prior time-entry API access was denied; it was not retried here. |
| [SIS12-09 policy](https://app.clickup.com/t/z8q7hbw386) | Comment `1100310000188264`, authored by verified primary Yerassyl, dated 17 Nov 2026 11:09:20 Asia/Almaty | Independently read in this session. Publication is implemented; adoption remains unverified. |
| Capacity provenance | Live [SIS12-02](https://app.clickup.com/t/z8q7hbw36q) description explicitly prescribes 8 h/member across 4–17 Nov, based on earlier 4 h/week | Original earlier availability commitment not located. Use as a capacity assumption, never verified hours available. |
| Historical acceptance | [Final acceptance report](https://github.com/yerassyl-clou/SmartCampus/blob/3e1807417c497330b24ea6b22c6eec9b3ce16589/docs/sis1011/FINAL_ACCEPTANCE_REPORT.md), [PR #22](https://github.com/yerassyl-clou/SmartCampus/pull/22), [PR #25](https://github.com/yerassyl-clou/SmartCampus/pull/25) | 126 backend, 70 browser and nine live tests recorded 10 Nov; no new application test run for these documentation changes. |
| Earlier redistribution | [SIS12-06](https://app.clickup.com/t/z8q7hbw37w) comment `1100310000188262`; [SIS12-07](https://app.clickup.com/t/z8q7hbw37x) comment `1100310000188263` | Transition evidence supplied in the brief and independently documented by Danaya in PR #26. Current assignments independently verified here. Those comment endpoints were not reread in this run. |
| Latest SIS12-01 transfer | [SIS12-01](https://app.clickup.com/t/z8q7hbw321): current assignee Danaya, estimate 60 min | Current state verified; prior owner/date supplied in brief. No independent activity-history export available. |

## Danaya review and integration

[PR #26](https://github.com/yerassyl-clou/SmartCampus/pull/26) was reviewed as `yerassyl-clou`: both commits resolve to author `aliyevadanaya`, and only `RESOURCE_INVENTORY.md` and `BOARD_BEFORE_AFTER_EVIDENCE.md` change. The review checked both file patches, task IDs, arithmetic, ownership separation and stated evidence limits. The documents explicitly describe a pre-publication To do snapshot; the PM's newer read shows her two tasks in Review. No Danaya task status or assignment was changed here.

Approval review ID: `5941070057`. PR #26 was merged through the GitHub plugin with expected head `699055579bccea13a5a9957cb479eca1262a39de`, producing [`736e30c020ac38ff3910bebc3fa9cedfd73a4dcc`](https://github.com/yerassyl-clou/SmartCampus/commit/736e30c020ac38ff3910bebc3fa9cedfd73a4dcc). This accepts her scoped documents; it does not prove actual human time, complete teammates' deliverables or close ClickUp tasks.

## PM artifacts and validation boundary

- [Workload matrix](WORKLOAD_MATRIX.md): 20 historical estimates, four named members and a separate current allocation.
- [Resource limits follow-up](RESOURCE_LIMITS_FOLLOWUP.md): planned-versus-actual boundaries, deviations and owner confirmations.
- [Time tracking protocol](TIME_TRACKING_PROTOCOL.md): usable start/finish log and variance procedure.
- [Resource optimization plan](RESOURCE_OPTIMIZATION_PLAN.md): PM controls, evidence, KPIs and dated next review.

Two requested GPT-6 Luna medium subagents drafted the workload and process documents locally. The coordinator independently recalculated source estimates and reviewed the final files. Remote publication and board changes are performed only by the coordinator through verified plugins. No measured human effort is available for this AI-assisted session, so no time entry is created from elapsed agent runtime. The full PDF, presentation, teammates' audits and final submission package are outside this run.


## Dated baseline control review — 17 November 2026

This review was performed during preparation of the PM documents. Original estimates were checked for all 29 selected records. Historical planned totals are 485/410/410/335 minutes (Yerassyl/Danaya/Gleb/Ratislav), 1,640 minutes overall; assumed team capacity is 1,920 minutes, giving 85.4167% planned utilization. Current individually assigned totals are 150/150/190/175 minutes (Yerassyl/Danaya/Ratislav/Gleb), 665 minutes overall; shared effort adds 120 once, giving 785. All nine SIS12 records have a positive estimate (9/9 setup coverage). Historical positive tracked-field coverage is 0/20; measured actual effort and pilot adoption remain unknown, and no actual-minus-planned value can be calculated.

Exceptions: human availability unconfirmed (all four owners to confirm); current actual human effort unmeasured; original capacity commitment and SIS12-01 transfer history unavailable; provider/billing limits await their assigned owners. Initial review did not find a substantiated actual overrun or financial overspend; it cannot rule either out. Next documented checkpoints are 17 Nov at 23:00 and 24 Nov at 18:00 Asia/Almaty, as planned control points rather than meetings already held or calendar events created here.


Validation performed on 17 November: all nine Markdown tables across the five PM files have consistent column counts; all relative document links resolve locally; every one of the 20 historical source task URLs appears in the workload table; independent integer-minute sums match 1,640 historical and 785 current project minutes. Historical lifecycle timestamps were converted to Asia/Almaty and distinguish 9 November creation, 10 November formal start/closure/deadline, and unverified labor dates. All nine current tasks were created and due 17 November. Application tests were not rerun because this change contains only scoped Markdown documents.
