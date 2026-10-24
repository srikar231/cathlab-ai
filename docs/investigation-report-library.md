# CathLab AI — Expanded Synthetic Investigation Report Library

**Version:** 1.1.0  
**Status:** Draft; all new cases pending qualified clinical review.  
**Purpose:** Case-based educational simulation and software testing only. **Not for real-patient diagnosis, treatment, prescribing, triage, or procedural guidance.**

## Coverage at a glance

| Case ID | Scenario | Frequency grouping | Teaching tier |
|---|---|---|---|
| `CASE-UA-004` | Common: suspected unstable angina with non-diagnostic initial tests | Common ACS presentation | High concern / urgent assessment |
| `CASE-RCA-STEMI-005` | Common emergency: inferior STEMI with possible right-ventricular involvement | Common ACS / STEMI | Severe / emergency |
| `CASE-MVD-006` | Common: multivessel coronary disease with diabetes | Common coronary anatomy / Heart Team | High risk / complex revascularization discussion |
| `CASE-LM-007` | Less common but critical: significant left-main coronary disease | High-risk anatomy | High risk / potentially unstable anatomy |
| `CASE-CTO-008` | Common specialist case: chronic total occlusion with stable symptoms | Chronic coronary syndrome | Elective / specialist complexity |
| `CASE-BIF-009` | Common complex PCI planning: LAD–diagonal bifurcation lesion | Complex coronary lesion | Intermediate-to-high anatomical complexity |
| `CASE-CALC-010` | Common specialist case: heavily calcified coronary stenosis | Complex PCI planning | High anatomical complexity |
| `CASE-STENT-011` | Common emergency: suspected acute stent thrombosis after prior PCI | Post-PCI emergency | Severe / emergency |
| `CASE-SCAD-012` | Rare/less common: spontaneous coronary artery dissection (SCAD) | Rare mechanism | Potential ACS / diagnosis-sensitive |
| `CASE-MINOCA-013` | Rare/important: myocardial infarction with non-obstructive coronary arteries (MINOCA working diagnosis) | Diagnostic uncertainty | High concern / mechanism unresolved |
| `CASE-VASO-014` | Rare/under-recognized: suspected vasospastic angina with non-obstructive arteries | ANOCA/INOCA spectrum | Variable / mechanism-focused |
| `CASE-EMBOLIC-015` | Rare: suspected coronary embolism | Rare ACS mechanism | High concern / mechanism-specific |
| `CASE-NOREFLOW-016` | Rare complication: no-reflow after simulated PCI | Cath-lab complication simulation | Severe procedural complication |
| `CASE-PERF-017` | Rare complication: suspected coronary perforation during intervention simulation | Cath-lab complication simulation | Severe procedural complication |
| `CASE-ANOM-018` | Rare: anomalous coronary origin discovered during evaluation | Rare coronary anatomy | Variable / anatomy clarification |

The labels “common” and “rare/less common” are for curriculum coverage, not prevalence estimates. Mild/moderate/severe are simulation tiers, not validated clinical risk scores. All measurements, ECG interpretations and angiographic descriptions are synthetic placeholders. No formal GRACE/TIMI score is generated unless a separate reviewed implementation supplies every required input and validated logic.

## Standard report fields — required in every case

Every case should display the following, with **not tested / not available / pending** kept distinct from normal:

- **1. Case header:** Case ID/version, fictional patient ID, report date/time relative to scenario, report status, author, clinical reviewer, review date, schema version, seed and provenance.
- **2. Presenting complaint:** Chief complaint, onset, duration, pattern, severity description, radiation, associated symptoms, provoking/relieving factors, recurrence and current symptom status.
- **3. Relevant history:** Prior CAD/MI/PCI/CABG, heart failure, arrhythmia, diabetes, hypertension, dyslipidaemia, kidney disease, stroke, bleeding, pregnancy/postpartum context where relevant, family history, smoking/substances and other comorbidities.
- **4. Medication reconciliation:** Name/class if available, indication, last dose/adherence, recent changes, over-the-counter/herbal/substance exposure where relevant, interaction checks, antiplatelet/anticoagulant history and unresolved unknowns. No dosing advice in the prototype.
- **5. Allergy/reaction record:** Substance, exact agent if known, reaction description, timing, severity, treatment required, date, certainty, source of history and whether verified. “Unknown” is not the same as “no allergy.”
- **6. Examination and vitals:** HR/rhythm, BP, RR, oxygen saturation, temperature, mental status, perfusion, respiratory signs, heart-failure signs and repeated measurements/time stamps.
- **7. ECG report:** Acquisition time, rhythm/rate, ST/T/QRS findings, territory, reciprocal changes, comparison to prior ECG, serial changes, quality limitations and whether expert interpretation is pending.
- **8. Laboratory report:** Serial hs-cTn values with fictional assay name/units/99th percentile and collection times; CBC/hemoglobin/platelets; renal function/eGFR; electrolytes; glucose/HbA1c; lipids where relevant; coagulation/bleeding context where relevant; abnormal/normal/not-tested flags and limitations.
- **9. Echocardiography:** LVEF and method/uncertainty, regional wall motion, RV size/function, valves, pericardium/effusion, volume status clues, image quality and limitations.
- **10. Other imaging/testing:** Stress imaging, coronary CT, cardiac MRI, chest imaging, physiology or intravascular imaging only when relevant; report indication, findings, limitations, status and why it changes the differential.
- **11. Coronary anatomy report:** Dominance if supplied; left main, LAD (proximal/mid/distal, diagonals/septals), LCx (proximal/mid/distal, OM branches), RCA (proximal/mid/distal, PDA/PL branches); lesion site/length, estimated severity, morphology/calcification/thrombus/dissection/bifurcation/CTO descriptors, flow grade, collaterals, image quality, non-culprit disease and explicit uncertainty.
- **12. Haemodynamics/complications:** Only if present: pressures and method, rhythm events, oxygenation, perfusion, shock/heart-failure signs, procedural complication markers and timestamped trend. Mark not measured if absent.
- **13. Differential diagnosis:** Working diagnosis, supporting evidence, evidence against, unresolved alternatives and what additional finding would change confidence.
- **14. Risk framing:** Simulation tier, reason for tier, instability flags and missing inputs. Clearly separate a qualitative tier from any validated score.
- **15. Diagnostic pathway options:** Each option classified acceptable / acceptable with caveats / not recommended; reason, benefits, risks, missing information, timing implications and rationale rubric.
- **16. Therapeutic pathway options:** Medical-management review, further diagnostic assessment, PCI evaluation, CABG/Heart Team review or non-coronary work-up as scenario-appropriate. State why options are considered; no drug doses or step-by-step procedural instructions.
- **17. Safety checklist:** Allergy/reaction verification, kidney/contrast risk, bleeding risk, medication interaction/adherence review, consent, patient preference, monitoring, escalation triggers and hard-stop alerts.
- **18. Simulation timeline:** Event time, learner action, result released, alert level, acknowledgement, response time, state change, simulated outcome and reproducible seed.
- **19. Outcome/debrief:** Reference outcome, what learner did, missed opportunities, alternate pathway comparison, what-if replay and limitations of the evidence.
- **20. Governance:** Clinical reviewer sign-off, sources used, revision history, dataset/model version and approval status. Until approved, show a visible “synthetic / pending review” banner.

