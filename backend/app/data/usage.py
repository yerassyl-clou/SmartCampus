"""Idempotent quota reservation contract."""

from __future__ import annotations

from dataclasses import dataclass


class QuotaError(ValueError):
    pass


@dataclass
class QuotaLedger:
    limit_amount: int
    used_amount: int = 0
    reservations: dict[str, int] | None = None

    def __post_init__(self) -> None:
        if self.reservations is None:
            self.reservations = {}

    def reserve(self, reservation_key: str, amount: int) -> int:
        if reservation_key in self.reservations:
            return self.reservations[reservation_key]
        if amount < 0:
            raise QuotaError("invalid_amount")
        if self.used_amount + amount > self.limit_amount:
            raise QuotaError("quota_exceeded")
        self.reservations[reservation_key] = amount
        self.used_amount += amount
        return amount
