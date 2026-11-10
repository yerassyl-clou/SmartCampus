# SmartCampus — Fictional Commercial Offer

**Educational template — fictional provider and fictional university client.
Not a quote, invoice, or executed agreement.**

## 1. Overview

SmartCampus is an AI-assisted course information prototype using fictional
SQLite course materials, deterministic retrieval, grounded chat responses, and
a deadline dashboard. The proposed improvement adds anonymous feedback on
chat responses without storing identity or conversation transcripts.

## 2. In-scope deliverables

1. Additive SQLite feedback schema and migration-safe persistence helper.
2. `POST /api/feedback` contract integration with validation and duplicate
   protection.
3. Frontend feedback controls and source-ID preservation.
4. Automated backend, integration, and browser acceptance checks.
5. English setup, migration, and acceptance documentation.

## 3. Explicit exclusions

- Microsoft Teams or other live university-system integrations.
- Student accounts, identity data, personal schedules, or transcript storage.
- Production hosting procurement and provider/API consumption charges.
- Custom analytics, data warehouse, mobile applications, and multilingual
  content.
- Any real university or student data.

## 4. Illustrative fixed implementation price

The one-off fixed price is based on the CR-001 estimate in
[CHANGE_IMPACT_ANALYSIS.md](CHANGE_IMPACT_ANALYSIS.md):

| Role | Hours | Assumed rate | Subtotal |
|---|---:|---:|---:|
| Database/helper | 10 | $30/hour | $300 |
| API/chat integration | 8 | $35/hour | $280 |
| Frontend | 8 | $30/hour | $240 |
| QA/integration | 10 | $25/hour | $250 |
| Implementation subtotal | 36 |  | $1,070 |
| 10% contingency allowance | 4 |  | $107 |
| **Total one-off fixed price** | **40** |  | **$1,177** |

This price is an academic planning assumption, not a verified market quote.
The historical **$800 start-up model** is background only. The optional
historical **$200/department/month** subscription forecast is separate from
this fixed implementation price and would cover optional hosting, API, and
support arrangements only after separate approval.

## 5. Timeline and milestones

Five working days after written approval and access to the agreed repository:

| Milestone | Target | Deliverable |
|---|---:|---|
| M1 | Day 1 | Contract confirmation, schema/API review, test plan |
| M2 | Day 2 | Persistence helper and additive migration |
| M3 | Day 3 | API/UI integration |
| M4 | Day 4 | Automated and browser acceptance testing |
| M5 | Day 5 | Documentation, review package, and handover |

## 6. Payment and support assumptions

| Installment | Trigger | Amount |
|---|---|---:|
| 40% | Written start approval | $470.80 |
| 40% | M3 implementation review | $470.80 |
| 20% | M5 acceptance package | $235.40 |
| **Total** |  | **$1,177.00** |

The illustrative warranty period is 14 calendar days after acceptance for
defects in the stated scope. It excludes new features, provider outages,
client-environment changes, and excluded integrations. Optional ongoing
support/hosting/API usage requires a separate agreement.

## 7. Client benefit

The change provides a traceable way to identify answer quality issues while
minimizing data collection. Unique response IDs and stored source IDs support
quality review without collecting student identity or chat transcripts.

## 8. Acceptance basis

Acceptance requires the agreed API shape, duplicate protection, persistence
across restart and repeat seed, no identity/transcript storage, passing
automated tests, and review of the documented limitations.
