# FINAL-02 · Design and brand the trilingual study workspace

**Owner** Danaya Aliyeva (`aliyevadanaya`) · UI/UX Designer and Frontend Developer

**Reviewer** Yerassyl Babayev · [ClickUp task](https://app.clickup.com/t/z8q7hby8dg)

**Scope** V2-US01–09 · C02.1–2, C05.4, C06.1 · synthetic browser design evidence

| Milestone | Actual record |
| --- | --- |
| In Progress | 2026-11-26T18:32:26.181+05:00, authenticated ClickUp status update |
| Owner packet prepared | 2026-11-26T18:36:14+05:00, after visual and browser checks |
| Original due / acceptance | 2026-11-25 13:30 / 15:00 Asia/Almaty, elapsed |
| Baseline | Approved `4aeb0a178f992c6585688ed48c8ed59e4d83e6aa`; observed main and PR base `34275e2a8ffcc0378efb74e5f20200334a1e421c`, a descendant |
| Review revision | Branch `codex/final-02-workspace-design`; exact delivery SHA and URL in ClickUp review notice |
| Evidence revision | Design tree `d1e57518a40e84ac75b583d45bc64c64c78cf217` |
| Acceptance / merge | Pending independent reviewer decision |
| Effort | Planned 110 active owner minutes, 55 human touch subset, 100 agent-only minutes and 15 rework reserve. Actual human and agent-only minutes unknown. |

## Deliverables

- [UX handoff](../design/UX_HANDOFF.md) with two visual directions, desktop and compact layouts, route/state/API/key mapping and editable browser frames.
- [Design tokens](../design/tokens-v2.json), [asset provenance](../design/ASSETS.md) and [localization glossary](../design/LOCALE_GLOSSARY.md).
- [Evidence manifest](../evidence/FINAL-02/captures.json) with EV-FINAL-02-01–14, [browser output](../evidence/FINAL-02/browser-check.log), [consumer handoffs](../handoffs/FINAL-02.md), [activity](../activity/FINAL-02.csv) and [contribution](../contributions/FINAL-02.json).
- Runtime React, existing SIS behavior, backend, database and infrastructure are outside this design commit.

## Actual checks

Serve `docs/final-exam/design` using `python3 -m http.server 8769 --bind 127.0.0.1`. From the repository root run `DESIGN_TREE=d1e57518a40e84ac75b583d45bc64c64c78cf217 node docs/final-exam/design/prototype/check.cjs` using the existing frontend Playwright install. The script regenerates local evidence.

| Case | Expected | Observed |
| --- | --- | --- |
| Route/locale matrix | Render all 12 screens in EN/RU/KK at both widths. | 72 renders passed. The first mobile pass exposed select overflow on the thread screen. A constrained control width cleared it on retest. |
| Theme and copy | All dictionary tuples populated. Selected text combinations meet 4.5:1. | 99 keys and 16 light/dark contrast pairs passed. Minimum sampled contrast 4.85:1. |
| Guest → source | Keyboard skip, open source, read original excerpt and return focus after Escape. Compact document button reveals the correct pane. | Passed at both widths. Demo made zero external requests and offered no upload control. |
| Guest → auth → personal preview | Switch between held and workspace profile, cancel, show the simulated successful callback, return to course list and recover from empty/error. | Passed. Auth was simulated. |
| Upload and dates | Show progress, failure and retry. Open the candidate source and explicitly confirm date. | Passed at both widths. File selection and persistence are runtime work. |
| Visual review | Readable hierarchy at 1440 and 375. | Visually inspected landing and compact chat captures. Fourteen local Chromium images recorded. |

## Reviewer checklist

- [ ] Accept folded-page brand, course-first navigation, source provenance and mobile pane switching.
- [ ] Verify two themes, EN/RU/KK labels, role/mode cues and the routes/API matrix at the submitted revision.
- [ ] Verify synthetic scope of screenshots and check the limitations before approving visual use.
- [ ] Record decision and exact accepted revision. Authorize consuming FINAL-06 only after acceptance.

## Limits and assumptions

The published ClickUp pages governed independent design. FINAL-01 was conditionally accepted and integrated through [PR #50](https://github.com/yerassyl-clou/SmartCampus/pull/50) at main `6a5798d1a398b2512b9809e0e3b96fc14377a0b4`. Its ledger approves the original execution baseline. FINAL-04 had no frozen fixture on that main. FINAL-05 draft `02e3872e14038c5420c4c3c5321ee84364459bec` retains an OAuth and personal data hold and allows local replay preparation. Figma required reauthentication. The local HTML/CSS/JS source is the editable fallback. Native linguistic review and physical device/assistive technology checks remain pending. Browser captures use a local Chromium engine. No hosted evidence, user feedback, live OAuth, private data, ingestion or live assistant results are claimed.

## Slide-ready material

**Slide 5 · Source-first student workspace**

Use the [desktop guest course](../evidence/FINAL-02/EV-FINAL-02-03-guest-course-1440.jpg) beside the [375 px guest chat](../evidence/FINAL-02/EV-FINAL-02-08-guest-course-375.jpg).

**On slide** “Course sources, cited answers and deadlines stay within one study context.”

**Speaker notes** “On desktop, documents sit next to the answer while deadlines remain visible. At 375 pixels the same tasks are available through three compact controls. Opening the citation shows its original excerpt. These are browser captures of the design prototype with an authored synthetic course.”

**Slide 11 · Delivery and validation**

Use the [dark mobile source tab](../evidence/FINAL-02/EV-FINAL-02-10-guest-source-tab-dark-375.jpg) and [browser result](../evidence/FINAL-02/browser-check.log).

**On slide** “72 route and locale renders across two widths. The design includes both themes and an offline synthetic demo.”

**Speaker notes** “The browser checks exercised citation focus return, state recovery and guest boundaries. The simulated live label identifies authored replay. Full product verification follows after the signed design handoff, including server eligibility and release-mode controls.”

**AI disclosure** Codex assisted with source review, draft interface and translations, original SVG paths, test authoring and delivery documentation. Chromium via Playwright produced the screenshots. Human language validation and the formal review decision remain pending.

## Review corrections · 2.0.0-review.2

The [review at the first head](https://github.com/yerassyl-clou/SmartCampus/pull/51#pullrequestreview-6075357784) identified an auth selector that showed a hold beside an enabled action and a misleading live demo label. The corrected auth picker and CTA share the same resolved state. Workspace preview supports available, loading, held, cancelled, failed and simulated success. Public-demo sign-in and callback remain held. The guest preview uses short localized selector labels and a wrapping provenance banner that identifies the simulation and the example replay.

The Chromium regression runs these cases for all 12 width × locale × theme combinations. It checks Google-action visibility, failure retry, callback loading and simulated success, direct public callback hold, synthetic fixture replay, lack of upload, zero external requests and no page errors. The affected images were inspected in the running Chromium prototype.

| Variant | 1440 px | 375 px |
| --- | --- | --- |
| Simulated sign-in available | [EV-02](../evidence/FINAL-02/EV-FINAL-02-02-signin-1440.jpg) | [EV-07](../evidence/FINAL-02/EV-FINAL-02-07-signin-375.jpg) |
| Sign-in held | [EV-11](../evidence/FINAL-02/EV-FINAL-02-11-signin-held-1440.jpg) | [EV-12](../evidence/FINAL-02/EV-FINAL-02-12-signin-held-375.jpg) |
| Simulated live replay, dark | [EV-13](../evidence/FINAL-02/EV-FINAL-02-13-simulated-live-dark-1440.jpg) | [EV-14](../evidence/FINAL-02/EV-FINAL-02-14-simulated-live-dark-375.jpg) |
