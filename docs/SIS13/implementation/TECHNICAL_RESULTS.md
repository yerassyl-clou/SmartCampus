# Technical result for the SIS13 retrospective

| Measure on a pull request to main | Baseline | Target | Observed |
| --- | ---: | ---: | ---: |
| Backend pytest and frontend build executed successfully without a manual start | 0/2 | 2/2 | 2/2 |

EV-16-01. The [before revision](https://api.github.com/repos/yerassyl-clou/SmartCampus/commits/668a230d7610c493efa1cf73729ea26b84cae915/check-runs) returned zero check runs. EV-16-02. The [after run](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788) was triggered by a pull request and reported success at `eabdbf3ec15b6c2bc857d87e7420d699125fd8cf`. [Backend pytest](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788/job/138444191910) and [Frontend build](https://github.com/yerassyl-clou/SmartCampus/actions/runs/45393821788/job/138444191451) completed independently.

E-04, E-09 and E-11 support I-02. The team had local verification evidence and an offline test guard. A-02 added the missing PR trigger. Yerassyl implemented [PR #42](https://github.com/yerassyl-clou/SmartCampus/pull/42). Ratislav verified the matching job records for the technical handoff. This single before/after sample measures automation coverage. It supplies no estimate of reliability over time, hours saved or defects prevented.
