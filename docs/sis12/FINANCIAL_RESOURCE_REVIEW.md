# SIS12-07 — Financial Resource Review and Evidence Cross-Check

**Prepared:** 17 November 2026  
**Owner:** Gleb  
**Status:** independent review for PM acceptance; not a financial statement

## Review conclusion

No actual paid project total can be established from the available evidence.
The repository is a local fictional-data prototype. The `$1,177` one-off
figure and `$200/department/month` scenario are documented SIS10–11
illustrative estimates, not invoices, subscriptions, or SIS12 actuals.

The main acceptance blockers are missing authorized account billing/quota
records, missing measured human-time data, and the absence of the final
6–10-page report/presentation from this review scope.

## Financial inventory

| Resource | Planned/illustrative basis | Actual cost/usage evidence | Difference | Status and owner |
|---|---|---|---|---|
| GitHub | Public repository and PR workflow; Free plan is a possible `$0` reference, not an account assertion. | Public `yerassyl-clou/SmartCampus`; repository API size 3,289 KB; no account billing screen; Actions workflows: 0. | Cost N/A; no comparable quota target. | **Unknown / owner confirmation required:** Yerassyl. |
| ClickUp | Board/task collaboration; public pricing displays Free Forever `$0` and 60 MB storage. | Authorized task evidence exists, but workspace plan/billing and actual spend were not available. | Cost N/A. | **Unknown / owner confirmation required:** Yerassyl. |
| Groq API | Real chat calls conditional on key; no approved monthly budget in repository. | Provider key/account usage, quota, and billing not available; mocked tests are local. | N/A. | **Unknown / owner confirmation required:** Ratislav. |
| SQLite/local storage | Fictional local fixture; no paid database service. | Temporary fixture 36,864 bytes, 3/6/6 rows; hardware/electricity unknown. | Bytes have no planned target; cost N/A. | **Measured local / cost unknown:** Gleb. |
| Local runtime/build | Local FastAPI/React tools; no hosting budget. | 126 backend tests in 1.22s; frontend build in 0.59s; workspace 80M. | N/A; no planned performance budget. | **Measured local / cost unknown:** Gleb/Danaya/Yerassyl. |
| Hardware/electricity | No budget supplied. | No device inventory, utility bill, depreciation, or allocation record. | N/A. | **Unknown:** PM/each owner. |

## Historical estimates versus actuals

| Figure | Meaning | Accounting treatment |
|---:|---|---|
| `$1,070` | SIS10–11 illustrative labor subtotal | Not an invoice or measured SIS12 spend |
| `$107` | Illustrative 10% contingency | Not incurred cost |
| `$1,177` | Illustrative one-off fixed-price scenario | Do not report as actual paid amount |
| `$200/department/month` | Optional historical hosting/support scenario | Not a confirmed subscription or monthly charge |

No arithmetic is performed between these estimates and measured local bytes,
test seconds, or repository size because the units and financial basis differ.

## Official free/paid references

- [GitHub pricing](https://github.com/pricing): public page lists Free at
  `$0 USD`; the project account plan remains unverified.
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions):
  included compute depends on the plan and usage model; this repository has
  no Actions workflow to measure.
- [ClickUp pricing](https://clickup.com/pricing): public page lists Free
  Forever at `$0` and 60 MB storage; the team's workspace plan is unknown.
- Groq pricing/account limits were not available in the evidence bundle or
  authorized account screens. No numeric Groq limit or cost is claimed.

## Planned-versus-actual financial/resource check

| Item | Planned usage/cost | Actual evidence | Difference | Issue | Proposed action | Confidence/source |
|---|---|---|---|---|---|---|
| SQLite | 3/6/6 fixture target; no byte budget | 3/6/6; 36,864 bytes; foreign keys clean | Rows 0; bytes N/A | No production growth/backup basis | Add migration/backup policy before deployment | High; local log |
| GitHub/CI | PR workflow; no numeric CI budget | Public repo; 0 workflows; account cost unknown | N/A | No automated quality gate or quota evidence | PM confirms plan and approves CI scope | High for repo facts; low for billing |
| Local test/build | Local checks; no timing SLA | 126 tests/1.22s; build/0.59s | N/A | Machine/version dependent | Record CI baseline and align Python target | High; local log |
| ClickUp | Board access; no budget supplied | Task reads available; plan/spend unknown | N/A | Cannot verify subscription cost | PM exports plan/billing evidence | Low for cost; task evidence high |
| Groq | Real calls only when configured; no budget supplied | No account usage/quota record | N/A | Provider cost/rate limits unverified | Ratislav supplies dated provider evidence | Low |
| Hardware/electricity | Not planned | No records | N/A | Local development cost omitted from evidence | Mark unknown; do not infer `$0` | High that it is unknown |

## QA findings and readiness blockers

1. **High — final report/PDF not available in this workspace.** Page count and
   preview cannot be checked. Owner: Yerassyl/PM.
2. **High — account-specific cost/quota evidence is missing.** GitHub,
   ClickUp, and Groq actual charges/limits cannot be inferred from public
   pricing. Owners: Yerassyl and Ratislav.
3. **High — actual human hours are not measured.** Existing planning estimates
   and `time_spent=null`/missing records must not be reported as zero labor.
   Owner: Yerassyl/PM; use the documented time-tracking protocol.
4. **Medium — no GitHub Actions workflow exists.** CI resource usage is zero
   because no workflow was found, not because a quota was fully measured.
   Owner: Yerassyl.
5. **Medium — Python runtime evidence is 3.9.6 while project documentation
   targets 3.11+.** Repeat measurements in the supported CI/runtime before
   treating timings as portable. Owner: Gleb/Ratislav.

## Readiness checklist handoff

The companion [SIS12_REPORT_QA_CHECKLIST.md](SIS12_REPORT_QA_CHECKLIST.md)
maps each official Part 1–4 requirement to evidence and assigns unresolved
items. This review does not mark the overall SIS12 submission 3/3 and does
not claim presentation completion.
