from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_allergy_alert_requires_explicit_acknowledgement():
    alert = "Example contrast agent"
    rejected = client.post("/api/safety/acknowledge", json={
        "alert_id": alert, "acknowledged": False
    })
    assert rejected.status_code == 422

    accepted = client.post("/api/safety/acknowledge", json={
        "alert_id": alert, "acknowledged": True
    })
    assert accepted.status_code == 200
    assert accepted.json()["acknowledged"] is True
