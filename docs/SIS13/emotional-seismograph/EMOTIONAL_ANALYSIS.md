# SIS13-06 Emotional Seismograph and interpretation

**Status:** Provisional, pending four independently submitted and publication-approved rating vectors.

The [frozen SIS13-01 register](https://github.com/yerassyl-clou/SmartCampus/blob/d903dfbb3317fff7fdce856b6643fffc33a1071f/docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md) and [SIS13-02 timeline](https://github.com/yerassyl-clou/SmartCampus/blob/61230601ccd026071db44b6a8ca7a600f7065e81/docs/SIS13/event-timeline/EVENT_TIMELINE.md) establish the same 11-event chronology. SIS13-05 had zero confirmed submissions at the initial 23 November 2026 checkpoint (Asia/Almaty). The chart, numerical conclusions and interpretation are pending.

## Generate the final deliverables

1. Obtain the accepted [SIS13-05 CSV](https://github.com/yerassyl-clou/SmartCampus/pull/36) after Danaya confirms all four independently supplied vectors and coded-publication permissions. Record its commit and the accepted roster revision. Use those sources for the official chart.
2. On the SIS13-06 branch, use the accepted `ratings.csv` path and the pinned roster. If SIS13-05 has not yet been integrated, point `--csv` at its verified checkout. Install Matplotlib and Pillow in a Python environment, then run from the repository root:

```sh
python3 docs/SIS13/emotional-seismograph/render_seismograph.py \
  --roster /path/to/pinned/EVENT_EVIDENCE_REGISTER.md \
  --csv docs/SIS13/emotional-seismograph/ratings.csv \
  --output docs/SIS13/emotional-seismograph/EMOTIONAL_SEISMOGRAPH.png
```

3. Recalculate and review the extrema, adjacent changes and all spreads of at least four points. Inspect the generated PNG for five entries, event order, axis range and readability. Omit `--output` to validate an in-progress CSV.
4. Replace this provisional status with a five- to eight-sentence interpretation. Include the observed peaks, troughs, shifts, spreads, supported context and one next-sprint lesson. Confirm any individual explanation with its author before using it.
5. Update PR #37 with the official PNG, source revisions, interpretation and validation results. Move SIS13-06 to Review only after all acceptance requirements are met.

## Demonstration

The [workflow demonstration](demonstration/SIMULATED_ANALYSIS.md) has its own AI-simulated CSV and visibly labeled PNG. To switch to production, use the accepted SIS13-05 input path in the command above. The simulation files stay in the demonstration directory.
