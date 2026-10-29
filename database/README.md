# Database workstream — Gleb (SIS89-02 / SIS89-03)

Implement three SQLite tables: courses, deadlines, documents. Seed **fictional** (not real student) sample information: >=3 courses, >=6 deadlines, >=6 excerpts. Place schema DDL in schema.sql and a reproducible loader in seed.py; create the local SQLite DB during setup, and keep the generated `.db` out of Git.

Then expose source-aware retrieval in backend/app/retrieval.py and GET /api/deadlines per docs/API_CONTRACT.md. Commit to feature/sis89-data. Do not add live Microsoft Teams credentials or data.
