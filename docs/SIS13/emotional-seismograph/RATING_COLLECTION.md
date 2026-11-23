# SIS13-05 independent rating collection

**Status:** Four complete response vectors supplied and approved for coded publication, as confirmed by the submitting user on 23 November 2026 (Asia/Almaty).

**Source:** [SIS13-01 frozen roster v1.0](https://github.com/yerassyl-clou/SmartCampus/blob/d903dfbb3317fff7fdce856b6643fffc33a1071f/docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md) as published in the [SIS13-05 handoff](https://app.clickup.com/t/z8q7hbx7w0#comment-1100310000219131). The 11 events below preserve the source IDs, labels and chronology. Dates use Asia/Almaty.

## Individual template

Copy these rows into a private message to Danaya Aliyeva. Score each event once before discussing scores with other participants. Use integers from −5 (very negative) through 0 (neutral) to +5 (very positive), based on your own experience. Optional context can be supplied privately. State whether you approve coded publication of your scores in GitHub and academic materials. Danaya keeps the member-code mapping private.

| Event ID | Almaty date | Neutral event label | Your rating | Optional context |
| --- | --- | --- | --- | --- |
| E-01 | 2026-11-10 | QA baseline published | ___ | |
| E-02 | 2026-11-10 | Academic feedback scope recorded | ___ | |
| E-03 | 2026-11-10 | SIS 10–11 integration merged | ___ | |
| E-04 | 2026-11-10 | Release verification recorded | ___ | |
| E-05 | 2026-11-10 | ClickUp quota delayed closure work | ___ | |
| E-06 | 2026-11-10 | SIS 10–11 board closure completed | ___ | |
| E-07 | 2026-11-17 | QA and finance work reassigned | ___ | |
| E-08 | 2026-11-17 | Human time logging protocol published | ___ | |
| E-09 | 2026-11-17 | Infrastructure and finance audit merged | ___ | |
| E-10 | 2026-11-18 | Groq account evidence gaps documented | ___ | |
| E-11 | 2026-11-18 | Offline backend test guard merged | ___ | |

## Handling and verification

1. Give all four participants the same template. Receive one response per person privately, with other respondents' answers withheld during collection. Record the submitter, actual receipt time and publication decision in a private log.
2. Verify the submitter supplied their own scores and submitted one integer per frozen ID. Ask the submitter privately to resolve duplicates, invalid scores and omissions. Record access limitations without publishing the submission or private context.
3. Enter only approved scores under a stable member code. Keep missing or unpublished values empty. Compute the exact four-person mean only when all four approved scores exist on that row.
4. Compare CSV headers and ordered event IDs with the schema and pinned register. Check integers, range, uniqueness, completeness and means. Format validation covers the CSV structure. Participant receipt and consent are checked separately.
5. After all four responses are verified and approved, notify [SIS13-06](https://app.clickup.com/t/z8q7hbx7vz). Use any optional context in shared work only with the participant's permission.

## Submission status

| Collection checkpoint | Recorded result |
| --- | --- |
| Coverage | 4 of 4 participant vectors, each with 11 scores |
| Source and receipt | The submitting user supplied the consolidated matrix and confirmed it represents actual team responses. Individual timestamps and original messages were unavailable for direct verification because the ClickUp connector hit its daily quota. |
| Publication | The submitting user separately confirmed coded GitHub and academic publication consent from all four participants. Member codes are used in shared data. |
| Numeric validation | All 44 scores are integers from −5 to +5. All 11 events match the frozen register, and each mean is the exact sum of four scores divided by four. |

The later confirmed matrix matches the values in the earlier simulation fixture. The fixture stays labeled as an example. The official CSV relies on the submitting user's later confirmation of provenance and consent. [Canonical ratings CSV](ratings.csv)

## Production handoff

1. Confirm the latest accepted roster against frozen SIS13-01 v1.0. If that roster changes, reconcile IDs and titles with SIS13-02 and obtain any required participant reconfirmation before transcribing answers.
2. For each private reply, register the timestamp, 11 original integer scores and the publication decision in the private collection log. Verify identity and independence in that channel. Resolve missing values or duplicate event IDs with the participant.
3. In this branch's `ratings.csv`, enter only personally supplied, publication-approved scores under stable private codes. Leave pending or restricted inputs blank. For complete rows, enter the exact sum divided by four.
4. Run the SIS13-06 validator against the pinned register and this CSV. Confirm all four coded columns are complete, review commit contents for private material, and publish the verified dataset in [PR #36](https://github.com/yerassyl-clou/SmartCampus/pull/36).
5. Hand the accepted CSV revision to [PR #37](https://github.com/yerassyl-clou/SmartCampus/pull/37). The workflow demonstration in that PR uses a separate AI-simulated fixture. Keep demonstration files separate from the canonical data and from retrospective evidence.

The review should check the collection provenance against the original private submissions if those records become available. Reserve any individual explanation for context explicitly approved by its author.
