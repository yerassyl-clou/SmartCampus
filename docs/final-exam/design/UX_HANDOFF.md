# SmartCampus V2 design handoff

Version 2.0.0-review.1 · FINAL-02 · Danaya Aliyeva · Review candidate

## Direction

- **Course-first split view.** The course is the persistent scope. Documents and recent threads sit beside the central answer. Upcoming work stays visible to its right. At compact widths the three panes become explicit buttons and the citation stays a shared dialog.
- **Dashboard-first grid.** Cards provide a broad entry point for tasks, files and conversations. Keeping the grid through the chat flow makes source scope and history harder to find and introduces an extra navigation step.
- **Decision.** Use a dashboard for landing, courses and deadlines, then the course-first split view inside an open course. Keep the compact default on Chat and place document and deadline buttons directly above it.

The folded-page mark combines course material with a campus cap. Flat surfaces, teal actions and a warm deadline accent match the approved palette. The landing illustration uses original rendered UI cards and the same tokens.

## Editable frames

Serve this directory with `python3 -m http.server 8769 --bind 127.0.0.1`. Open [the prototype](prototype/index.html) at `http://127.0.0.1:8769/prototype/`. The browser combines the hash fragment as a design-frame identifier with the optional `?profile=workspace` query before the hash. The default demonstrates the public-demo CTA hold. The workspace profile is a visual simulation. Use the localized **Preview state** control to inspect variants. Personal URLs and figures are synthetic and directly inspectable for design review.

Edit [markup and interactions](prototype/prototype.js), [styles](prototype/style.css), [strings](prototype/strings.js) and [tokens](tokens-v2.json). Chromium evidence is indexed in [captures](../evidence/FINAL-02/captures.json). Use viewport 1440×1000 or 375×812 and the in-header theme and language controls. Figma required reauthentication at execution. These authored source files are the editable fallback.

## Layout and behavior

| Building block | Desktop | Compact | Token and interaction |
| --- | --- | --- | --- |
| Brand bar | 40 px mark, controls and inline navigation in one row | 30 px mark, preferences beside it and wrapping second navigation row | Surface, line, ink, accent. Skip link and route heading receive keyboard focus. |
| Landing | 1240 px content, 48 px gap, copy and product illustration side by side | Single column, copy and CTA first | Hero size 38–76 px. CTA variants use accent/on-accent and surface/ink. |
| Course workspace | 215 px minimum sources, flexible chat and 210 px minimum deadlines, 20 px gaps | One pane at a time at ≤840 px. Buttons have pressed state and stay in tab order. | Card radius 16 px, surface and line, 20/16 px padding. Course scope always appears with chat. |
| Source detail | Modal up to 540 px with original excerpt, filename/locator and mode | Same modal within 12 px viewport margins, scrollable | Focus enters the dialog and returns to its trigger on Escape. Production may show short signed original or stable excerpt from the authorized source endpoint. |
| Status and errors | Inline message beside affected control and optional retry | Same message immediately before retry | Status region for asynchronous progress, danger for failures, warm for hold/due, badges also carry text. |
| Shared forms | Clear label, constrained input and pending state | Single column with at least 44 px actionable controls | Preserve form values across recoverable errors. Destructive actions require explicit confirmation. |
| Citation and conversation | Question then answer then evidence action. Thread list is in sources column. | Read newest response and citation in Chat. History in Documents. | Use sentence-level evidence when provided. Preserve original source language and citation focus. |
| Deadlines and analytics | Two-column cards with semantic list/table blocks | Stack cards and date controls; table remains readable | Empty and unavailable are explicit. CSV shares the approved snapshot; permission enforced server-side. |

## Route, component, state and API map

API paths below use the approved preliminary `/api/v2` prefix. OAuth uses the approved Supabase Google OIDC broker with PKCE. All private surfaces wait for verified server eligibility and course/admin ownership. The path following successful callback must be same-origin and allowlisted. On held configuration, offer guest and privacy handling. The only approved registration is self-service Google.

