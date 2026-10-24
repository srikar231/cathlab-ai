# Development phases and acceptance gates

This plan follows the supplied master brief's instruction to deliver one runnable phase at a time. The project remains a browser prototype; the roadmap does not claim that later modules already exist.

## Phase 1 — anatomy and projection prototype

**Available now**

- Rotatable textured heart and separately switchable BodyParts3D reference anatomy with actual left/right coronary tree geometry.
- LAD, RCA, LCx, and left-main teaching targets with short guided descriptions.
- A linked monochrome C-arm projection pane with RAO/LAO and cranial/caudal camera controls.
- Basic guidewire progress and conceptual device visibility controls.
- Synthetic case selection, event log, local reviewer notes, model credits, and pending-review status.

**Acceptance checks**

- Both model assets load or show a recoverable message.
- The reference model contains both coronary tree meshes and retains attribution.
- Projection angle changes preserve camera distance and move the view in the requested direction.
- The learner can orbit the anatomy, change target vessels, and adjust the projection without network transmission of review notes.
- Educational and non-clinical limitations remain visible.

## Phase 2 — diagnostic angiography

- Add explicit case preparation and acquisition states, including simulated checklist completion and structured image-quality observations.
- Add a vessel/lesion data set with provenance, units, parent links, and review state.
- Move catheter progression to a constrained path over the reference vessel mesh; do not claim realistic tissue contact until validated.
- Generate a structured educational findings report that exposes uncertainty and source data.
- Replace the silhouette preview with a documented simplified projection model and separately tested projection calculations.

## Phase 3 — physiology

- Add synthetic ECG and pressure waveforms with explicit units, deterministic replay, and reference cases.
- Keep FFR/iFR and right-heart calculations in isolated modules with numerical tests and source citations.
- Do not present results as treatment recommendations; require qualified review of all educational thresholds and explanations.

## Phase 4 — therapeutic and complication scenarios

- Add lesion-dependent device visuals only after a validated data contract and bench/reference cases exist.
- Model complications as observable state transitions, with expert-reviewed learning responses.
- Keep device behavior clearly marked as conceptual until bench validation.

## Phase 5 — validation and deployment decision

- Obtain interventional cardiology, cardiac physiology, educational design, and accessibility review.
- Validate anatomy, projections, and mechanics against documented reference data and bench criteria.
- Conduct learner usability and outcome studies with appropriate governance.
- Review privacy, regulatory, security, accessibility, asset licensing, and deployment requirements before public or clinical use.

## Explicitly out of scope for the current phase

Patient-specific anatomy, real X-ray physics, radiation-dose estimation, physiology, FFR/iFR, realistic catheter mechanics, collision detection, haptics, clinical recommendations, competency scoring, and clinical deployment.
