# CR-001 Change Impact Analysis

**Status** · CR-001-A approved the scope for the coursework implementation on 10 November 2026. The approval represents a simulated client decision.

## Decision context

The [change request](CHANGE_REQUEST_DOCUMENT.md) and backlog item PB-103 define the approved scope. The feature adds anonymous, source-aware chat feedback and preserves the existing SQLite course, deadline and chat interfaces. The academic approval covers implementation. The [final acceptance report](FINAL_ACCEPTANCE_REPORT.md) records the subsequent technical verification.

## Before and after

| Dimension | Current baseline | CR-001 change |
|---|---|---|
| Product scope | Fictional course data, deadlines, grounded chat, and frontend display. | Add optional feedback capture tied to a response UUID; store rating, optional issue/comment, signed source IDs, and UTC timestamp only. |
| UI | Chat and source cards display answers and sources. | Add a feedback control and validation states; no identity or transcript collection. |
| API | `POST /api/chat` and `GET /api/deadlines`; `ChatResponse` remains unchanged. | Add `POST /api/feedback` as a separate contract; return safe validation/conflict/storage errors. |
| Database | `courses`, `deadlines`, `documents`. | Add additive `feedback` table with unique `response_id`; seed resets only fictional course tables and preserves feedback. |
| Exclusions | No Microsoft Teams, student accounts, personal schedules, or production integrations. | Same exclusions; no analytics profile, transcript, identity, or provider prompt is stored. |

## Time and workload assumptions

Illustrative estimate: **40 person-hours over five working days**. This is a
planning assumption, not an invoice.

| Role | Hours | Assumed rate | Subtotal |
|---|---:|---:|---:|
| Gleb — database/helper/migration | 10 | $30/hour | $300 |
| Ratislav — API contract/chat integration | 8 | $35/hour | $280 |
| Danaya — feedback UI and source-card wiring | 8 | $30/hour | $240 |
| Yerassyl — QA, integration, and acceptance evidence | 10 | $25/hour | $250 |
| **Implementation subtotal** | **36** |  | **$1,070** |
| **Contingency allowance (10% of subtotal)** | **4** |  | **$107** |
| **Total planning effort/cost basis** | **40** |  | **$1,177** |

The fixed-price documents use a separate **$1,177 illustrative fixed price**,
which is the rounded planning basis above. Rates are assumptions for academic
estimation only.

## Cost distinction

- One-off CR-001 implementation price: **$1,177 fixed, illustrative**.
- Optional historical forecast: **$200 per department per month** for
  subscription/hosting/support, excluded from the fixed implementation price.
- The earlier **$800 start-up model** is retained only as historical
  background; it is not a verified client quote and is not used in the new
  calculation.
- Actual provider/API usage, hosting, and support charges are not included in
  the one-off price.

## Existing functionality, risks, and mitigations

| Risk | Effect | Mitigation |
|---|---|---|
| Duplicate retries | Same response could be recorded twice. | Unique `response_id`, explicit conflict response, and an isolated duplicate test. |
| Comment data | Free text could contain personal data or control characters. | Route validation: plain text, length limit, normalization, and no identity/transcript fields. |
| Migration against an existing DB | A schema change could remove course data. | Additive `CREATE TABLE IF NOT EXISTS`; seed deletes only fixture tables and has a preservation test. |
| UI drops source IDs | Feedback could not accurately reference evidence. | Preserve signed IDs, including negative deadline IDs, from chat response to feedback payload. |
| Provider dependency | Feedback must not make chat less available. | Keep feedback persistence separate from LLM calls and return safe storage errors. |

## Dependencies and acceptance

Dependencies are the pinned feedback contract, the existing chat response
shape, the SQLite helper, frontend source-card mapping, and QA's isolated
database/browser tests. Acceptance requires persistence after restart and
repeat seed, no identity/transcript data, duplicate protection, and passing
API/UI checks.

The [versioned backlog](UPDATED_USER_STORIES_AND_BACKLOG.md) links PB-103 to the
[simulated implementation approval](CHANGE_REQUEST_DOCUMENT.md). The ClickUp
acceptance review and board closure remain pending. See the
[acceptance handoff](CLICKUP_ACCEPTANCE_HANDOFF.md).
