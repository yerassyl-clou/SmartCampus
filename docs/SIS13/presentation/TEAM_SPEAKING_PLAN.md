# SIS13 team speaking plan

Planned running time **9:00**, including slide changes and handoffs. The following is a speaking script. A timed team rehearsal and attendance remain to be confirmed.

| Speaker | Slides | Planned time |
| --- | --- | ---: |
| Yerassyl Babayev | 1, 2, 3, 7 | 2:15 |
| Danaya Aliyeva | 4, 8 | 2:15 |
| Gleb Yurtayev | 5, 6, 10 | 2:15 |
| Ratislav Ovchinnikov | 9, 11, 12 | 2:15 |

## Running order

| Window | Slide | Speaker | Reveal clicks |
| --- | --- | --- | ---: |
| 0:00–0:20 | 1. SmartCampus | Yerassyl Babayev | 0 |
| 0:20–0:50 | 2. The deadline question | Yerassyl Babayev | 0 |
| 0:50–1:40 | 3. The sprint in eleven events | Yerassyl Babayev | 2 |
| 1:40–2:50 | 4. Emotional Seismograph | Danaya Aliyeva | 2 |
| 2:50–3:40 | 5. Five findings from the sprint | Gleb Yurtayev | 0 |
| 3:40–4:25 | 6. Five Whys of deadline discovery | Gleb Yurtayev | 4 |
| 4:25–5:00 | 7. Three measurable actions | Yerassyl Babayev | 3 |
| 5:00–6:05 | 8. Enter opens the deadline list | Danaya Aliyeva | 2 |
| 6:05–7:25 | 9. Pull requests run their own checks | Ratislav Ovchinnikov | 2 |
| 7:25–8:05 | 10. A review decision you can trace | Gleb Yurtayev | 1 |
| 8:05–8:30 | 11. How the team contributed | Ratislav Ovchinnikov | 0 |
| 8:30–9:00 | 12. What we’ll measure next sprint | Ratislav Ovchinnikov | 2 |

After the listed reveals, advance once to change slides. The final slide can remain visible for questions.

## Yerassyl Babayev

### Slide 1 · SmartCampus · 0:00–0:20

SmartCampus is a student workspace for asking questions about coursework and checking deadlines. We use fictional courses and deadlines to test the experience. Today we’ll look back at the sprint from November seventh through twentieth, then show what we changed on November twenty-third and twenty-fourth.

### Slide 2 · The deadline question · 0:20–0:50

Imagine opening SmartCampus to answer this question: where can I find information about course deadlines? That exact question was a suggested prompt on the old welcome screen. Enter filled the chat box, and another Enter submitted it. The assistant returned the safe fallback with zero sources. The course deadlines were already in the workspace. We used this reproducible interaction to test whether the interface could take a student straight to the right place.

### Slide 3 · The sprint in eleven events · 0:50–1:40

On November tenth we had a QA baseline, agreed the academic feedback scope, and merged and verified the release. The ClickUp connector quota interrupted board closeout. The board lagged behind the integrated release until the final QA task was accepted. We can date those events from the records, but the effect on the submission deadline is unknown. On the seventeenth we moved 165 planned minutes across two tasks, published a time logging protocol, and merged the infrastructure audit. Just after local midnight came the provider evidence gap and an offline test guard. These eleven events end our historical record. The fixes were a separate follow-up. Danaya will show how the scoring exercise follows this sequence.

### Slide 7 · Three measurable actions · 4:25–5:00

For each action we agreed a baseline, a target and how to score it. Danaya owned the keyboard shortcut. I implemented the hosted workflow and ran the ClickUp pilot. Ratislav owned the technical follow-up, and Gleb owned the process follow-up. All deadlines used Almaty time. We counted two keyboard journeys, two intended jobs on a comparison pull request, and one task with a complete acceptance comment. All three reached their targets at those sample sizes. Danaya will take us through the first change.

## Danaya Aliyeva

### Slide 4 · Emotional Seismograph · 1:40–2:50

