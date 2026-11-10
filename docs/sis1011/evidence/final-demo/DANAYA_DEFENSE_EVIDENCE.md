# SmartCampus SIS 10–11 defense

[SIS1011-19](https://app.clickup.com/t/z8q7hbuc8p) · [Editable PowerPoint](SmartCampus_SIS1011_Final_Presentation.pptx)

Ten English slides, 16:9, with speaker notes and links. The visual reference is the earlier SIS 8–9 defense. The deck uses current application captures from fictional data and identifies open PRs and independent QA gates.

| Speaker | Time | Slides |
|---|---|---|
| Yerassyl Babayev | 0:00–2:15 | 1–3, MVP, tests and issue log |
| Danaya Aliyeva | 2:15–4:30 | 4–5, dashboard before/after and feedback |
| Ratislav Ovchinnikov | 4:30–7:15 | 6–7, retrieval and feedback API |
| Gleb Yurtayev | 7:15–9:30 | 8–9, impact, debt, offer and contract |
| Yerassyl Babayev | 9:30–10:00 | 10, QA and submission |

## Evidence for the 12 submission items

| Item | Review evidence |
|---|---|
| 1. Test cases and results | [Baseline audit #6](https://github.com/yerassyl-clou/SmartCampus/pull/6), [AI/retrieval #13](https://github.com/yerassyl-clou/SmartCampus/pull/13), [dashboard #17](https://github.com/yerassyl-clou/SmartCampus/pull/17) |
| 2. Issue log | [Priorities and reproductions #7](https://github.com/yerassyl-clou/SmartCampus/pull/7) |
| 3. Technical debt | [Gleb's technical debt audit #20](https://github.com/yerassyl-clou/SmartCampus/pull/20) |
| 4. Two improvements | [Dashboard fix with paired captures #18](https://github.com/yerassyl-clou/SmartCampus/pull/18), [retrieval fix with before/after candidates #14](https://github.com/yerassyl-clou/SmartCampus/pull/14), [independent QA draft #10](https://github.com/yerassyl-clou/SmartCampus/pull/10) |
| 5. Stories and backlog | [Backlog #9](https://github.com/yerassyl-clou/SmartCampus/pull/9) |
| 6. Change request | [CR-001 and academic decision #8](https://github.com/yerassyl-clou/SmartCampus/pull/8) |
| 7. Impact | [Scope, 40 assumed hours, five days and cost in #20](https://github.com/yerassyl-clou/SmartCampus/pull/20) |
| 8. Feedback feature | [Contract #15](https://github.com/yerassyl-clou/SmartCampus/pull/15), [route #16](https://github.com/yerassyl-clou/SmartCampus/pull/16), [UI #19](https://github.com/yerassyl-clou/SmartCampus/pull/19), [storage #20](https://github.com/yerassyl-clou/SmartCampus/pull/20) |
| 9. Feedback test evidence | [UI and combined local browser/SQLite evidence #19](https://github.com/yerassyl-clou/SmartCampus/pull/19), [independent acceptance draft #11](https://github.com/yerassyl-clou/SmartCampus/pull/11) |
| 10. Commercial offer | [Fictional offer in #20](https://github.com/yerassyl-clou/SmartCampus/pull/20) |
| 11. Fixed-price contract | [Unsigned educational contract in #20](https://github.com/yerassyl-clou/SmartCampus/pull/20) |
| 12. Defense | [Editable deck](SmartCampus_SIS1011_Final_Presentation.pptx) and [final QA draft #12](https://github.com/yerassyl-clou/SmartCampus/pull/12) |

## Original browser captures

- [MVP workspace](danaya-mvp-1440.png), Chromium 1440×900 on baseline `42dcac9`, captured 10 November 2026 against the fictional local seed.
- Dashboard comparison: [before](https://github.com/yerassyl-clou/SmartCampus/blob/4b1ffd47bcf27a03a05debc66b7238690313e0da/docs/sis1011/evidence/baseline/dashboard-1440.png) and [after](https://github.com/yerassyl-clou/SmartCampus/blob/cac7c203727bf12337c7d604f8c6ea79278bebd2/docs/sis1011/evidence/improvements-before-after/dashboard-1440.png). Same viewport, seed and fixed campus date.
- Feedback: [issue form](https://github.com/yerassyl-clou/SmartCampus/blob/b2d8ea5be7cf6327703171b02598a37cf4daf783/docs/sis1011/evidence/feedback-feature/danaya-feedback-1440.png) and [saved after real HTTP 201](https://github.com/yerassyl-clou/SmartCampus/blob/341bd03cd4fb9377b429805cbdef69c00efd8c16/docs/sis1011/evidence/feedback-feature/danaya-feedback-saved.png). Chromium 1440×900, 10 November 2026. The answer is a fictional fixture. The saved state comes from the actual feedback endpoint and SQLite store in the combined checkout.

## Validation and review

The final file passed the package, slide size, heading and import checks. LibreOffice rendered all ten slides. The package includes ten nonempty notes, four speakers and a continuous 10-minute schedule. The team still needs to rehearse its handoffs.

The combined backend test fixture needs reconciliation before integration. Browser feedback persistence passed locally and independent SIS1011-16 QA remains open. The offer and contract use the same illustrative price and terms. This package does not record any real agreement or production deployment.

AI-assisted production. Yerassyl Babayev reviews the deck and its links.
