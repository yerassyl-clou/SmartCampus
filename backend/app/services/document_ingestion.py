"""Synthetic, bounded document-ingestion contract."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class IngestionReason(str, Enum):
    READY = "ready"
    CORRUPTED = "corrupted"
    ENCRYPTED = "encrypted"
    SCANNED = "scanned"
    OVERLIMIT = "overlimit"
    UNSUPPORTED = "unsupported"
    DUPLICATE = "duplicate"
    EXPIRED_LEASE = "expired_lease"


@dataclass(frozen=True)
class IngestionResult:
    reason: IngestionReason
    locator: str | None = None
    coverage: int = 0


def classify_ingestion(file_name: str, byte_count: int, duplicate: bool = False) -> IngestionResult:
    if duplicate:
        return IngestionResult(IngestionReason.DUPLICATE)
    if byte_count > 10 * 1024 * 1024:
        return IngestionResult(IngestionReason.OVERLIMIT)
    suffix = file_name.lower().rsplit(".", 1)[-1] if "." in file_name else ""
    if suffix not in {"pdf", "docx"}:
        return IngestionResult(IngestionReason.UNSUPPORTED)
    return IngestionResult(IngestionReason.READY, locator=f"{suffix}:1", coverage=1)
