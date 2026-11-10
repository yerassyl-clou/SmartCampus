# Updated user stories and product backlog

[SIS1011-09 — Updated User Stories & Product Backlog](https://app.clickup.com/t/z8q7hbuc7v)

The SIS 8–9 [API contract](../API_CONTRACT.md), [test plan](../TEST_PLAN.md) and [sprint review](../SPRINT_REVIEW.md) establish the existing chat, question and retrieval scope. The stories below reconstruct that context from the available project artifacts. The original SIS 6–7 story text was unavailable for comparison. Data and schedules are fictional, and the MVP uses no student profile or live Microsoft Teams data.

## User stories and acceptance criteria

### US-CHAT-01 · Ask a course question

As a student, I want to ask a plain-language course question and see the supporting excerpts so I can check the answer against the materials.

- For a supported deadline or rule question, the chat shows the verified excerpt and source. For unsupported questions it shows the no-evidence fallback. A temporary service failure preserves history and offers a retry.
- Follow-up SC-ISS-003. The built-in deadline starter surfaces an available fictional deadline list or sends the student to the dashboard. Keep the unsupported-question fallback. Verify EXP-CHAT-01 and BL-CHAT-01/04/05.

### US-RET-01 · Retrieve evidence for the intended course

As a student, I want evidence scoped to the course I ask about so I can rely on course-specific deadlines and rules.

- For an explicitly named course, answer only with matching course evidence or return a safe fallback or clarification when the course cannot be resolved.
- “When is the Human-Computer Interaction Assignment 2 due?” must never use Database Systems source IDs 1 or -1. A corresponding Database Systems query must still retrieve its matching evidence, and explicit course filters still apply.
- Verify IMP-RET-01 and BL-RET-01/02/04/05. Related issue SC-ISS-002.

### US-DASH-01 · See deadlines in time to act

As a student, I want to distinguish upcoming deadlines from past deadlines so I can decide what to work on next.

- Compare calendar days in Asia/Almaty. A deadline due today stays upcoming. Past deadlines are clearly labeled or separated while remaining reachable.
- For the fictional seed on 10 November 2026, 6 and 9 November are past and the four later records are upcoming. Keep earliest-first ordering within a group, source attribution, mobile layout, refresh and safe recovery.
- Verify IMP-DASH-01 and BL-DASH-01/04/05. Related issue SC-ISS-001.

### US-FB-01 · AI Answer Feedback & Issue Reporting

As a student, I want to rate SmartCampus AI answers and report incorrect or outdated information, so that I can help improve the reliability of academic assistance.

- Per assistant answer, support Helpful and Not helpful, a negative-feedback category selection and an optional plain-text comment up to 500 characters.
- Confirm successful submission only after the API saves the record. Show recoverable errors, prevent duplicate records, and persist the feedback in SQLite through restart and reseed.
- Preserve the existing chat and dashboard, store no student identity or transcript, and verify the keyboard-accessible mobile flow.
- Trace to CR-001 and NFT-01 through NFT-10.

## Prioritized product backlog

Estimates are task-directory planning targets for related work. The issue follow-up estimate is an unvalidated planning assumption. Board state reflects the last successful ClickUp snapshot on 10 November 2026. Existing task cards provide the board mapping, and prior SIS items remain historical.

| ID | Story / priority | Owner and ClickUp card | Value and acceptance | Planning estimate | Delivery state |
| --- | --- | --- | --- | --- | --- |
| PB-101 | US-DASH-01 / Must Have | [Danaya, SIS1011-06](https://app.clickup.com/t/z8q7hbuc7r) | Trustworthy dashboard dates. SC-ISS-001, IMP-DASH-01 | 105 min | Board last seen To Do. QA [SIS1011-08](https://app.clickup.com/t/z8q7hbuc7u) pending. |
| PB-102 | US-RET-01 / Must Have | [Ratislav, SIS1011-07](https://app.clickup.com/t/z8q7hbuc7t) | Prevent unrelated course evidence. SC-ISS-002, IMP-RET-01 | 105 min | Board last seen To Do. Independent QA pending. |
| PB-103 | US-FB-01 / Must Have for SIS 10–11 | [Gleb, storage](https://app.clickup.com/t/z8q7hbuc8b), [Ratislav, API](https://app.clickup.com/t/z8q7hbuc8d), [Danaya, UI](https://app.clickup.com/t/z8q7hbuc8e), [Yerassyl, QA](https://app.clickup.com/t/z8q7hbuc8g) | Collect reliability signals. CR-001, NFT-01–10 | 145/130/145/105 min respectively | [CR-001-A approved for academic implementation](https://github.com/yerassyl-clou/SmartCampus/pull/8). Acceptance pending. Board last seen To Do. |
| PB-104 | US-CHAT-01 follow-up / Should Have | [Yerassyl, SIS1011-09 triage](https://app.clickup.com/t/z8q7hbuc7v) | Improve first-use success. SC-ISS-003, EXP-CHAT-01 | 30 min rough estimate | Deferred from the two selected improvements. No fix task assigned. |
| PB-105 | US-DASH-01 optional course filter / Could Have | [Yerassyl, SIS1011-09 triage](https://app.clickup.com/t/z8q7hbuc7v) | Reduce scanning when more fictional courses exist. If scheduled, selected course shows only its rows, clear restores all rows. | Unestimated | Deferred. No implementation task assigned. |

## Traceability

- [Baseline case matrix](https://github.com/yerassyl-clou/SmartCampus/pull/6) and [issue log with repro evidence](https://github.com/yerassyl-clou/SmartCampus/pull/7).
- [ClickUp SmartCampus task board](https://app.clickup.com/1100310000007240/v/l/li/1100310000045293) and [SIS1011-11 impact and backlog review](https://app.clickup.com/t/z8q7hbuc88). Board synchronization for this update is pending because the ClickUp MCP daily limit was reached.
