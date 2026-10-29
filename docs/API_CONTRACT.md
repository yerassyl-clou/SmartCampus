# SmartCampus API contract (Sprint 8–9)

Base: `http://localhost:8000`; frontend uses Vite proxy for `/api`.
All dates in mock data are ISO 8601 date strings, e.g. `2026-11-06`. No real student data.

## GET /api/health
200: `{"status":"ok","app":"SmartCampus"}`

## GET /api/deadlines?course_id=<optional string>
200: `{"items":[{"id":1,"course_id":1,"course_name":"Database Systems","title":"Assignment 2","due_date":"2026-11-06","source_title":"Mock Database Systems syllabus"}],"total":1}`
Sort ascending by due_date. Empty: `{"items":[],"total":0}`.

## POST /api/chat
Request: `{"question":"When is the next Database Systems assignment due?","course_id":1}` (course_id optional). Answer with server-side retrieval and **real** LLM when there is evidence; no evidence => deterministic fallback without LLM call.

200 successful grounded sample:
```json
{"answer":"Assignment 2 is due on 2026-11-06.","grounded":true,"sources":[{"id":1,"title":"Mock Database Systems syllabus","excerpt":"Assignment 2 deadline: 2026-11-06"}]}
```

200 no evidence:
```json
{"answer":"I couldn't find this information in the available course materials.","grounded":false,"sources":[]}
```

503 provider unavailable (example): `{"detail":"The AI service is temporarily unavailable."}`.
422: empty/invalid question. Never return secret keys, model debug payloads, stack traces or unsupported dates. Sources must trace to SQLite mock records. Model-generated text is not considered authoritative without evidence.

## Coordination
Gleb implements retrieval + deadlines; Ratislav consumes retrieval in chat service; Danaya consumes endpoints in UI; Yerassyl validates end-to-end shapes. Any contract change must be announced in ClickUp before merging.
