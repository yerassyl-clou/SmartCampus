from uuid import uuid4

import pytest

from backend.app.data.upload_repository import UploadError, reserve_upload
from backend.app.services.document_ingestion import IngestionReason, classify_ingestion


def test_owner_upload_path_and_limit():
    owner = uuid4()
    reservation = reserve_upload(owner, f"{owner}/private.pdf", 1024)
    assert reservation.owner_key == owner

    with pytest.raises(UploadError, match="overlimit"):
        reserve_upload(owner, f"{owner}/large.pdf", 10 * 1024 * 1024 + 1)


def test_cross_owner_upload_path_denied():
    owner = uuid4()
    with pytest.raises(UploadError, match="cross_owner_path"):
        reserve_upload(owner, f"{uuid4()}/private.pdf", 1024)


@pytest.mark.parametrize(
    ("name", "size", "reason"),
    [
        ("course.pdf", 1024, IngestionReason.READY),
        ("course.docx", 1024, IngestionReason.READY),
        ("course.txt", 1024, IngestionReason.UNSUPPORTED),
        ("course.pdf", 10 * 1024 * 1024 + 1, IngestionReason.OVERLIMIT),
    ],
)
def test_ingestion_classification(name, size, reason):
    assert classify_ingestion(name, size).reason == reason


def test_duplicate_fixture():
    assert classify_ingestion("course.pdf", 1024, duplicate=True).reason == IngestionReason.DUPLICATE
