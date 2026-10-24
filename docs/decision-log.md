# Architecture decision log

## ADR-001 — Separate public case data from reference findings
**Decision:** The API constructs public case responses from an explicit allowlist. Reference findings are never returned by the learner-facing case endpoint.  
**Reason:** Hiding fields only in the UI does not protect assessment answers.

## ADR-002 — Deterministic replay
**Decision:** Simulation state and action logs use explicit case seeds and canonical serialization. The current scaffold hashes action logs; a fixed-step simulation engine and golden files remain future work.  
**Reason:** Reproducible sessions are needed for debugging and fair assessment.

## ADR-003 — Rule-based safety checks before generative AI
**Decision:** Allergy acknowledgement and pathway metadata are controlled by explicit application rules.  
**Reason:** Safety-critical behavior should be testable and traceable rather than dependent on generated text.

## ADR-004 — Synthetic educational data first
**Decision:** The prototype uses fictional case data and records review status explicitly.  
**Reason:** It avoids exposing real patient information and makes development reproducible.
