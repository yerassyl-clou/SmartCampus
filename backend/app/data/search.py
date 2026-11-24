"""Owner-scoped search contract."""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class SearchHit:
    document_id: UUID
    owner_key: UUID
    locator: str
    excerpt: str


def scoped_search(hits: list[SearchHit], owner_key: UUID, query: str) -> list[SearchHit]:
    query_folded = query.casefold()
    return [
        hit for hit in hits
        if hit.owner_key == owner_key
        and query_folded in hit.excerpt.casefold()
    ]
