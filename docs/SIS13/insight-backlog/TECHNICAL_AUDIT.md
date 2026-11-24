# Technical retrospective, 7–20 November 2026

Audit performed 24 November against main `44e888645245a7ae465de9b63b672a68daa38e43`. The event dates below use Asia/Almaty.

| Evidence | Historical observation | Engineering implication |
| --- | --- | --- |
| EV-13-01 · 10 Nov · [Release acceptance](https://github.com/yerassyl-clou/SmartCampus/blob/47a562a/docs/sis1011/FINAL_ACCEPTANCE_REPORT.md) | Named-course retrieval and deadline filtering had regression cases. The documented release run exercised grounded chat, fallback and feedback persistence, including retry and SQLite restart. | Preserve the course boundary, evidence requirement, and feedback status codes. The recorded totals apply to that fixture and revision. |
| EV-13-02 · 17 Nov · [Resource inventory](https://github.com/yerassyl-clou/SmartCampus/pull/28) | The team measured its local fixture and recorded unknown hosted limits. | Local runtime evidence cannot determine production capacity. |
| EV-13-03 · 18 Nov · [Offline guard](https://github.com/yerassyl-clou/SmartCampus/pull/30) | The default pytest suite guarded external Python socket calls while allowing loopback. | This supports provider-free regression, but execution still depended on someone running pytest. |
| EV-13-04 · 24 Nov follow-up · [A-02](https://github.com/yerassyl-clou/SmartCampus/pull/42) | The pre-change workflow tree was empty. GitHub returned zero check runs on the sampled PR #39 head. | I-02 links E-04, E-09 and E-11 to a measurable delivery gap. Count backend pytest and frontend build separately on one PR to main. Target 2/2 executed and passed. |

## Repeat the comparison

Run `git ls-tree -r 4aeb0a178f992c6585688ed48c8ed59e4d83e6aa -- .github/workflows`. Query the [PR #39 head check runs](https://api.github.com/repos/yerassyl-clou/SmartCampus/commits/668a230d7610c493efa1cf73729ea26b84cae915/check-runs), then inspect both jobs and the event on the [implementation run](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788). The comparison measures trigger coverage on two sampled revisions. It cannot establish a defect escape rate or provider availability.

Handoff for SIS13-10/14: retain I-02 and the approved A-02 metric. Credit the workflow implementation to Yerassyl. Ratislav’s technical work here reconciles the historical record and verifies the published implementation.
