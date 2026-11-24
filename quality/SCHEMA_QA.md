# SCHEMA_QA

## Local proof

1. Validate migrations with a disposable Supabase project:
   `supabase db reset --local`
2. Run repository tests:
   `python -m pytest backend/tests/test_v2_schema.py -q`

## Role matrix

| Actor | Own row | Cross-owner row | Anon |
|---|---|---|---|
| authenticated owner | allow | deny | deny |
| admin | policy-reviewed ACL only | admin only | deny |
| anon | deny | deny | deny |

Hosted reset is prohibited. No live credentials are stored.
