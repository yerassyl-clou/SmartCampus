# SIS89-06 / SIS89-07: setup and testing

Chat searches SQLite, asks OpenAI to select relevant verbatim evidence, verifies
quotes and IDs, and returns answer/sources/grounded. No retrieval results means
the exact API contract fallback without a model call. Insufficient or conflicting
evidence is declined by the prompt. Invalid quotes or IDs also trigger fallback.
Answers are deliberately extractive to prevent invented facts in model prose.
Semantic relevance/conflict detection still needs live model QA: prompts alone
cannot guarantee correctness. Weak keyword matches may call the model to decline.

## Setup (macOS/Linux, from repository root)

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
python database/seed.py
cp .env.example backend/.env
```

Edit backend/.env locally with your team's OPENAI_API_KEY and OPENAI_MODEL
(team setting: openai/gpt-oss-120b via Groq). Never share keys
in chat, screenshots, commits, or frontend code. Start from backend/:
`../.venv/bin/uvicorn app.main:app --reload --port 8000`.
The example database path is relative to backend/, matching these instructions.
Open http://localhost:8000/docs and try POST /api/chat, or:

```sh
curl -sS http://localhost:8000/api/chat -H 'Content-Type: application/json' \
  -d '{"question":"When is Assignment 2 due?","course_id":1}'
```

This makes a real, potentially billable OpenAI call. Expected: grounded=true,
2026-11-06 in the answer, Mock Database Systems syllabus source id=1.
Record the actual response as live evidence. No live test was run in preparation.
Missing config, auth, timeout and rate-limit failures return safe 503 errors.

## Cases for Yerassyl

| Question | course_id | Expected |
|---|---|---|
| When is Assignment 2 due? | 1 | 2026-11-06; syllabus id 1; grounded=true |
| What is the rule for late database lab work? | 1 | Within three calendar days with explanation; rules id 2 |
| zzzzquux | 1 | Exact contract fallback; no sources; grounded=false; no AI call |
| What is the rector's phone number? | 1 | Fallback, no invented contact |
| When is the next assignment due? | 1 | Decline if reference date is unclear |
| Assignment 2 | 999 | Fallback; no AI call |

For conflict QA, use a temporary database and insert a second Assignment 2 record
with a different deadline; expect fallback. Run these semantic cases with the real
model, in addition to unit tests. Do not report mocked tests as live evidence.

From backend/: `../.venv/bin/python -m pytest -q`. Automated tests use temporary
seeded databases and simulated model output/errors. No paid calls occur.

## Submission

Branch feature/sis89-ai. Include SIS89-06 and SIS89-07 in commit and PR title.
Open PR toward main, include test results and actual live test evidence when
available. Add PR link and truthful evidence to both ClickUp tasks. Done requires
passing acceptance criteria and merged code. This preparation does not mark them Done.

## Team provider: Groq

Set OPENAI_BASE_URL=https://api.groq.com/openai/v1 and
OPENAI_MODEL=openai/gpt-oss-120b in backend/.env. OPENAI_API_KEY holds
the Groq key because this integration uses the compatible OpenAI SDK.
Do not send reasoning_effort=none: this model supports low/medium/high.
The integration omits that parameter and uses the provider default.
