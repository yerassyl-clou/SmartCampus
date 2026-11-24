# INGESTION_QA

Run `python -m pytest backend/tests/test_v2_ingestion.py -q`.

Approved staging checks:
- 10 MB direct upload lifecycle
- cross-owner path denial
- insufficient reservation
- duplicate and expired cleanup
- unsupported and corrupt fixture
- stale lease
- no large request through the Vercel API
