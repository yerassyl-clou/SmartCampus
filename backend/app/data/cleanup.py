"""Deletion and cleanup contract."""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID


class CleanupError(ValueError):
    pass


@dataclass(frozen=True)
class CleanupJob:
    owner_key: UUID
    document_id: UUID
    status: str = "claimed"


def complete_cleanup(job: CleanupJob, actual_owner: UUID) -> CleanupJob:
    if job.owner_key != actual_owner:
        raise CleanupError("cross_owner_denied")
    if job.status != "claimed":
        raise CleanupError("invalid_cleanup_state")
    return CleanupJob(job.owner_key, job.document_id, "completed")
