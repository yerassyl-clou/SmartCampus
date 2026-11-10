# CR-001 — Feedback API and data contract

[SIS1011-12](https://app.clickup.com/t/z8q7hbuc89) · Owner: Ratislav · 10 November 2026

Aligned with page 01 of the shared ClickUp playbook. This document records the implemented interface for SIS1011-13/14/15 and traces to the simulated academic CR-001 approval.

## Existing interfaces and ownership

Inspected main `42dcac91995f5cd930af907716962d6e0f99154c`: `backend/app/main.py`, `schemas.py`, `routes/chat.py`, `db.py`, `database/schema.sql`, `seed.py`, `frontend/src/components/ChatPanel.jsx` and `frontend/src/lib/chat.js`.

POST `/api/chat` continues to return exactly `answer`, `sources`, `grounded`. Feedback adds no server response ID to that API. Positive source IDs are documents; negative IDs are deadline rows. The integrated frontend preserves valid signed `source.id` values separately from display titles and excerpts. It omits absent or invalid IDs.

Ratislav owns feedback request/response models and FastAPI route registration; Gleb owns DDL, migration and persistence helper; Danaya owns UI and fetch helper. Current main has no feedback table/helper/UI. The helper interface below is proposed for parallel development and was posted to Gleb's task; production persistence requires his reviewed implementation.

## Request

`POST /api/feedback`, `Content-Type: application/json`.

| Field | Rules |
| --- | --- |
| `response_id` | Required UUID **version 4** string, generated once with `crypto.randomUUID()` when the assistant answer arrives, including fallback answers. Server canonicalizes to lowercase hyphenated UUID before uniqueness check. Reuse it for every retry of that displayed answer. |
| `rating` | Required exact string `helpful` or `not_helpful`. |
| `issue_type` | Required non-null for `not_helpful`; enum `incorrect_information`, `outdated_information`, `missing_information`, `other`. For `helpful`, omitted/null is normal; a supplied valid category is accepted. |
| `comment` | Optional/null plain-text string, at most **500 Unicode code points before cleanup**. Strip leading/trailing whitespace and remove control/format characters except newline/tab; empty becomes null. Do not interpret HTML, Markdown or scripts. Render as text in any future viewer. No silent truncation. |
| `source_ids` | Optional array, default `[]`; strict nonzero signed 64-bit integers, including negative deadline IDs. Reject strings, booleans, floats and zero. Preserve submitted order and values. IDs are metadata, not proof of existence/ownership; no source FK or existence check (sources may be stale). |

Unknown fields are rejected with 422 to avoid accepting identity/transcript fields. No student identifier, answer text, prompt, credentials or transcript is part of this schema. Clients must not send personal data in comments; free text cannot automatically guarantee absence of personal data.

```json
{
  "response_id": "a2b64e7c-0c29-4d18-8f80-9cd688a9e950",
  "rating": "not_helpful",
  "issue_type": "outdated_information",
  "comment": "Please check the sample deadline.",
  "source_ids": [1, -1]
}
```

Minimal positive request:

```json
{"response_id":"c37ef168-172c-4225-bacf-f66dbe626540","rating":"helpful"}
```

## Responses and retry semantics

| HTTP | JSON / behavior | Client behavior |
| --- | --- | --- |
| 201 | `{"id":1,"status":"saved"}`; integer persistent row ID | Show success, disable both rating actions for this answer. |
| 422 | FastAPI `{"detail":[...]}` validation errors; no insert | Preserve input, show a concise field error; correct then retry same UUID. Do not log entire validation body because it may echo submitted comments. |
| 409 | `{"detail":"Feedback has already been submitted for this response."}`; unique UUID, no second row or overwrite | Treat as already submitted; disable further submission. This also safely resolves a retry after a lost 201 response. |
| 503 | `{"detail":"Feedback storage is temporarily unavailable. Please try again later."}`, `X-SmartCampus-Error: feedback_unavailable` | Preserve input and same UUID, offer explicit retry. Do not create a new UUID to bypass duplication. |

Other network/unreadable-response failures enter an error state with retry using the same UUID. A uniqueness constraint and atomic insert—not a check-then-insert race—enforce at most one row per canonical UUID, regardless of later rating changes. 409 is not an edit endpoint. No public GET/list/update/delete feedback route.

## UI state machine

At assistant answer receipt: create stable `response_id`, copy valid source IDs, state **idle**. Helpful submits immediately. Not helpful enters **editing** with an accessible category selector and optional 500-character comment. Submit requires a category; Enter/button duplicate activation must share a synchronous in-flight guard.

`idle/editing → pending → saved` on 201; `pending → already_submitted` on 409; `pending → error` on network/503/422. Disable controls during pending. On error preserve selection/comment/UUID, allow correction or retry; on success/duplicate show an announced status. Keep feedback state per message, source cards and chat history intact, and labels/error controls usable at 375px. See the [executed acceptance report](NEW_FEATURE_TESTING_REPORT.md) for keyboard, responsive and browser-to-database checks.

## Persistence interface for Gleb

Implemented module: `backend/app/feedback_store.py`:

```python
class DuplicateFeedback(Exception): ...

def save_feedback(*, response_id: str, rating: str,
                  issue_type: str | None, comment: str | None,
                  source_ids: list[int]) -> int: ...
```

Input is already validated/canonicalized plain data. The helper uses `SMARTCAMPUS_DB_PATH` consistently with `app.db`, parameterized atomic insert and a transaction. It serializes source IDs as a JSON array, creates a UTC `created_at` timestamp, commits before returning the row ID, raises `DuplicateFeedback` **only** for duplicate response_id, and translates other database/migration/permission/lock failures into `app.db.DatabaseUnavailable` without raw exception text. Route maps these to 409/503 with the safe messages above.

Table fields: integer primary key `id`, unique/non-null canonical `response_id`, `rating`, nullable `issue_type`/`comment`, JSON text `source_ids`, UTC `created_at`. FastAPI enforces ratings, category and comment length. SQLite enforces the canonical response UUID uniqueness constraint. Additive, idempotent migration must work for fresh and existing seeded DBs. Do not delete feedback in `seed.py` or add foreign keys to course rows that seeding replaces. Do not silently create empty databases on requests. Verify re-seeding/restart retention in Gleb's tests.

If the helper is absent, the route must remain importable and return controlled 503 for valid submissions. The integrated route tests run against the production store and the database created from the shared schema.

## Acceptance scenarios

| ID | Expected check |
| --- | --- |
| NFT-01 | Minimal helpful saves once: 201 and one committed row. |
| NFT-02 | Each negative category accepted; missing/invalid category → 422. |
| NFT-03 | Optional comment normalized/persisted; 500 accepted, 501 rejected, control cleanup verified. |
| NFT-04 | Invalid UUID, non-v4 UUID, rating, types, source IDs and extra fields → 422 without writes. |
| NFT-05 | Duplicate canonical UUID → 409, one row, original payload unchanged; concurrent insert safe. |
| NFT-06 | Missing helper or unavailable/missing/locked/uninitialized DB → controlled 503, no paths/SQL leaked. |
| NFT-07 | Reopen backend/helper and re-seed: row and source IDs persist; existing DB upgrade does not lose course data. |
| NFT-08 | Real browser → FastAPI → production SQLite helper: actual persisted row; no mocked fetch or storage. |
| NFT-09 | Existing chat/deadline schema and tests remain green; no live LLM needed. |
| NFT-10 | 375px keyboard/screen-reader labels, pending guard, saved/error state, lost-response retry using same UUID. |

These are test expectations, not predetermined PASS claims. Actual results belong to the task evidence files and SIS1011-16 report.

## Privacy, compatibility and limits

This unauthenticated educational MVP cannot prove that response_id names a real server answer or belongs to a particular user; anyone can generate a different UUID. Client IDs and uniqueness do not provide authorization or production anti-spam protection. Source IDs do not attest correctness. Do not expose feedback publicly, log request/comment bodies, or claim real Teams/student integration. Feedback does not retrain the model. Retention/access controls beyond local educational use remain future work. The existing Chat and Deadline APIs remain compatible. All business approval remains simulated/documented coursework; no merge before reviewer acceptance.