## Case reports

### 1. CASE-UA-004 — Common: suspected unstable angina with non-diagnostic initial tests

**Curriculum grouping:** Common ACS presentation  
**Simulation tier:** High concern / urgent assessment  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 64-year-old Female; fictional ID `CASE-UA-004-P01`.  
- **Chief complaint:** New chest pressure at rest lasting 12 minutes, resolved before assessment; two similar episodes over 24 hours.  
- **History of present illness:** Central pressure with radiation to left shoulder; no fever or pleuritic component reported. Symptom pattern is new and increasing in frequency.  
- **Relevant history:** Hypertension; Dyslipidaemia; Former smoker; No known prior MI or coronary intervention.  
- **Medication reconciliation:** Fictional home list: antihypertensive and lipid-lowering therapy; exact names/adherence to be reconciled.  
- **Allergy record:** No known drug allergy recorded in this scenario; verify directly rather than assuming absence.

#### B. Initial examination
- **Vitals/clinical state:** HR 88 bpm; BP 142/84 mmHg; RR 18/min; SpO2 98% room air; temperature 36.8 C; alert, no shock signs in initial snapshot.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Sinus rhythm; nonspecific ST-T changes; no diagnostic ST elevation. Repeat ECG during recurrent symptoms is not yet available.  
- **Laboratory panel:** hs-cTn fictional assay: 0 h below 99th percentile; repeat sample at scenario-defined interval remains below threshold without significant delta. CBC without major abnormality; creatinine 0.9 mg/dL; potassium 4.1 mmol/L; glucose 118 mg/dL. These are synthetic values.  
- **Echocardiography:** LVEF 55%; no definite regional wall-motion abnormality; no significant pericardial effusion. Image quality adequate in this teaching report.  
- **Coronary/other imaging:** No coronary anatomy study supplied at entry. If invasive angiography is selected in the reference branch, it shows mild diffuse plaque with no focal stenosis >50% and TIMI 3 flow in all major vessels.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Possible unstable angina / NSTE-ACS remains a working diagnosis because symptoms are crescendo/rest symptoms; biomarker-negative results do not alone exclude unstable angina. Non-cardiac causes remain in differential.  
- **Differential diagnoses:** Unstable angina / NSTE-ACS; Oesophageal reflux or spasm; Musculoskeletal pain; Pulmonary cause if symptoms/signs support it.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `urgent_review` — Urgent clinical assessment, serial ECG/biomarkers and risk-based disposition | **acceptable** | Crescendo/rest symptoms require careful assessment even with initially negative biomarkers. |
| `selective_invasive` — Specialist-led invasive evaluation if risk profile or recurrence supports it | **acceptable with caveats** | Choice depends on full risk assessment, recurrence, local pathway and patient factors. |
| `dismiss` — Discharge based only on one normal ECG and one negative troponin | **not recommended** | Ignores symptom trajectory and limitations of single time-point testing. |

#### F. Safety review  
Confirm symptom onset and serial testing timing; reconcile medicines; document allergy details; assess renal function, bleeding risk, pregnancy possibility where relevant, consent and escalation plan before any invasive pathway.

#### G. Simulated course and outcome  
Reference branch: no culprit obstructive lesion found; learner receives a debrief on why the diagnosis remains clinical and why no automatic PCI target exists.

#### H. Learning objectives
- Distinguish unstable angina from biomarker-positive MI without overclaiming certainty.
- Use serial testing and clinical trajectory.
- Avoid automatic angiography or PCI without a reasoned indication.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 2. CASE-RCA-STEMI-005 — Common emergency: inferior STEMI with possible right-ventricular involvement

**Curriculum grouping:** Common ACS / STEMI  
**Simulation tier:** Severe / emergency  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 59-year-old Male; fictional ID `CASE-RCA-STEMI-005-P01`.  
- **Chief complaint:** Sudden severe chest pressure with nausea, sweating and light-headedness for 45 minutes.  
- **History of present illness:** Persistent symptoms at rest. Learner should recognize a time-critical presentation; the scenario is not designed to teach procedural steps.  
- **Relevant history:** Type 2 diabetes; Hypertension; Current smoker; No prior coronary intervention reported.  
- **Medication reconciliation:** Fictional medication list incomplete at arrival; medication reconciliation pending.  
- **Allergy record:** No known allergy documented initially; verify with patient/records.

#### B. Initial examination
- **Vitals/clinical state:** HR 52 bpm; BP 92/60 mmHg; RR 22/min; SpO2 95% room air; cool extremities and diaphoresis; reassessment required.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Inferior ST elevation pattern in II, III and aVF with reciprocal change in I/aVL in the synthetic tracing. Right-sided leads are pending in the initial data.  
- **Laboratory panel:** Initial hs-cTn may be non-diagnostic early; repeat trend rises above the fictional assay threshold. Creatinine 1.1 mg/dL; potassium 4.3 mmol/L; CBC without major abnormality.  
- **Echocardiography:** LVEF approximately 45%; inferior wall hypokinesis. Right-ventricular size/function assessment is limited on first view; additional focused assessment is pending.  
- **Coronary/other imaging:** Reference angiogram: acute thrombotic proximal RCA occlusion, TIMI 0 flow before simulated reperfusion; left main without significant stenosis, LAD mild plaque, LCx mild plaque. Anatomy is fictional.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Acute inferior STEMI pattern; possible right-ventricular involvement and bradyarrhythmia/hypotension risk require urgent team assessment.  
- **Differential diagnoses:** Acute inferior STEMI; Aortic syndrome if clinical features suggest it; Pericarditis/myocarditis in appropriate context; Non-coronary causes of chest pain.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `activate_emergency` — Immediate STEMI emergency pathway and reperfusion-team activation | **acceptable** | The ECG/clinical pattern is time-critical; do not wait for troponin confirmation when emergency criteria are met. |
| `focused_assessment` — Rapid assessment for RV involvement and haemodynamic instability in parallel with escalation | **acceptable with caveats** | Should not delay emergency reperfusion pathway. |
| `wait_biomarker` — Wait for serial troponin before escalating | **not recommended** | A critical timing trap in a compatible STEMI presentation. |

