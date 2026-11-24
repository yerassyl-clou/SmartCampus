# SIS13-17 retrospective report

The existing report source and generator produce an 11-page English PDF for review. The contribution table cites the published SIS13 work. The report retains the provenance limitation of the PM-authorized figure. See the [supplementary audit](../quality/FINAL_SUPPLEMENTARY_CHECK.md).

From the repository root, fetch the published SIS13 timeline, emotional-analysis and UX-evidence branches, then run with Python and ReportLab:

```sh
python3 docs/SIS13/report/render_report.py
pdfinfo docs/SIS13/report/SmartCampus_SIS13_Retrospective_Report.pdf
pdftotext docs/SIS13/report/SmartCampus_SIS13_Retrospective_Report.pdf -
```

The source pins the Git objects for the timeline and UX images. The CI figures are original browser captures in `docs/SIS13/evidence/ci/`. The generator rejects an out-of-range page count or content extending beyond the page layout.
