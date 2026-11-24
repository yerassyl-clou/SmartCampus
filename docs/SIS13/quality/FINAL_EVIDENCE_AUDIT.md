# SmartCampus SIS 13 evidence audit

**Integration checkpoint · 24 November 2026 · Asia/Almaty (UTC+05:00)**
**Reviewed main:** `6697f1cd985e002ac5385f7d3788038f36452d07`
**Owner:** Yerassyl Babayev

This checkpoint evaluates 24 requirements in the [rubric matrix](RUBRIC_COMPLIANCE.md). It records evidence available for each requirement, named owners and unresolved work. The [centralized review amendment](../AGENT_PLAYBOOK.md#review-workflow-amendment--24-november-2026) governs integration. The academic submission remains in progress.

| Evidence ID | Observation | Verification and disposition |
| --- | --- | --- |
| EV-04-01 | Assignment, guide and task index | Reviewed the original course handout, six grading weights, integrated documentation and live ClickUp task criteria. The scope is 7–20 November with follow-up on 23–24 November. [ClickUp guide](https://app.clickup.com/1100310000007240/docs/z8q7hb2y28-918/z8q7hb2y28-158) · [Task index](https://app.clickup.com/1100310000007240/docs/z8q7hb2y28-918/z8q7hb2y28-178) |
| EV-04-02 | Register and chronology | Verified 11 ordered events, 10 pinned GitHub file locators, timezone conversions, PR merge times and original ClickUp handoff, delay, reassignment and policy comments. The E-06 closure field matched the register timestamp. [Integrated register](../event-timeline/EVENT_EVIDENCE_REGISTER.md) · [PR #32](https://github.com/yerassyl-clou/SmartCampus/pull/32) |
| EV-04-03 | Visual timeline | All 11 Markdown rows match the integrated register. Python 3.12.1, Pillow 12.2.0 and Arial reproduced the Markdown and 3200 × 1800 PNG byte for byte. PNG decoding and visual QA at 1440 × 810 passed. [Timeline](../event-timeline/EVENT_TIMELINE.md) · [PR #33](https://github.com/yerassyl-clou/SmartCampus/pull/33) |
| EV-04-04 | Insight backlog and action plan | SIS13-10 is To Do and has a UX triage comment. The reviewed remote PRs and branches contained no ranked backlog or 5 Whys handoff. The plan documents proposal metrics but has no approved A-IDs or completed action records. [SIS13-10](https://app.clickup.com/t/z8q7hbx7w5) · [PR #34](https://github.com/yerassyl-clou/SmartCampus/pull/34) |
| EV-04-05 | Ratings and seismograph | The coded CSV has 44 in-range scores and 11 recalculated means in roster order. It is byte-identical to the earlier explicitly AI-simulated fixture. The PR reports a later submitting-user attestation. The task history available to this review contains invitations and a 0/4 checkpoint. Private original receipts, independence and individual coded publication decisions remain unverified. The plot regenerated pixel for pixel at 2160 × 1215. The interpretation has seven sentences and lists the qualifying spreads E-05 (4), E-07 (6), E-08 (5), E-11 (4). Explanations need verified input and supported context. [PR #36](https://github.com/yerassyl-clou/SmartCampus/pull/36) · [PR #37](https://github.com/yerassyl-clou/SmartCampus/pull/37) |
| EV-04-06 | UX candidate | On head `a42d335`, Vite build, 72 Playwright tests and 127 pytest tests passed. A replay using the local React/FastAPI app, the fictional SQLite seed and both viewports reproduced 0/2 failed after journeys. Documented baseline is 2/2. Verified all eight before/after PNGs decode with the indexed dimensions. The candidate still needs the approved E/I/A chain. [Implementation PR #38](https://github.com/yerassyl-clou/SmartCampus/pull/38) · [Captures PR #39](https://github.com/yerassyl-clou/SmartCampus/pull/39) |
| EV-04-07 | Submission and contributions | The PDF draft is 10 A4 pages with extractable English text and a Task Board link. The PPTX draft has 10 slides, 10 notes and an 8-minute plan naming all four speakers. The drafts use the 7–20 November window and the tested UX candidate’s 2/2 to 0/2 result. Confirm contributions, collect a timed rehearsal and replace evidence placeholders before release. [PR #40](https://github.com/yerassyl-clou/SmartCampus/pull/40) · [PR #41](https://github.com/yerassyl-clou/SmartCampus/pull/41) |
| EV-04-08 | CI and access | GitHub returned zero configured Actions workflows and zero runs, check runs and commit statuses across the audited heads #32–41. The project manager's authenticated ClickUp reads succeeded. Instructor access still requires verification. [Task Board](https://app.clickup.com/1100310000007240/v/l/z8q7hb2y28-378) · [SIS13-15](https://app.clickup.com/t/z8q7hbx7w9) |

## Prioritized release handoff

| Severity | Owner | Status | Corrective action |
| --- | --- | --- | --- |
| Critical | Danaya Aliyeva | Blocked on provenance | Verify four private, independent original vectors and each publication decision. Reconcile the chart and spread explanations with those accepted inputs. |
| Critical | Gleb Yurtayev, supported by Ratislav Ovchinnikov | Ranked backlog missing | Publish at least five sourced insights with E-IDs, prioritized impacts and documented 5 Whys. Mark uncertain causes explicitly. |
| Critical | Yerassyl Babayev | Action plan blocked | Use the accepted backlog to assign three dated actions with stable A-IDs, evidenced baselines, numeric targets and reproducible methods. Record two approved delivery candidates. |
| Critical | Danaya Aliyeva, Gleb Yurtayev, Ratislav Ovchinnikov | One tested candidate, zero qualifying accepted improvements | Link the deadline shortcut to its approved action. Supply a second distinct change with matched before/after and measured actuals. Count SIS12 overlap only with new results. |
| High | Ratislav Ovchinnikov | CI unconfigured | Verify exact implementation revisions and record Actions or its specific unavailability. |
| High | Yerassyl Babayev, Danaya Aliyeva and all presenters | PDF and deck in draft | Integrate the accepted evidence, confirm four contributions and record a 7–10 minute rehearsal. Verify instructor access and compare both artifacts before submission. |

See [implementation evidence and counting rules](../implementation/IMPROVEMENT_SUMMARY.md). The course score remains unassessed.
