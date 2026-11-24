from uuid import uuid4

import pytest

from backend.app.data.cleanup import CleanupError, CleanupJob, complete_cleanup
from backend.app.data.search import SearchHit, scoped_search
from backend.app.data.usage import QuotaError, QuotaLedger


def test_quota_reservation_is_idempotent():
    ledger = QuotaLedger(limit_amount=10)
    assert ledger.reserve("one", 4) == 4
    assert ledger.reserve("one", 4) == 4
    assert ledger.used_amount == 4


def test_quota_rejects_overflow_and_negative():
    ledger = QuotaLedger(limit_amount=10)
    with pytest.raises(QuotaError, match="quota_exceeded"):
        ledger.reserve("two", 11)
    with pytest.raises(QuotaError, match="invalid_amount"):
        ledger.reserve("three", -1)


def test_search_is_owner_scoped_and_case_folded():
    owner = uuid4()
    other = uuid4()
    document = uuid4()
    hits = [
        SearchHit(document, owner, "pdf:1", "Қазақстан University"),
        SearchHit(document, other, "pdf:2", "Қазақстан Other"),
    ]
    result = scoped_search(hits, owner, "UNIVERSITY")
    assert len(result) == 1
    assert result[0].owner_key == owner


def test_cleanup_cross_owner_and_completed_state():
    owner = uuid4()
    job = CleanupJob(owner, uuid4())
    completed = complete_cleanup(job, owner)
    assert completed.status == "completed"
    with pytest.raises(CleanupError, match="cross_owner_denied"):
        complete_cleanup(job, uuid4())
