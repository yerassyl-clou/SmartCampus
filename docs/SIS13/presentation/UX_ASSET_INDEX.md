# SIS13-08 UX asset index

**Status:** Matched evidence for approved A-01. Integrate this evidence after [PR #38](https://github.com/yerassyl-clou/SmartCampus/pull/38). On 24 November 2026 the PM retrospectively approved SC-ISS-003 → I-01 → A-01 (E-01, E-03), with 2/2 failed before, 0/2 target and 0/2 failed after. [PM decision](https://github.com/yerassyl-clou/SmartCampus/pull/38#issuecomment-7131524329)

The four baseline assets were captured on **23 November 2026, 08:40:25 Asia/Almaty** for [SIS13-08](https://app.clickup.com/t/z8q7hbx7w3) and [SIS13-07](https://app.clickup.com/t/z8q7hbx7w1). They show the real React/FastAPI/SQLite application at `6645b5ef95e2cb4d00aa4bb6756705ac84475654` with the fictional seed. The [capture protocol](../evidence/ux/UX_CAPTURE_PROTOCOL.md) records the browser, fixture, clock and keyboard checks.

| Evidence ID | Original | Scenario and purpose | Stage | Placement and limits |
| --- | --- | --- | --- | --- |
| EV-08-01 | [sis13-08-sc-iss-003-baseline-chat-1440.png](../evidence/ux/sis13-08-sc-iss-003-baseline-chat-1440.png) | Desktop deadline suggestion submitted. Shows the fallback and the populated dashboard. | Baseline · full-page 1440 × 1853 | Report UX baseline. For a slide, crop to the fallback and use the dashboard excerpt alongside it. |
| EV-08-02 | [sis13-08-sc-iss-003-baseline-chat-375.png](../evidence/ux/sis13-08-sc-iss-003-baseline-chat-375.png) | Mobile replay of the same shortcut with the same fixture. | Baseline · full-page 375 × 2156 | Report appendix for mobile coverage. Tall capture benefits from a slide crop. |
| EV-08-03 | [sis13-08-sc-iss-003-baseline-focus-1440.png](../evidence/ux/sis13-08-sc-iss-003-baseline-focus-1440.png) | Desktop focus on the keyboard-activated suggestion before submission. | Baseline · viewport 1440 × 1000 | Report keyboard evidence. Capture covers focus for this control. |
| EV-08-04 | [sis13-08-sc-iss-003-baseline-focus-375.png](../evidence/ux/sis13-08-sc-iss-003-baseline-focus-375.png) | Mobile focus on the same suggestion, whose short desktop label is hidden at this width. | Baseline · viewport 375 × 812 | Defense accessibility detail. Capture covers focus for this control. |

Suggested baseline caption: “The built-in deadline question returned a fallback on desktop and mobile, while the same seeded session showed six deadlines in Course deadlines.” The two baseline journeys failed with the same SQLite fixture.

### Candidate implementation captures

Captured **23 November 2026, 11:05:14 Asia/Almaty** on [implementation commit `748f695`](https://github.com/yerassyl-clou/SmartCampus/commit/748f6951a870ee0c7bb4a29179bd54e754d25cb2) from a clean working tree. All four after captures use the original baseline browser version, respective viewports, SQLite fixture and fixed browser clock. The baseline terminal captures are full-page. The after terminal captures show the viewport immediately after native fragment navigation. On mobile, the remaining deadline cards can be reached by scrolling and all six were asserted in the dashboard.

| Evidence ID | Original | Scenario and purpose | Stage | Placement |
| --- | --- | --- | --- | --- |
| EV-08-05 | [sis13-08-sc-iss-003-after-focus-1440.png](../evidence/ux/sis13-08-sc-iss-003-after-focus-1440.png) | Desktop focus on the new welcome link | After · 1440 × 1000 | Pair with EV-08-03 for the visible control change |
| EV-08-06 | [sis13-08-sc-iss-003-after-focus-375.png](../evidence/ux/sis13-08-sc-iss-003-after-focus-375.png) | Mobile focus on the new welcome link | After · 375 × 812 | Pair with EV-08-04 for mobile keyboard evidence |
| EV-08-07 | [sis13-08-sc-iss-003-after-dashboard-1440.png](../evidence/ux/sis13-08-sc-iss-003-after-dashboard-1440.png) | Desktop dashboard after Enter, with focused panel and all six records | After · 1440 × 1000 | Pair with EV-08-01 for the desktop journey result |
| EV-08-08 | [sis13-08-sc-iss-003-after-dashboard-375.png](../evidence/ux/sis13-08-sc-iss-003-after-dashboard-375.png) | Mobile dashboard after Enter, with focused panel and records continuing below the fold | After · 375 × 812 | Pair with EV-08-02 for the mobile journey result |

**Suggested result caption:** “Failed deadline journeys fell from 2/2 to 0/2 on the same fictional dataset. After the change, keyboard activation opened Course deadlines directly on desktop and mobile.” Use the [capture protocol](../evidence/ux/UX_CAPTURE_PROTOCOL.md) for sample limits. The PM approved the observed result on 24 November, after measurement.
