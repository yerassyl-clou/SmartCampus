# FINAL-10 course, document and deadline QA

Baseline: accepted FINAL-06 merge `6c328b24f77e54f4e4efc0d520d1ce973510ac78`. Tested implementation commit `98d83b268c5d1c3b50a41cb36cfe79388073e156`, frontend tree `409849a2e5716a84dbbc59c77f2dc43adc667a16`. The delivery commit adds evidence and does not change the tested frontend tree.

| Workflow | Expected and observed in local Chromium |
| --- | --- |
| Course CRUD | Unicode create, whitespace rejection, rename after reload, cancel deletion with Escape, confirm deletion, focus fallback and empty document state. Scope stays on the selected course. |
| Upload boundaries | Reject unsupported type and 10,000,001 bytes. Process a 10,000,000-byte signature-only synthetic PDF in browser memory and a signature-only DOCX fixture. Report 6,291,456 bytes at interruption and resume in the same view. Reject duplicate bytes within the course. |
| Recovery and source | Cancel, retry, restart after simulated lease expiry, distinguish scanned and damaged signatures, confirm deletion, and open the curated original excerpt by keyboard. |
| Deadlines | Add, edit, complete, reopen and delete a date-only deadline. Verify 19:00 UTC changes the Almaty calendar day with the browser set to America/Los_Angeles. Confirm exact-date extraction explicitly, reject a relative candidate, and see provenance in the aggregate view. |
| Eligibility and presentation | Denied session hides the workspace. Unknown course ID returns the same unavailable view. Test EN/RU/KK × both themes × 375 and 1440 widths, mobile source drawer and return focus, and intercepted local session authorization. Existing synthetic-over-legacy regression remains in the full suite. |

## Mode, reproducibility and hold

From `frontend/` run `npm ci`, `npm run build`, `npx playwright test tests/v2-courses.spec.js`, and `npm test`. For fresh proof, pass an absolute directory in `FINAL10_CAPTURE_DIR` to the targeted run. Logs and [capture manifest](../evidence/FINAL-10/captures.json) are bundled together. The session HTTP request is fulfilled by Playwright and all foreign/API/Auth/Storage requests are blocked by the route guard in the local proof. App access still follows FINAL-06 server eligibility. Fixture mutations require a Vite development build, explicit enablement, same loopback origin and the browser fixture key. The guest replay stays read-only.

The transfer simulation reads file slices, validates a file signature and computes SHA-256. It has no TUS transport, backend parser, original-file storage or hosted authorization. Parser/lease outcomes are authored scenarios. Upload retry/resume retains offsets in the current view. Metadata and changes persist in tab-scoped, fixture-owner-keyed session storage. A reload discards unfinished bytes. The UI exposes the authored sample excerpt. Locally uploaded files have metadata only.

The published playbook uses 10,000,000 bytes. The unaccepted FINAL-07 packet in PR #43 uses 10,485,760 bytes. This fixture uses the playbook limit pending producer reconciliation. Authorized direct smoke remains unresolved. When FINAL-07/08 and the release owner supply the accepted environment and wire shape, verify the exact approved cap and cap+1, interruption/resume to the reserved private key, small finalize/retry bodies, duplicate/expiry and scoped source/deletion across two authorized synthetic accounts. Record actual network and storage proof before any hosted claim.

Browser fixtures cover the defined cases above. A manual screen-reader review, native linguistic review and hosted access verification remain open. `npm ci` reported two dependency advisories in the existing dependency set.
