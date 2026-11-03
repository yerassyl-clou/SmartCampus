"""Create a repeatable SQLite database from fictional course data."""

import argparse
import json
import sqlite3
from pathlib import Path

DATABASE_DIR = Path(__file__).resolve().parent
SCHEMA_PATH = DATABASE_DIR / "schema.sql"
DATA_PATH = DATABASE_DIR / "mock_data" / "courses.json"
DEFAULT_DATABASE_PATH = DATABASE_DIR / "smartcampus.db"


def load_database(database_path: Path) -> tuple[int, int, int]:
    with DATA_PATH.open(encoding="utf-8") as data_file:
        data = json.load(data_file)

    with sqlite3.connect(database_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        connection.execute("DELETE FROM documents")
        connection.execute("DELETE FROM deadlines")
        connection.execute("DELETE FROM courses")

        for course in data["courses"]:
            connection.execute(
                "INSERT INTO courses (id, name) VALUES (?, ?)",
                (course["id"], course["name"]),
            )
            connection.executemany(
                """
                INSERT INTO deadlines
                    (id, course_id, title, due_date, source_title)
                VALUES (?, ?, ?, ?, ?)
                """,
                [
                    (
                        deadline["id"],
                        course["id"],
                        deadline["title"],
                        deadline["due_date"],
                        deadline["source_title"],
                    )
                    for deadline in course["deadlines"]
                ],
            )
            connection.executemany(
                """
                INSERT INTO documents
                    (id, course_id, title, content, source_title)
                VALUES (?, ?, ?, ?, ?)
                """,
                [
                    (
                        document["id"],
                        course["id"],
                        document["title"],
                        document["content"],
                        document["source_title"],
                    )
                    for document in course["documents"]
                ],
            )

        counts = tuple(
            connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            for table in ("courses", "deadlines", "documents")
        )
    return counts


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--db",
        type=Path,
        default=DEFAULT_DATABASE_PATH,
        help="SQLite path (default: database/smartcampus.db)",
    )
    args = parser.parse_args()
    args.db.parent.mkdir(parents=True, exist_ok=True)
    courses, deadlines, documents = load_database(args.db)
    print(
        f"Seeded {args.db}: "
        f"courses={courses}, deadlines={deadlines}, documents={documents}"
    )


if __name__ == "__main__":
    main()
