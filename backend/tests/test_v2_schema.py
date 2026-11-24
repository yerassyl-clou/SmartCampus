from pathlib import Path
from uuid import uuid4

import pytest

from backend.app.data.repository import RepositoryError, SchemaRepository


ROOT = Path(__file__).resolve().parents[2]


def test_migrations_define_owned_tables_and_rls():
    sql = (ROOT / "database/supabase/migrations/001_workspace.sql").read_text()
    required = [
        "owner_key uuid",
        "enable row level security",
        "owner_key = auth.uid()",
        "auth_profiles",
        "document_chunks",
    ]
    for value in required:
        assert value in sql


def test_grants_do_not_make_normal_users_public():
    sql = (ROOT / "database/supabase/migrations/002_grants.sql").read_text()
    assert "revoke all on all tables" in sql
    assert "grant select, insert, update" in sql


def test_cross_owner_denied():
    repo = SchemaRepository()
    with pytest.raises(RepositoryError, match="cross_owner_denied"):
        repo.verify_owner(uuid4(), uuid4())


def test_verified_consent_and_row_caps():
    repo = SchemaRepository()
    with pytest.raises(RepositoryError, match="verified_consent_required"):
        repo.verify_verified_consent(False)
    with pytest.raises(RepositoryError, match="document_cap_reached"):
        repo.verify_document_cap(10)
    with pytest.raises(RepositoryError, match="course_cap_reached"):
        repo.verify_course_cap(5)
