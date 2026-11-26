# FINAL-05 deployment and rollback runbook

Current mode is local synthetic preparation. Operator: Yerassyl. Pin frontend and backend artifact hashes, configuration version and database migration head together. Hosted steps require separate authorization and verified [cloud gates](CLOUD_GATES.md). Existing application health and legacy API behavior are separate from V2 readiness.

## Routing and environment

1. In the authorized Vercel scope confirm Hobby eligibility. Use roots `frontend` (Vite, npm ci, npm run build, dist) and `backend` (FastAPI, requirements.txt). Existing ASGI app is `backend/app/main.py:app`; verify framework detection from the backend root. If detection fails, use one supported root entrypoint that imports the existing app and remove ambiguity before hosting.
2. Review the inert templates in `infra/deploy`. Instantiate a frontend rewrite for each environment only after exact backend origins are assigned. Route `/api/*` to the matching backend before SPA fallback. Use a dedicated stable preview frontend and backend alias for controlled tests. Never point preview at production. Require no-store for API and callback responses at both direct and proxied paths. If proxy behavior cannot be verified, use an exact backend origin, narrow CORS and equivalent server-side authorization.
3. Keep browser variables limited to the public values in `infra/environment/final-05.env.example`. Scope server variables separately by project and environment. Record configured names and provenance in a restricted manifest; keep secret values in the provider secret store. Unconfigured authorization or provider credentials fail closed. Local replay uses fixture data and no cloud keys.
4. Use Vercel-supplied HTTPS names initially. Owner may compare Student Pack domain eligibility, renewal and DNS/OAuth rework before later authorization. Keep the default domain during preparation.

## Redirect and scope matrix

| Setting | Controlled preview | Production |
| --- | --- | --- |
| Supabase Site URL | Exact assigned preview frontend HTTPS origin | Exact assigned production frontend HTTPS origin |
| Supabase allowlist and client redirectTo | Preview frontend origin + `/auth/callback` | Production frontend origin + `/auth/callback` |
| Google authorized callback | Preview Supabase origin + `/auth/v1/callback` | Production Supabase origin + `/auth/v1/callback` |
| Project, token issuer and worker key | Preview-only | Production-only |
| Current live value | Pending operator authorization | Pending operator authorization |

Use exact values from the consoles. No broad wildcard or production callback in preview. Exchange PKCE code once with matching verifier and constrain the post-auth destination to allowed same-origin application paths. Clear callback parameters before UI navigation. Logs use fixed event names, status class and correlation ID. Exclude headers, raw URLs with queries, authorization codes, tokens, signed links, prompts, document text and user identifiers.

## Migration and rollback

1. Candidate needs accepted schema/API handoffs. Preflight migration order and compatibility in disposable local synthetic Postgres. Record checksums, expected changes and owner. Before approved hosted apply, export approved rollback data to permissioned storage and verify the restore into isolation. Record restore duration and keep the prior application aliases and feature mode.
2. Apply forward-compatible migrations to isolated preview after authorization. Confirm schema version, owner-scope denial and private Storage before promoting any application. Check actual raw byte cap at limit and one byte above, TUS interruption/resume and metadata-only Vercel calls. The decimal and binary cap discrepancy remains an open cross-owner decision.
3. Validate direct and rewritten health, HTTPS, cache policy, app deep links, missing/wrong-project/expired authorization, OAuth cancel and path allowlist, two-user isolation, quota holds and log redaction. Record observations on immutable artifacts before enabling the affected feature.
4. On failure, hold intake and mode, disable external login/provider processing through the approved control, restore known-good frontend and backend aliases together, and rerun health, route and denial checks. Keep backward-compatible database migrations where safe. For incompatible changes use a reviewed forward repair or verified restore after explicit operator authorization. Preserve evidence and account for data written since the backup before any restore. Fall back to local synthetic replay if hosted recovery is unavailable.
