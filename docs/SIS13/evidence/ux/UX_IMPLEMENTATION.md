# SIS13-07 UX investigation

**Status:** Baseline verified. Product implementation awaits an approved action in SIS13-03 and its ranked SIS13-10 insight.

## SC-ISS-003 baseline

The [SIS 10–11 issue log](https://github.com/yerassyl-clou/SmartCampus/blob/6645b5ef95e2cb4d00aa4bb6756705ac84475654/docs/sis1011/ISSUE_LOG.md#sc-iss-003--built-in-deadline-suggestion-returns-a-fallback) deferred the built-in deadline suggestion. On 23 November 2026 (Asia/Almaty), the same interaction reproduced against `origin/main` at `6645b5ef95e2cb4d00aa4bb6756705ac84475654`, which includes the SIS 12 provider audit and offline guard.

1. Open the Academic assistant with the fictional SQLite seed.
2. Tab to the suggestion “Where can I find information about course deadlines?” Desktop also displays “Find the right information.”
3. Press Enter to prefill and focus the question input. Press Enter again to submit.
4. Observe the source-grounded assistant's fallback warning and the six existing records in Course deadlines.

The expected journey surfaces the available deadlines or sends the student directly to them. Actual `POST /api/chat` returned HTTP 200 with `grounded=false` and zero sources in both desktop (1440 × 1000) and mobile (375 × 812) runs. The separate deadlines API returned six records (one upcoming and five past in this capture). The shortcut's wording falls outside the application's deterministic deadline-listing grammar. The fallback is valid for missing evidence. The UX gap is that a built-in prompt reaches that fallback while the dashboard already has relevant data.

| Metric candidate | Observed baseline | Target | Actual after |
| --- | --- | --- | --- |
| Shortcut attempts ending in a fallback while the deadline dashboard has records | 2/2 (100%). One run at each viewport, same fixture and browser. | Pending SIS13-03 approval. | Pending implementation. |

The sample measures the tested path under two viewport configurations. An approved action can use the same denominator and record whether each activation surfaced data or reached the deadline view without a fallback. The historical SIS 10–11 report and source register provide context. Confirmed E/I/A linkage remains pending [SIS13-10](https://app.clickup.com/t/z8q7hbx7w5) and [SIS13-03](https://app.clickup.com/t/z8q7hbx7vx). [Draft action plan](https://github.com/yerassyl-clou/SmartCampus/pull/34)

## Replay and local verification

React 18 and Vite render the chat, feedback and deadline components. The browser used normal mode and called the actual FastAPI/SQLite application through Vite's proxy. Keep credentials empty to avoid remote provider requests. Use the same pinned revision, seeded dataset, browser time and viewports when collecting the after evidence.

1. From the repository root, install `backend/requirements.txt` in a Python environment and run `python database/seed.py --db /absolute/path/to/sis13-fixture.db`.
2. Start FastAPI with `OPENAI_API_KEY= OPENAI_MODEL= SMARTCAMPUS_DB_PATH=/absolute/path/to/sis13-fixture.db python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000`.
3. From `frontend/`, run `npm ci`, `npx playwright install chromium`, and `VITE_USE_MOCK_CHAT=false npm run dev -- --host 127.0.0.1 --port 5193 --strictPort`.
4. From the root, run `node docs/SIS13/evidence/ux/capture-sc-iss-003.mjs /absolute/path/to/captures`. The replay sets the browser clock to 23 November 2026 at 08:00 Asia/Almaty and reports API/UI state and keyboard checks.

| Command | Result |
| --- | --- |
| `npm ci` / `npx playwright install chromium` | Passed. Node 22.14.0, npm 10.9.2, Playwright 1.64.1, Chromium 156.0.8078.4. |
| `npm run build` | Passed with Vite 5.4.21. |
| `npm test` | 70 passed in 19.9 s. Standard suite uses deterministic browser API fixtures where applicable. |
| `python -m pytest backend/tests -q` | 127 passed in 1.94 s, one Starlette deprecation warning. Python 3.12.1, FastAPI 0.165.0, Uvicorn 0.54.0. |
| `node docs/SIS13/evidence/ux/capture-sc-iss-003.mjs /absolute/path/to/captures` | Passed both baseline assertions against real local FastAPI/SQLite. Two reproductions, each with six dashboard records and zero chat sources. |

[Original captures and asset index](https://github.com/yerassyl-clou/SmartCampus/tree/codex/sis13-08-ux-evidence/docs/SIS13) are owned by SIS13-08. This checkpoint used fictional records and measured the local journey. Product changes and an after SHA are pending the approved scope.

## 23 November continuation: proposed acceptance check

The product trees under `frontend/`, `backend/` and `database/` match the re-fetched `origin/main` (`9dff9c289289eda7bb2402fb2ef2075f1b7d6571`). [SIS13-03's candidate measurement](https://github.com/yerassyl-clou/SmartCampus/blob/d0bf0bfef0ca8e1cd02917a87a00f1debcf0f216/docs/SIS13/improvement-plan/ACTION_PLAN.md#candidate-measurement-for-the-deadline-shortcut) records 2/2 baseline failures and proposes a 0/2 target conditional on approval.

The recommended change is to use the existing Course deadlines fragment as a direct welcome shortcut. The current sidebar link proves the panel can receive keyboard focus and expose the six seeded records without a chat POST. A second option is a supported question starter. The actual API returned `grounded=true` with six sources for “Show deadlines” on the same seed. A direct link better matches the existing question's “where” intent and uses the dashboard's refresh and error states.

Use the existing launch procedure, then run:

```sh
node docs/SIS13/evidence/ux/check-deadline-shortcut.mjs --reference
node docs/SIS13/evidence/ux/check-deadline-shortcut.mjs
```

The reference check passed on both 1440 × 1000 and 375 × 812. It verifies Tab/Enter activation, dashboard focus, visible heading, all six records, no chat POST during navigation and no page-level horizontal overflow. A subsequent unsupported chat question retained the fallback on both widths. Welcome mode failed on both widths as expected on the baseline, because the welcome shortcut is still a button. The reference results describe the existing sidebar and cannot serve as the implementation's after measurement. Run the welcome-mode check on the approved implementation revision before capturing the after evidence.

The repeated baseline build passed. `npm test` passed 70 tests and `python -m pytest backend/tests -q` passed 127 tests with one existing Starlette deprecation warning.
