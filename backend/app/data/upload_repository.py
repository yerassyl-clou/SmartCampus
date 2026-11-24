"""Upload reservation and ownership guard."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from uuid import UUID


class UploadError(ValueError):
    pass


@dataclass(frozen=True)
class UploadReservation:
    owner_key: UUID
    object_path: str
    byte_count: int
    expires_at: datetime


def reserve_upload(owner_key: UUID, object_path: str, byte_count: int, now: datetime | None = None) -> UploadReservation:
    if byte_count < 1 or byte_count > 10 * 1024 * 1024:
        raise UploadError("overlimit")
    if not object_path.startswith(f"{owner_key}/"):
        raise UploadError("cross_owner_path")
    now = now or datetime.now(timezone.utc)
    return UploadReservation(owner_key, object_path, byte_count, now + timedelta(minutes=30))