| Route and frame | Component and state variants | Data and API | String keys |
| --- | --- | --- | --- |
| `/` | Landing, product sample, enabled Google or launch hold | Approved release profile, synthetic illustration | workspace, headline, intro, demo, google, held, privacy |
| `/privacy` | Privacy notice, return to demo | Versioned notice copy, acknowledgement via POST /session/consent when eligible | privacy, privacyText, demo |
| `/signin` and `/auth/callback` | OAuthEntry, hold, loading, cancelled, expired, denied and verified | Supabase OIDC + GET /session. Show hold for invalid or unavailable configuration. Successful callback clears authorization parameters. | signin, signIntro, google, held, callback, loading, cancelled, expired, denied, connected, retry |
| `/demo` | GuestCourses, synthetic banner and mode-appropriate CTA | Embedded fixture in offline mode. GET /demo only for an enabled synthetic API adapter. | synthetic, live, courses, course, openCourse, syllabus, brief, google, held |
| `/demo/course/:slug` | GuestCourse, read-only source, authored sample and deadlines. Example replay on live budget hold. | Fixture by slug. Approved live mode POST /demo/chat with curated slug and locale. | synthetic, live, course, documents, chat, deadlines, scope, question, answer, citation, source, original, extracted |
| `/app/courses` | CourseList/Editor, list, create, empty, loading, error, success and quota | GET/POST /courses. Show names, document counts and nearest deadline. | owned, courses, addCourse, label, course, openCourse, loading, empty, error, successful, retry, quota |
| `/app/courses/:id` | CourseWorkspace, CourseEditor, DocumentList, UploadProgress. Pending, uploading, processing, ready, duplicate, failed, deleting. | GET/PATCH/DELETE /courses/{id}; GET /courses/{id}/documents; POST /courses/{id}/uploads; reserved private TUS; POST /documents/{id}/finalize or /retry; DELETE /documents/{id}; GET /documents/{id}/source | documents, upload, pending, uploading, processing, ready, duplicate, failed, deleting, remove, rename, history, newChat, retry, source |
| `/app/courses/:id/chats/:id` | ThreadHistory, Composer, Answer and CitationDialog. Empty, sending, grounded, insufficient, provider error and quota. | GET/POST /courses/{id}/threads; GET/POST /threads/{id}/messages; GET /documents/{id}/source. Do not render a citation for insufficient answers. | chat, history, newChat, emptyChat, ask, send, scope, loading, question, answer, citation, insufficient, provider, quota, source, original |
| `/app/deadlines` | Deadlines, DeadlineForm, CandidateReview. Today, upcoming, overdue, completed, manual and extracted. | GET /deadlines; POST /courses/{id}/deadlines; PATCH/DELETE /deadlines/{id}; candidate list/confirm/reject per R04. Confirm an exact source date. Leave relative dates undated. | deadlines, today, upcoming, overdue, completed, manual, extracted, addDeadline, date, edit, complete, candidates, candidateTitle, undated, confirm, reject |
| `/app/settings` | AccountSettings, preferences, logout and deletion, pending and recoverable failure | GET /session, DELETE /account and approved receipt UI. Language/theme local. | settings, privacy, language, theme, logout, deleteAccount, deletion, deleting, error, successful |
| `/app/admin` | AggregateMetrics, DateRange and Export, denied, loading, zero and unavailable | GET /admin/metrics?from=&to= and GET /admin/metrics/export after eligibility. | admin, from, to, refresh, export, accounts, activity, unavailable, denied, loading |
| Fallthrough | ErrorState and return action | Local route handling and generic denial | unavailable, home |

## Consumer checkpoints

Use the [localization glossary](LOCALE_GLOSSARY.md) for key parity, the [asset manifest](ASSETS.md) for attribution and the [token JSON](tokens-v2.json) for CSS aliases. R04 owns API shape, specialized error codes and final candidate endpoint spelling. Translate allowlisted server error keys to labels with a generic localized fallback. Restrict demo to its own synthetic adapter and omit upload, persistence and personal workspace calls in that mode. See the [handoff envelope](../handoffs/FINAL-02.md) for the version gate.
