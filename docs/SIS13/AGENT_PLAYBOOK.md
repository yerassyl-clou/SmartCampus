# SIS 13 Agent Playbook

Use the [live ClickUp guide](https://app.clickup.com/1100310000007240/docs/z8q7hb2y28-918/z8q7hb2y28-158) for the shared task index and handoffs.

## Scope and rubric

SmartCampus is the existing fictional-campus application with a React interface, backend APIs, SQLite course data, retrieval-grounded assistant, deadlines and answer feedback. This retrospective uses **7–20 November 2026, inclusive (Asia/Almaty, UTC+05:00)**, a fixed 14-day period supported by SIS 10–11 integration and board closure on 10 November, SIS 12 PRs on 17–18 November and related ClickUp closes on 17–18 November. Keep the **23–24 November improvement cycle** separate. Final submission is due **24 November 2026 at 23:59 Asia/Almaty**. Author all deliverables in English.

| Part | Points | Full-credit evidence | Leads |
|---|---:|---|---|
| 1. Event Timeline | 0.75 | 8–15 real dated events, effects, evidence and a visual | SIS13-01/02 |
| 2. Emotional Seismograph | 0.75 | Four independent ratings, members and mean plotted, shifts and disagreements explained | SIS13-05/06 |
| 3. Insight Backlog | 1.00 | At least 5 linked insights with defensible root causes | SIS13-09/10/13 |
| 4. Improvement Action Plan | 0.75 | At least 3 named, timed actions with numerical baseline and target | SIS13-03 |
| 5. Actual Implementation | 1.25 | At least 2 implemented and measured changes, before/after evidence and updated board or documents | SIS13-07/08/11/12/14/15/16 |
| 6. Presentation and Team Reflection | 0.50 | 8–12 slides over 7–10 minutes, lessons and four presenters who can answer questions | SIS13-18 |
| Total | 5.00 | English 8–12-page PDF plus board link, visual artifacts and contribution table | SIS13-04/17 |

## Team and delivery roles

- Yerassyl Babayev coordinates the evidence register, action plan, release audit and report integration. He gives final integration and presentation approval.
- Danaya Aliyeva leads independent rating collection, UX and presentation coordination.
- Gleb Yurtayev leads board and process analysis, improvements and follow-up measurement.
- Ratislav Ovchinnikov leads technical analysis, implementation, regression and GitHub Actions evidence.
- Each owns four individual tasks. All four contribute to the separate report and defense. The task index records reviewer, effort, dates and dependency links.

## Workflow for each agent

1. Read your task, this guide, related handoffs and the relevant repository docs. Pull the latest `origin/main`, verify the clean baseline in your own checkout or worktree and record the SHA.
2. Move the assigned task to `in progress` and post a short dated plan with baseline, intended branch and expected evidence. Use a task-specific `codex/sis13-XX-topic` branch created from the recorded baseline. Keep commits off `main`.
3. Confirm shared-file ownership before edits. Put independent contributions in scoped files or worktrees and coordinate consolidation with the named owner. Preserve API compatibility, fictional data, source grounding and safe fallback behavior.
4. Produce exact planned artifacts and actual verification. Commit scoped changes, push your branch and open a PR targeting `main`, including documentation-only outputs. Use the ClickUp task link, objective, changes, changed files, exact test commands and results, screenshots/evidence, Actions run/status, remaining issues and risks in the PR.
5. Post the PR, evidence and measured/failure outcomes in the ClickUp completion comment and move the task to `review`. Reviewer verifies sources, correctness, compatibility and artifacts. The authorized integrator merges accepted work and sets `done`. Keep rejected or incomplete work actionable in the task.
6. Starting state is `to do`. Use a task comment for blockers with dependency, owner, evidence, attempted recovery, next checkpoint and work that can continue. Agree a resolution with the reviewer. Retain actual failures and identify partial results. Follow the ClickUp owner and reviewer for work authorization.

The official handout governs grading. This playbook governs shared schemas and coordination. The task governs its exact scope and outputs. Use merged repository content and original GitHub/ClickUp records for project facts, and reconcile contradictions with the coordinator in the affected task. For evidence, timestamp the source and disclose gaps or uncertainty.


See [artifact schemas](ARTIFACT_SCHEMAS.md), [CI instructions](GITHUB_ACTIONS.md) and [historical sources](SOURCE_REGISTER.md).

## Report and defense

- Aim for a 10-page English PDF (8–12 permitted) covering scope/method, visual timeline, emotional chart and interpretation, insight root causes, action plan, at least two actual implementations with before/after, metrics and next sprint, team contributions and references. Include the live Task Board link. Render every page and check legibility, access and clipping.
- Aim for 10 editable slides (8–12 permitted) and 8–9 minutes (7–10 permitted). Follow scope, achievements, timeline, seismograph, root causes, backlog, plan, two improvements with real evidence, and lessons/next action. Use the established SmartCampus visual identity as a reference. Plan four roughly two-minute speaking blocks, notes and defense Q&A. Every member presents and answers questions.
- Contribution table: person, role, actual tasks/outputs, evidence or PR links, reviewer and speaking segment. Confirm each person’s contribution before submission.
- Start both drafts on 22 November. Use provisional sections while source tasks run. Lock verified content after the final evidence audit and late technical handoff. PDF due 24 November 21:00; slides due 22:00 Almaty.

## Final acceptance checklist

- Verify 8–15 sourced events, four actual independently supplied rating vectors and mean, ≥5 linked insights and ≥3 measurable actions.
- Verify two distinct implemented actions with updated project/board or documents and authentic before/after screenshots, new results where SIS 12 overlaps and partial labels where needed.
- Check names, dates, units and references across report, deck, board and source records. Confirm 8–12 report pages, slides and timing, and all four members' actual contributions.
- Record Actions evidence or the specific reason unavailable for every PR. Preserve reviewers’ decisions and verify final audience access.
