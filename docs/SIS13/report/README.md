# SIS13-17 retrospective report draft

Open `SmartCampus_SIS13_Retrospective_Report.pdf` for review. Edit `RETROSPECTIVE_DRAFT.md` to update the narrative. The report contains dated and source-linked evidence plus explicit pending inputs. The visible evidence-draft marker is required while acceptance gates remain open.

From the repository root, fetch the referenced branches if their pinned commits are absent locally, then render with Python 3 and ReportLab 4.4.9.

```sh
git fetch origin codex/sis13-02-event-timeline codex/sis13-08-ux-evidence
python3 docs/SIS13/report/render_report.py
pdfinfo docs/SIS13/report/SmartCampus_SIS13_Retrospective_Report.pdf
pdftoppm -r 100 -png docs/SIS13/report/SmartCampus_SIS13_Retrospective_Report.pdf /tmp/sis13-report
```

Each Markdown `---` creates a page break. The renderer supports headings, paragraphs, separate bullet rows, three- or four-column tables, HTTPS links and image references relative to this folder or in `commit:path` form. The timeline uses the independently approved revision. Check its reference against the accepted register before final submission.

Before release, incorporate the privacy-approved chart and verified interpretation, ranked insights, approved actions, at least two implementations and comparable results, contribution confirmations and speaking plan. Reconcile the PDF with SIS13-04 and SIS13-18. Verify Task Board and source access for the intended readers, then render and inspect all pages and confirm the 8-12 page limit.
