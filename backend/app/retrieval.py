"""Deterministic retrieval from the fictional SQLite course materials.

Public interface for the chat workstream:

    search_course_materials("Assignment 2", course_id=1)
    # [{"id": 1, "title": "Mock Database Systems syllabus",
    #   "excerpt": "Assignment 2 deadline: 2026-11-06. ..."}]

Each result has a source title and evidence excerpt. Positive IDs identify
documents; negative IDs identify deadline rows. Equal scores prefer documents,
then deterministic record order.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import TypedDict

from .db import fetch_all


class Source(TypedDict):
    id: int
    title: str
    excerpt: str


class Deadline(TypedDict):
    id: int
    course_id: int
    course_name: str
    title: str
    due_date: str
    source_title: str


# Small vocabulary normalization; no external NLP or probabilistic ranking.
STOP_WORDS = set("a an the is are was were be do does did i my me we our have has what when where how should must can for of to in on with and or all show list please information available mock".split())
NORMAL_FORMS = {"deadlines": "deadline", "assignments": "assignment",
                "requirements": "requirement", "rules": "rule",
                "critiques": "critique", "courses": "course"}
GENERIC_WORDS = {"deadline", "due", "requirement", "course"}


def _tokens(value: str) -> set[str]:
    return {NORMAL_FORMS.get(word, word) for word in re.findall(r"[a-z0-9]+", value.lower())} - STOP_WORDS


def _score(query: str, title: str, content: str) -> int:
    query_tokens = _tokens(query)
    field_tokens = _tokens(title + " " + content)
    anchors = query_tokens - GENERIC_WORDS
    # Function words and generic deadline vocabulary cannot establish relevance.
    if not anchors or not anchors & field_tokens:
        return 0
    numbers = {word for word in anchors if word.isdigit()}
    if not numbers <= field_tokens:
        return 0
    return 3 * len(query_tokens & _tokens(title)) + len(query_tokens & field_tokens)


def deadline_source(item: Deadline) -> Source:
    # Negative IDs identify deadline rows; positive IDs identify document rows.
    return {"id": -item["id"], "title": item["source_title"],
            "excerpt": f"{item['course_name']} — {item['title']} deadline: {item['due_date']}"}


def search_course_materials(
    query: str,
    course_id: int | None = None,
    *,
    limit: int = 10,
    database_path: Path | str | None = None,
) -> list[Source]:
    """Rank substantive normalized keywords in documents and deadline rows.

    Course filters apply to both tables. Deadline-only facts are considered even
    when a weaker document matches; source IDs cannot collide across tables.
    """
    if not query.strip() or limit <= 0:
        return []
    rows = fetch_all(
        "SELECT id, content, source_title FROM documents" +
        (" WHERE course_id = ?" if course_id is not None else "") + " ORDER BY id",
        (course_id,) if course_id is not None else (), database_path,
    )
    sources = [{"id": row["id"], "title": row["source_title"], "excerpt": row["content"]}
               for row in rows]
    sources += [deadline_source(item) for item in list_deadlines(course_id, database_path=database_path)]
    scored = [(_score(query, source["title"], source["excerpt"]), index, source)
              for index, source in enumerate(sources)]
    return [source for score, _, source in sorted(scored, key=lambda item: (-item[0], item[1]))
            if score > 0][:limit]


def list_deadlines(
    course_id: int | None = None,
    *,
    database_path: Path | str | None = None,
) -> list[Deadline]:
    """Return deadlines sorted by ISO due date, optionally filtered by course."""
    course_filter = ""
    parameters: tuple[object, ...] = ()
    if course_id is not None:
        course_filter = "WHERE d.course_id = ?"
        parameters = (course_id,)

    rows = fetch_all(
        f"""
        SELECT d.id, d.course_id, c.name AS course_name, d.title,
               d.due_date, d.source_title
        FROM deadlines AS d
        JOIN courses AS c ON c.id = d.course_id
        {course_filter}
        ORDER BY d.due_date ASC, d.id ASC
        """,
        parameters,
        database_path,
    )
    return [dict(row) for row in rows]  # type: ignore[return-value]