#### F. Safety review  
Emergency escalation; continuous rhythm/hemodynamic monitoring in simulation; document allergy status, renal function when available, bleeding risk and medication reconciliation without delaying time-critical activation.

#### G. Simulated course and outcome  
Reference branch: simulated reperfusion restores flow; post-event scenario monitors rhythm, blood pressure, heart failure and recurrent ischemia. Alternative branch: delay triggers deterministic hypotension/bradyarrhythmia event.

#### H. Learning objectives
- Recognize inferior STEMI pattern.
- Consider RV involvement and instability.
- Escalate in parallel rather than waiting for biomarkers.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 3. CASE-MVD-006 — Common: multivessel coronary disease with diabetes

**Curriculum grouping:** Common coronary anatomy / Heart Team  
**Simulation tier:** High risk / complex revascularization discussion  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 70-year-old Male; fictional ID `CASE-MVD-006-P01`.  
- **Chief complaint:** Progressive exertional dyspnoea and chest tightness over six weeks, now occurring with minimal activity.  
- **History of present illness:** Symptoms reproducible with exertion, relieved by rest. No persistent rest pain in the initial snapshot; symptoms have progressed.  
- **Relevant history:** Type 2 diabetes for 15 years; Chronic kidney disease stage 3 in fictional history; Hypertension; Dyslipidaemia.  
- **Medication reconciliation:** Fictional medication list incomplete; assess adherence and drug interactions.  
- **Allergy record:** No known allergy documented; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 78 bpm; BP 136/78 mmHg; RR 17/min; SpO2 97%; afebrile; no acute shock features.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Sinus rhythm; nonspecific ST-T changes; no acute ST-elevation pattern.  
- **Laboratory panel:** Serial hs-cTn without significant rise/fall in the fictional stable presentation. Hb 12.1 g/dL; creatinine 1.5 mg/dL; eGFR reported as 44 mL/min/1.73 m2 (synthetic); potassium 4.5 mmol/L; HbA1c 8.2%; LDL-C 118 mg/dL.  
- **Echocardiography:** LVEF 48%; mild global hypokinesis; no acute mechanical complication.  
- **Coronary/other imaging:** Reference angiogram: diffuse calcified disease with ~75% proximal LAD, ~80% mid LCx/large OM, and ~80% proximal RCA lesions; left main 20%; flow TIMI 3 in all three territories. Synthetic SYNTAX-like complexity descriptor is “high complexity”; no formal score is calculated.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Symptomatic multivessel obstructive coronary artery disease with diabetes and CKD; revascularization strategy requires individualized multidisciplinary review.  
- **Differential diagnoses:** Multivessel epicardial CAD; Heart failure contribution to dyspnoea; Anaemia/deconditioning; Pulmonary disease.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `heart_team` — Heart Team discussion comparing medical therapy, PCI feasibility and CABG suitability | **acceptable** | Anatomical complexity, diabetes, LV function, renal risk and patient goals all matter. |
| `ad_hoc_multivessel` — Proceed with a broad multivessel PCI plan without reviewing complexity or renal risk | **not recommended** | Skips key individualized planning and contrast/renal-risk review. |
| `medical_review` — Optimize guideline-directed chronic coronary disease management and reassess symptoms | **acceptable with caveats** | Medical therapy is essential; whether it is sufficient depends on complete review and symptoms/anatomy. |

#### F. Safety review  
Renal function/contrast exposure planning, anemia/bleeding review, diabetes management, medication reconciliation, informed consent and discussion of PCI versus surgical options are required in the educational checklist.

#### G. Simulated course and outcome  
Reference branch: case is referred to a Heart Team decision node rather than rewarding a single automatic intervention. Learner compares expected benefits, risks and unknowns.

#### H. Learning objectives
- Describe disease in each major vessel and lesion complexity.
- Explain why diabetes/multivessel anatomy can change the revascularization discussion.
- Include CKD and patient preferences.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 4. CASE-LM-007 — Less common but critical: significant left-main coronary disease

**Curriculum grouping:** High-risk anatomy  
**Simulation tier:** High risk / potentially unstable anatomy  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 66-year-old Female; fictional ID `CASE-LM-007-P01`.  
- **Chief complaint:** Exertional chest pressure with a recent increase in frequency and reduced exercise tolerance.  
- **History of present illness:** No pain at the moment of the initial assessment; recent symptoms are more frequent than baseline.  
- **Relevant history:** Hypertension; Dyslipidaemia; Family history of premature CAD.  
- **Medication reconciliation:** Fictional statin and antihypertensive listed; verify exact agents and adherence.  
- **Allergy record:** Prior rash to an unspecified antibiotic; not a contrast allergy; details require verification.

#### B. Initial examination
- **Vitals/clinical state:** HR 76 bpm; BP 130/76 mmHg; RR 16/min; SpO2 98%; stable in the snapshot.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Sinus rhythm with nonspecific ST-T changes; no diagnostic ST elevation.  
- **Laboratory panel:** Serial hs-cTn below fictional threshold with no significant delta; CBC, renal function and electrolytes included in pre-procedure panel and require review.  
- **Echocardiography:** LVEF 52%; no definite resting regional wall-motion abnormality.  
- **Coronary/other imaging:** Reference angiography: visually estimated 60–70% distal left-main narrowing extending toward bifurcation; LAD and LCx ostia involved to a lesser degree; RCA 40% disease; TIMI 3 flow. Image interpretation is synthetic and intentionally leaves uncertainty requiring specialist review/intravascular assessment where appropriate.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Potentially significant left-main disease; exact severity and revascularization strategy require careful expert assessment. Risk tier is not a formal score.  
- **Differential diagnoses:** Obstructive left-main CAD; Intermediate lesion with visual estimation uncertainty; Non-cardiac chest symptoms coexisting with CAD.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `expert_review` — Prompt specialist/Heart Team review and clarification of lesion severity/anatomy | **acceptable** | Left-main location and bifurcation involvement carry important prognostic implications. |
| `blind_stent` — Treat based only on a single visual percentage without anatomical/clinical review | **not recommended** | Visual estimation uncertainty and complex anatomy make this an unsafe shortcut. |
| `ignore` — Dismiss because troponin is negative | **not recommended** | Negative biomarkers do not exclude high-risk chronic coronary anatomy. |

#### F. Safety review  
Review renal function, contrast reaction history, bleeding risk, consent, medication list and urgency; avoid using the scenario to prescribe a specific revascularization choice without complete Heart Team context.

#### G. Simulated course and outcome  
Reference branch: lesion is escalated for expert anatomy review and Heart Team discussion; no one-click treatment answer is revealed as universally correct.

#### H. Learning objectives
- Recognize high-risk coronary anatomy.
- Separate ACS biomarker status from anatomic risk.
- Discuss uncertainty and Heart Team decision-making.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 5. CASE-CTO-008 — Common specialist case: chronic total occlusion with stable symptoms

