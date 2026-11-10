# Simplified Fixed-Price Contract

**Educational template for a fictional project. Not an executed agreement;
no signatures are provided.**

## 1. Parties

- **Provider:** SmartCampus Educational Software Team, a fictional IT
  provider.
- **Client:** Fictional University Client.

The parties and project are simulated for academic assessment.

## 2. Scope

The Provider will implement CR-001 feedback persistence for the SmartCampus
prototype: an additive SQLite feedback table/helper, validated feedback API
integration, frontend feedback wiring, automated checks, and handover
documentation.

## 3. Deliverables

1. Migration-safe SQLite schema and parameterized persistence helper.
2. Feedback API integration with validation, safe errors, and duplicate
   response protection.
3. Frontend feedback controls that preserve signed source IDs.
4. Backend/integration/browser test evidence.
5. Setup, migration, and acceptance documentation.

## 4. Fixed price

The total one-off fixed price is **$1,177.00**, based on the illustrative
hours/rates and 10% contingency in
[COMMERCIAL_OFFER.md](COMMERCIAL_OFFER.md). This is a fictional educational
amount, not a binding commercial quote.

## 5. Timeline

The planned delivery period is five working days after written approval,
repository access, and confirmation of the acceptance contacts:

- Day 1: scope, schema, API, and test-plan confirmation;
- Day 2: persistence helper and additive migration;
- Day 3: API and frontend integration;
- Day 4: automated and browser testing;
- Day 5: documentation, review package, and handover.

## 6. Payment schedule

| Installment | Trigger | Amount |
|---|---|---:|
| 40% | Written start approval | $470.80 |
| 40% | Implementation review at M3 | $470.80 |
| 20% | Acceptance package at M5 | $235.40 |
| **Total** |  | **$1,177.00** |

## 7. Responsibilities

### Provider

- Implement only the agreed scope and protect credentials.
- Use fictional data and avoid identity/transcript persistence.
- Provide reproducible test commands and truthful results.
- Report blockers, provider limitations, and rejected acceptance cases.

### Client

- Provide timely written decisions and access to the agreed repository.
- Review the API/UI behavior and provide acceptance feedback.
- Supply no real student data or credentials in the repository.
- Approve or reject a change request before extra work begins.

## 8. Change Request procedure

Any requested change must be submitted in writing. Before extra work starts,
the Provider will document its impact on scope, time, price, risks, and
dependencies. The Client must approve that impact in writing. Unapproved
extra work is not included in the fixed price.

## 9. Acceptance and remediation

The Client has five working days after delivery of the acceptance package to
review the deliverables against the following conditions:

- feedback persists after backend restart and repeat seed;
- duplicate `response_id` submissions are rejected safely;
- the API validates the agreed fields and returns safe errors;
- no identity or transcript is stored;
- signed source IDs, including negative deadline IDs, remain traceable;
- existing course/deadline/chat behavior is not disrupted;
- automated and browser checks are reproducible;
- documentation and limitations are delivered;
- no live university integration or real personal data is required.

The Client will provide written rejection details tied to these conditions.
The Provider will remediate confirmed in-scope defects within a reasonable
agreed period, normally five working days. New requirements follow the Change
Request procedure.

## 10. Exclusions

Microsoft Teams, student identity/accounts, personal schedules, transcript
storage, custom analytics, production hosting, provider/API consumption,
mobile applications, and multilingual content are excluded.

## 11. Warranty and support

The illustrative warranty is 14 calendar days after acceptance for defects
within this scope. Ongoing support, hosting, and API usage require a separate
agreement. The historical $200/department/month forecast is not part of this
fixed price.
