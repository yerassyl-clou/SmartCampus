import pytest
from seed import load_database


@pytest.fixture(autouse=True)
def database(tmp_path, monkeypatch):
    path = tmp_path / 'test.db'
    load_database(path)
    monkeypatch.setenv('SMARTCAMPUS_DB_PATH', str(path))
    # Tests must never use local credentials, even when backend/.env exists.
    monkeypatch.setenv('OPENAI_API_KEY', 'test-only')
    monkeypatch.setenv('OPENAI_MODEL', 'test-model')
    monkeypatch.setenv('OPENAI_BASE_URL', 'https://provider.invalid/v1')
    return path