**Curriculum grouping:** Chronic coronary syndrome  
**Simulation tier:** Elective / specialist complexity  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 63-year-old Male; fictional ID `CASE-CTO-008-P01`.  
- **Chief complaint:** Persistent exertional angina despite a reported trial of anti-anginal therapy.  
- **History of present illness:** Symptoms for several months, stable in the last two weeks; no acute rest pain in the entry scenario.  
- **Relevant history:** Prior MI several years earlier; Hypertension; Former smoker.  
- **Medication reconciliation:** Medication list incomplete; assess adherence, contraindications and symptom response.  
- **Allergy record:** No known allergies recorded; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 70 bpm; BP 124/74 mmHg; RR 15/min; SpO2 98%; stable.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Old inferior Q-wave pattern in the synthetic ECG; no new ischemic change.  
- **Laboratory panel:** No acute hs-cTn rise/fall in the stable scenario; renal function and CBC available for elective planning; exact values to be confirmed in case file.  
- **Echocardiography:** LVEF 50%; mild inferior hypokinesis; viability is not fully established by resting echo alone.  
- **Coronary/other imaging:** Reference angiography: chronic total occlusion of mid RCA with collateral filling distal vessel; estimated occlusion length 25 mm, moderate calcification, proximal cap ambiguity in image-quality notes; LAD 40%, LCx 30%; TIMI 0 across occluded segment with distal collateral filling.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Chronic total occlusion (CTO) in a patient with stable symptoms; symptom burden, ischemia/viability, anatomy, procedural complexity and patient goals determine whether specialist CTO evaluation is appropriate.  
- **Differential diagnoses:** Symptomatic CTO-related ischemia; Scar-related symptoms or LV dysfunction; Non-cardiac chest discomfort; Microvascular disease.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `specialist_cto_review` — Specialist review of symptoms, ischemia/viability and CTO complexity | **acceptable** | The decision is individualized; symptom benefit and procedural risk must be considered. |
| `automatic_cto_pci` — Automatically attempt CTO PCI because an occlusion is visible | **not recommended** | Anatomic occlusion alone does not establish that intervention is the best option. |
| `medical_reassessment` — Review medical therapy and objective ischemia/symptom burden | **acceptable with caveats** | Appropriate for shared decision-making and assessment of expected benefit. |

#### F. Safety review  
Elective consent, renal/contrast exposure, bleeding risk, comorbidity review, expected benefit, local expertise and alternatives must be discussed.

#### G. Simulated course and outcome  
Reference branch: referral to a specialist decision node; learner compares medical management and intervention evaluation, without catheter wiring instructions.

#### H. Learning objectives
- Identify CTO and collateral filling.
- Recognize limits of resting echo for viability.
- Discuss symptom-driven, expert-led decision-making.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 6. CASE-BIF-009 — Common complex PCI planning: LAD–diagonal bifurcation lesion

**Curriculum grouping:** Complex coronary lesion  
**Simulation tier:** Intermediate-to-high anatomical complexity  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 60-year-old Female; fictional ID `CASE-BIF-009-P01`.  
- **Chief complaint:** Exertional angina with an abnormal stress imaging report.  
- **History of present illness:** Stable exertional symptoms; no acute rest symptoms or dynamic ECG changes in this scenario.  
- **Relevant history:** Dyslipidaemia; Hypertension; No known prior PCI.  
- **Medication reconciliation:** Fictional lipid-lowering medication; medication reconciliation pending.  
- **Allergy record:** No known allergies recorded; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 74 bpm; BP 132/80 mmHg; RR 16/min; SpO2 98%; stable.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Sinus rhythm; no acute ischemic change.  
- **Laboratory panel:** No acute hs-cTn rise/fall. CBC and renal function are supplied for procedural planning; no simulated critical abnormality.  
- **Echocardiography:** LVEF 58%; no resting regional wall-motion abnormality.  
- **Coronary/other imaging:** Reference angiography: 70% proximal LAD lesion involving a sizable first diagonal branch; side-branch ostial narrowing ~60%; LAD TIMI 3, diagonal TIMI 3. Lesion is described as a true bifurcation pattern in this synthetic case; exact classification requires expert image review.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Symptomatic coronary disease involving a bifurcation; lesion significance and strategy depend on anatomy, ischemia, side-branch importance and operator/Heart Team review.  
- **Differential diagnoses:** Epicardial LAD/diagonal ischemia; Microvascular angina; Non-cardiac chest pain.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `imaging_guided_review` — Review anatomy and consider intravascular imaging/physiology where indicated | **acceptable with caveats** | Complex lesion anatomy can benefit from additional characterization; modality selection needs clinical review. |
| `one_size_fits_all` — Assume every bifurcation requires the same stent strategy | **not recommended** | Bifurcation anatomy and branch importance vary. |
| `noninvasive_reassess` — Reassess ischemia evidence and symptoms before elective intervention if uncertainty remains | **acceptable** | Stable presentation permits structured review when no high-risk features are present. |

#### F. Safety review  
Consent should include uncertainty, branch-related risks and alternatives; review renal function, allergy history, bleeding risk and medication interactions.

#### G. Simulated course and outcome  
Reference branch: expert planning node compares anatomy and physiology evidence. Simulation shows branch-flow status as an outcome metric, not step-by-step procedural instructions.

#### H. Learning objectives
- Describe main-vessel and side-branch findings separately.
- Avoid a universal bifurcation strategy assumption.
- Use image quality and uncertainty explicitly.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 7. CASE-CALC-010 — Common specialist case: heavily calcified coronary stenosis

**Curriculum grouping:** Complex PCI planning  
**Simulation tier:** High anatomical complexity  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 72-year-old Male; fictional ID `CASE-CALC-010-P01`.  
- **Chief complaint:** Progressive exertional angina and reduced activity over two months.  
- **History of present illness:** Stable at rest in the scenario; symptoms limit ordinary activity.  
- **Relevant history:** Diabetes; CKD stage 3; Hypertension; Peripheral arterial disease.  
- **Medication reconciliation:** Medication list and adherence review pending.  
- **Allergy record:** Contrast history unknown; must be verified.

