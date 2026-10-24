# CathLab AI

**Hands-on 3D coronary anatomy and interventional cardiology educational simulation prototype**

> **Educational use only.** The 3D anatomy, device movement, lesion marker, contrast effect, and procedure states are simplified visual simulations. This is not a validated anatomical model and must not be used for real-patient diagnosis, treatment selection, prescribing, or procedural guidance. Clinical content is pending qualified review.

## Current experience: Phase 1 anatomy and projection prototype

The current stack is a browser-based TypeScript/Three.js frontend and a FastAPI backend. The viewer includes:
- A switch between the supplied textured heart and an anatomically segmented BodyParts3D reference heart with separate left/right coronary tree meshes.
- Selectable LAD, RCA, LCx, and left-main teaching targets with short guided anatomy notes.
- A linked simplified monochrome C-arm projection with RAO/LAO and cranial/caudal camera controls.
- Basic guidewire progress and conceptual balloon/stent display controls.
- Synthetic case selection, patient context, a session timeline, and resettable visual state.
- A locally stored/downloadable reviewer-notes workflow. Notes are not transmitted to a service.

This is a **Phase 1 educational prototype**, not a hyperrealistic or clinically accurate simulator. The C-arm view is a camera projection with a monochrome material, not diagnostic fluoroscopy or X-ray physics. Guidewire motion, lesions, balloon, and stent are conceptual visuals. Patient-specific anatomy, collision/contact mechanics, physiology, dose, and clinical recommendations are not implemented. Both model views remain pending qualified review.

## Synthetic case library

The project includes 19 synthetic scenarios in `cases/definitions`, learner-safe versions in `cases/public`, and hidden reference answers in `cases/reference`. See `docs/investigation-report-library.md` for the case report structure. All cases remain `pending_review`; they require qualified cardiology review before use as clinical teaching material.

## Architecture

- `frontend/`: Vite + TypeScript + Three.js
- `backend/`: FastAPI service and case engine
- `schemas/`: versioned JSON Schema
- `cases/public/`: learner-visible data
- `cases/reference/`: reference findings kept separate from public API serialization
- `docs/`: decision log, threat model, limitations, case reports, and data sheet
- `docs/architecture.md`, `docs/phase-plan.md`, `docs/reviewer-checklist.md`: module boundaries, phased acceptance gates, and a real reviewer workflow
- `schemas/coronary-simulation.schema.json`: forward-looking vessel/lesion/device contract; the current UI does not simulate all of these fields

See [docs/architecture.md](docs/architecture.md) for the current data flow and [docs/phase-plan.md](docs/phase-plan.md) for later milestones.

## Anatomy asset credits and licensing

- `frontend/public/models/bodyparts3d-heart.glb` is a curated BodyParts3D 4.0 model with separate coronary tree meshes. Credit: BodyParts3D, © The Database Center for Life Science (DBCLS), CC BY 4.0. See [BODY_PARTS3D_ATTRIBUTION.txt](frontend/public/models/BODY_PARTS3D_ATTRIBUTION.txt).
- The textured `Heart.fbx` was supplied by the project owner. Its original source and redistribution license have not been documented in this repository; confirm permission before publishing or redistributing it.
- The anatomy models are generic reference assets, not patient-specific and not clinically validated. Do not infer patient anatomy or procedural accuracy from their appearance.

## Requirements

- Node.js 20+
- Python 3.11+
- A modern browser with WebGL support

## Run locally

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend docs: http://127.0.0.1:8000/docs

### Frontend

In another terminal, from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local Vite URL printed in the terminal, normally http://localhost:5173.

## Tests

```powershell
cd backend
.venv\Scripts\Activate.ps1
pytest -q
```

Frontend checks:

```powershell
cd frontend
npm test
npm run build
```

The Node built-in tests check the bundled coronary tree nodes, model credit metadata, and C-arm camera angle invariants. These checks do not establish anatomical accuracy or clinical validity.

## Next milestones

1. Add explicit diagnostic workflow states and structured findings.
2. Replace the remaining illustrative surface paths with reviewer-checked vessel geometry aligned to the selected model.
3. Validate projection behavior against documented reference views before expanding the fluoroscopy effect.
4. Add scenario and event schemas with deterministic simulation replay.
5. Consider physiology, device mechanics, and complication modules only with appropriate data, bench validation, and qualified review.
6. Complete anatomy, clinical, accessibility, licensing, privacy, and educational review before any public or clinical use.

## Dataset provenance and safety

Cases are synthetic and manually authored for software development. They are not derived from identifiable patient records. Clinical reviewer status is pending. Do not use this project to guide real patient care.
