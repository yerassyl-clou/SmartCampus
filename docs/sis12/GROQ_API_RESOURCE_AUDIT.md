# SIS12-03: Groq API resource audit

Evidence date: 2026-11-17, Asia/Almaty. Owner: Ratislav. Task: https://app.clickup.com/t/z8q7hbw36w. Related test workflow: https://app.clickup.com/t/z8q7hbw371. Repository baseline: `926ef53230a5a35c415b7219d811480747e2ebba`.

## Configuration and account evidence

`.env.example` specifies `OPENAI_MODEL=openai/gpt-oss-120b` and `OPENAI_BASE_URL=https://api.groq.com/openai/v1`; these are example configuration values, not proof of the deployed environment. `backend/app/services/llm.py` reads the key and model from the environment, passes the optional base URL to the OpenAI-compatible client, uses a 20-second timeout and `max_retries=0`. Missing key or model produces a configuration error. The historical live-tested model is noted in that source; no live call was made for this audit.

No authorized Groq account console or billing evidence was available to this session. Organization, plan, actual configured model, limits, usage and spend therefore require owner confirmation. Do not put account tokens, keys or personal billing data in the repository.

| Resource | Planned usage / limit | Actual usage 4–17 Nov | Difference actual−planned | Problem / response | Evidence |
|---|---|---|---|---|---|
| Requests, tokens, 429s | Account RPM/RPD/TPM/TPD unknown; proposed live smoke ceiling: one selected test per session (planned, not enforced) | Unknown; provider account evidence unavailable | N/A | Quota exhaustion cannot be quantified; check console limits and usage before a live test | [Groq rate limits](https://console.groq.com/docs/rate-limits), accessed 17 Nov 2026 |
| Charges, credits and subscription | Account plan and budget unknown | Unknown | N/A | Cost cannot be inferred from test counts; account owner exports sanitized billing totals | [Groq billing FAQs](https://console.groq.com/docs/billing-faqs), accessed 17 Nov 2026 |

Groq's published developer-plan summary for this model lists 30 RPM, 1,000 RPD, 8,000 TPM and 200,000 TPD. These are general base values, **not verified account limits**; the provider says exact organization limits are in its console. Free-tier limits and account-specific context/output permissions are unknown. The [model page](https://console.groq.com/docs/model/openai/gpt-oss-120b), accessed 17 Nov 2026, lists a 131,072-token context and 65,536 maximum output tokens; these are model documentation, not measured use or a guarantee for this account.

The same model page lists $0.15 per million input tokens and $0.60 per million output tokens. Illustrative only: 1 million uncached input plus 100,000 output tokens = $0.15 + $0.06 = $0.21, before other charges or credits. This is not actual expenditure, a quote, or proof of account pricing. Free-tier eligibility and actual credits are unknown. Gleb should cross-check the published rates, units, arithmetic and account billing evidence for SIS12-07 before inclusion.

## Risks and procedure

| Risk | Owner / monitoring | Mitigation |
|---|---|---|
| Request rate/daily quota exhausted | AI owner checks organization console and response headers before and after authorized live work | Prefer mock regression, stop on 429, respect retry-after; no automatic SDK retries in current code |
| Token quota or context exceeded | AI owner checks model and token headroom | Keep test prompts small; inspect actual token use where available; stop when headroom is insufficient |
| Unknown spend or credentials leaked | Account owner reviews billing and key access | Keep keys server-side and out of logs; use sanitized aggregate evidence only; stop live tests if budget is unconfirmed |

For SIS12-04: run mock-first regression without real credentials; any live test is opt-in. The proposed one-selected-test ceiling is a planning control, not a hard limit on provider requests. Record measured requests and tokens only from authorized account data. For the PM's Part 1/3 tables, configuration is verified from code; account limits, usage, costs and variance are **unknown**, not zero. Owner confirmation required for each account-specific row.