#### B. Initial examination
- **Vitals/clinical state:** HR 80 bpm; BP 138/82 mmHg; RR 17/min; SpO2 97%; stable.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Sinus rhythm, nonspecific ST-T changes.  
- **Laboratory panel:** No acute hs-cTn delta; creatinine 1.6 mg/dL and eGFR 41 mL/min/1.73 m2 in synthetic report; Hb 11.8 g/dL; potassium 4.4 mmol/L.  
- **Echocardiography:** LVEF 45%; mild anterior hypokinesis.  
- **Coronary/other imaging:** Reference angiography: 85% heavily calcified proximal-to-mid LAD lesion with moderate tortuosity; TIMI 3 flow; LCx 40%, RCA 50%. Angiographic calcium description is qualitative; intravascular imaging result is not yet supplied.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Symptomatic severe calcified LAD disease; lesion preparation and revascularization planning require expert review, especially given CKD and vascular comorbidity.  
- **Differential diagnoses:** Obstructive calcified LAD disease; Microvascular disease coexisting with epicardial CAD; Heart failure contribution to exercise limitation.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `complex_lesion_review` — Specialist review of lesion morphology and whether intravascular imaging is useful | **acceptable** | Calcification can affect lesion assessment and intervention planning. |
| `standard_assumption` — Assume routine lesion treatment is appropriate without assessing calcium/anatomy | **not recommended** | Ignores lesion complexity and potential procedural risk. |
| `renal_safety_review` — Explicitly review renal function and contrast-sparing planning as appropriate | **acceptable** | CKD is a relevant safety and planning variable. |

#### F. Safety review  
Renal function, contrast exposure, anemia, vascular access considerations, bleeding risk, allergy history and informed consent are mandatory simulation checklist fields.

#### G. Simulated course and outcome  
Reference branch: intravascular imaging clarifies calcium distribution in a synthetic report; learner chooses among reviewed planning options and receives a complication-risk debrief.

#### H. Learning objectives
- Recognize severe calcification and complexity.
- Include CKD and anemia in safety planning.
- Do not present device selection/settings as universal instructions.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 8. CASE-STENT-011 — Common emergency: suspected acute stent thrombosis after prior PCI

**Curriculum grouping:** Post-PCI emergency  
**Simulation tier:** Severe / emergency  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 57-year-old Male; fictional ID `CASE-STENT-011-P01`.  
- **Chief complaint:** Severe chest pressure and sweating several days after a recent coronary stent procedure.  
- **History of present illness:** Pain began suddenly at rest and persists. The scenario requires immediate emergency reassessment.  
- **Relevant history:** Prior PCI 5 days ago in fictional timeline; Diabetes; Medication adherence uncertain.  
- **Medication reconciliation:** Discharge antiplatelet regimen listed but adherence and interruptions are unknown; reconcile urgently.  
- **Allergy record:** Possible previous medication-related rash, culprit unclear; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 104 bpm; BP 104/68 mmHg; RR 22/min; SpO2 94%; anxious and diaphoretic.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** New ST elevation in leads matching the previously treated territory in the synthetic tracing.  
- **Laboratory panel:** Initial hs-cTn elevated with rising repeat; CBC and renal function obtained; platelet count and bleeding history require review.  
- **Echocardiography:** New regional wall-motion abnormality in the stented territory; LVEF estimated 40% in the synthetic report.  
- **Coronary/other imaging:** Reference angiography: thrombotic occlusion within recently placed proximal RCA stent, TIMI 0 flow. Other vessels show moderate non-culprit disease. This is a fictional emergency finding.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Suspected acute stent thrombosis causing acute coronary syndrome; immediate specialist escalation is required in the simulation.  
- **Differential diagnoses:** Stent thrombosis; Stent edge complication/restenosis (timing and context differ); New plaque event in another vessel; Non-coronary cause less likely but assessed by context.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `emergency_cath_review` — Emergency cardiology/cath-lab activation and urgent assessment | **acceptable** | Compatible symptoms and ECG after recent PCI are time-critical. |
| `medication_reconcile_parallel` — Review antiplatelet adherence and interactions in parallel without delaying escalation | **acceptable with caveats** | Important for cause analysis but must not delay emergency care. |
| `routine_followup` — Book routine outpatient follow-up only | **not recommended** | Dangerous under-triage of possible acute coronary occlusion. |

#### F. Safety review  
Emergency escalation, bleeding risk, platelet count, antithrombotic medication history, adherence/interaction review, allergy status and post-event monitoring. No drug dosing in this simulator.

#### G. Simulated course and outcome  
Reference branch: emergency team activation and simulated restoration of flow; debrief examines adherence uncertainty, event timeline and recurrence prevention review.

#### H. Learning objectives
- Recognize possible stent thrombosis.
- Treat medication reconciliation as critical but not a reason to delay escalation.
- Use post-PCI safety monitoring.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 9. CASE-SCAD-012 — Rare/less common: spontaneous coronary artery dissection (SCAD)

**Curriculum grouping:** Rare mechanism  
**Simulation tier:** Potential ACS / diagnosis-sensitive  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 38-year-old Female; fictional ID `CASE-SCAD-012-P01`.  
- **Chief complaint:** Acute chest pain after intense emotional stress; discomfort persists for 30 minutes.  
- **History of present illness:** No known prior coronary disease. Scenario includes a recent major stressor; it is a clue, not proof of SCAD.  
- **Relevant history:** No known diabetes or hypertension; No known prior PCI; Pregnancy/postpartum history must be asked when relevant, not assumed.  
- **Medication reconciliation:** Medication list to be obtained.  
- **Allergy record:** No known allergies recorded; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 92 bpm; BP 118/74 mmHg; RR 18/min; SpO2 98%; stable at initial snapshot.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** T-wave inversion and subtle ST changes in anterior leads; no definitive pattern at first reading.  
- **Laboratory panel:** Serial hs-cTn rises above fictional assay threshold; CBC, renal function and electrolytes without major simulated abnormality.  
- **Echocardiography:** LVEF 50%; mild anterior hypokinesis.  
- **Coronary/other imaging:** Reference angiography: long smooth tapering narrowing in mid-to-distal LAD with preserved distal flow; no obvious focal calcified plaque. Image quality is intentionally limited and diagnosis remains uncertain without expert review.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** SCAD is a differential diagnosis in this synthetic ACS presentation; angiographic appearance must be interpreted by experienced clinicians and distinguished from atherosclerosis/spasm.  
- **Differential diagnoses:** SCAD; Atherosclerotic plaque rupture; Epicardial coronary spasm; Takotsubo syndrome or myocarditis depending on further imaging.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `expert_scad_review` — Escalate for expert review of possible SCAD and stability | **acceptable** | Correct recognition matters because management differs from routine atherosclerotic PCI. |
| `automatic_stent` — Automatically stent a long smooth lesion without confirming mechanism | **not recommended** | Unnecessary intervention can be harmful in SCAD; this is a reasoning trap, not a procedural guide. |
| `further_diagnostic_review` — Consider reviewed diagnostic clarification and myocardial imaging where clinically appropriate | **acceptable with caveats** | Choice depends on stability, uncertainty and expert guidance. |

#### F. Safety review  
Do not make the simulator imply all SCAD requires PCI. Emphasize clinical stability, expert review, associated-condition assessment and monitored care decisions.

