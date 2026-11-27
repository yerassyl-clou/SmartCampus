# FINAL-10 | Course, document and deadline workflows

Owner: Danaya Aliyeva. Reviewer: Yerassyl Babayev. [ClickUp task](https://app.clickup.com/t/z8q7hby8dt). Branch `codex/final-10-course-deadline-ui`. Implementation `98d83b268c5d1c3b50a41cb36cfe79388073e156`.

## Implementation and verification

The authorized local QA workspace extends the accepted shell with course cards and scoped detail, a localized syllabus picker and resumable fixture transfer, source drawer, and manual and suggested deadline actions. Course, document and deadline deletions require confirmation. Deadlines use calendar dates in Asia/Almaty and display manual or confirmed extraction provenance. Relative dates stay unconfirmed. Producer integration status and the direct-upload smoke procedure are recorded in [COURSE_UI_QA](../quality/COURSE_UI_QA.md).

Install and build passed, targeted Chromium passed 9/9, and the full frontend suite passed 94/94. Tested frontend tree `409849a2e5716a84dbbc59c77f2dc43adc667a16`. [Install and build](../evidence/FINAL-10/build.log), [targeted Chromium run](../evidence/FINAL-10/targeted.log), [full frontend run](../evidence/FINAL-10/full.log), [annotated screenshot manifest](../evidence/FINAL-10/captures.json).

## English slides and speaking notes

| Slide | Summary | Speaking notes |
| --- | --- | --- |
| 6 | Course setup, visible document state and one deadline list keep student work scoped. | Open the synthetic course and show the source and deadline panels. |
| 11 | The source drawer, form focus and provenance remain available in the mobile layout. | Show the RU dark source drawer, then switch to KK. Explain that the source quotation stays in its original language. |
| 12 | Resume a synthetic 10 MB transfer and confirm a dated suggestion before it appears in the active list. | Show the interrupted state and saved offset. Open the suggestion, review the date and source, and confirm. Point out the disabled action for Week 8. State that TUS and ingestion are simulated. |

## Independent reviewer checklist

- Match the PR frontier and tested frontend tree, then rerun the build, targeted specs and existing suite.
- Verify local session eligibility, course scope, production hold and synthetic-over-legacy isolation.
- Review file limits, byte-progress and retry states, confirmation and focus at desktop/mobile widths, date-only rules, provenance and the synthetic data classification.
- Record any required fixes against the current head. Record direct TUS smoke as held until FINAL-07/08, infrastructure and the designated QA account are authorized.

Codex assisted with implementation, translations, tests, evidence and drafting. Browser proof was generated against the running Vite app. Human hands-on minutes and independent acceptance are pending owner/reviewer entry.
