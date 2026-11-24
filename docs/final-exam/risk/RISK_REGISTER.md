# Risk register

| Risk | Likelihood | Impact | Trigger | Owner | Response | Status |
|---|---|---|---|---|---|---|
| Hosted credentials unavailable | high | high | No isolated environment | Yerassyl | Use disposable local proof and hold hosted writes | open |
| Quota exhaustion | medium | high | Amount reaches limit | Gleb | Stop real writes and preserve unknown status | open |
| Cross-owner data access | low | critical | Denial fixture fails | Gleb | Disable affected feature | open |
| No provider receipt | medium | medium | Billing unavailable | Gleb | Mark spend unknown; no estimate | open |
