# FINAL-03 task record

## Implementation

Added portable Supabase migrations for owned auth profiles, courses, documents, chunks, deadlines, threads and messages. RLS and least-privilege grants use `auth.uid()`.

## Tests

Run `python -m pytest backend/tests/test_v2_schema.py -q`.

## Limitations

Hosted Supabase/local credentials were not available. Migration execution and PostgREST actor matrix require a disposable approved environment.

## English slide summary

The schema provides tenant-isolated owned rows and synthetic local proof for cross-owner denial.

## Speaking notes

Explain that the service role is not used for normal reads and that logical deletion preserves session data.

## AI disclosure

Implementation and documentation were prepared with AI assistance and require human owner/reviewer acceptance.
