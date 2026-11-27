# FINAL-06 UX shell QA

**Contract** `2.0.0-shell-review.2`

**Design** FINAL-02 2.0.0-review.2, [PR #51](https://github.com/yerassyl-clou/SmartCampus/pull/51), merged at `c95c0a448218611c1a61c7f71acda3580ef1ec04`

**Verified source** frontend Git tree `5c6876dd2fe8a2c9e3acd1d1f27d9d7e8f6a2568`

## Scope and modes

| Surface | Mode and behavior | Contract |
| --- | --- | --- |
| `/`, `/privacy` | Responsive landing, original brand, localized preferences and access notice. Default profile is public-demo. | [Shared React shell](../../../frontend/src/app/Shell.jsx) |
| `/demo`, `/demo/course/:slug` | Read-only authored Design Research course, original English syllabus excerpt, explicit date and localized curated answer. The guest adapter exposes read-only course and replay functions. | [Local replay](../../../frontend/src/features/demo/syntheticReplay.js); `demo_example`, curated slug and reserved `/api/v2/demo/chat` path. No live adapter is selected while FINAL-04 and provider authorization are pending. |
| `/signin`, `/auth/callback` | Held by default. Explicit workspace config enables Supabase Google PKCE with exact origin callback, sanitized callback parameters, allowlisted return and typed recoverable states. | [Auth configuration](../../../frontend/src/features/auth/config.js), [Supabase PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow) |
| `/app/**` | Private shell is denied before eligibility. Verified workspace session from the API is required, with exact admin role for analytics. Personal course, chat and deadline data integration belongs to the downstream tasks. | [Route registry](../../../frontend/src/app/v2Routes.js), [session client](../../../frontend/src/features/auth/client.js) |
| Previous SIS app | Existing entry point and test suites remain available through `VITE_APP_MODE=legacy`. Explicit old `VITE_USE_MOCK_CHAT=true/false` remains compatible when neither V2 mode nor the synthetic release flag is selected. Legacy is separate from the V2 demo. | [Entry selection](../../../frontend/src/app/entry.jsx) |

The FINAL-05 preliminary synthetic setting `VITE_RELEASE_MODE=synthetic` takes precedence over every legacy selector and holds auth even if other variables are present. Both `/` and `/legacy` show the V2 landing for this release. Explicit legacy mode remains available when synthetic release is absent. The workspace profile expects `VITE_APP_MODE=workspace`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and optional origin-only `VITE_API_BASE_URL`. A client session alone never authorizes personal content. Only the verified workspace result from `GET /api/v2/session` does. Use an exact approved HTTPS origin and callback for hosted work. No hosted Auth configuration or provider access was performed.

## Actual test cases

| Case | Expected and observed |
| --- | --- |
| T01 subset · guest | Course, syllabus, curated reply, source and deadline reachable at 1440×1000 and 375×812. Browser route interception observed no auth, API, write or off-origin requests. Unknown course shows a localized missing state. |
| T02/T03 subset · auth | Offline-held sign-in and callback, provider cancellation, expired PKCE code, callback parameter cleanup, valid callback, allowlisted return, verified session restoration, admin denial, unverified denial and sign-out passed. PKCE and eligibility traffic were intercepted with synthetic broker/API responses. |
| T14 subset · UX | EN/RU/KK dictionaries have equal keys and nonblank values. Language and theme persisted after reload, actual primary CTA contrast met 4.5:1 in the exercised dark view, control height was at least 44 px, and both viewports passed horizontal overflow checks. Skip navigation and citation focus restoration passed. |
| Synthetic release precedence | A loopback build profile combines `VITE_RELEASE_MODE=synthetic` with `VITE_APP_MODE=legacy`. Both `/` and `/legacy` render the V2 landing, reach guest replay, and hold sign-in, with zero API, Supabase Auth or off-origin requests. The preceding revision failed both paths with intercepted `/api/deadlines` requests. |
| SIS regression | The existing assistant, feedback, deadlines, mocked demo and production guard suites run with their existing legacy profile. |

From `frontend`, run `npm ci`, `npm run build`, `npx playwright test tests/v2-shell.spec.js` and `npm test`. Playwright config registers one V2 project and three loopback fixture servers. Existing projects, API test behavior and cloud configuration are intact. Set `SMARTCAMPUS_V2_CAPTURE_DIR` to regenerate the local screenshots. See [command output](../evidence/FINAL-06/checks.log) and [capture manifest](../evidence/FINAL-06/captures.json).

## Limits

Held cases are explicit. Screenshots reflect local Vite runtime using authored data. Browser OAuth/eligibility fixtures validate choreography and UI behavior. Provider availability, real Google signup, live AI, verified hosted callbacks, production access, backend authorization/ownership coverage and native linguistic review require independent evidence. FINAL-04 wire fixtures and final FINAL-05 disposition remain pending. The consent UI, private CRUD, content ingestion and protected analytics belong to subsequent integration work.
