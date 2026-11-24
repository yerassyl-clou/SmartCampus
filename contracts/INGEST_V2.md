# INGEST_V2

Version: v2.0.0

## Upload

- Direct private TUS-style upload to Storage.
- Vercel receives metadata only, never the 10 MB body.
- Object path must begin with the authenticated owner UUID.
- Maximum byte count: 10,485,760.
- Reservation lease: 30 minutes.

## Terminal reasons

`ready`, `corrupted`, `encrypted`, `scanned`, `overlimit`, `unsupported`, `duplicate`, `expired_lease`.

## Locator contract

PDF: `pdf:page:N`.
DOCX: `docx:section:N`.
