from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "app": "SmartCampus"}


def test_deadlines_endpoint_returns_contract_shape_without_seed_data():
    response = client.get("/api/deadlines")
    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0}


def test_unimplemented_chat_is_not_misrepresented_as_done():
    assert client.post("/api/chat", json={"question": "hello"}).status_code == 501
