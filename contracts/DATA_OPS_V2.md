# DATA_OPS_V2

Version: v2.0.0

## Signatures

- `reserve_ai(owner_key, partition, window, reservation_key, amount)`
- `read_context(owner_key, source_ids)`
- `append_event(owner_key, event)`
- `summarize(owner_key, source_ids)`
- `claim_cleanup(owner_key, document_id)`
- `complete_cleanup(owner_key, document_id)`
- `signup_hook(owner_key)`

## Quota rules

Reservations are idempotent by `(owner_key, reservation_key)`. Per-user and global limits are checked atomically. Negative and over-limit values are denied.

## Search

Search and source snippets must match `owner_key`. Locators remain exact chunk/page/section references.

## Deletion

Claim, remove permitted Storage object, reconcile rows, then complete cleanup. Stale and cross-owner jobs are denied.
