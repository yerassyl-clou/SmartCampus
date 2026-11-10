import sqlite3

import pytest

from app.db import DatabaseUnavailable
from app.feedback_store import DuplicateFeedback, get_feedback, save_feedback
from seed import SCHEMA_PATH, load_database


def test_feedback_persists_and_is_retrievable(database):
    feedback_id = save_feedback(
        response_id="00000000-0000-4000-8000-000000000001",
        rating="not_helpful",
        issue_type="wrong_date",
        comment="The date needs review.",
        source_ids=[1, -2],
        database_path=database,
    )
    saved = get_feedback(
        "00000000-0000-4000-8000-000000000001",
        database_path=database,
    )
    assert saved is not None
    assert saved["id"] == feedback_id
    assert saved["source_ids"] == [1, -2]
    assert saved["created_at"].endswith("+00:00")


def test_duplicate_response_id_is_rejected(database):
    kwargs = {
        "response_id": "00000000-0000-4000-8000-000000000002",
        "rating": "helpful",
        "issue_type": None,
        "comment": None,
        "source_ids": [],
        "database_path": database,
    }
    save_feedback(**kwargs)
    with pytest.raises(DuplicateFeedback):
        save_feedback(**kwargs)


def test_feedback_table_is_added_to_an_existing_course_database(tmp_path):
    path = tmp_path / "existing.db"
    with sqlite3.connect(path) as connection:
        connection.executescript(
            """
            CREATE TABLE courses (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
            CREATE TABLE deadlines (
                id INTEGER PRIMARY KEY, course_id INTEGER NOT NULL, title TEXT NOT NULL,
                due_date TEXT NOT NULL, source_title TEXT NOT NULL
            );
            CREATE TABLE documents (
                id INTEGER PRIMARY KEY, course_id INTEGER NOT NULL, title TEXT NOT NULL,
                content TEXT NOT NULL, source_title TEXT NOT NULL
            );
            INSERT INTO courses VALUES (1, 'Existing Course');
            """
        )
    assert load_database(path) == (3, 6, 6)
    save_feedback(
        response_id="00000000-0000-4000-8000-000000000003",
        rating="helpful",
        issue_type=None,
        comment=None,
        source_ids=[],
        database_path=path,
    )
    assert get_feedback(
        "00000000-0000-4000-8000-000000000003",
        database_path=path,
    ) is not None


def test_repeat_seed_preserves_feedback(database):
    save_feedback(
        response_id="00000000-0000-4000-8000-000000000004",
        rating="helpful",
        issue_type=None,
        comment=None,
        source_ids=[-1],
        database_path=database,
    )
    assert load_database(database) == (3, 6, 6)
    assert get_feedback(
        "00000000-0000-4000-8000-000000000004",
        database_path=database,
    ) is not None


def test_missing_feedback_database_is_reported(tmp_path):
    with pytest.raises(DatabaseUnavailable):
        save_feedback(
            response_id="00000000-0000-4000-8000-000000000005",
            rating="helpful",
            issue_type=None,
            comment=None,
            source_ids=[],
            database_path=tmp_path / "missing.db",
        )