#### G. Simulated course and outcome  
Reference branch: expert review favours SCAD; no automatic PCI is performed in the stable synthetic branch. If instability is introduced, route to urgent specialist escalation.

#### H. Learning objectives
- Recognize a non-atherosclerotic cause of ACS.
- Avoid equating every angiographic narrowing with plaque.
- Discuss why intervention decisions differ by mechanism.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 10. CASE-MINOCA-013 — Rare/important: myocardial infarction with non-obstructive coronary arteries (MINOCA working diagnosis)

**Curriculum grouping:** Diagnostic uncertainty  
**Simulation tier:** High concern / mechanism unresolved  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 52-year-old Female; fictional ID `CASE-MINOCA-013-P01`.  
- **Chief complaint:** Acute chest pain with troponin rise and ischemic ECG changes.  
- **History of present illness:** Symptoms began at rest; initial work-up supports myocardial injury, but coronary angiography shows no obstructive lesion.  
- **Relevant history:** Hypertension; No known prior CAD; Recent viral-like illness is included as a possible clue but is not diagnostic.  
- **Medication reconciliation:** Medication list to be reconciled.  
- **Allergy record:** No known allergies recorded; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 86 bpm; BP 126/78 mmHg; RR 18/min; SpO2 98%; stable.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Transient ST-T changes; no persistent STEMI pattern in the available tracing.  
- **Laboratory panel:** Serial hs-cTn shows a clear rise/fall above fictional assay threshold; CBC and renal function without major simulated abnormality.  
- **Echocardiography:** LVEF 53%; subtle inferolateral hypokinesis; no effusion.  
- **Coronary/other imaging:** Reference coronary angiography: no stenosis >=50%; mild irregularities only; TIMI 3 flow. No OCT/IVUS or cardiac MRI result at entry.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** MINOCA is a working description after MI criteria with non-obstructive coronary arteries; it is not a final mechanism diagnosis. Further evaluation is needed to distinguish plaque disruption, spasm, embolism, myocarditis, Takotsubo and other causes.  
- **Differential diagnoses:** Plaque disruption not apparent on angiography; Epicardial or microvascular spasm; Coronary embolism; Myocarditis; Takotsubo syndrome; Supply-demand mismatch.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `mechanism_workup` — Continue structured mechanism-focused evaluation, including cardiac MRI and coronary assessment as clinically appropriate | **acceptable** | MINOCA is a working diagnosis; mechanism determines subsequent management. |
| `label_final` — Stop after writing “MINOCA” as the final cause | **not recommended** | Confuses a working diagnosis with the underlying mechanism. |
| `empiric_everything` — Apply the same treatment pathway to every possible mechanism without review | **not recommended** | Mechanisms differ; the case should teach cause-based reasoning. |

#### F. Safety review  
Review contrast/renal status before additional imaging, check medication and allergy history, monitor for recurrent symptoms and ensure the learner distinguishes myocardial injury from confirmed mechanism.

#### G. Simulated course and outcome  
Reference branch: cardiac MRI suggests a non-ischemic myocarditis pattern in the hidden answer; learner is graded on keeping the differential open and ordering suitable clarification, not guessing early.

#### H. Learning objectives
- MINOCA is not a final etiologic diagnosis.
- Use cardiac MRI and additional tests selectively to resolve mechanism.
- Avoid premature closure.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 11. CASE-VASO-014 — Rare/under-recognized: suspected vasospastic angina with non-obstructive arteries

**Curriculum grouping:** ANOCA/INOCA spectrum  
**Simulation tier:** Variable / mechanism-focused  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 46-year-old Male; fictional ID `CASE-VASO-014-P01`.  
- **Chief complaint:** Brief episodes of chest tightness at rest, often overnight, resolving spontaneously.  
- **History of present illness:** Episodes are intermittent; exertional tolerance between episodes is relatively preserved. Symptoms alone are not diagnostic.  
- **Relevant history:** Current smoker; No known obstructive CAD; No prior MI.  
- **Medication reconciliation:** Medication list to be reconciled; substances that may affect vasomotor tone should be documented by clinical reviewer.  
- **Allergy record:** No known allergies recorded; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 72 bpm; BP 124/76 mmHg; RR 15/min; SpO2 99%; asymptomatic at the current snapshot.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Resting ECG normal between episodes; one fictional captured symptomatic ECG shows transient ischemic ST shift.  
- **Laboratory panel:** Serial hs-cTn remains below fictional threshold without rise/fall in this episode; electrolytes and renal function available.  
- **Echocardiography:** LVEF 60%; no regional wall-motion abnormality at rest.  
- **Coronary/other imaging:** Reference angiography: no obstructive stenosis; TIMI 3 flow. Vasoreactivity testing is not included in the initial report and must only be represented as an expert-led diagnostic option in the simulator.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Possible vasospastic angina; diagnosis requires appropriate clinical context and, when indicated, specialist testing. A normal angiogram does not exclude vasomotor disease.  
- **Differential diagnoses:** Epicardial vasospasm; Microvascular angina/spasm; Reflux or oesophageal spasm; Panic/anxiety-related symptoms only after appropriate evaluation.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `specialist_functional_assessment` — Consider specialist evaluation for ANOCA/INOCA endotypes | **acceptable with caveats** | Testing choice depends on symptom pattern, local expertise, contraindications and clinical review. |
| `normal_angio_dismiss` — Dismiss symptoms because no obstructive lesion is seen | **not recommended** | Non-obstructive anatomy does not exclude vasomotor or microvascular causes. |
| `label_without_evidence` — Diagnose vasospasm from symptom timing alone | **not recommended** | Timing can be a clue but is not sufficient proof. |

#### F. Safety review  
Any provocation-testing depiction must remain high-level and clinician-supervised; include informed consent, rhythm monitoring and contraindication review in the educational checklist, not operational dosing or administration steps.

#### G. Simulated course and outcome  
Reference branch: further specialist functional assessment is selected; case debrief explains uncertainty and distinguishes epicardial from microvascular endotypes.

#### H. Learning objectives
- Recognize angina without obstructive CAD.
- Avoid premature dismissal or diagnosis from one clue.
- Understand that specialized testing requires expertise.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 12. CASE-EMBOLIC-015 — Rare: suspected coronary embolism

