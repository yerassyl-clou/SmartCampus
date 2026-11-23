# Emotional Seismograph workflow demonstration

**AI-simulated test data.** This fixture exercises the SIS13-06 workflow. Member 1–4 are columns in the simulation. The scores carry no attribution to real participants, consent or evidentiary weight. Keep the figure and example out of the official SIS13 report and defense.

**Inputs and outputs:** [Simulated CSV](ratings.simulated.csv) · [Demonstration PNG](EMOTIONAL_SEISMOGRAPH.simulated.png) · [Frozen SIS13-01 roster v1.0](https://github.com/yerassyl-clou/SmartCampus/blob/d903dfbb3317fff7fdce856b6643fffc33a1071f/docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md)

## Example interpretation using simulated values

The simulated team mean peaks at **+4.50** at E-03, when the SIS 10–11 integration merged. It bottoms at **−3.00** at E-05, the recorded delay in ClickUp closure work. The largest adjacent drop is **7.25 points** from E-04 to E-05, followed by the largest rebound of **6.50 points** at E-06. The spreads at or above four points are E-05 (**4**), E-07 (**6**), E-08 (**5**) and E-11 (**4**). The synthetic scores at E-07 range from −2 to +4, showing how a positive average of +1.00 can coexist with scores of opposite signs. The event titles describe the project history, and the simulated inputs provide no evidence about anyone’s emotional response or its cause. In the real retrospective, invite participants to explain any large spreads privately and use only their approved context when proposing a follow-up.

## Reproduce and verify

Use Python 3.12.1, Matplotlib 3.11.2 and Pillow 13.0.0 for the recorded run. Execute from the repository root. If needed, fetch PR #32 before reading the frozen commit.

```sh
git fetch origin refs/pull/32/head
git show d903dfbb3317fff7fdce856b6643fffc33a1071f:docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md > /tmp/sis13-roster-v1.md
python3 docs/SIS13/emotional-seismograph/render_seismograph.py \
  --roster /tmp/sis13-roster-v1.md \
  --csv docs/SIS13/emotional-seismograph/demonstration/ratings.simulated.csv \
  --output /tmp/EMOTIONAL_SEISMOGRAPH.simulated.png
python3 docs/SIS13/emotional-seismograph/demonstration/check_simulated_workflow.py \
  --roster /tmp/sis13-roster-v1.md \
  --official-csv /path/to/SIS13-05/ratings.csv
```

In the second command, point `--official-csv` to the existing blank SIS13-05 CSV from PR #36 when repeating this checkpoint. The checks compare all 11 exact means, extrema, adjacent changes and inclusive spread flags. They verify five chart entries through the renderer, reproduce the committed 2160 × 1215 PNG pixel for pixel in the recorded environment, and exercise rejection of malformed input and official output names for the simulated source.
