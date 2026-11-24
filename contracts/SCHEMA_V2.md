# SCHEMA_V2

Version: v2.0.0

## Ownership

All mutable rows carry `owner_key`. Normal actors may read and write only rows where `owner_key = auth.uid()`. The service role is not granted a blanket table API; user reads stay under RLS.

## Tables

- `auth_profiles`, `courses`, `documents`, `document_chunks`
- `deadlines`, `threads`, `messages`

## Constraints

- UUID primary keys and foreign keys.
- Logical deletion uses `deleted_at`.
- Course enrollment is represented by owned course/document relationships.
- Document count cap: 10.
- Course count cap: 5.

## Repository errors

- `cross_owner_denied`
- `verified_consent_required`
- `document_cap_reached`
- `course_cap_reached`
