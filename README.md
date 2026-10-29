# SmartCampus — SIS 8–9 Sprint

AI-assisted course information prototype. Sprint: **30 Oct–4 Nov 2026**. The current repository contains a **starter scaffold**, not a completed product.

## Tech stack
- React + Vite frontend (Node.js 20+)
- FastAPI backend (Python 3.11+)
- SQLite for fictional sample course data
- OpenAI API (server-side only, optional until integration is implemented)

## Quick start (two terminals)

Backend:
```bash
cd backend
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
cp ../.env.example .env  # Windows: copy ..\\.env.example .env
uvicorn app.main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 (API http://localhost:8000/docs). Frontend forwards `/api` to port 8000.

The base app currently has only a **health endpoint**; chat and deadlines return **501 Not Implemented** until their owners add the features. This is intentional to avoid passing a placeholder off as a completed feature.

## Local LLM setup
Place `OPENAI_API_KEY=...` in **backend/.env** only. Configure `OPENAI_MODEL` there. Do not paste credentials into a task, commit, browser code or screenshots. All actual LLM calls must run on the backend. Backend dependencies include OpenAI SDK, but no model calls exist in the scaffold.

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

## Initial backend check
```bash
cd backend
pytest -q
```

## Ownership & boundaries
Existing ClickUp work from SIS 6–7 provides planning context. This Sprint implements a new code increment; its tasks must not be marked Done simply because older prototype tasks have a similar name. Microsoft Teams credentials, live access and student personal data remain out of scope.

See [API contract](docs/API_CONTRACT.md), [development guide](docs/DEVELOPMENT.md), [test plan](docs/TEST_PLAN.md), and [review template](docs/SPRINT_REVIEW.md).
