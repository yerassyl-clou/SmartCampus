# Feedback route implementation and actual evidence

[SIS1011-14](https://app.clickup.com/t/z8q7hbuc8d) · [Contract PR #15](https://github.com/yerassyl-clou/SmartCampus/pull/15) · Ratislav · 10 November 2026

Base: main `42dcac91995f5cd930af907716962d6e0f99154c`. Adds `backend/app/feedback_schemas.py`, `routes/feedback.py`, router registration in `main.py`, and `backend/tests/test_feedback.py`. No changes to Gleb's DB/seed/schema files or Danaya's frontend files. ChatResponse remains exactly answer/sources/grounded.

## Scope and integration gate

The route is implemented against the proposed `app.feedback_store.save_feedback` interface in PR #15. **That production helper/table/migration is absent from current main and remote branches as inspected during this task.** Gleb owns SIS1011-13. The route lazily loads his helper so the application, chat and deadlines remain usable; valid feedback returns controlled **503 until that helper is integrated**. This is an explicit integration dependency, not a claim that production persistence is complete. Gleb was notified through ClickUp; module/function names and error mapping must be reconciled before merge. Do not accept this PR as an integrated feature until SIS1011-13/15/16 and the academic CR-001 approval are reviewed.

Tests use an explicitly test-only helper backed by **real temporary SQLite**, injected through FastAPI's dependency override. Inserts are parameterized, committed and reopened with separate connections. This proves the route→helper boundary and HTTP outcomes, not Gleb's production migration, retention logic or browser integration. Production DDL is deliberately not duplicated in app code.

## Actual checks

Command from repository root: `python -m pytest backend/tests -q` using the environment installed from `backend/requirements.txt`. **113 passed**, one Starlette TestClient deprecation warning, exit 0. This includes the original 77 chat/deadline/data/provider tests plus 36 feedback cases. [Sanitized log](feedback-route-tests.log). Python 3.13, FastAPI 0.162.2, Pydantic 2.14.3, OpenAI SDK 2.54.0, pytest 9.2.0, httpx 0.28.1. No external LLM call.

| Scenario | Observed result | Evidence |
| --- | --- | --- |
| Helpful + signed sources | 201 id=1/status=saved; committed row contains [1,-1], nullable comment/category | `test_helpful_commits_and_reopens` |
| Each negative category | All four accepted with 201; text trimmed and control characters removed | `test_negative_categories_and_comment` |
| Comment boundaries | null, whitespace, 500 chars and literal markup accepted as plain text; 501/non-string rejected | `test_optional_plain_text_comment`, invalid parameter cases |
| Invalid data | Invalid/non-v4 UUID, ratings/categories, missing negative category, invalid signed ID types/range/zero, extra fields and malformed JSON return 422 with no rows | `test_invalid_never_writes`, `test_malformed_json_never_writes` |
| Duplicate / lost-response retry | Same canonical UUID, including uppercase form, returns 409; original row unchanged | `test_duplicate_canonical_uuid_does_not_overwrite` |
| Simultaneous submissions | Two requests with same UUID: one 201, one 409, exactly one committed row | `test_concurrent_duplicate_submissions` (SQLite harness) |
| Missing helper | Controlled 503; health still 200 | `test_missing_helper_is_safe` |
| Missing/uninitialized/corrupt DB | Controlled 503 feedback_unavailable; no comment/path leaked or missing DB created | `test_database_errors_are_safe` (SQLite harness) |
| Reopen helper/connection | Duplicate still rejected and saved row retained | `test_helpful_commits_and_reopens` (harness, not process restart) |
| Existing API compatibility | All original tests pass; OpenAPI ChatResponse fields unchanged, feedback only exposes POST | `test_no_public_listing_or_chat_schema_change`, full suite |

Exact request/response and persisted row evidence: [feedback-api-responses.json](feedback-api-responses.json). Reproduce with `PYTHONPATH=backend:database:backend/tests python docs/sis1011/evidence/feedback-feature/feedback_probe.py`. Probe uses the same named test-only SQLite harness; fixture setup is explicit. Its base revision plus revision_note identify the applied route patch; final source revision is the PR head.

## Required independent follow-up

Gleb: provide the agreed production helper, unique canonical UUID storage, safe exception translation, additive migration and repeat-seed retention. Yerassyl: verify actual helper integration, real process restart, migration/re-seeding, locked-DB handling and browser→API→SQLite on the final combined revision. Danaya: retain signed source IDs, stable per-answer UUID and retry semantics from PR #15. NFT-07 production retention, NFT-08 browser integration and NFT-10 mobile/accessibility are **not claimed tested here**. There is no production public feedback listing or proof that a client UUID belongs to a real answer. Request/comment bodies are never logged by the route; clients should avoid logging 422 details which can echo input.
