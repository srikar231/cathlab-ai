from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parents[2]
CASE_DIR = ROOT / "cases" / "definitions"
DEFAULT_CASE_ID = "CASE-ACS-001"

app = FastAPI(
    title="CathLab AI Educational API",
    version="0.1.0",
    description=(
        "Educational prototype only. Not for real-patient diagnosis, "
        "treatment, prescribing, or clinical procedure guidance."
    ),
)

allowed_origins = os.getenv(
    "CATHLAB_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

class InvestigationRequest(BaseModel):
    case_id: str = DEFAULT_CASE_ID
    test_id: str
    rationale_options: list[str] = Field(min_length=1)
    note: str = Field(default="", max_length=500)

class AcknowledgeRequest(BaseModel):
    case_id: str = DEFAULT_CASE_ID
    alert_id: str
    acknowledged: bool

class ReplayRequest(BaseModel):
    case_id: str
    seed: int
    actions: list[dict[str, Any]]

def load_case(case_id: str = DEFAULT_CASE_ID) -> dict[str, Any]:
    # Only server-side definitions are loaded; public serialization is allowlisted.
    if not case_id or any(ch not in "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-" for ch in case_id):
        raise HTTPException(status_code=404, detail="Case not found")
    path = CASE_DIR / f"{case_id}.json"
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Case not found")
    with path.open(encoding="utf-8") as file:
        return json.load(file)

def public_case(case: dict[str, Any]) -> dict[str, Any]:
    # Explicit allowlist: never serialize reference_findings.
    return {
        "case_id": case["case_id"],
        "case_version": case["case_version"],
        "seed": case["seed"],
        "schema_version": case["schema_version"],
        "review_status": case["review"]["review_status"],
        "risk_tier": case["public_case"].get("risk_tier", "not_specified"),
        "title": case["public_case"]["title"],
        "presentation": case["public_case"]["presentation"],
        "allergy_history": case["public_case"]["allergy_history"],
        "investigation_catalog": case["public_case"]["investigation_catalog"],
        "pathways": case["public_case"]["pathways"],
        "disclaimer": "Educational simulation only. Not for clinical use."
    }

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "educational-prototype"}

@app.get("/api/cases")
def list_cases() -> dict[str, Any]:
    items = []
    for path in sorted(CASE_DIR.glob("*.json")):
        with path.open(encoding="utf-8") as file:
            case = json.load(file)
        items.append({"case_id": case["case_id"], "title": case["public_case"]["title"], "review_status": case["review"]["review_status"], "risk_tier": case["public_case"].get("risk_tier", "not_specified")})
    return {"count": len(items), "cases": items, "disclaimer": "Synthetic educational cases only; not for clinical use."}

@app.get("/api/cases/{case_id}")
def get_case(case_id: str) -> dict[str, Any]:
    case = load_case(case_id)
    return public_case(case)

@app.post("/api/investigations/order")
def order_investigation(request: InvestigationRequest) -> dict[str, Any]:
    case = load_case(request.case_id)
    catalog = case["public_case"]["investigation_catalog"]
    test = next((item for item in catalog if item["id"] == request.test_id), None)
    if test is None:
        raise HTTPException(status_code=404, detail="Investigation not found")

    allowed = set(test["rationale_options"])
    if not any(option in allowed for option in request.rationale_options):
        raise HTTPException(status_code=422, detail="Select a valid structured rationale")

    # Educational-only deterministic rationale scoring.
    relevant = [option for option in request.rationale_options if option != "No relevant reason"]
    score = 2 if len(relevant) >= 1 else 0
    return {
        "test_id": request.test_id,
        "status": "ordered",
        "rationale_score": score,
        "maximum_rationale_score": 2,
        "simulated_cost_points": test["cost_points"],
        "simulated_duration_minutes": test["duration_minutes"],
        "limitations": test["limitations"],
        "note_feedback": "Free-text note recorded for reflection; it does not change the automated score."
    }

@app.post("/api/safety/acknowledge")
def acknowledge_alert(request: AcknowledgeRequest) -> dict[str, Any]:
    case = load_case(request.case_id)
    alerts = case["public_case"]["allergy_history"]
    alert = next((item for item in alerts if item.get("substance") == request.alert_id), None)
    if alert is None:
        raise HTTPException(status_code=404, detail="Safety alert not found")
    if not request.acknowledged:
        raise HTTPException(status_code=422, detail="Explicit acknowledgement is required")
    return {
        "alert_id": request.alert_id,
        "acknowledged": True,
        "event": "allergy_alert_acknowledged",
        "disclaimer": "Acknowledgement does not establish clinical safety or authorize real-world exposure."
    }

@app.post("/api/replay/hash")
def replay_hash(request: ReplayRequest) -> dict[str, Any]:
    case = load_case(request.case_id)
    if request.seed != case["seed"]:
        raise HTTPException(status_code=422, detail="Unknown case/seed combination")

    # Stable serialization for the starter event-log hash. This is not yet the
    # complete fixed-timestep simulation engine described in the specification.
    canonical = json.dumps(
        {"case_id": request.case_id, "seed": request.seed, "actions": request.actions},
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return {
        "case_id": request.case_id,
        "seed": request.seed,
        "event_log_hash": hashlib.sha256(canonical).hexdigest(),
        "event_count": len(request.actions),
        "notice": "Starter deterministic action-log hash; fixed-step physiology is not implemented yet."
    }

# The Vercel Python function serves the built Vite app and API from one origin.
# In local development the Vite server serves the UI, so this mount is optional.
FRONTEND_DIST = ROOT / "frontend" / "dist"
if FRONTEND_DIST.is_dir():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
