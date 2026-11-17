# SIS12-04: Provider test resource guardrail

Evidence date: 2026-11-17 (Asia/Almaty). Owner: Ratislav. Task: https://app.clickup.com/t/z8q7hbw371. Related audit: https://app.clickup.com/t/z8q7hbw36w.

## Routing and evidence

At main commit `926ef53230a5a35c415b7219d811480747e2ebba`, backend pytest uses isolated SQLite, dummy credentials and an invalid provider URL. Provider calls in the existing chat tests are mocked. This reduces risk but does not prevent a future test from connecting elsewhere. Standard Playwright uses browser route fixtures; the separate integration configuration requires `SMARTCAMPUS_LIVE_TESTS=1`, one worker and no retries. It runs a live backend and can consume provider quota. See `frontend/playwright.integration.config.js` and `frontend/README.md`. The 126 backend / 70 standard browser / 9 live browser results in the SIS10–11 report are historical (10 November), not today's browser results.

| problem | change implemented | board action | before evidence | after evidence | actual vs planned | source |
|---|---|---|---|---|---|---|
| A backend test could accidentally open an external TCP socket despite dummy provider settings | Autouse pytest socket connect guard rejects non-loopback IPs and hostnames; a regression test verifies rejection | Submit SIS12-04 for review | Current fixture sets an invalid URL but has no socket guard; 126 tests passed | 127 tests passed, including the new rejection test | Actual: the attempted test connection was rejected before connect; account-wide call savings unknown. Future quota savings are planned, not measured | `backend/tests/conftest.py`, `backend/tests/test_network_guard.py` |

This is a Python socket-connect guard, not a system firewall: loopback and Unix sockets are allowed, and subprocesses, other networking mechanisms and DNS resolution are outside its scope. It does not instrument total provider traffic. No live provider request was intentionally made; account usage is unavailable. It does not change application behavior.

## Commands and results

macOS, Python 3.13, isolated virtual environment with current dependency versions from `backend/requirements.txt` and pytest. No real key was configured for the test run. Before: `../venv/bin/python -m pytest backend/tests -q` — 126 passed, one Starlette deprecation warning, 4.64 s. After same command — 127 passed, one warning, 4.64 s. Both were run on 17 November 2026; the first run preceded the change. Full browser suites were not run in this environment. Timing is incidental, not a resource saving claim.

Run from repository root with an installed Python environment: `python -m pytest backend/tests -q`. If this fails because a test legitimately needs external access, retain the guard for regression and investigate the test instead of adding credentials. Live browser integration is a separate explicit opt-in documented in `frontend/README.md`; obtain account owner's approval and inspect remaining quota first. Proposed manual ceiling: at most one explicitly selected smoke test per session (planned, not enforced; a test may make multiple requests). Stop on 429 or other provider errors; do not retry automatically. Record actual usage from the provider console if authorized, without secrets. Limits and spend remain unknown pending the related audit and account-owner confirmation.

## PM handoff

Implemented: deterministic backend socket-connect rejection in the regression process, with a passing test. Not measured: historical or account-wide provider calls, tokens, spend and savings. The proposed live smoke ceiling is procedural and not an enforced request budget. Browser and live-provider verification remain outstanding. Review this PR and the companion Groq audit before incorporating figures into the Resource Optimization Plan.
