# SIS13-08 UX capture protocol

**Status:** Baseline and candidate originals verified. The formal action decision is pending.

## Baseline environment

- App SHA `6645b5ef95e2cb4d00aa4bb6756705ac84475654` from `origin/main`. Real local Vite, FastAPI and SQLite using the committed fictional seed. Seed database SHA-256 `2860e68c40ac242cb247b15e8d502b268348ae0336ff14695283a2da038a8763`.
- Chromium 156.0.8078.4 via Playwright 1.64.1, desktop 1440 × 1000 and mobile 375 × 812, Asia/Almaty, browser clock fixed to 23 November 2026 at 08:00. Capture time 23 November 2026 at 08:40:25 Asia/Almaty. Local provider credentials were empty.
- Launch and replay instructions, exact command and observed tests are in the [SIS13-07 baseline record](https://github.com/yerassyl-clou/SmartCampus/blob/codex/sis13-07-ux-implementation/docs/SIS13/evidence/ux/UX_IMPLEMENTATION.md). The replay activates the original deadline suggestion and submits the prefilled question against the same seeded API.

## Focused observations

| Check | Desktop and mobile result |
| --- | --- |
| Keyboard and semantics | The accessible button name contains the visible question on both widths. Eight Tab presses reached it from a fresh page in these runs. Enter filled and focused the textbox, and a second Enter submitted. |
| Focus visibility | Both viewports showed a solid 3 px outline, computed as `rgb(128, 102, 214)`. The original focus captures record the indicator and nearby content. |
| Fallback and text | The browser exposed visible warning text, with foreground `rgb(127, 99, 55)` and opaque background `rgb(252, 251, 254)` from computed CSS (5.44:1 for this text/background pair). The keyboard interaction reproduced the fallback in both runs. |
| Responsive layout | Asserted no page-level horizontal overflow at either tested width. The full-page captures include the dashboard down the page. |
| Capture integrity | Four unedited PNGs decoded successfully and are indexed with their original dimensions. |

This is a scenario-level Chromium check. Assistive technology behavior, full-page contrast coverage and other browsers remain unverified.

## Matched after capture procedure

1. Record the scenario and implementation SHA from SIS13-07. Attach the action ID once approved.
2. Seed from the same source and use the same app clock, viewport, browser and input intent. Keep local requests provider-free. Replay using the regression or capture command appropriate to the approved after interaction.
3. Verify keyboard activation, visible focus, intended data or navigation outcome, warning discoverability for an unsupported question and no page-level horizontal overflow. Compare the agreed metric over the same denominator.
4. Save unmodified after originals and add their commit, fixture, commands, timestamp and observed result to the [asset index](../../presentation/UX_ASSET_INDEX.md). Use separate presentation crops if needed and keep the original PNGs.

## Observed after run

- App SHA `748f6951a870ee0c7bb4a29179bd54e754d25cb2`, captured 23 November 2026 at 11:05:14 Asia/Almaty. Same fictional database hash, browser version, browser clock and viewport dimensions as the baseline.
- From the clean implementation checkout with FastAPI and Vite running, execute `SIS13_CAPTURE_DIR=/absolute/output node docs/SIS13/evidence/ux/check-deadline-shortcut.mjs`. The script captures Tab focus on the new link and the focused panel immediately after Enter. Then it sends a separate unsupported question to verify the safe fallback remains visible.
- Both after runs loaded six records, showed a 3 px solid focus outline on both the initial link and the destination, and made zero chat POSTs during navigation. The page had no horizontal overflow. Mobile content below the fold remains scrollable.
- Failed journeys: desktop 1/1 → 0/1, mobile 1/1 → 0/1, total 2/2 → 0/2. All eight indexed originals decoded. The original four baseline files are preserved. These are two Chromium cases, with no screen-reader or cross-browser claim.
