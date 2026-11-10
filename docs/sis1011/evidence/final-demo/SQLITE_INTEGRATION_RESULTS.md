# SQLite integration results

**PASS · 10 November 2026 · SmartCampus SIS 10–11**

## Reproduction and resolution

The combined heads of [PR #16](https://github.com/yerassyl-clou/SmartCampus/pull/16) and [PR #20](https://github.com/yerassyl-clou/SmartCampus/pull/20) reached **91 passed and 35 setup errors** across the full integrated backend suite. The failing cases raised `sqlite3.OperationalError: table feedback already exists`. The autouse database fixture had already executed `database/schema.sql` through the seed loader. The route fixture independently issued a second `CREATE TABLE feedback`.

The seed and production DDL own schema creation. The feedback route tests use the seeded, per-test SQLite file and the production store. Only the missing-module test replaces the import. The unavailable-storage tests switch the test DB path and restore it through pytest's monkeypatch teardown. The production store commits or rolls back and explicitly closes each SQLite connection. See [integration commit](https://github.com/yerassyl-clou/SmartCampus/commit/60d09fbddbd6ce336e88957d3571f0fad3ae30f0).

`python -m pytest backend/tests -q` then completed with **126 passed** and one dependency deprecation warning. [Executed log](pytest-regression.log).

## Fresh seed, upgrade and restart

| Check | Observed |
| --- | --- |
| Fresh fictional seed | Three courses, six deadlines and six documents. Production DDL also creates the feedback table. |
| Additive upgrade of a baseline DB | Apply `database/schema.sql` twice. Existing course, deadline and document rows remained identical. |
| Reseed of the fictional upgraded DB | Existing feedback row remained. The seed restored the fictional fixture records. |
| Live API restart | Two browser-created rows remained on the same SQLite file, including UUIDs, ratings, category, comment, signed sources and UTC timestamps. |
| Replay and malformed requests | Duplicate returned 409 and four invalid cases returned 422. Exactly the same two feedback rows remained. |
| Unavailable file | Browser received safe 503, retained its draft and saved once after the file was restored. |

[Upgrade and reseed log](sqlite-upgrade-reseed.log) · [Actual HTTP and SQL log](browser-feedback-http-sqlite.log)

Run the seed only for fictional fixture data. To upgrade an existing SmartCampus DB, apply the additive schema to that file with `sqlite3 "$SMARTCAMPUS_DB_PATH" < database/schema.sql`. The seed replaces existing course records, so use the schema-only command when those rows must be retained.
