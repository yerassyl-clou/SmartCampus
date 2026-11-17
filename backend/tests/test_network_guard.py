import socket

import pytest


def test_external_connection_is_blocked():
    with socket.socket() as sock:
        with pytest.raises(RuntimeError, match='External network disabled'):
            sock.connect(('203.0.113.1', 443))
