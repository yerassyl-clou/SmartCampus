# SIS13-06 Emotional Seismograph and interpretation

**Status:** Provisional, pending four independently submitted and publication-approved rating vectors.

The [frozen SIS13-01 register](https://github.com/yerassyl-clou/SmartCampus/blob/d903dfbb3317fff7fdce856b6643fffc33a1071f/docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md) and [SIS13-02 timeline](https://github.com/yerassyl-clou/SmartCampus/blob/ade37867c78aea95d59925b4729753044c5d0165/docs/SIS13/event-timeline/EVENT_TIMELINE.md) establish the same 11-event chronology. SIS13-05 had zero confirmed submissions at the initial 23 November 2026 checkpoint (Asia/Almaty). The chart, numerical conclusions and interpretation are pending.

## Reproduce after receipt and consent

Use the pinned SIS13-01 event register and the accepted SIS13-05 CSV. With Python 3 and Matplotlib and Pillow installed, run from the repository root:

```sh
python3 docs/SIS13/emotional-seismograph/render_seismograph.py \
  --roster /path/to/pinned/EVENT_EVIDENCE_REGISTER.md \
  --csv docs/SIS13/emotional-seismograph/ratings.csv \
  --output docs/SIS13/emotional-seismograph/EMOTIONAL_SEISMOGRAPH.png
```

Omit `--output` to validate an in-progress CSV. The renderer verifies the header and event sequence, checks the integer scale and recalculates complete-row means. With four complete vectors it reports tied extremes, adjacent mean changes and every event with a spread of at least four points. Review those outputs and the PNG, then write five to eight sentences on observed peaks, troughs, shifts and differences, with approved context and a next-sprint lesson. Keep explanations that require personal confirmation pending until the member provides it.
