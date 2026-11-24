"""Check submitted retrospective records as part of the existing offline PR job."""

import re
import runpy
from pathlib import Path

import pytest


DOCS = Path(__file__).resolve().parents[2] / "docs/SIS13"
ROSTER = DOCS / "event-timeline/EVENT_EVIDENCE_REGISTER.md"
INSIGHTS = DOCS / "insight-backlog/INSIGHT_BACKLOG.md"


def records(path, pattern):
    rows = path.read_text(encoding="utf-8").splitlines()
    entries = [(match[1], row) for row in rows if (match := re.match(pattern, row))]
    ids = [key for key, _ in entries]
    assert entries, f"No records found in {path.name}"
    assert len(ids) == len(set(ids)), f"Duplicate IDs in {path.name}"
    return dict(entries)


def test_submitted_actions_trace_to_ranked_insights_and_events():
    if not ROSTER.exists() or not INSIGHTS.exists():
        pytest.skip("Awaiting the event register and ranked insights")
    events = records(ROSTER, r"^\|\s*(E-\d+)\s*\|")
    insights = records(INSIGHTS, r"^\|\s*\d+\s*/\s*(I-\d+)\s*\|")
    for key, row in insights.items():
        references = set(re.findall(r"E-\d+", row.split("|")[2]))
        assert references and references <= events.keys(), f"Invalid event references for {key}"

    plan = DOCS / "improvement-plan/ACTION_PLAN.md"
    if plan.exists():
        actions = records(plan, r"^\|\s*\*\*(A-\d+)\*\*")
        for key, row in actions.items():
            references = set(re.findall(r"I-\d+", row.split("|")[1]))
            assert references and references <= insights.keys(), f"Invalid insights for {key}"


def test_submitted_ratings_match_roster():
    folder = DOCS / "emotional-seismograph"
    ratings = folder / "ratings.csv"
    if not ratings.exists() or not ROSTER.exists():
        pytest.skip("Awaiting ratings and roster")
    validator = runpy.run_path(str(folder / "render_seismograph.py"))
    validator["read_ratings"](ROSTER, ratings)
