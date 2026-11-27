# FINAL-02 design handoffs

Contract version **2.0.0-review.2** · Danaya Aliyeva · review corrections verified 2026-11-28T00:00:49.049+05:00. Exact design tree `d1e57518a40e84ac75b583d45bc64c64c78cf217`. Review branch `codex/final-02-workspace-design`. The [review notice](https://app.clickup.com/t/z8q7hby8dg) records the exact PR and head. Read the [task packet](../tasks/FINAL-02.md) and [evidence manifest](../evidence/FINAL-02/captures.json) for validation and mode limits.

| Handoff ID | From → to | State | Original deadline, Asia/Almaty | Artifact and next action | Prerequisite, limitation and recovery |
| --- | --- | --- | --- | --- | --- |
| H-FINAL-02-06 | D → D / FINAL-06 | ready for review | 2026-11-25 15:00 | Verify [UX handoff](../design/UX_HANDOFF.md), [tokens](../design/tokens-v2.json) and [assets](../design/ASSETS.md) against the accepted head. Map shell routes and locale/theme preferences from verified files. | Native gate requires Yerassyl's acceptance. Until then use this packet as preliminary reference. |
| H-FINAL-02-10 | D → D / FINAL-10 | preliminary | 2026-11-25 13:30 ready / 15:00 accepted | Review course, document, TUS and deadline variants in the route grid. | Wait for shell acceptance and reconcile final API fixtures. Use synthetic previews for design review. |
| H-FINAL-02-12 | D → D / FINAL-12 | preliminary | 2026-11-25 13:30 ready / 15:00 accepted | Review thread states, original-language citation drawer and aggregate analytics. | Verify protected data access, final message payload and metrics snapshots before implementing. |
| H-FINAL-02-16 | D → D / FINAL-16 | preliminary | 2026-11-25 13:30 ready / 15:00 accepted | Verify [glossary](../design/LOCALE_GLOSSARY.md), demo language, width and mode cues. | Qualified language review and pilot evidence require independent work and approval. |
| H-FINAL-02-21 | D → Y / FINAL-21 | preliminary | 2026-11-25 13:30 ready / 15:00 accepted | Verify evidence and approve slide 5/11 images independently. | Captures are local prototype evidence. Reuse in defense only with that classification. |
| H-FINAL-02-API | D → R / FINAL-04 and downstream API owners | preliminary | Review checkpoint | Validate states, exact candidate endpoint names and supported demo mode against the API contract. | R04 owns fixture version and error codes. Retain the preliminary mappings until verified. |

## FINAL-06 preparation at the review gate

- Compare the accepted FINAL-01 mirror with the published V2 route and mode definitions. The FINAL-01 mirror is integrated through PR #50 at main `6a5798d1a398b2512b9809e0e3b96fc14377a0b4`. The ledger approves the execution baseline and records conditional acceptance.
- Read FINAL-04's versioned `contracts/API_V2.md` and `api-v2-fixtures.json` when delivered. The published baseline allows offline fixture-only guest routes. The authored preview supplies a synthetic course, syllabus excerpt, explicitly dated deadline and curated replay for visual verification. Map these to R04's accepted fixtures before using runtime adapters.
- Validate FINAL-05's environment and release disposition with Yerassyl. The FINAL-05 draft permits local synthetic replay and keeps personal processing and OAuth held pending verification. Use the held-auth visual state until the approved configuration is available. Personal route guards must wait for server-verified `GET /session` eligibility.
- After the native acceptance gate, implement and test on the separate FINAL-06 branch. Keep provider and release operations under owner control. The prototype controls generate no personal server calls.
