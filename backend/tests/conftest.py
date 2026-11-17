import pytest
import socket
import ipaddress
from seed import load_database


@pytest.fixture(autouse=True)
def block_external_network(monkeypatch):
    """Keep backend regression tests offline even if provider mocking regresses."""
    original_connect = socket.socket.connect

    def guarded_connect(sock, address):
        if isinstance(address, tuple):
            host = address[0]
            try:
                local = ipaddress.ip_address(host).is_loopback
            except ValueError:
                local = host.lower() == 'localhost'
            if not local:
                raise RuntimeError('External network disabled in backend tests')
        return original_connect(sock, address)

    monkeypatch.setattr(socket.socket, 'connect', guarded_connect)


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
