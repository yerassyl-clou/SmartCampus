from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "app": "SmartCampus"}


def test_unimplemented_features_are_not_misrepresented_as_done():
    assert client.get("/api/deadlines").status_code == 501
    assert client.post("/api/chat", json={"question": "hello"}).status_code == 501
