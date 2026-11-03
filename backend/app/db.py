"""Small SQLite connection and parameterized query helpers."""

from __future__ import annotations

from contextlib import closing
import os
import sqlite3
from pathlib import Path
from typing import Any

DEFAULT_DATABASE_PATH = (
    Path(__file__).resolve().parents[2] / "database" / "smartcampus.db"
)


class DatabaseUnavailable(Exception):
    """The local course database is missing, unreadable, or uninitialized."""


def get_database_path() -> Path:
    path = Path(os.getenv("SMARTCAMPUS_DB_PATH") or DEFAULT_DATABASE_PATH).expanduser()
    # Environment paths have the same meaning from root and backend/.
    return path if path.is_absolute() else Path(__file__).resolve().parents[1] / path


def get_connection(database_path: Path | str | None = None) -> sqlite3.Connection:
    """Open a SQLite connection with foreign keys and named row access enabled."""
    path = Path(database_path or get_database_path()).resolve()
    try:
        # Do not silently create an empty database during a read request.
        connection = sqlite3.connect(path.as_uri() + "?mode=rw", uri=True)
    except sqlite3.DatabaseError:
        raise DatabaseUnavailable() from None
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def fetch_all(
    query: str,
    parameters: tuple[Any, ...] = (),
    database_path: Path | str | None = None,
) -> list[sqlite3.Row]:
    """Run a parameterized SELECT and return all rows."""
    try:
        with closing(get_connection(database_path)) as connection:
            return connection.execute(query, parameters).fetchall()
    except sqlite3.DatabaseError:
        raise DatabaseUnavailable() from None


def fetch_one(
    query: str,
    parameters: tuple[Any, ...] = (),
    database_path: Path | str | None = None,
) -> sqlite3.Row | None:
    """Run a parameterized SELECT and return one row, if present."""
    try:
        with closing(get_connection(database_path)) as connection:
            return connection.execute(query, parameters).fetchone()
    except sqlite3.DatabaseError:
        raise DatabaseUnavailable() from None
