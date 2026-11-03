# SmartCampus API contract (Sprint 8–9)

Base: `http://localhost:8000`; frontend uses Vite proxy for `/api`.
All dates in mock data are ISO 8601 date strings, e.g. `2026-11-06`. No real student data.

## GET /api/health
200: `{"status":"ok","app":"SmartCampus"}`

## GET /api/deadlines?course_id=<optional positive integer>
200: `{"items":[{"id":1,"course_id":1,"course_name":"Database Systems","title":"Assignment 2","due_date":"2026-11-06","source_title":"Mock Database Systems syllabus"}],"total":1}`
Sort ascending by due_date, then ID. Unknown positive course IDs return empty; zero, negative, and non-integer filters return 422. Empty: `{"items":[],"total":0}`.

## POST /api/chat
Request: `{"question":"When is Assignment 2 due?","course_id":1}` (course_id optional). Answer with server-side retrieval and **real** LLM when there is evidence; no evidence => deterministic fallback without LLM call.

200 successful grounded sample:
```json
{"answer":"Assignment 2 is due on 2026-11-06.","grounded":true,"sources":[{"id":1,"title":"Mock Database Systems syllabus","excerpt":"Assignment 2 deadline: 2026-11-06"}]}
```

200 no evidence:
```json
{"answer":"I couldn't find this information in the available course materials.","grounded":false,"sources":[]}
```

503 provider unavailable (example): `{"detail":"The AI service is temporarily unavailable."}`.
422: empty/invalid question. Never return secret keys, model debug payloads, stack traces or unsupported dates. Sources must trace to SQLite mock records. Positive source IDs identify documents; negative IDs identify deadlines (`-id`), preventing cross-table collisions. Deadline excerpts are formatted from the stored course, title, and date. Model-generated text is not considered authoritative without evidence.

## Coordination
Gleb implements retrieval + deadlines; Ratislav consumes retrieval in chat service; Danaya consumes endpoints in UI; Yerassyl validates end-to-end shapes. Any contract change must be announced in ClickUp before merging.

## SIS89-08 integration details

General questions `What deadlines do I have?`, `Show all deadlines`, `What assignments are due?`, and `List upcoming deadlines` return deterministic SQLite listings with sources, `grounded=true`, and an explicit fictional sample / non-personal-schedule label. `course_id` also filters listings. Upcoming means due_date >= current date in Asia/Almaty, inclusive; the answer prints its reference date. No matches yields a factual empty-list message and no sources. Other course questions keep the retrieval → real LLM → quote validation path.

503 bodies retain `{ "detail": "safe message" }`. `X-SmartCampus-Error` provides a safe category: `configuration`, `authentication`, `rejection`, `rate_limit`, `timeout`, `unavailable`, `invalid_output`, or `database_unavailable`. React maps recognized categories to fixed user messages and never displays raw provider details. Missing/uninitialized/corrupt SQLite is a service error, not missing course information. A successfully parsed model selection declaring insufficient evidence still returns the normal 200 fallback; a missing/invalid structured response returns 503. Fabricated source IDs or non-verbatim quotes remain rejected by the grounding guard.