**Curriculum grouping:** Rare ACS mechanism  
**Simulation tier:** High concern / mechanism-specific  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 69-year-old Female; fictional ID `CASE-EMBOLIC-015-P01`.  
- **Chief complaint:** Acute chest discomfort with transient ischemic ECG changes and troponin rise.  
- **History of present illness:** History includes atrial fibrillation and recent interruption of prescribed anticoagulation in the fictional scenario; this is a clue requiring verification, not proof of embolism.  
- **Relevant history:** Atrial fibrillation; Hypertension; Prior transient ischemic attack in fictional history.  
- **Medication reconciliation:** Anticoagulation history incomplete; last dose, indication, interruptions and bleeding history must be clarified.  
- **Allergy record:** No known allergies recorded; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 96 bpm irregular; BP 120/74 mmHg; RR 18/min; SpO2 97%; stable.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Transient inferolateral ST-T changes; rhythm strip shows atrial fibrillation.  
- **Laboratory panel:** Serial hs-cTn rises above fictional threshold; CBC, renal function, coagulation-related history and bleeding assessment are required.  
- **Echocardiography:** LVEF 50%; mild inferolateral hypokinesis. Left atrial appendage source is not established by this transthoracic study.  
- **Coronary/other imaging:** Reference angiography: abrupt distal obtuse marginal branch cut-off with little diffuse coronary plaque elsewhere; initial angiogram cannot prove embolic source. TIMI 0 distal branch in initial synthetic image.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Coronary embolism is a differential mechanism; require assessment for alternative plaque event and potential embolic source.  
- **Differential diagnoses:** Coronary embolism; Plaque rupture/erosion; In-situ thrombosis; Vasospasm.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `mechanism_and_source` — Specialist assessment of coronary mechanism and potential embolic source | **acceptable** | Atrial fibrillation history and abrupt branch cut-off support investigation but are not conclusive. |
| `assume_source` — Assume embolism solely because atrial fibrillation is present | **not recommended** | Risk factor does not establish mechanism. |
| `ignore_anticoag` — Ignore anticoagulation history and bleeding risk | **not recommended** | Medication and bleeding history are central safety variables. |

#### F. Safety review  
Reconcile anticoagulant and antiplatelet history, last dose, adherence, renal function, bleeding history and allergy status; do not give dose-specific advice in the simulator.

#### G. Simulated course and outcome  
Reference branch: source evaluation remains part of debrief; learner is scored on considering embolic mechanism without prematurely closing the differential.

#### H. Learning objectives
- Identify clues to embolic coronary occlusion.
- Distinguish clue from proof.
- Treat anticoagulant history and bleeding assessment as essential.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 13. CASE-NOREFLOW-016 — Rare complication: no-reflow after simulated PCI

**Curriculum grouping:** Cath-lab complication simulation  
**Simulation tier:** Severe procedural complication  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 62-year-old Male; fictional ID `CASE-NOREFLOW-016-P01`.  
- **Chief complaint:** The patient initially presents with an acute coronary syndrome; during the simulated intervention, epicardial anatomy appears improved but myocardial perfusion remains poor.  
- **History of present illness:** This is a complication branch attached to an ACS case, not a stand-alone diagnostic presentation.  
- **Relevant history:** Diabetes; Large thrombus burden in the fictional culprit lesion.  
- **Medication reconciliation:** Periprocedural medication record is intentionally incomplete; learner must request reconciliation rather than infer doses.  
- **Allergy record:** Contrast and medication allergy status must be explicitly checked before simulated intervention.

#### B. Initial examination
- **Vitals/clinical state:** Before event: HR 88 bpm, BP 118/72 mmHg. After event: BP trends down and ischemic discomfort persists in the deterministic event timeline.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Persistent ST elevation/ischemic changes after simulated epicardial opening.  
- **Laboratory panel:** Troponin trend expected to rise in the infarction context; no single biomarker can diagnose no-reflow. Hemoglobin, renal function and electrolytes reviewed for safety.  
- **Echocardiography:** New or persistent regional wall-motion abnormality; LVEF estimate 40% in the fictional branch.  
- **Coronary/other imaging:** Simulation report: epicardial vessel is patent after the intervention branch but distal myocardial blush/perfusion is poor; flow grade and image quality must be clearly marked as synthetic.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Suspected no-reflow phenomenon in the educational simulation; exclude mechanical obstruction, dissection, residual lesion and other causes by expert review.  
- **Differential diagnoses:** No-reflow/microvascular obstruction; Residual epicardial obstruction; Dissection or distal embolization; Spasm.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `recognize_and_escalate` — Recognize poor tissue perfusion and activate the reviewed complication-response pathway | **acceptable** | Persistent ischemia despite apparent epicardial patency requires immediate attention in the scenario. |
| `declare_success` — Declare success based only on an open-looking epicardial artery | **not recommended** | Ignores myocardial perfusion and clinical state. |
| `blind_action` — Choose an unreviewed intervention without reassessing cause | **not recommended** | Complication management requires trained clinician judgment and case-specific review. |

#### F. Safety review  
Pause simulation, log event time, record hemodynamic changes, trigger team escalation, document the response and monitor for arrhythmia/shock. No drug doses or procedural maneuvers are provided.

#### G. Simulated course and outcome  
Reference branch: complication is recognized, team response logged and perfusion improves in the simulated outcome; debrief highlights time to recognition and differential checks.

#### H. Learning objectives
- Differentiate epicardial patency from tissue-level perfusion.
- Use deterministic event timeline and escalation.
- Avoid declaring procedural success prematurely.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 14. CASE-PERF-017 — Rare complication: suspected coronary perforation during intervention simulation

**Curriculum grouping:** Cath-lab complication simulation  
**Simulation tier:** Severe procedural complication  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 68-year-old Female; fictional ID `CASE-PERF-017-P01`.  
- **Chief complaint:** During a simulated complex coronary intervention, new hypotension develops and pericardial fluid appears.  
- **History of present illness:** The initial presentation is a stable coronary lesion case; this branch tests recognition of an acute procedural complication.  
- **Relevant history:** Chronic kidney disease in fictional history; Complex calcified lesion in parent scenario.  
- **Medication reconciliation:** Medication record available but requires antithrombotic and bleeding-risk review.  
- **Allergy record:** Contrast/medication allergy status to be verified.

#### B. Initial examination
- **Vitals/clinical state:** Before event: HR 76 bpm, BP 126/74 mmHg. Event: HR 112 bpm, BP 78/48 mmHg, SpO2 93%; immediate simulated deterioration.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Sinus tachycardia with nonspecific ischemic changes; ECG alone does not establish the cause.  
- **Laboratory panel:** CBC/hemoglobin trend and coagulation/antithrombotic context requested; immediate lab values may lag behind clinical deterioration.  
- **Echocardiography:** New pericardial effusion with features concerning for evolving tamponade in the synthetic event; requires urgent expert assessment.  
- **Coronary/other imaging:** Simulation log reports suspected contrast extravasation from a coronary branch; images are abstracted and not a procedural training guide.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Suspected coronary perforation with possible tamponade physiology in a simulated cath-lab event.  
- **Differential diagnoses:** Coronary perforation; Access-site or other hemorrhage; Acute ventricular dysfunction; Vasovagal event (less consistent with effusion finding).  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `pause_escalate` — Pause the training sequence and trigger immediate cath-lab emergency response | **acceptable** | Hemodynamic collapse with new pericardial fluid is a stop-level event. |
| `continue_routine` — Continue the elective procedure without reassessment | **not recommended** | Critical safety failure in the simulation. |
| `document_only` — Record the finding but take no escalation action | **not recommended** | Documentation cannot replace emergency response. |

