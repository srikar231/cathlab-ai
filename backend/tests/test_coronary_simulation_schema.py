import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[2]


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def test_coronary_simulation_schema_and_example_are_valid():
    schema = load_json(ROOT / "schemas" / "coronary-simulation.schema.json")
    example = load_json(ROOT / "schemas" / "examples" / "coronary-simulation.example.json")
    Draft202012Validator.check_schema(schema)
    Draft202012Validator(schema).validate(example)


def test_example_parent_links_resolve_and_are_acyclic():
    example = load_json(ROOT / "schemas" / "examples" / "coronary-simulation.example.json")
    segments = {segment["segment_id"]: segment for segment in example["segments"]}
    for segment in segments.values():
        parent = segment["parent_segment_id"]
        assert parent is None or parent in segments
        assert parent != segment["segment_id"]

    for start in segments:
        seen = set()
        current = start
        while current is not None:
            assert current not in seen, f"cycle found from segment {start}"
            seen.add(current)
            current = segments[current]["parent_segment_id"]