The four thin lines are coded series on a minus-five to plus-five scale, and the heavy line is their average. Integration at E-03 has the highest mean, plus four point five. The board closure delay at E-05 has the lowest mean, minus three. The steepest fall is 7.25 points from release verification to that delay, followed by the 6.50-point rebound at board closure. Four events have a spread of at least four points: the closure delay, task reassignments, the time logging protocol and the offline test guard. At reassignment, the mean is plus one, but the scores run from minus two to plus four. The event record establishes what happened and when. The project manager authorized these AI-assisted values, and independent responses and individual publication consent remain unverified. We can discuss the pattern in the data. Gleb will explain which findings are supported by project evidence.

### Slide 8 · Enter opens the deadline list · 5:00–6:05

On the left is the original fallback. On the right is the current deadline panel with its purple focus outline. We linked the welcome shortcut directly to the existing panel. Tab reaches View course deadlines. Enter opens the list and puts keyboard focus on its heading region. We replayed the failed journey on desktop and on a 375-pixel mobile viewport, with the same six fictional records and the same browser clock. Both old journeys failed and both after journeys passed. We checked the destination focus and saw zero chat POST requests during navigation. The separate unsupported chat question still returned its safe fallback. That result covers two Chromium keyboard journeys. Ratislav will show how the team made pull request checks repeatable.

## Gleb Yurtayev

### Slide 5 · Five findings from the sprint · 2:50–3:40

We ranked five findings by impact, evidence and what we could address in the follow-up. The first blocked a student journey. The second left each pull request without shared verification. The third left a board reader unable to tell which revision had been accepted. Those three became the measured actions. The other two remain on the backlog. The 165 minutes we moved were planned, and none of the twenty tasks in the historical sample had positive tracked time. The infrastructure audit could size the local fixture, while usage, quotas and spend still required account evidence. The priorities came from the project records and the replay.

### Slide 6 · Five Whys of deadline discovery · 3:40–4:25

Let’s walk through the deadline example. Both keyboard journeys ended in the fallback. The suggested wording missed the supported deadline query. Why did wording matter? The welcome control was a chat starter. The sidebar already had a direct link, but the welcome screen didn’t use it. The issue had been logged and deferred. The source doesn’t establish why the prompt was originally worded that way. The same method exposed a missing pull request trigger and a handoff that stopped short of acceptance. Where the record ends, we leave the explanation open. Yerassyl will show how we turned those findings into measurements.

### Slide 10 · A review decision you can trace · 7:25–8:05

We scored the same task twice. The November twenty-third comment on the left handed off baseline evidence. The next day Yerassyl recorded the acceptance decision, named the reviewer, linked PR thirty-nine and pinned the reviewed revision. Those are the four fields that counted. We moved from zero of one complete records to one of one. I documented the pilot and how to score it. We can now repeat that method across several eligible tasks to see how often the team uses it. Ratislav will close with our contributions and next sprint checks.

## Ratislav Ovchinnikov

### Slide 9 · Pull requests run their own checks · 6:05–7:25

Before the change, the team could run the backend tests and build locally. The sampled head of PR thirty-nine had no hosted checks. PR forty-two introduced a GitHub Actions workflow that starts on a pull request to main. Two jobs run independently: backend pytest and the frontend production build. Both passed on the implementation PR, so we measured two of two. Then PR forty-seven added two backend checks for the retrospective artifacts and Playwright to the frontend job. The later PR forty-eight run passed 129 backend cases, the build and 72 Playwright tests on one head. The earlier UX evidence had 127 backend tests and 72 browser tests under its own conditions. This measures whether checks ran on specific revisions. It gives us a review record, and we can check it again when the head changes. Gleb will show how we tied the board review to a revision as well.

### Slide 11 · How the team contributed · 8:05–8:30

Yerassyl assembled the historical record and action plan, implemented the workflow and piloted the acceptance comment. Danaya prepared the rating materials, implemented the shortcut and captured the matched evidence. Gleb completed the process audit and pilot measurement records. I audited the technical baseline, added the regression checks and documented the hosted results. Those contributions let us show how each change was measured.

### Slide 12 · What we’ll measure next sprint · 8:30–9:00

The integration and local QA gave us a release we could verify. The follow-up showed where a student or reviewer could still get stuck. Next sprint we’ll replay the keyboard route when entry points change, verify both hosted jobs on the head under review, and count complete acceptance comments across eligible tasks. We’ll also compare actual and planned effort and request a dated, redacted provider usage snapshot. Thank you. Questions?
