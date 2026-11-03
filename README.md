# SmartCampus — SIS 8–9 Sprint

AI-assisted course information prototype. Sprint: **30 Oct–4 Nov 2026**. The integrated MVP uses fictional course data; no real university systems or student accounts are connected.

## Tech stack
- React + Vite frontend (Node.js 20+)
- FastAPI backend (Python 3.11+)
- SQLite for fictional sample course data
- Groq LLM API through the OpenAI-compatible SDK (server-side only)

## Quick start (two terminals)

First, from the repository root:
```bash
python3 database/seed.py
```
Expected: `courses=3, deadlines=6, documents=6`. Seeding resets fictional sample rows; use `--db <temporary-path>` for experiments.

Backend:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
cp -n ../.env.example .env  # preserve an existing file
# Windows PowerShell: Copy-Item ../.env.example .env
# Edit .env with your Groq key in OPENAI_API_KEY before starting chat.
uvicorn app.main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm ci
npm run dev
```

Visit http://localhost:5173 (API http://localhost:8000/docs). Frontend forwards `/api` to port 8000.

Health, deadlines, and grounded chat endpoints are implemented. Course questions require a local Groq key when evidence is found. General deadline listings and missing-information fallbacks do not call the LLM. See [chat setup](docs/AI_CHAT.md) and the [SIS89-08 QA report](docs/SIS89_08_QA_REPORT.md) for verified results and remaining review steps.

## Local LLM setup
Place `OPENAI_API_KEY=...` in **backend/.env** only. Set `OPENAI_MODEL=openai/gpt-oss-120b` and `OPENAI_BASE_URL=https://api.groq.com/openai/v1` there. The app reads `OPENAI_API_KEY`, not `GROQ_API_KEY`. Do not paste credentials into a task, commit, browser code or screenshots. All actual LLM calls must run on the backend. Chat calls the OpenAI SDK on the backend. Seed the mock database before testing; see docs/AI_CHAT.md.

## Branches and workstream owners
- `main`: integrated, reviewed code only
- `feature/sis89-data`: Gleb — SQLite schema, seed, retrieval, deadlines endpoint
- `feature/sis89-frontend`: Danaya — React chat + deadlines panel
- `feature/sis89-ai`: Ratislav — POST /api/chat, LLM adapter, grounding and fallback
- `feature/sis89-qa`: Yerassyl — integration tests, reporting and review

## Team workflow
1. Clone: `git clone https://github.com/yerassyl-clou/SmartCampus.git`.
2. `git fetch origin && git switch feature/sis89-<your-stream>`.
3. `git pull --ff-only origin <branch>`, edit only your workstream files, run checks, commit: `git add <paths> && git commit -m "SIS89-XX: specific implementation change"`.
4. `git push -u origin <branch>`. Open a PR **toward main** and mention the corresponding ClickUp task URL, acceptance criteria and screenshots/test command.
5. Resolve review comments and merge only after working tests and cross-team checks. Avoid force-pushing shared branches.
6. Each day (30 Oct, 2 Nov, 3 Nov, 4 Nov) post a truthful completed/in-progress/blocked summary in ClickUp. The final burndown must use real accepted task statuses.

## Automated checks

From the repository root, using the backend virtual environment:
```bash
backend/.venv/bin/python -m pytest backend/tests -q
cd frontend
npm ci
npm run build
npx playwright install chromium
npm test
```
On Windows use `backend\.venv\Scripts\python.exe` instead of `backend/.venv/bin/python` (and `python` for `python3` in setup). Pytest uses isolated temporary databases and a mocked provider; it never uses your key. `npm test` runs Chromium with intercepted API fixtures; it does not verify Groq. The explicitly enabled live browser command is in [the QA report](docs/SIS89_08_QA_REPORT.md).

`SMARTCAMPUS_DB_PATH` relative paths resolve from `backend/`, regardless of the shell working directory. Missing or uninitialized databases return a safe 503; health remains a process-liveness check. "Upcoming" chat listings use the current Asia/Almaty date inclusively and print that reference date. The dashboard displays all stored sample deadlines.

## Ownership & boundaries
Existing ClickUp work from SIS 6–7 provides planning context. This Sprint implements a new code increment; its tasks must not be marked Done simply because older prototype tasks have a similar name. Microsoft Teams credentials, live access and student personal data remain out of scope.

See [API contract](docs/API_CONTRACT.md), [development guide](docs/DEVELOPMENT.md), [test plan](docs/TEST_PLAN.md), and [review template](docs/SPRINT_REVIEW.md).
