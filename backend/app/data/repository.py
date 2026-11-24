"""In-process repository contract shared with Supabase migrations."""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID


class RepositoryError(ValueError):
    pass


@dataclass(frozen=True)
class WorkspaceRecord:
    id: UUID
    owner_key: UUID


class SchemaRepository:
    """Portable ownership guard for repository implementations."""

    MAX_DOCUMENTS = 10
    MAX_COURSES = 5

    def verify_owner(self, owner_key: UUID, record_owner: UUID) -> None:
        if owner_key != record_owner:
            raise RepositoryError("cross_owner_denied")

    def verify_verified_consent(self, verified_consent: bool) -> None:
        if not verified_consent:
            raise RepositoryError("verified_consent_required")

    def verify_document_cap(self, count: int) -> None:
        if count >= self.MAX_DOCUMENTS:
            raise RepositoryError("document_cap_reached")

    def verify_course_cap(self, count: int) -> None:
        if count >= self.MAX_COURSES:
            raise RepositoryError("course_cap_reached")
