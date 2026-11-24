# SIS13-06 Emotional Seismograph and interpretation

**Dataset and provenance.** In the “SIS13-05/06 — Final Data Confirmation” project handoff on 24 November 2026 (Asia/Almaty), the PM authorized the existing SIS13-05 CSV as the intended analysis input. Its 44 values and 11 averages were retained exactly. The CSV is byte-identical to the earlier AI-assisted demonstration dataset. Independent original submissions and individual publication consent remain unverified. The chart describes the authorized dataset. Cite this disclosure alongside the chart. [Pinned ratings CSV](https://github.com/yerassyl-clou/SmartCampus/blob/4499cac600607703499170fcfbd2ce219099348f/docs/SIS13/emotional-seismograph/ratings.csv) · [Collection record](https://github.com/yerassyl-clou/SmartCampus/pull/36)

![SmartCampus Emotional Seismograph with four coded score series and their average](EMOTIONAL_SEISMOGRAPH.png)

## Interpretation

The highest average in the dataset was **+4.50** at E-03, when the SIS 10–11 integration merged. The lowest was **−3.00** at E-05, the recorded ClickUp closure delay. The largest adjacent drop was **7.25 points** from E-04 to E-05. The largest adjacent rebound was **6.50 points** from E-05 to E-06, when board closure was recorded. Spreads of at least four points occurred at E-05 (**4**), E-07 (**6**), E-08 (**5**) and E-11 (**4**). At E-07, the range from **−2 to +4** produced a mean of **+1.00**, so the mean obscures the negative value on that row. The event register establishes the sequence of project events, while the unverified provenance limits conclusions about how individual participants experienced them.

[Event evidence register](https://github.com/yerassyl-clou/SmartCampus/blob/d903dfbb3317fff7fdce856b6643fffc33a1071f/docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md) · [Visual timeline](https://github.com/yerassyl-clou/SmartCampus/blob/61230601ccd026071db44b6a8ca7a600f7065e81/docs/SIS13/event-timeline/EVENT_TIMELINE.md)

## Reproduce the figure

1. Use the PM-authorized CSV at commit `4499cac600607703499170fcfbd2ce219099348f` and the frozen register at `d903dfbb3317fff7fdce856b6643fffc33a1071f`.
2. On the SIS13-06 branch, use the authorized `ratings.csv` path and the pinned roster. If SIS13-05 has not yet been integrated, point `--csv` at its verified checkout. Install Matplotlib and Pillow in a Python environment, then run from the repository root:

```sh
python3 docs/SIS13/emotional-seismograph/render_seismograph.py \
  --roster /path/to/pinned/EVENT_EVIDENCE_REGISTER.md \
  --csv docs/SIS13/emotional-seismograph/ratings.csv \
  --output docs/SIS13/emotional-seismograph/EMOTIONAL_SEISMOGRAPH.png
```

3. Recalculate and review the extrema, adjacent changes and all spreads of at least four points. Inspect the generated PNG for five entries, event order, axis range and readability. Omit `--output` to validate an in-progress CSV.
4. Confirm any proposed individual explanation with its author before adding it. The recorded run used Python 3.12.1, Matplotlib 3.11.2 and Pillow 13.0.0. The output decoded at 2160 × 1215 and reproduced pixel for pixel.

## Demonstration

The [workflow demonstration](demonstration/SIMULATED_ANALYSIS.md) has its own AI-simulated CSV and visibly labeled PNG. To switch to production, use the authorized SIS13-05 input path in the command above. The simulation files stay in the demonstration directory.
