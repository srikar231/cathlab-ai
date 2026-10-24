import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def test_pathways_have_evidence_and_classification():
    case = json.loads((ROOT / "cases/definitions/CASE-ACS-001.json").read_text(encoding="utf-8"))
    pathways = case["public_case"]["pathways"]
    assert pathways
    for pathway in pathways:
        assert pathway["classification"] in {
            "acceptable", "acceptable_with_caveats", "not_recommended"
        }
        assert "supports" in pathway
        assert "against" in pathway
        assert "unknowns" in pathway
        assert pathway["reason"]
