from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def scan_hidden(value):
    forbidden = {"reference_findings", "hidden_diagnosis", "true_lesion", "private_answer_key"}
    if isinstance(value, dict):
        for key, nested in value.items():
            assert key not in forbidden, f"Hidden field leaked: {key}"
            scan_hidden(nested)
    elif isinstance(value, list):
        for nested in value:
            scan_hidden(nested)

def test_public_case_does_not_leak_reference_findings():
    response = client.get("/api/cases/CASE-ACS-001")
    assert response.status_code == 200
    body = response.json()
    scan_hidden(body)
    assert "reference_findings" not in body

def test_unknown_case_returns_404():
    assert client.get("/api/cases/CASE-NOT-REAL").status_code == 404

def test_health():
    assert client.get("/health").json()["status"] == "ok"


def test_public_case_file_does_not_contain_reference_findings():
    from pathlib import Path
    import json
    root = Path(__file__).resolve().parents[2]
    body = json.loads((root / "cases/public/CASE-ACS-001.json").read_text(encoding="utf-8"))
    scan_hidden(body)
    assert "reference_findings" not in body

def test_case_catalogue_lists_all_synthetic_cases():
    response = client.get("/api/cases")
    assert response.status_code == 200
    body = response.json()
    assert body["count"] >= 19
    assert any(item["case_id"] == "CASE-SCAD-012" for item in body["cases"])


def test_case_specific_investigation_ordering():
    case = client.get("/api/cases/CASE-STABLE-001").json()
    test = case["investigation_catalog"][0]
    response = client.post("/api/investigations/order", json={
        "case_id": "CASE-STABLE-001",
        "test_id": test["id"],
        "rationale_options": [test["rationale_options"][0]],
        "note": "Synthetic education test"
    })
    assert response.status_code == 200
    assert response.json()["test_id"] == test["id"]
