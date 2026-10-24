# CathLab AI architecture

## Current runnable prototype

The repository is a browser-based TypeScript/Three.js application with a FastAPI service. It is not an Unreal or Unity project, so the first implementation milestone stays in the existing stack rather than replacing the working app.

```text
Synthetic case JSON ──> FastAPI allowlisted case API ──> Case brief and learner controls
                                                       │
                                                       ├──> 3D heart scene ──> anatomy camera
                                                       │                   └──> C-arm projection camera
                                                       └──> event timeline / local review notes
```

- `frontend/src/main.ts`: page composition, input events, Three.js scene, model loading, case selection, and session display. Keep clinical facts out of rendering math where practical.
- `frontend/src/projection.js`: pure C-arm camera geometry, isolated so its angle and distance invariants can be tested.
- `frontend/public/models/source/Heart.fbx`: owner-supplied textured model. Its original source and redistribution license are not documented; obtain that information before public distribution.
- `frontend/public/models/bodyparts3d-heart.glb`: CC BY 4.0 reference model with separate left/right coronary tree meshes. Credit is in `BODY_PARTS3D_ATTRIBUTION.txt` and in the viewer.
- `backend/app/main.py`: synthetic case loading, explicit public-field allowlisting, and educational API endpoints. Reference findings remain server-side.
- `cases/definitions`, `cases/public`, `cases/reference`: authoring source, learner-visible serialization, and hidden answer material.
- `schemas`: case and simulation data contracts. The coronary schema is a forward-looking data contract; it does not imply that the renderer or case library currently simulates these fields.

## Phase 1 simulation state

The current shared visual state includes the selected synthetic case, selected coronary target, guidewire progress, device visibility state, contrast toggle, anatomy display mode, and C-arm angles. The anatomy and projection cameras render the same scene, so the projection changes with the same model and visible simulation state.

The anatomy view is interactive and rotatable. The adjacent C-arm pane uses the same mesh with a monochrome material and angle-controlled camera. That is a geometric projection demo, not X-ray attenuation, diagnostic fluoroscopy, contrast transit, dose tracking, or image-quality modelling. Guidewire progress follows a simplified surface path; it has no contact mechanics or collision response.

Feedback notes remain in browser local storage unless the learner explicitly downloads them. There is no remote feedback endpoint and no telemetry collection added by this feature.

## Extension boundaries

Keep anatomy/model provenance, scenario data, procedural events, display code, and simulated mechanics separately reviewable. The next architecture steps are a versioned event/state contract, an explicit diagnostic workflow state machine, and independently tested projection and catheter-path modules. Do not add unvalidated decision support or realistic-looking physics without clinical and bench review plans.
