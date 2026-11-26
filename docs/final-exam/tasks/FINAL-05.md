# FINAL-05 · $0 deployment, OAuth and release authority

Owner and reviewer: Yerassyl. Scope C05.1, C07.1/3/4 and C08.1/4. See the [ClickUp task](https://app.clickup.com/t/z8q7hby8dm). Approved execution baseline `34275e2a8ffcc0378efb74e5f20200334a1e421c`; FINAL-01 accepted integration `6a5798d1a398b2512b9809e0e3b96fc14377a0b4`. Original owner due 26 November 14:00 Almaty, original acceptance 15:00, both elapsed. Independent preparation resumed after integration on 26 November. Actual human and agent-only minutes are unknown; planned owner effort 125 minutes. Acceptance is pending.

- [Preliminary contract](../product/INFRA_PRELIMINARY.md), [release and account gates](../product/CLOUD_GATES.md), [deployment and rollback runbook](../product/DEPLOYMENT_RUNBOOK.md), [handoffs](../handoffs/FINAL-05.md), [activity](../activity/FINAL-05.csv), [contribution](../contributions/FINAL-05.json).
- The `infra/deploy` JSON templates and `infra/environment/final-05.env.example` document proposed isolated configuration. The repository runtime continues to use its existing configuration.
- [Local evidence](../evidence/FINAL-05/checks.json) covers template structure, credential-free synthetic defaults and local runtime observations. Hosted HTTPS, effective Vercel limits, redirect enforcement, test-account login, log redaction and deployed migration/restore remain unverified. Actual approved charges are unknown. No new spend was authorized.
- The dated FINAL-01 acceptance is in [PR #50](https://github.com/yerassyl-clou/SmartCampus/pull/50) and the [status ledger](../STATUS_LEDGER.md). ClickUp rejected the Done write due to its daily connector limit; the connected Chrome session is Danaya2. Board synchronization is pending under Yerassyl.

## Slides 14–15

**On slide:** “$0 infrastructure plan with local synthetic replay. Live sign-in and hosted operation require account and privacy verification.”

**Speaker notes:** “The team can validate the interface without signing in to cloud providers. Before deployment, confirm the exact account plan, locations, remaining limits and environment separation. Prove rollback in isolated preview and keep registration held until the authorized release decision.”

**Visual:** Use the gate table and the synthetic routing and rollback sequence in the runbook. Actual console imagery requires a permissioned redacted capture.

**AI disclosure:** Codex drafted provider documentation comparisons, deployment templates and evidence. The owner retains authority for cloud changes and release.
