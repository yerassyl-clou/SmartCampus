# A-02 technical change record

The [approved plan](../improvement-plan/ACTION_PLAN.md) assigns implementation credit to Yerassyl Babayev and SIS13-14/15 evidence ownership to Ratislav Ovchinnikov. [PR #42](https://github.com/yerassyl-clou/SmartCampus/pull/42) introduced the shared workflow. It is present in main through merge `25df09f`.

| Measure | Before · EV-14-01 | After · EV-14-02 |
| --- | --- | --- |
| Two defined commands execute and pass on a pull request to main | 0/2. [PR #39 head](https://api.github.com/repos/yerassyl-clou/SmartCampus/commits/668a230d7610c493efa1cf73729ea26b84cae915/check-runs) had zero check runs. | 2/2. [Backend pytest](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788/job/138444191910) and [Frontend build](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788/job/138444191451) both succeeded on `eabdbf3ec15b6c2bc857d87e7420d699125fd8cf`. |

The change uses a read-only GitHub token and independent Ubuntu jobs, each limited to ten minutes. Python 3.12 installs backend requirements and runs the existing offline suite. Node 22 restores the lockfile dependencies and builds the frontend. `git diff --name-only 4aeb0a1...eabdbf3` returned only `.github/workflows/pull-request.yml`. The app, API and SQLite fixture are outside this diff. The separate A-01 keyboard journey belongs to the UX metric.

Trace: E-04/E-09/E-11 → I-02 → A-02 → PR #42 → EV-14-02. The run started 24 November 2026 at 17:28 Almaty. Reviewers can verify its event, head and separate job conclusions in the [Actions record](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788). The denominator is two jobs on one PR. Branch protection, production health and live Groq behavior require separate evidence.
