from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_investigation_requires_structured_rationale():
    response = client.post("/api/investigations/order", json={
        "test_id": "ecg", "rationale_options": [], "note": "check symptoms"
    })
    assert response.status_code == 422

def test_investigation_returns_cost_time_and_limitations():
    response = client.post("/api/investigations/order", json={
        "test_id": "ecg",
        "rationale_options": ["Assess electrical evidence"],
        "note": "Educational rationale"
    })
    assert response.status_code == 200
    body = response.json()
    assert body["simulated_cost_points"] >= 0
    assert body["simulated_duration_minutes"] >= 0
    assert body["limitations"]
