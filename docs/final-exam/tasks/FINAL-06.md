# FINAL-06 · Localized shell, auth and guest demo

**Owner** Danaya Aliyeva · UI/UX Designer and Frontend Developer · `aliyevadanaya`

**Reviewer** Yerassyl Babayev · [ClickUp task](https://app.clickup.com/t/z8q7hby8dn)

**Scope** V2-US01/02/08 · C05.1–4, C06.2/4 · local public-demo and isolated auth fixtures

| Milestone | Record |
| --- | --- |
| Started | 2026-11-28T00:09:45.323+05:00, verified In Progress update |
| Original delivery / acceptance | 2026-11-26 15:00 / 16:00 Asia/Almaty, elapsed |
| Accepted baseline | `c95c0a448218611c1a61c7f71acda3580ef1ec04` integrates FINAL-02. Conditional FINAL-01 acceptance entered main via PR #50. |
| Packet prepared | 2026-11-28T00:18:38+05:00 |
| Implementation and captures | Frontend tree `5c6876dd2fe8a2c9e3acd1d1f27d9d7e8f6a2568`. Exact PR, head and review request time appear in the ClickUp review notice. |
| Acceptance / merge of FINAL-06 | Pending independent reviewer decision |
| Effort | Planned 150 active owner minutes, 65 human touch subset, 160 agent-only minutes and 20 reserved rework minutes. Actual human and agent-only time unknown. |

## Implementation and verification

- The Vite entry routes to the responsive SmartCampus shell and retains an explicit legacy profile. Shared header, cards, actions, citation dialog and route registry use the accepted brand and token values. Locale and theme preferences persist locally.
- Supabase PKCE is guarded by explicit workspace configuration. Callback parameters are removed, return paths allowlisted and private routes require server eligibility. An admin route additionally requires admin from the verified response. Cancellation, stale code, login failure, denied and unavailable states are explicit, with a held path back to guest.
- The synthetic course and deadline dashboard use authored local data. Example replay accepts a curated slug. Citation opens the original English excerpt and restores focus on close. The guest shell has no private API client or mutation path.
- The existing Playwright config has one V2 project and isolated local servers so the required command and the existing CI entry both exercise the new suite. Backend, database, provider accounts and Vercel configuration are outside this change.

| Command | Result |
| --- | --- |
| `cd frontend && npm ci` | Passed. The existing dev-dependency audit reports two findings. Runtime-only npm audit reported zero. |
| `cd frontend && npm run build` | Passed. |
| `cd frontend && npx playwright test tests/v2-shell.spec.js` | 13 passed, including responsive and keyboard tests, three locales, both themes, OAuth fixture callback and eligibility, role denial and no guest network requests. |
| `cd frontend && npm test` | 85 passed, including 72 existing legacy tests. |

[QA report](../quality/UX_SHELL_QA.md) · [Asset manifest](../quality/SHELL_ASSETS.md) · [Test output](../evidence/FINAL-06/checks.log) · [Capture manifest](../evidence/FINAL-06/captures.json) · [Downstream handoffs](../handoffs/FINAL-06.md) · [Activity](../activity/FINAL-06.csv) · [Contribution](../contributions/FINAL-06.json)

## Review checklist

- [ ] Open the public demo without credentials. Play the example, open the original source, verify the date and check the network.
- [ ] Verify the accepted brand, desktop/mobile layouts, preferences and accessible focus.
- [ ] Rerun the V2 and legacy checks at the submitted revision; verify authorization holds and synthetic classification.
- [ ] Record the independent decision and integrated revision. FINAL-10 remains held until accepted integration.

## Limits

FINAL-04 has yet to freeze the final API example schema and approved live demo request contract. FINAL-05 preliminary.3 holds external OAuth, signup and hosted callback pending operator verification. The SDK and eligibility consumer were exercised with loopback fixtures. Production, real data, provider/hosted throughput, linguistic review and user feedback remain unverified. Personal routes provide protected integration surfaces for downstream owners.

## Slide-ready content

**Slide 5 · Trilingual workspace shell**

“The local SmartCampus demo links one sample course to a syllabus, cited answer and deadline. Learners can switch between English, Russian and Kazakh and between light and dark.”

**Speaker notes** “Open the desktop replay beside the compact mobile citation. The answer comes from an authored example. Open the citation and show that the excerpt retains its original language. The guest path requires no account.” [Desktop replay](../evidence/FINAL-06/EV-FINAL-06-03-replay-1440.jpg) · [Mobile citation](../evidence/FINAL-06/EV-FINAL-06-12-citation-375.jpg)

**Slide 11 · Separation of access modes**

“The local frontend passes thirteen shell checks and 72 existing regression checks. Personal routes wait for server eligibility. The default profile keeps Google sign-in held.”

**Speaker notes** “Show the held sign-in capture and demonstrate guest access. The PKCE tests use synthetic broker responses. The hosted decision has its own evidence and approval gate.” [Held sign-in](../evidence/FINAL-06/EV-FINAL-06-07-held-1440.jpg)

**AI disclosure** Codex assisted with implementation, localized strings, tests, browser checks, evidence preparation and delivery documentation. Chromium screenshots were generated from the running frontend. Independent acceptance and native linguistic review are open.

## Independent review correction

The [review finding](https://github.com/yerassyl-clou/SmartCampus/pull/53#pullrequestreview-6092547592) reproduced automatic legacy requests on both entry paths when the synthetic release and legacy application flags were configured together. Both new browser tests failed on the first submitted entry logic and intercepted `/api/deadlines`. The corrected entry logic resolves the synthetic release first and gives `/legacy` the V2 landing in that profile. Explicit legacy mode continues to pass its compatibility checks. See the [before and after output](../evidence/FINAL-06/checks.log) and [updated captures](../evidence/FINAL-06/captures.json).
