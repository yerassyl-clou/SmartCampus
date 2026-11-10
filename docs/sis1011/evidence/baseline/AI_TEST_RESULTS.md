# AI baseline test results — Ratislav

[SIS1011-02](https://app.clickup.com/t/z8q7hbuc7m). Run on 10 November 2026 against unchanged baseline `42dcac91995f5cd930af907716962d6e0f99154c`.

macOS-15.8.1-x86_64-i386-64bit-Mach-O Python 3.13.5

Fictional data seeded into a temporary SQLite DB. Chat and Knowledge Retrieval are assessed separately. No live Groq call was made. Provider modes below are explicit; a mocked selector proves route behavior, not what a live model would choose.

| ID | Feature | Exact input / steps | Expected | Observed actual | Result | Provider |
| --- | --- | --- | --- | --- | --- | --- |
| AI-01 | Chat | Assignment 2 deadline; course_id=1 | 200, verified verbatim source 1 | HTTP 200; grounded=True; source IDs=[1] | PASS | mocked deterministic quote selector |
| AI-02 | Chat | What is the rule for late database lab work?; course_id=1 | 200, verified verbatim source 2 | HTTP 200; grounded=True; source IDs=[2] | PASS | mocked deterministic quote selector |
| AI-03 | Chat | When is the Physics exam?; course_id=None | 200 fallback, no sources or provider call | HTTP 200; grounded=False; source IDs=[] | PASS | provider forbidden |
| AI-04 | Chat | Assignment 2; course_id=999 | 200 fallback, no sources or provider call | HTTP 200; grounded=False; source IDs=[] | PASS | provider forbidden |
| AI-05 | Chat | Assignment 2; selector raises ProviderUnavailable | 503 safe unavailable category | HTTP 503; {"detail": "The AI service is temporarily unavailable."} | PASS | mocked failure |
| AI-06 | Chat | Assignment 2; selector returns invented quote | 200 safe fallback | HTTP 200; grounded=False; source IDs=[] | PASS | mocked invalid quote |
| AI-07 | Knowledge Retrieval | assignments 2 requirements; course_id=None | First source 1 | Candidate IDs [1, -1] | PASS | no provider |
| AI-08 | Knowledge Retrieval | What is the rule for late database lab work?; course_id=None | First source 2 | Candidate IDs [2, 1, 4, 6, -1, -2] | PASS | no provider |
| AI-09 | Knowledge Retrieval | Assignment 999; course_id=None | No candidates | Candidate IDs [] | PASS | no provider |
| AI-10 | Knowledge Retrieval | When is the Human-Computer Interaction Assignment 2 due?; course_id=None | No candidates | Candidate IDs [1, -1] | FAIL | no provider |
| AI-11 | Knowledge Retrieval | When is the Human-Computer Interaction Assignment 2 due?; course_id=3 | No candidates | Candidate IDs [] | PASS | no provider |
| AI-12 | Chat | When is the Human-Computer Interaction Assignment 2 due? | Fallback; no unrelated course evidence | HTTP 200; grounded=True; source IDs=[1] | FAIL | mocked deterministic quote selector; not live model behavior |

Full exact responses, quotations and candidate excerpts: [ai-probe.json](ai-probe.json). Reproduction: `PYTHONPATH=backend:database python docs/sis1011/evidence/baseline/ai_probe.py` from repository root.

Backend command: `python -m pytest backend/tests -q`: **77 passed**, one Starlette TestClient deprecation warning, exit 0. [Log](ratislav-pytest.log). Runtime packages: FastAPI 0.162.2, Pydantic 2.14.3, OpenAI SDK 2.54.0, pytest 9.2.0, httpx 0.28.1.

## Confirmed issue: SC-ISS-002

AI-10 reproduces the issue already selected in the team issue log: the exact named HCI course has no Assignment 2, yet unscoped retrieval returns Database Systems sources 1 and -1. AI-11 is the explicit-course control and correctly returns no candidates. AI-12 shows that a deterministic provider selecting the first eligible verbatim quote causes the API to publish that unrelated evidence as grounded. This does not assert a live provider gave that answer. Expected: restrict candidates to the recognized named course, or fallback when scope conflicts. Severity high / priority P1; owner Ratislav; fix in SIS1011-07.

An ambiguous question without a unique course is also exercised through these course-scope controls; generic cross-course requests remain an MVP limitation. Existing grounded quote verification and provider failure handling passed; neither is reported as newly broken.

Shared QA files are owned by Yerassyl. This scoped evidence file avoids concurrent edits; link or merge its rows into TEST_CASES_AND_RESULTS.md during review.
