"""Small SQLite connection and parameterized query helpers."""

from __future__ import annotations

import os
import sqlite3
from pathlib import Path
from typing import Any

DEFAULT_DATABASE_PATH = (
    Path(__file__).resolve().parents[2] / "database" / "smartcampus.db"
)


def get_database_path() -> Path:
    return Path(os.getenv("SMARTCAMPUS_DB_PATH", DEFAULT_DATABASE_PATH))


def get_connection(database_path: Path | str | None = None) -> sqlite3.Connection:
    """Open a SQLite connection with foreign keys and named row access enabled."""
    connection = sqlite3.connect(database_path or get_database_path())
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def fetch_all(
    query: str,
    parameters: tuple[Any, ...] = (),
    database_path: Path | str | None = None,
) -> list[sqlite3.Row]:
    """Run a parameterized SELECT and return all rows."""
    with get_connection(database_path) as connection:
        return connection.execute(query, parameters).fetchall()


def fetch_one(
    query: str,
    parameters: tuple[Any, ...] = (),
    database_path: Path | str | None = None,
) -> sqlite3.Row | None:
    """Run a parameterized SELECT and return one row, if present."""
    with get_connection(database_path) as connection:
        return connection.execute(query, parameters).fetchone()
