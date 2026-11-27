# FINAL-10 handoff

Version `2.0.0-course-ui.local.1`. Implementation `98d83b268c5d1c3b50a41cb36cfe79388073e156`. Tested frontend tree `409849a2e5716a84dbbc59c77f2dc43adc667a16`. Branch `codex/final-10-course-deadline-ui`. The native task review notice supplies the submitted evidence head and PR. See [fixture and QA details](../quality/COURSE_UI_QA.md).

| Handoff | State | Contract and next actor | Original deadline, Almaty |
| --- | --- | --- | --- |
| H-FINAL-10-12 | Ready for independent review | Danaya verifies merged head before starting FINAL-12. Consume the course detail layout, `Workspace({route, owner, locale, translate, signOut})`, scoped Documents and WorkspaceDeadlines props, and the source dialog. Keep unapproved services held. | 2026-11-28 11:00 |
| H-FINAL-10-13 | Preliminary | Yerassyl verifies authorized test mode and exact producer contract, then runs direct-upload and ownership smoke against the combined environment. | 2026-11-28 11:00 |
| H-FINAL-10-14 | Preliminary | Ratislav replays the workflow cases and maps fixtures to accepted CRUD, deadline and source operations. | 2026-11-28 11:00 |
| H-FINAL-10-16 | Preliminary | Danaya may use the local screenshots for preparation. Recruitment and pilot evidence require the release decision and native predecessors. | 2026-11-28 11:00 |

Routes are `/app/courses`, `/app/courses/:id`, and `/app/deadlines`. Fixture entities use scoped `course_id`, date-only `due_on`, and `document_id` for derived provenance. `fixtureWorkspace.js` and `fixtureUpload.js` contain browser-only IO. Treat their shapes as UI contracts. Confirm FINAL-04/07/08/11 wire responses, storage origin and allowed operations before integrating service calls. FINAL-02 and FINAL-06 are accepted. FINAL-03/07 packets from PR #43 and FINAL-05 from PR #52 are provisional, and FINAL-04/08/11 have no accepted producer artifact at this checkout.
