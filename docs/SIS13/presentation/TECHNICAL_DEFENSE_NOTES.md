# Technical defense notes

**Slide sentence.** Both planned checks ran automatically on the implementation PR and passed. The comparison PR had zero recorded checks.

**Demonstration (45 seconds).** Open the [before head](https://api.github.com/repos/yerassyl-clou/SmartCampus/commits/668a230d7610c493efa1cf73729ea26b84cae915/check-runs) and point to `total_count`. Open the [after run](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788), match its head to `eabdbf3`, then show the pytest and build steps. Credit Yerassyl for the workflow and identify the original SIS12 guard in [PR #30](https://github.com/yerassyl-clou/SmartCampus/pull/30).

**Why those two checks?** The backend suite exercises the API with isolated fixtures. The build checks whether the frontend compiles from its locked dependencies. A failure in either job is visible to the reviewer.

**Does green CI prove the student journey?** The two jobs establish backend regression and frontend build results at the cited revision. The separate keyboard-navigation and browser evidence supports the UX claim.

**What decision follows?** Use both job conclusions when reviewing a PR. Track more PRs before making claims about sustained pass rates or time savings. The report and presentation teams can use the before/target/after row from [Technical results](../implementation/TECHNICAL_RESULTS.md).
