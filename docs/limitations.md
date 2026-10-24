# Limitations

CathLab AI is an educational software prototype. It is not a medical device and must not be used for real-patient diagnosis, treatment selection, medication prescribing, or clinical procedure guidance.

## 3D simulation limitations

- The textured heart is a generic owner-supplied model whose source/redistribution license is not documented in this repository. The alternative BodyParts3D view is a generic adult reference model under CC BY 4.0, not a patient-derived or clinically validated mesh.
- The BodyParts3D asset has separate left- and right-coronary tree meshes. It is not patient-specific, does not encode coronary dominance options, and has not received qualified review for this project.
- The textured view uses simplified, surface-projected teaching paths; they are not the coronary geometry from the BodyParts3D model and may not align precisely with the supplied heart.
- The two heart models are alternatives, not fused assets. Their geometry and surface detail differ.
- Vessel dimensions, coronary branch positions, lesion shape, and device proportions are illustrative and not to scale.
- The adjacent C-arm pane renders the shared scene with a monochrome material and an angle-controlled camera. It is not X-ray attenuation, diagnostic fluoroscopy, contrast transit, dose tracking, or image-quality modelling.
- Guidewire movement is a visual progress control; it does not calculate contact forces, vessel-wall interaction, torque transmission, friction, buckling, perforation risk, or realistic device kinematics.
- Balloon inflation and stent deployment are conceptual visual states, not a simulation of clinically validated device behavior.
- The contrast/angiography mode is a visual effect, not X-ray projection physics, realistic contrast transport, dose modelling, or diagnostic image generation.
- No physiology engine currently models blood flow, pressure, ischemia, myocardial response, or treatment outcome.
- No clinical skill score should be interpreted as validated competency assessment.

## Clinical content limitations

- All cases are synthetic and marked pending review.
- Risk labels and pathway classifications are educational placeholders, not a substitute for validated clinical risk scores or professional judgement.
- Allergy, interaction, emergency and procedure-related content requires qualified clinical review before any educational deployment.
- Hidden reference data must remain separate from learner-facing responses.

## Software limitations

- The backend tests do not establish clinical validity.
- The frontend build must be run locally after installing the Three.js dependency.
- The event timeline is a simple UI log; deterministic fixed-timestep physiology and golden-file replay are not implemented.
- Reviewer notes are stored locally in the browser or downloaded by the user; they are not sent to a review service.
- WebGL model rendering requires a supported browser and GPU. Clinical review and licensing checks are still required before external distribution.
