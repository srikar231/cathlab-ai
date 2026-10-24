from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_replay_hash_is_repeatable():
    payload = {
        "case_id": "CASE-ACS-001",
        "seed": 41027,
        "actions": [
            {"sequence": 1, "type": "open_case", "simulation_time_ms": 0},
            {"sequence": 2, "type": "order_test", "test_id": "ecg", "simulation_time_ms": 1000}
        ]
    }
    first = client.post("/api/replay/hash", json=payload).json()
    second = client.post("/api/replay/hash", json=payload).json()
    assert first["event_log_hash"] == second["event_log_hash"]

def test_replay_hash_changes_when_actions_change():
    base = {"case_id": "CASE-ACS-001", "seed": 41027, "actions": [{"type": "open_case"}]}
    changed = {"case_id": "CASE-ACS-001", "seed": 41027, "actions": [{"type": "order_test", "test_id": "ecg"}]}
    a = client.post("/api/replay/hash", json=base).json()["event_log_hash"]
    b = client.post("/api/replay/hash", json=changed).json()["event_log_hash"]
    assert a != b