#### F. Safety review  
Hard stop, deterministic deterioration timeline, event logging, simulated team activation, echo reassessment and post-event debrief. Do not include device-specific sealing steps or procedural maneuvers.

#### G. Simulated course and outcome  
Reference branch: emergency response is activated; the simulator tracks time to recognition and escalation. The case does not teach the technical repair procedure.

#### H. Learning objectives
- Recognize hypotension plus new effusion as an emergency pattern.
- Use a hard-stop safety state.
- Record the event timeline and team response.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

### 15. CASE-ANOM-018 — Rare: anomalous coronary origin discovered during evaluation

**Curriculum grouping:** Rare coronary anatomy  
**Simulation tier:** Variable / anatomy clarification  
**Review status:** Pending qualified clinical review

#### A. Patient identification and presentation
- **Synthetic patient:** 34-year-old Male; fictional ID `CASE-ANOM-018-P01`.  
- **Chief complaint:** Exertional chest discomfort and near-syncope during intense exercise.  
- **History of present illness:** No known coronary disease. Symptoms during exertion require careful risk assessment; the case is not intended to reassure from age alone.  
- **Relevant history:** No known diabetes or hypertension; Family history and sudden-death history must be specifically asked.  
- **Medication reconciliation:** No regular medication reported; verify.  
- **Allergy record:** No known allergies recorded; verify.

#### B. Initial examination
- **Vitals/clinical state:** HR 68 bpm; BP 122/72 mmHg; RR 14/min; SpO2 99%; stable at rest.  
- **Important examination fields:** general appearance, perfusion, respiratory distress, heart failure signs and focused examination are to be timestamped in the interactive report; where not supplied above, mark **not supplied**, not normal.  
- **Current symptoms at first decision:** see presentation; repeat symptom state after each simulated event.

#### C. Investigation reports
- **12-lead ECG:** Resting ECG without acute ischemic changes; exercise-related tracing not supplied.  
- **Laboratory panel:** Serial hs-cTn negative in the current resting assessment; CBC, electrolytes and renal function within fictional reference intervals.  
- **Echocardiography:** LVEF 60%; no resting wall-motion abnormality; coronary origin not fully visualized by transthoracic echo.  
- **Coronary/other imaging:** Reference coronary CT angiography report: anomalous origin of a coronary artery from the opposite sinus with an interarterial course described in the fictional report. Exact vessel/course must be reviewed by specialist; invasive angiography alone may not fully define 3D course.  
- **Additional tests not yet supplied:** physiology, IVUS/OCT, CCTA, CMR, stress imaging, formal risk scores and other studies should show **not ordered/not available** unless explicitly populated. Do not auto-fill normal results.

#### D. Interpretation and differential
- **Working diagnosis:** Potentially important coronary-origin anomaly; anatomical subtype and risk interpretation require specialist imaging review and correlation with symptoms.  
- **Differential diagnoses:** Anomalous coronary origin/course; Exercise-induced arrhythmia; Hypertrophic cardiomyopathy or other structural disease; Non-cardiac exertional symptoms.  
- **Confidence:** qualitative only; explain which findings support the working diagnosis and what uncertainty remains. Do not display an invented probability as a validated clinical estimate.

#### E. Pathway comparison
| Option | Classification | Rationale |
|---|---|---|
| `anatomy_review` — Obtain specialist congenital/coronary-anatomy review and correlate with symptoms | **acceptable** | The course and exact anatomy matter; do not generalize from “anomaly” alone. |
| `dismiss_young` — Dismiss coronary cause because patient is young and resting ECG is normal | **not recommended** | Does not account for exertional near-syncope or anomalous anatomy. |
| `infer_from_angiogram` — Assume 2D angiography fully describes the 3D course | **not recommended** | Cross-sectional imaging may be needed to define the course. |

#### F. Safety review  
Escalation for exertional syncope/near-syncope, activity advice only by clinician, family history, imaging review, informed consent and specialist referral are tracked as educational actions.

#### G. Simulated course and outcome  
Reference branch: specialist review is requested and case remains open pending anatomic risk characterization.

#### H. Learning objectives
- Recognize that rare anatomy can be clinically important.
- Use appropriate imaging to define course.
- Avoid reassurance based solely on age or resting tests.

#### I. Required report completion checklist
- [ ] Every result has a timestamp, units/reference metadata where relevant, source and status.
- [ ] Not-tested, pending, unavailable and normal are distinct states.
- [ ] Coronary vessels/branches not mentioned in the report are marked “not described” rather than presumed normal.
- [ ] Missing values are visible and never silently imputed.
- [ ] Public learner report contains no hidden answer key; reference report remains server-side.
- [ ] Reviewer, review date, schema version and pending-review banner are present.

## Emergency and rare-case authoring rules

- For emergency cases, escalation and event recognition are the learning target; do not make the learner wait for a lab result when the case context already defines a time-critical emergency.
- Rare mechanisms (SCAD, MINOCA, vasospasm, embolism, anomalous coronary origin) should reward differential diagnosis and appropriate expert review, not a single keyword guess.
- Complication cases (no-reflow, suspected perforation/tamponade, stent thrombosis) must support deterministic event timelines, stop-level alerts, action logs and post-event debriefs.
- Do not expose the hidden diagnosis, reference anatomy, event trigger conditions or expected outcome through public API payloads before the learner has reached the appropriate reveal state.
- No real medication doses, device settings, guidewire/catheter manipulation instructions, or patient-specific treatment recommendations belong in this educational prototype.

## Clinical source basis for review

- 2025 ACC/AHA/ACEP/NAEMSP/SCAI Acute Coronary Syndromes guideline overview: https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes
- 2024 ESC Chronic Coronary Syndromes guideline (includes ANOCA/INOCA): https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/chronic-coronary-syndromes/
- AHA Scientific Statement on SCAD: https://professional.heart.org/en/science-news/spontaneous-coronary-artery-dissection-current-state-of-the-science
- AHA Scientific Statement on MINOCA: https://professional.heart.org/en/science-news/contemporary-diagnosis-and-management-of-patients-with-minoca

**Governance:** source links support curriculum review; they do not validate the synthetic numbers or scenario-specific pathways. A qualified interventional cardiologist must review every case and every alert before the cases are marked approved.
