# Threat model

## Asset
Hidden case reference findings and answer keys.

## Primary threat
A learner inspects browser network responses, JavaScript state or API payloads to reveal the hidden diagnosis or reference answer.

## Mitigations
- The learner-facing API constructs responses using an explicit allowlist.
- Reference findings are stored separately and are not loaded by public endpoints.
- Automated tests recursively scan API response bodies for forbidden reference keys.
- CI tests unknown IDs and endpoint access behavior.

## Residual risk
A field-name scan alone cannot prove absence of semantic leakage. Review all public response schemas and test endpoints with adversarial fixtures. This prototype has no authentication or production-grade access controls and must not be deployed with real patient data.
