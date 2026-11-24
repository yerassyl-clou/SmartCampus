# SIS13 Five Whys

Yerassyl Babayev / Codex, 24 November 2026. Supporting records are linked in the [ranked backlog](INSIGHT_BACKLOG.md). Where evidence ends, the final question records a hypothesis for owner confirmation.

## I-01 · Deadline discovery

1. Why did both tested journeys fail? The welcome prompt led to the ungrounded fallback with zero sources.
2. Why did the fallback occur with six records visible to the dashboard? The built-in phrase did not match the supported deadline query, although “Show deadlines” returned six sources on the same seed.
3. Why did a navigation question use that grammar? The welcome control was a chat starter that populated the composer.
4. Why did the control depend on chat? The panel's native fragment navigation existed in the sidebar but the welcome control lacked that link.
5. Why was the mismatch still present? SC-ISS-003 was documented and explicitly deferred in PB-104. The reason for the original wording is unverified.

## I-02 · PR verification

1. Why was automatic pre-merge verification unavailable? No workflow was configured on the representative baseline.
2. Why did the earlier checks still succeed? E-04 records manually triggered local runs against the release revision.
3. Why were successful local runs insufficient for per-PR execution? The local commands generated evidence for the locally checked revision without a GitHub PR trigger.
4. Why could the existing offline guard not fill that gap? E-11 adds a rule inside pytest, which takes effect when pytest executes.
5. Why was there no hosted trigger after SIS12? SIS12 delivered the offline guard and documented infrastructure limits. Whether the team explicitly deferred CI remains unverified.

## I-03 · Board acceptance traceability

1. Why could a board reader not verify final UX asset acceptance from the pilot task? Its existing comments covered preparation and baseline capture.
2. Why did a comment with a commit still fail the acceptance check? The cited commit concerned prior workflow availability, and the review decision was pending.
3. Why did the decision remain pending in that snapshot? The comment records dependency on the approved SIS13-07 scope and implementation SHA.
4. Why did later GitHub evidence not automatically settle the board record? The before snapshot shows a manual board handoff and no later acceptance comment.
5. Why can this happen even when technical work is ready? E-05 documents a connector-quota interruption in an earlier release. Recurrence on this pilot is unverified. Publish the dated decision with a pinned GitHub record.

## I-04 · Effort visibility

1. Why could the audit not calculate actual hours from the sample? Zero of 20 tasks had positive tracked time.
2. Why could planned values not supply the missing actuals? The recorded estimates represent planned effort.
3. Why did reallocation alone leave the variance unknown? E-07 documents task transfers and estimated minutes without start and end records.
4. Why was a logging protocol introduced? E-08 documents the observed tracking gap and prescribes consistent start/end and variance checks.
5. Why did historical entries remain absent? Adoption, prior defaults and any manual records outside the sample remain hypotheses.

## I-05 · Provider usage visibility

1. Why could the audit not report account-specific spend? It lacked usage and billing evidence.
2. Why did example configuration not fill that gap? It describes project settings and illustrative prices.
3. Why could the team still report some infrastructure data? The local fictional SQLite fixture was directly measurable.
4. Why did local observations not establish account quotas? Provider limits and usage depend on the linked account.
5. Why were provider records unavailable? The audit requests owner verification. Whether access, collection timing or another factor prevented capture remains unverified.
