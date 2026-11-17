# SIS12-05 — GitHub, SQLite and Local Deployment Resource Limits Audit

**Prepared:** 17 November 2026  
**Evidence period:** 4–17 November 2026  
**Owner:** Gleb  
**Status:** evidence handoff for review; not a production capacity guarantee

## Scope and evidence rules

SmartCampus is a local prototype using fictional course data. No production
hosting, uptime, account quota, invoice, or personal machine inventory was
available for verification. This document distinguishes measured actuals,
repository facts, illustrative planning values, and unknown account facts.

The reproducible command output is in
[RESOURCE_MEASUREMENTS.log](evidence/infrastructure/RESOURCE_MEASUREMENTS.log).
The backend/frontend timing output is in
[LOCAL_BUILD_TEST_MEASUREMENTS.log](evidence/infrastructure/LOCAL_BUILD_TEST_MEASUREMENTS.log).

## Technical inventory and measurements

| Resource | Planned/baseline | Measured actual | Difference | Limit/availability issue | Mitigation/owner |
|---|---|---|---|---|---|
| SQLite fixture database | Seeded local fixture; expected 3 courses, 6 deadlines, 6 documents. Planned byte size was not specified. | Temporary seeded database: 36,864 bytes; 9 pages × 4,096 bytes; counts 3/6/6; foreign-key check empty. Seed repeated successfully. | Bytes: N/A; no planned byte baseline. Rows: 0 difference from fixture target. | SQLite is a local file; concurrent writer behavior, backup retention, and production growth capacity are not established. | Keep fixture/operational data separate, add backup/migration policy before production use. Gleb. |
| GitHub repository and Git history | Use public `main` plus feature branches and PRs. No Actions usage target was specified. | `yerassyl-clou/SmartCampus` is public; default branch `main`; GitHub API repository size 3,289 KB; Actions workflow count 0; local Git objects 3.14 MiB packed. | N/A: no numeric planned storage or CI baseline. | Account billing, storage quota, Actions entitlement, and minutes are not verified. No CI workflow currently exists. | Confirm account plan/quotas with authorized owner; add CI only after scope approval. Yerassyl. |
| Local backend runtime | Python/FastAPI/Uvicorn local service; no response-time or machine-capacity target was specified. | Python 3.9.6 environment; 126 backend tests passed in 1.22s wall time. | N/A: no planned duration target. | Runtime is machine-dependent; Python version differs from README target of 3.11+. | Standardize supported Python and record CI runtime baseline. Gleb/Ratislav. |
| Local frontend build | React/Vite local build; no build-time target was specified. | Node v25.9.0, npm 11.12.1; `npm run build` passed in 0.59s wall time. | N/A: no planned duration target. | Build time depends on local machine and dependency cache; no hosted build capacity. | Add CI build measurement and retain lockfile/package audit. Danaya/Yerassyl. |
| Developer workspace storage | Local development only; no disk quota target. | Workspace 80M; `database` 60K; `frontend` 26M; `backend` 46M. Host filesystem reported 287Gi available at measurement time. | N/A: no planned disk allocation. | Shared machine identity/specifications, backup, and retention are unknown. | Keep generated DB/build artifacts ignored; confirm backup policy if data becomes operational. Gleb. |

## SQLite limits and reproducible measurement

The measured database is a temporary fixture created with:

```bash
backend/.venv/bin/python database/seed.py --db "$tmp/smartcampus.db"
stat -f 'database_path=%N size_bytes=%z' "$tmp/smartcampus.db"
```

Rows and SQLite page metrics were read with:

```sql
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM deadlines;
SELECT COUNT(*) FROM documents;
PRAGMA foreign_key_check;
PRAGMA page_count;
PRAGMA page_size;
```

This proves the current fixture size and integrity only. It does not establish
a universal SQLite file cap, multi-user concurrency SLA, backup RPO/RTO, or
production capacity. The current seed is a repeatable fixture reset and must
not be treated as an operational migration policy.

## GitHub and CI status

The repository is public and uses `main` plus feature branches/PRs. The
GitHub Actions listing returned zero workflows on 17 November 2026. Therefore
there is no measured CI minutes usage or CI storage usage to report.

Official references:

