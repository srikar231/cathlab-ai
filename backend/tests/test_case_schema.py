import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[2]

def test_all_case_definitions_validate_against_schema():
    schema = json.loads((ROOT / "schemas/patient-case.schema.json").read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    definitions = sorted((ROOT / "cases/definitions").glob("*.json"))
    assert definitions, "No case definitions found"
    ids = []
    for path in definitions:
        case = json.loads(path.read_text(encoding="utf-8"))
        errors = list(validator.iter_errors(case))
        assert not errors, f"{path.name}: {[error.message for error in errors]}"
        ids.append(case["case_id"])
        assert case["review"]["author"]
        assert case["review"]["clinical_reviewer"]
        assert case["review"]["review_date"]
        assert case["schema_version"] == "1.0.0"
    assert len(ids) == len(set(ids)), "Duplicate case IDs found"
