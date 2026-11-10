# CR-001 · AI Answer Feedback & Issue Reporting

[SIS1011-10 — Client Change Request & Simulated Approval](https://app.clickup.com/t/z8q7hbuc7w)

| Field | Record |
| --- | --- |
| Request ID | CR-001 |
| Request date | 10 November 2026 |
| Fictional requester | Academic Services team, Example Campus University |
| Change owner | Yerassyl Babayev, SmartCampus PM and QA |
| Decision | Approved for MVP implementation in the coursework simulation. Integrated delivery acceptance is pending. |
| Related work | [US-FB-01 / PB-103 in the updated backlog](https://github.com/yerassyl-clou/SmartCampus/blob/feature/sis1011-09-product-backlog/docs/sis1011/UPDATED_USER_STORIES_AND_BACKLOG.md#prioritized-product-backlog) · [SIS1011-09](https://app.clickup.com/t/z8q7hbuc7v). |

Example Campus University is a fictional coursework stakeholder. The approval below is an academic simulation with no client signature or commercial commitment.

## Business need

Students can check a SmartCampus answer against its source excerpt. The baseline has no per-answer channel for reporting an inaccurate or outdated answer. Add a quick reporting path so the project team can collect reliability signals without storing a student's profile or chat transcript.

### User story

As a student, I want to rate SmartCampus AI answers and report incorrect or outdated information, so that I can help improve the reliability of academic assistance.

## Scope

| Baseline | Requested change |
| --- | --- |
| Chat shows source-backed answers or a safe fallback. | Add Helpful and Not helpful to each received assistant answer, including supported fallback display. |
| Students can read source excerpts but cannot submit an issue from the answer. | For Not helpful, offer incorrect information, outdated information, missing information and other, with an optional plain-text comment of up to 500 characters. |
| FastAPI and SQLite serve course data. | Add `POST /api/feedback` and a SQLite record containing the response UUID v4, rating, optional issue category/comment, source IDs and creation timestamp. Preserve the chat response schema and dashboard API. |

The scope excludes student identity, transcript collection, login, administrator dashboards, public feedback listings, live Teams integration, email notifications, automatic model training and production anti-spam. Client-generated UUIDs identify displayed answers for this MVP and cannot establish authenticity or answer ownership.

## Acceptance criteria

1. Rate a received answer Helpful without choosing an issue category. A Not helpful submission offers the four pinned category values, and the comment can be blank. Accept a valid 500-character comment and reject 501 characters.
2. For a valid submission, return HTTP 201 with the saved ID and status. Invalid rating or UUID returns 422. A repeated response UUID returns 409 and leaves one row. An unavailable database returns a safe 503. Align exact validation rules with the [SIS1011-12 API contract task](https://app.clickup.com/t/z8q7hbuc89).
3. Show pending, saved and failure states. Allow safe retry after a transport or recoverable service error. Prevent repeated successful submission from the same displayed answer.
4. Verify the real browser → FastAPI → SQLite path, restart persistence, preservation on repeat seed, 375px mobile keyboard use and existing chat/dashboard regressions. Record actual evidence in [SIS1011-16](https://app.clickup.com/t/z8q7hbuc8g).

## Simulated decision and sign-off conditions

**Academic decision CR-001-A, 10 November 2026.** Record the change as approved for implementation in the fictional Academic Services scenario. Keep the approved scope to answer feedback and issue reporting. Link the decision to PB-103, the UI/API/storage tasks and NFT-01–10. This coursework decision is separate from the user's review of the PR.

Before merge and delivery acceptance, reconcile scope, time, cost, workload and regression impacts with [SIS1011-11](https://app.clickup.com/t/z8q7hbuc88) and its planned `CHANGE_IMPACT_ANALYSIS.md`. Require the agreed interface, successful critical QA and explicit merge authorization. Commercial figures and actual client authorization are outside this CR.

[Feedback MVP contract in the playbook](https://app.clickup.com/1100310000007240/v/dc/z8q7hb2y28-698/z8q7hb2y28-98) · [Storage](https://app.clickup.com/t/z8q7hbuc8b) · [API](https://app.clickup.com/t/z8q7hbuc8d) · [UI](https://app.clickup.com/t/z8q7hbuc8e)
