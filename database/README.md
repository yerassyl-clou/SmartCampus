# Database workstream — Gleb (SIS89-02 / SIS89-03)

TASK:
Implement three SQLite tables: courses, deadlines, documents. Seed **fictional** (not real student) sample information: >=3 courses, >=6 deadlines, >=6 excerpts. Place schema DDL in schema.sql and a reproducible loader in seed.py; create the local SQLite DB during setup, and keep the generated `.db` out of Git.

Then expose source-aware retrieval in backend/app/retrieval.py and GET /api/deadlines per docs/API_CONTRACT.md. Commit to feature/sis89-data. Do not add live Microsoft Teams credentials or data.



DONE
This directory contains the SQLite schema and fictional course data used by the
SmartCampus backend. The generated database is local-only and is ignored by Git.

## Seed the local database

From the repository root, run:

```bash
python database/seed.py
```

The command is repeatable: it recreates the rows from
`database/mock_data/courses.json` and writes `database/smartcampus.db`.
Use an alternate path when needed:

```bash
python database/seed.py --db /tmp/smartcampus.db
```

The seed command prints a count summary. To manually verify the expected rows:

```bash
sqlite3 database/smartcampus.db \
  'SELECT (SELECT COUNT(*) FROM courses) AS courses,
          (SELECT COUNT(*) FROM deadlines) AS deadlines,
          (SELECT COUNT(*) FROM documents) AS documents;'
```

Expected output is `3|6|6`.



GUIDE TO TEST
# SmartCampus Setup and Testing Guide

This guide covers the complete local setup and verification of the SIS89-02
SQLite database work and the SIS89-03 retrieval/deadlines API.

## 1. Open the project

```bash
cd "/Users/gleb/KBTU/KBTU 7 sem/it project management/SmartCampus"
```

Check the Python version:

```bash
python3 --version
```

The project targets Python 3.11+, although the implemented database and API
code is also compatible with Python 3.9.

## 2. Create and activate a virtual environment

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

Verify that the virtual environment is active:

```bash
which python
```

The path should contain:

```text
SmartCampus/backend/.venv/bin/python
```

## 3. Create and seed the SQLite database

From the repository root:

```bash
python database/seed.py
```

If `python` is not available, use:

```bash
python3 database/seed.py
```

Expected output:

```text
Seeded .../database/smartcampus.db: courses=3, deadlines=6, documents=6
```

The generated database is:

```text
database/smartcampus.db
```

SQLite is a local file database; no separate database server is required.

The schema is in [database/schema.sql](../database/schema.sql), and the
fictional records are in
[database/mock_data/courses.json](../database/mock_data/courses.json).

The seed command is repeatable. It recreates the rows from the mock data file
and can safely be run again.

## 4. Verify database row counts

If the SQLite CLI is installed:

```bash
sqlite3 database/smartcampus.db \
  'SELECT
     (SELECT COUNT(*) FROM courses) AS courses,
     (SELECT COUNT(*) FROM deadlines) AS deadlines,
     (SELECT COUNT(*) FROM documents) AS documents;'
```

Expected output:

```text
3|6|6
```

Inspect the deadlines:

```bash
sqlite3 database/smartcampus.db \
  'SELECT id, course_id, title, due_date, source_title
   FROM deadlines
   ORDER BY due_date;'
```

Expected dates, in order:

```text
2026-11-06
2026-11-09
2026-11-11
2026-11-13
2026-11-20
2026-11-27
```

## 5. Start the backend

In the first terminal, with the virtual environment active:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The backend runs at:

```text
http://localhost:8000
```

## 6. Check the health endpoint

In a second terminal:

```bash
curl http://localhost:8000/api/health
```

Expected response:

```json
{"status":"ok","app":"SmartCampus"}
```

## 7. Check all deadlines

```bash
curl http://localhost:8000/api/deadlines
```

The response must contain six items and use the following shape:

```json
{
  "items": [
    {
      "id": 1,
      "course_id": 1,
      "course_name": "Database Systems",
      "title": "Assignment 2",
      "due_date": "2026-11-06",
      "source_title": "Mock Database Systems syllabus"
    }
  ],
  "total": 6
}
```

