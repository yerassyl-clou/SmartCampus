# Artifact schemas



| Path under docs/final-exam | Writer and required fields |
| ---| --- |
| tasks/FINAL-XX.md | Each writer. task ID, owner, scope/rubric/stories, actual start/delivery, baseline/head/merge separately, changed files and rationale, exact commands/observed results, evidence links, assumptions/open risks, mode/date classifications, actual vs planned minutes, English slide synopsis and recommended visuals. |
| handoffs/FINAL-XX.md | Each producer. handoff ID, from/to, state preliminary/ready/accepted/blocked, contract version, path/PR/checksum, actual occurred\_at ISO, deadline, next operation, limitations, assumed prerequisite and recovery. Verify accepted head from ledger. |
| activity/FINAL-XX.csv | Each writer. local\_date, stable\_id, owner, started\_at/end, planned\_minutes, hands\_on\_minutes\_or\_null, effort\_type, from\_status, to\_status, blocker, source. Count actual owner work separately from AI/wait/peer review. |
| contributions/FINAL-XX.json | Each person per owned task. ID, role, work items/proof, estimated and actual or unknown minutes, method, date, AI tools + purpose, English slide/speaker notes, approved visuals, independently confirmed\_by/at. 21 collects one owner file plus peer addendum. May not infer contribution shares from raw commits. |
| evidence/FINAL-XX/ | Actual photos/screens/logs with ID EV-FINAL-XX-NN, date, dataset and environment, case/expected/observed, exact revision, device/viewport, privacy/classification, rights/view access limitations. Do not push private real records. Use controlled pointer. |
| contracts/ | R04 API, G03/07/09 schema/ingest/data ops, frozen version. Request field changes only with CR. Fixtures and examples published before consumers need. |
| design/, quality/, product/, monitoring/, finance/, requirements/, risk/, pilot/, presentation/, submission/ | See exact writers in descriptions. Y single status/release/final-binary writer; D single frontend/UX writer; G single schema/forecast/metrics-query/actuals writer; R single API/CI/QA/debt and recording owner. Cross-owner edits require agreed small handoff. |

All owners provide actual activity/cost artifact or unknown and independent contribution receipts by Dec2 10:30 before 19 closing; append accepted later work in 21 addendum. Interim spending report by Nov29 12:00 to G15. Each producer writes the English content and evidence before RfR, including example “what changed, why, proof and boundaries”. Aggregator collects accepted artifacts, never invents their inputs. Instructor access is tested from permitted viewer. No secrets anywhere in Git, ClickUp, screenshots or logs. Private file samples synthetic/permissioned controlled.