- [GitHub pricing](https://github.com/pricing) lists the Free plan at
  `$0 USD`; the repository account plan and entitlement were not inspected.
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
  explains included compute usage and plan-dependent billing; this project
  has no workflow from which to measure usage.

PR history demonstrates repository activity, not human hours, plan usage, or
cost. Account billing and quota confirmation remains a Yerassyl follow-up.

## Local deployment and availability

The documented deployment is local:

- FastAPI/Uvicorn on `localhost:8000`;
- React/Vite on `localhost:5173`;
- SQLite as a local file.

No paid hosting, deployment URL, uptime, or production concurrency was found.
Health endpoint availability during a local process run must not be reported
as service uptime.

## Cost and capacity register

| Resource | Cost status | Verified source/date | Paid alternative or follow-up |
|---|---|---|---|
| SQLite software | No separate software licence purchase is evidenced for this local prototype. Actual hardware/electricity spend is unknown. | Repository schema/seed and local measurement, 17 Nov 2026. | Hosting/storage cost requires a separately approved deployment design. |
| GitHub | Repository is public; account billing and actual project spend unknown. GitHub pricing lists Free `$0`, but this is not proof of the account's plan. | [GitHub pricing](https://github.com/pricing), accessed 17 Nov 2026. | Confirm account plan and Actions/storage quota with Yerassyl; use GitHub's paid plan only if required. |
| ClickUp | Workspace plan and actual spend unknown. Official public pricing lists Free Forever `$0` and 60 MB storage, but workspace entitlement was not inspected. | [ClickUp pricing](https://clickup.com/pricing), accessed 17 Nov 2026. | Confirm workspace plan/billing with the authorized PM account. |
| Groq API | API key/account, quota, usage, and spend unknown. No numeric limit is asserted. | Repository `.env.example`/`docs/AI_CHAT.md`; no account billing screen available, 17 Nov 2026. | Ratislav must supply dated provider usage/limit evidence; keep mocked tests as the no-cost baseline. |
| Developer hardware/electricity | Unknown; no device inventory or bill was available. | No local hardware ownership/cost record, 17 Nov 2026. | Owner confirmation required; do not convert local disk output into a project cost. |

The historical `$1,177` and `$200/department/month` figures in SIS10–11
documents are explicitly illustrative scenarios, not actual SIS12 spending.

## Planned versus actual follow-up rows

| Non-human resource | Planned usage/cost | Actual evidence | Difference | Issue | Solution |
|---|---|---|---|---|---|
| SQLite fixture | 3/6/6 rows; byte size not planned; local/no separate licence cost assumption | 3/6/6 rows, 36,864 bytes, 9 × 4,096-byte pages | Rows 0; bytes N/A | No operational growth/backup/concurrency baseline | Add migration, backup, and growth checks before deployment |
| GitHub repository/CI | Branch + PR workflow; no numeric storage/minutes target | Public repo, 3,289 KB API size, 0 workflows, 3.14 MiB packed local objects | N/A | Account plan and quota unknown; CI absent | Confirm plan and decide whether a CI workflow is required |
| Local build/test runtime | Local backend/frontend; no time target | 126 pytest tests/1.22s wall; frontend build/0.59s wall; workspace 80M | N/A | Machine-dependent; Python 3.9 actual vs README 3.11+ target | Standardize runtime and capture CI measurements |

Actual minus planned is intentionally `N/A` where the planned unit was not
numeric or used a different basis. No false capacity or savings claim is made.

## Risks and ownership

| Priority | Risk | Evidence | Mitigation | Owner |
|---|---|---|---|---|
| High | Repeatable seed could be mistaken for a production backup/migration. | `database/seed.py` resets fixture tables; SQLite is local. | Separate fixture and operational DBs; define backups and migration policy. | Gleb |
| High | No CI means regressions and dependency drift are not automatically gated. | GitHub Actions count is 0. | Confirm scope and add a minimal backend/frontend CI workflow. | Yerassyl |
| Medium | Provider/API cost and quota are unmeasured. | No authorized Groq billing/usage evidence. | Ratislav supplies dated usage/limits; keep provider-mocked tests mandatory. | Ratislav |
| Medium | Runtime timing is machine-specific and Python version differs from target. | Measurements use Python 3.9.6 while README targets 3.11+. | Align supported interpreter and repeat timing in CI. | Gleb/Ratislav |

## Outstanding facts

- ClickUp workspace plan and billing: owner confirmation required from
  Yerassyl.
- GitHub account plan and Actions/storage quota: owner confirmation required
  from Yerassyl.
- Groq quota, billing, and actual usage: owner confirmation required from
  Ratislav.
- Hardware, electricity, and backup costs: owner confirmation required from
  each relevant owner/PM.
- Production hosting and availability: not applicable to the current local
  prototype; future deployment decision required.