The items must be sorted by `due_date` in ascending order.

## 8. Check the optional course filter

For course 1:

```bash
curl "http://localhost:8000/api/deadlines?course_id=1"
```

Expected result:

```json
{
  "items": [
    {
      "id": 1,
      "course_id": 1,
      "course_name": "Database Systems",
      "title": "Assignment 2",
      "due_date": "2026-11-06",
      "source_title": "Mock Database Systems syllabus"
    },
    {
      "id": 2,
      "course_id": 1,
      "course_name": "Database Systems",
      "title": "Midterm project proposal",
      "due_date": "2026-11-13",
      "source_title": "Mock Database Systems syllabus"
    }
  ],
  "total": 2
}
```

For an unknown course:

```bash
curl "http://localhost:8000/api/deadlines?course_id=999"
```

Expected response:

```json
{"items":[],"total":0}
```

## 9. Check Swagger/OpenAPI

Open the following URL in a browser:

```text
http://localhost:8000/docs
```

The documentation should list:

- `GET /api/health`
- `GET /api/deadlines`
- `POST /api/chat`

Use **Try it out** for `GET /api/deadlines`, with and without `course_id`.
The endpoint schema follows
[docs/API_CONTRACT.md](API_CONTRACT.md).

## 10. Check deterministic retrieval directly

The retrieval interface is implemented in
[backend/app/retrieval.py](../backend/app/retrieval.py).

From the repository root:

```bash
PYTHONPATH=backend python3 - <<'PY'
from app.retrieval import search_course_materials

result = search_course_materials("Assignment 2", course_id=1)
print(result)
PY
```

Expected result:

```python
[
    {
        "id": 1,
        "title": "Mock Database Systems syllabus",
        "excerpt": (
            "Assignment 2 deadline: 2026-11-06. "
            "Submit a normalized schema and query plan."
        ),
    }
]
```

Test other relevant searches:

```bash
PYTHONPATH=backend python3 - <<'PY'
from app.retrieval import search_course_materials

for query in ("risk register", "usability test plan", "prototype critique"):
    print(query, search_course_materials(query))
PY
```

Test an unknown search:

```bash
PYTHONPATH=backend python3 - <<'PY'
from app.retrieval import search_course_materials

result = search_course_materials("unknown information xyz")
assert result == []
print("Unknown query returns:", result)
PY
```

## 11. Check the SQLite connection helper

The connection and parameterized query helpers are in
[backend/app/db.py](../backend/app/db.py).

```bash
PYTHONPATH=backend python3 - <<'PY'
from app.db import fetch_all, fetch_one

course_count = fetch_one("SELECT COUNT(*) AS count FROM courses")
print("Courses:", course_count["count"])

deadlines = fetch_all(
    """
    SELECT title, due_date
    FROM deadlines
    WHERE course_id = ?
    ORDER BY due_date
    """,
    (1,),
)

for deadline in deadlines:
    print(dict(deadline))
PY
```

Expected output includes:

```text
Courses: 3
{'title': 'Assignment 2', 'due_date': '2026-11-06'}
{'title': 'Midterm project proposal', 'due_date': '2026-11-13'}
```

## 12. Run automated tests

From the repository root, with the virtual environment active:

```bash
PYTHONPATH=backend pytest -q
```

Expected result:

```text
3 passed
```

## 13. Start the frontend (optional)

In a third terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend requires the backend to be running because Vite proxies API
requests to `http://localhost:8000`.

## Current scope

Implemented:

- SQLite schema and fictional seed data.
- Three courses, six deadlines, and six documents.
- Repeatable database seeding.
- SQLite connection and parameterized query helpers.
- Deterministic document/deadline retrieval.
- `GET /api/deadlines` with optional course filtering.
- Sorted deadline responses and empty-result handling.
- Structured retrieval source objects.
- OpenAPI documentation for the deadlines endpoint.

Not implemented in these tasks:

- `POST /api/chat` still returns `501 Not Implemented`.
- The chat/LLM workflow belongs to the AI workstream and can use
  `search_course_materials()` as its grounded retrieval interface.
