# SmartCampus SIS 10–11 defense script

Ten slides. Target duration 10:00.

## Slide 1 · Yerassyl · 0:00–0:35

SmartCampus brings an academic assistant and course deadlines into one workspace. A student can ask a question about the course materials or use the dashboard to check the next due date. React renders the workspace. FastAPI retrieves the evidence from a local SQLite database with three fictional courses. Today we will show the baseline we tested, the two weaknesses we corrected and the new way a student can flag an answer. The academic client and its data are fictional.

[PR #6](https://github.com/yerassyl-clou/SmartCampus/pull/6)

## Slide 2 · Yerassyl · 0:35–1:30

We pinned the baseline to commit 42dcac9 so that every finding could be replayed. We tested three paths. In chat we checked that an answer can cite its evidence, that a missing answer is clearly marked and that retry leaves the conversation usable. In retrieval we tested whether the candidates came from the requested course. For the dashboard, the baseline probe used a real FastAPI request and six seeded deadlines, then simulated slow or failing responses to check the UI states. The three baseline counts come from separate suites. After integration, 126 backend tests and 70 standard browser checks passed. We also ran a separate browser suite against the live provider and validated the new feedback flow against the real database.

[PR #6](https://github.com/yerassyl-clou/SmartCampus/pull/6) · [PR #13](https://github.com/yerassyl-clou/SmartCampus/pull/13) · [PR #17](https://github.com/yerassyl-clou/SmartCampus/pull/17)

## Slide 3 · Yerassyl · 1:30–2:15

The issue log records the reproduction, priority and owner for each weakness. The first item made already expired work appear under Upcoming deadlines. The second could give the assistant evidence from an unrelated course. Both directly affect what a student sees and were selected for this sprint. We deferred the third item. The built-in deadline prompt can lead to a safe fallback even though the dashboard has the records. A direct question such as List upcoming deadlines still works. The backlog records the two fixes and the deferred prompt. Danaya will show the dashboard comparison with the same data and date.

[PR #7](https://github.com/yerassyl-clou/SmartCampus/pull/7) · [PR #9](https://github.com/yerassyl-clou/SmartCampus/pull/9)

## Slide 4 · Danaya · 2:15–3:20

Both images are Chromium captures with the same six deadline records and the same fixed reference time, noon on 10 November in Asia/Almaty. In the baseline, 6 and 9 November are at the top of Upcoming deadlines. The fixed dashboard keeps those records and their course and source labels in a separate Past deadlines group. The four upcoming records remain in chronological order. A date equal to today remains upcoming. The date-only test runs in a Los Angeles browser timezone and still uses the Almaty calendar day. The regression checks also cover loading, the empty response, a failed refresh with the last good data still visible, and recovery with Retry. We checked the page at desktop, tablet and mobile widths.

[PR #17](https://github.com/yerassyl-clou/SmartCampus/pull/17) · [PR #18](https://github.com/yerassyl-clou/SmartCampus/pull/18)

## Slide 5 · Danaya · 3:20–4:30

The feedback controls appear when an assistant answer arrives, including a safe fallback answer. Helpful sends one request. Not helpful opens the form and focuses the category selector. The user chooses a category and may leave a short plain-text comment. The limit is 500 characters. In the live replay we submitted a helpful rating on one response and reported missing information on the next. Both requests reached FastAPI. We intentionally interrupted the second request before it reached the server. The UI showed a network error and kept the selected category and comment. Using the keyboard to send again reused the same UUID. The saved state in this image came after the API replied with HTTP 201. We also captured the form at 375 pixels.

[PR #19](https://github.com/yerassyl-clou/SmartCampus/pull/19)

## Slide 6 · Ratislav · 4:30–5:45

The baseline question named Human-Computer Interaction and asked about Assignment 2. That course has no matching assignment. The older retriever admitted the Database Systems syllabus and deadline as candidates, with IDs one and minus one. The change recognizes a named course when the client has not supplied an explicit course ID. It scopes the candidate search to that course. On the integrated API, the same question returned HTTP 200 with grounded false and an empty source list. The Database Systems control still retrieved its own materials. The separate Groq suite verified actual source titles, IDs and exact phrases from the sample SQLite data. The API checks that the selected quotes occur in the retrieved excerpts before using them to answer.

[PR #13](https://github.com/yerassyl-clou/SmartCampus/pull/13) · [PR #14](https://github.com/yerassyl-clou/SmartCampus/pull/14)

## Slide 7 · Ratislav · 5:45–7:15

The academic approval for CR-001 added anonymous answer feedback. React attaches a UUID version four to each received answer and keeps the source IDs with that answer. FastAPI validates the rating, category, UUID, source IDs and comment before the SQLite helper writes a row. A successful insert returns 201. Invalid input returns 422. The database uniqueness constraint makes concurrent duplicate submissions safe and returns 409 for a repeated UUID. A storage problem returns a controlled 503. We saw a schema collision when joining the API and persistence branches. Thirty-five route tests failed during setup because a test fixture tried to create the table again. The route suite now uses the production storage helper and the same seeded schema as the app. Both real browser submissions persisted after the API restarted. We queried SQLite to check their ratings, category, comment and source IDs, then repeated a UUID and checked that the original row stayed intact.

[PR #8](https://github.com/yerassyl-clou/SmartCampus/pull/8) · [PR #15](https://github.com/yerassyl-clou/SmartCampus/pull/15) · [PR #16](https://github.com/yerassyl-clou/SmartCampus/pull/16) · [PR #19](https://github.com/yerassyl-clou/SmartCampus/pull/19) · [PR #20](https://github.com/yerassyl-clou/SmartCampus/pull/20)

## Slide 8 · Gleb · 7:15–8:30

The impact analysis covers one added feedback workflow. The chat and deadline response shapes stay compatible. The estimate allocates ten hours to the database, eight to the API, eight to the interface, ten to testing and four to contingency. This is a 40-hour workload with five working days from the simulated approval. The audit identified two high-priority debts. The seed intentionally resets the course fixtures, and the backend dependency ranges lack a lockfile. The additive feedback table can be applied without reseeding existing course rows. For our tests we used isolated databases. The storage check proved that a fresh seed and an upgrade preserve the expected data. We also recorded the lack of shared CI, so the defense evidence points to the actual executed local test logs.

[PR #20](https://github.com/yerassyl-clou/SmartCampus/pull/20)

## Slide 9 · Gleb · 8:30–9:30

The fictional offer and unsigned fixed-price contract use the same figures. Estimated labor costs 1,070 dollars, with 107 dollars of contingency. The total is 1,177 dollars for implementation. The payment schedule is 470 dollars and 80 cents at written start, the same amount at implementation review and 235 dollars and 40 cents at delivery of the acceptance package. The five working days start with approval. The provider supplies the UI, endpoint, storage, test evidence and handover. The client supplies access and reviews against the acceptance criteria. Further scope requires a written change approval, and the 14-day warranty covers in-scope defects. Hosting and API usage are separate from this price.

[PR #20](https://github.com/yerassyl-clou/SmartCampus/pull/20)

## Slide 10 · Yerassyl · 9:30–10:00

The submission checklist maps each of the twelve course outputs to its evidence. The integrated build reproduced and verified both improvement cases. The feedback workflow saved two distinct responses, recovered after a network error and retained both rows across an API restart. The team can show the actual product and explain the test evidence, the approved coursework change and the commercial assumptions.

[PR #10](https://github.com/yerassyl-clou/SmartCampus/pull/10) · [PR #11](https://github.com/yerassyl-clou/SmartCampus/pull/11) · [PR #12](https://github.com/yerassyl-clou/SmartCampus/pull/12)
