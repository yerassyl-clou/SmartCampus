"""SQLite persistence for anonymous chat feedback."""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .db import DatabaseUnavailable, get_connection


class DuplicateFeedback(Exception):
    """Raised when feedback already exists for a response ID."""


def save_feedback(
    *,
    response_id: str,
    rating: str,
    issue_type: str | None,
    comment: str | None,
    source_ids: list[int],
    database_path: Path | str | None = None,
) -> int:
    """Persist anonymous feedback and return its database ID.

    Validation of UUIDs, enum values, comments, and source IDs belongs to the
    API route. This helper only performs an atomic parameterized insert.
    """
    try:
        with get_connection(database_path) as connection:
            cursor = connection.execute(
                """
                INSERT INTO feedback
                    (response_id, rating, issue_type, comment, source_ids, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    response_id,
                    rating,
                    issue_type,
                    comment,
                    json.dumps(source_ids, separators=(",", ":")),
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
            return int(cursor.lastrowid)
    except sqlite3.IntegrityError as error:
        if "feedback.response_id" in str(error) or "UNIQUE constraint failed" in str(error):
            raise DuplicateFeedback() from None
        raise DatabaseUnavailable() from None
    except sqlite3.DatabaseError:
        raise DatabaseUnavailable() from None


def get_feedback(
    response_id: str,
    *,
    database_path: Path | str | None = None,
) -> dict[str, Any] | None:
    """Read one feedback row for isolated persistence checks."""
    try:
        with get_connection(database_path) as connection:
            row = connection.execute(
                """
                SELECT id, response_id, rating, issue_type, comment, source_ids, created_at
                FROM feedback
                WHERE response_id = ?
                """,
                (response_id,),
            ).fetchone()
    except sqlite3.DatabaseError:
        raise DatabaseUnavailable() from None
    if row is None:
        return None
    result = dict(row)
    result["source_ids"] = json.loads(result["source_ids"])
    return result
