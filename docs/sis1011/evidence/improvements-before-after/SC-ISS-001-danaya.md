# SC-ISS-001 dashboard date grouping

[SIS1011-06](https://app.clickup.com/t/z8q7hbuc7r) · [P1 issue and acceptance criteria](https://github.com/yerassyl-clou/SmartCampus/pull/7) · [baseline UX PR](https://github.com/yerassyl-clou/SmartCampus/pull/17)

The identical fictional seed returned six records in both runs. Chromium used a fixed clock of 10 November 2026 at noon in Asia/Almaty and FastAPI served real GET /api/deadlines requests from local SQLite.

| Before on main 42dcac9 | After on the fix |
|---|---|
| All six records appeared under Upcoming deadlines. Nov 6 and Nov 9 were expired. | Nov 11, 13, 20 and 27 appear under Upcoming deadlines. Nov 6 and 9 appear under Past deadlines. |
| [1440 px baseline](SC-ISS-001-danaya-before.png) | [1440 px](dashboard-1440.png) · [768 px](dashboard-768.png) · [375 px](dashboard-375.png) |

The UI compares validated date-only values with the Asia/Almaty calendar day. A record due today remains upcoming. Each group sorts earliest first and keeps the original course, date, and source label. All-past datasets keep their records visible. The API, seed, stale data warning, loading and retry behavior are unchanged. Grouping is recalculated on render, including after Refresh.

| Check | Actual outcome |
|---|---|
| `npm run build` | Exit 0, 33 modules transformed. |
| `npm test -- --project=chat --project=deadlines` | Exit 0, 55 passed, including yesterday/today/tomorrow with a Los Angeles browser and an all-past fixture. Chat and dashboard suites intercept HTTP. |
| Browser probe with `DASHBOARD_FIXED=1 DASHBOARD_URL=http://127.0.0.1:5186 DASHBOARD_EVIDENCE=../docs/sis1011/evidence/improvements-before-after node ../docs/sis1011/evidence/improvements-before-after/dashboard-probe.mjs` | Exit 0. Same six source-labeled records and correct groups at 1440/768/375 px, no horizontal overflow, and Tab/Enter refresh returned 200 at every width. [Replay log](danaya-dashboard-replay.log). |

The optional live Groq integration suite was outside this local run. Existing chat behavior was checked with the 33 intercepted browser tests. SIS1011-08 can replay the before/after pair after integration.
