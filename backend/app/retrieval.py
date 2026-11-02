"""Deterministic retrieval from the fictional SQLite course materials.

Public interface for the chat workstream:

    search_course_materials("Assignment 2", course_id=1)
    # [{"id": 1, "title": "Mock Database Systems syllabus",
    #   "excerpt": "Assignment 2 deadline: 2026-11-06. ..."}]

Each result is a source object with an SQLite record ID, source title, and
verbatim excerpt. Results are ordered by relevance and then by record ID.
"""

from __future__ import annotations

import re
import sqlite3
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


def _tokens(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", value.lower()))


def _database_is_uninitialized(error: sqlite3.OperationalError) -> bool:
    return "no such table" in str(error).lower()


def _score(query: str, *fields: str) -> int:
    query_tokens = _tokens(query)
    if not query_tokens:
        return 0
    field_tokens = _tokens(" ".join(fields))
    return len(query_tokens & field_tokens)


def search_course_materials(
    query: str,
    course_id: int | None = None,
    *,
    limit: int = 10,
    database_path: Path | str | None = None,
) -> list[Source]:
    """Return relevant document/deadline evidence for a course question.

    The search is intentionally small and deterministic: it tokenizes the
    query and scores exact keyword matches in titles, source titles, content,
    and deadline dates. Unknown or blank queries return an empty list.
    """
    if not query.strip() or limit <= 0:
        return []

    course_filter = ""
    parameters: list[object] = []
    if course_id is not None:
        course_filter = "AND d.course_id = ?"
        parameters.append(course_id)

    try:
        rows = fetch_all(
            f"""
            SELECT d.id, d.title, d.content, d.source_title
            FROM documents AS d
            WHERE 1 = 1 {course_filter}
            """,
            tuple(parameters),
            database_path,
        )
    except sqlite3.OperationalError as error:
        if _database_is_uninitialized(error):
            return []
        raise

    scored = [
        (
            _score(query, row["title"], row["source_title"], row["content"]),
            row,
        )
        for row in rows
    ]
    matching_documents = [
        row for score, row in sorted(scored, key=lambda item: (-item[0], item[1]["id"]))
        if score > 0
    ]
    if matching_documents:
        return [
            {
                "id": row["id"],
                "title": row["source_title"],
                "excerpt": row["content"],
            }
            for row in matching_documents[:limit]
        ]

    deadline_filter = ""
    deadline_parameters: list[object] = []
    if course_id is not None:
        deadline_filter = "AND dl.course_id = ?"
        deadline_parameters.append(course_id)
    try:
        deadlines = fetch_all(
            f"""
            SELECT dl.id, dl.title, dl.due_date, dl.source_title
            FROM deadlines AS dl
            WHERE 1 = 1 {deadline_filter}
            """,
            tuple(deadline_parameters),
            database_path,
        )
    except sqlite3.OperationalError as error:
        if _database_is_uninitialized(error):
            return []
        raise

    scored_deadlines = [
        (
            _score(query, row["title"], row["source_title"], row["due_date"]),
            row,
        )
        for row in deadlines
    ]
    return [
        {
            "id": row["id"],
            "title": row["source_title"],
            "excerpt": f"{row['title']} deadline: {row['due_date']}",
        }
        for score, row in sorted(
            scored_deadlines, key=lambda item: (-item[0], item[1]["id"])
        )
        if score > 0
    ][:limit]


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

    try:
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
    except sqlite3.OperationalError as error:
        if _database_is_uninitialized(error):
            return []
        raise
    return [dict(row) for row in rows]  # type: ignore[return-value]
