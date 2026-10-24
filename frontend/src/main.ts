import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { projectionCameraPosition } from './projection.js';

type CaseSummary = { case_id: string; title: string; review_status: string; risk_tier: string };
type CaseResponse = {
  case_id: string; case_version: string; seed: number; schema_version: string; review_status: string;
  risk_tier: string; title: string;
  presentation: { age: number; symptoms: string[]; history: string[]; vitals: Record<string, number>; notice: string };
  allergy_history: Array<{ substance: string; reaction: string; severity: string; status: string; requires_acknowledgement: boolean }>;
  investigation_catalog: Array<{ id: string; name: string; cost_points: number; duration_minutes: number; limitations: string; rationale_options: string[] }>;
  pathways: Array<{ id: string; label: string; classification: string; reason: string }>;
  disclaimer: string;
};

// Use same-origin API routes in production; Vite proxies /api to FastAPI locally.
const API = import.meta.env.VITE_API_BASE_URL ?? '';
const MODEL_URL = '/models/source/Heart.fbx'; // Included detailed heart FBX model
const REFERENCE_MODEL_URL = '/models/bodyparts3d-heart.glb';
const root = document.querySelector<HTMLDivElement>('#app')!;

let cases: CaseSummary[] = [];
let patient: CaseResponse | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let fluoroCamera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let animationFrame = 0;
let heartGroup: THREE.Group | null = null;
let loadedAnatomy: THREE.Object3D | null = null;
let referenceAnatomy: THREE.Object3D | null = null;
let anatomyMixer: THREE.AnimationMixer | null = null;
let anatomyView: 'surface' | 'reference' = 'surface';
let schematicOverlayMode: 'opaque' | 'translucent' | 'hidden' = 'hidden';
const schematicTubes: THREE.Mesh[] = [];
let lastCycleDisplay = '';

function updateOverlayMode(mode: 'opaque' | 'translucent' | 'hidden') {
  schematicOverlayMode = mode;
  const btnOpaque = document.querySelector<HTMLButtonElement>('#overlay-opaque-btn');
  const btnTrans = document.querySelector<HTMLButtonElement>('#overlay-trans-btn');
  const btnHidden = document.querySelector<HTMLButtonElement>('#overlay-hidden-btn');
  if (btnOpaque) {
    btnOpaque.style.background = mode === 'opaque' ? 'var(--cyan)' : '#0e1a29';
    btnOpaque.style.color = mode === 'opaque' ? '#050b13' : '#fff';
    btnOpaque.style.borderColor = mode === 'opaque' ? 'var(--cyan)' : 'var(--line)';
  }
  if (btnTrans) {
    btnTrans.style.background = mode === 'translucent' ? 'var(--cyan)' : '#0e1a29';
    btnTrans.style.color = mode === 'translucent' ? '#050b13' : '#fff';
    btnTrans.style.borderColor = mode === 'translucent' ? 'var(--cyan)' : 'var(--line)';
  }
  if (btnHidden) {
    btnHidden.style.background = mode === 'hidden' ? 'var(--cyan)' : '#0e1a29';
    btnHidden.style.color = mode === 'hidden' ? '#050b13' : '#fff';
    btnHidden.style.borderColor = mode === 'hidden' ? 'var(--cyan)' : 'var(--line)';
  }
  addLog(`Coronary overlay opacity updated to: ${mode}`);
}

function setAnatomyView(view: 'surface' | 'reference') {
  anatomyView = view;
  if (loadedAnatomy) loadedAnatomy.visible = view === 'surface';
  if (referenceAnatomy) referenceAnatomy.visible = view === 'reference';
  const viewDescription = document.querySelector('#view-description');
  if (viewDescription) viewDescription.textContent = view === 'reference'
    ? 'BodyParts3D reference · 3D coronary trees · drag to orbit'
    : 'Your textured heart · surface view · drag to orbit';
  const modelCredit = document.querySelector('#model-credit');
  if (modelCredit) modelCredit.innerHTML = view === 'reference'
    ? 'Reference model: <a href="https://organui.com/docs/components/heart" target="_blank" rel="noopener noreferrer">BodyParts3D 4.0, DBCLS · CC BY 4.0</a> · generic reference anatomy; expert review pending.'
    : 'Textured heart supplied with this project · natural surface artery detail; choose Anatomy for highlighted coronary trees.';
  const surfaceBtn = document.querySelector<HTMLButtonElement>('#view-surface-btn');
  const referenceBtn = document.querySelector<HTMLButtonElement>('#view-reference-btn');
  for (const [button, active] of [[surfaceBtn, view === 'surface'], [referenceBtn, view === 'reference']] as const) {
    if (!button) continue;
    button.setAttribute('aria-pressed', String(active));
    button.style.background = active ? 'var(--cyan)' : '#0e1a29';
    button.style.color = active ? '#050b13' : '#fff';
    button.style.borderColor = active ? 'var(--cyan)' : 'var(--line)';
  }
  addLog(view === 'reference'
    ? 'Showing the BodyParts3D reference heart with separate left and right coronary trees.'
    : 'Showing the supplied textured heart with reference coronary trees. Device markers are hidden.');
}

let wire: THREE.Mesh | null = null;
let balloon: THREE.Mesh | null = null;
let stentGroup: THREE.Group | null = null;
let contrastParticles: THREE.Points | null = null;
let selectedArtery = 'LAD';
let wireProgress = 0.08;
let deployed = false;
let balloonInflated = false;
let contrastOn = false;
let angiographyMode = false;
let simEvents: string[] = ['Simulation ready. Select a control to begin.'];
let curves: Record<string, THREE.CatmullRomCurve3> = {};
let resizeObserver: ResizeObserver | null = null;
let modelLoaded = false;
let cArmObliqueDeg = 0;
let cArmTiltDeg = 0;

const arteryNames: Record<string, string> = {
  LAD: 'Left anterior descending (LAD)',
  RCA: 'Right coronary artery (RCA)',
  LCX: 'Left circumflex (LCx)',
  LM: 'Left main (LM)'
};
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function esc(v: unknown) {
  return String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
function logEvent(text: string) {
  simEvents.unshift(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · ${text}`);
  simEvents = simEvents.slice(0, 7);
}
function renderShell() {
  anatomyView = 'reference';
  schematicOverlayMode = 'hidden';
  root.innerHTML = `
  <main class="app-shell">
    <header class="app-header"><div class="brand"><div class="brand-mark">✚</div><div><div class="eyebrow">INTERVENTIONAL CARDIOLOGY · SIMULATION BAY</div><h1>CathLab <span>AI</span></h1></div></div>
      <div class="header-right"><span class="live-dot"></span><span>SIMULATION MODE</span><label class="case-select-label" for="case-picker">PATIENT CASE</label><select id="case-picker" aria-label="Select synthetic patient case"><option>Loading cases…</option></select></div>
    </header>
    <div class="safety-banner"><strong>EDUCATIONAL SIMULATION</strong><span>Fictional anatomy and events. Not for clinical decisions or real procedural guidance.</span><span id="review-status" class="review-chip">Pending review</span></div>
    <section class="workspace">
      <aside class="left-rail">
        <div class="rail-title"><span>01</span><div><b>CASE BRIEF</b><small>Patient context</small></div></div>
        <div id="patient-card" class="patient-card"><div class="skeleton"></div></div>
        <div class="rail-title section-gap"><span>02</span><div><b>ANATOMY TARGET</b><small>Choose a coronary vessel</small></div></div>
        <div class="artery-list">
          ${Object.entries(arteryNames).map(([id, name]) => `<button class="artery-choice ${id === 'LAD' ? 'active' : ''}" data-artery="${id}" aria-pressed="${id === 'LAD'}"><span class="artery-icon" aria-hidden="true">⌁</span><span><b>${id}</b><small>${name.replace(` (${id})`, '')}</small></span><span class="choice-dot" aria-hidden="true"></span></button>`).join('')}
        </div>
        <section id="anatomy-lesson" class="anatomy-lesson" aria-live="polite"></section>
        <div class="anatomy-legend arteries-only-legend"><span><i class="legend-dot red"></i> Coronary arteries · anatomical view</span></div>
      </aside>
      <section class="viewport-panel">
        <div class="viewport-top"><div><div class="eyebrow">LIVE 3D FIELD</div><h2 id="view-title">Coronary anatomy · LAD</h2><p id="view-description">Reference anatomy · drag to orbit · scroll to zoom</p></div><div class="view-actions"><button id="reset-camera" class="icon-btn" title="Reset camera">↺ <span>Reset view</span></button></div></div>
        <section class="cardiac-cycle" aria-label="Animated cardiac cycle phases"><div class="cycle-header"><div><div class="eyebrow">CARDIAC CYCLE</div><h3>Chamber timing</h3></div><div class="cycle-rate"><span class="cycle-pulse" aria-hidden="true"></span><b id="cycle-heart-rate">72</b><small>BPM</small></div><span id="cycle-live-label" class="cycle-live-label" aria-live="polite">Heart cycle running</span></div><div class="cycle-grid"><div class="cycle-row-label">ATRIA</div><article class="cycle-phase" data-cycle="atrial-systole" aria-label="Atrial systole"><span class="phase-status">REST</span><b>Atrial systole</b><small>Contract · prime filling</small></article><article class="cycle-phase" data-cycle="atrial-diastole" aria-label="Atrial diastole"><span class="phase-status">ACTIVE</span><b>Atrial diastole</b><small>Relax · receive blood</small></article><div class="cycle-row-label">VENTRICLES</div><article class="cycle-phase" data-cycle="ventricular-systole" aria-label="Ventricular systole"><span class="phase-status">REST</span><b>Ventricular systole</b><small>Contract · eject blood</small></article><article class="cycle-phase" data-cycle="ventricular-diastole" aria-label="Ventricular diastole"><span class="phase-status">ACTIVE</span><b>Ventricular diastole</b><small>Relax · fill</small></article></div><p class="cycle-note">Atrial systole occurs during late ventricular diastole. Timing is for education, not measurement.</p></section>
        <div id="three-stage" class="three-stage"><div class="stage-hud top-left"><span class="artery-hud-mark" aria-hidden="true"></span> RED BRANCHES = CORONARY ARTERIES <small id="model-status" aria-live="polite">LOADING HEART MODELS</small></div><div class="stage-hud fluoro-pane-label" aria-hidden="true">CORONARY ARTERIES · PROJECTION ONLY</div><div class="fluoro-divider" aria-hidden="true"></div><div class="stage-hud bottom-left"><span id="stage-mode">PUMPING HEART</span><small>Educational anatomy · not to scale</small></div>
        <div class="stage-hud bottom-right" style="right: 12px; left: auto; text-align: right; pointer-events: auto; display: flex; gap: 6px; background: rgba(11,20,32,0.85); padding: 6px 10px; border-radius: 6px; border: 1px solid var(--line);">
          <span style="font-size: 11px; font-weight: bold; align-self: center;">MODEL:</span>
          <button class="hud-btn" id="view-surface-btn" aria-pressed="false" style="padding: 3px 6px; font-size: 10px; background: #0e1a29; border: 1px solid var(--line); color: #fff;">Textured</button>
          <button class="hud-btn" id="view-reference-btn" aria-pressed="true" disabled title="Loading the reference anatomy model" style="padding: 3px 6px; font-size: 10px; background: var(--cyan); border: 1px solid var(--cyan); color: #050b13;">Anatomy</button>
        </div>
        <div class="orientation-cube"><div class="cube-face">ANT</div><small>VIEW</small></div><div id="loading-overlay" class="loading-overlay">Loading heart models…</div></div>
        <div class="viewport-footer"><div class="legend-inline"><span><i class="legend-dot red"></i> Coronary arterial trees</span></div><div id="camera-status">ORBIT CONTROLS ENABLED</div><div id="model-credit" class="model-credit">Loading the credited reference coronary anatomy…</div></div>
      </section>
      <aside class="right-rail cycle-side-rail">
        <div class="rail-title"><span>03</span><div><b>ARTERIAL VIEW</b><small>Adjust the linked projection</small></div></div>
        <div class="control-card c-arm-card"><div class="control-heading"><div><b>C-arm projection</b><small>Rotate the simplified artery view</small></div><span class="control-icon">◉</span></div><div class="range-row"><label for="oblique-range">RAO / LAO</label><output id="oblique-value">AP 0°</output></div><input id="oblique-range" type="range" min="-45" max="45" step="5" value="${cArmObliqueDeg}" aria-label="C-arm right or left anterior oblique angle"/><div class="range-row"><label for="tilt-range">CRANIAL / CAUDAL</label><output id="tilt-value">0°</output></div><input id="tilt-range" type="range" min="-30" max="30" step="5" value="${cArmTiltDeg}" aria-label="C-arm cranial or caudal angle"/><p class="control-note">Simplified geometric projection; not diagnostic fluoroscopy or radiation-dose modelling.</p></div>
      </aside>
    </section>
    <section class="bottom-workspace"><div class="bottom-panel cycle-summary-panel"><div class="eyebrow">04 / HEARTBEAT</div><h3>Cycle at a glance</h3><p class="cycle-summary">Atrial systole tops off ventricular filling. Ventricular systole ejects blood; both chambers then relax as filling resumes.</p><div class="session-metrics"><div><small>HEART RATE</small><b id="metric-rate">— bpm</b></div><div><small>ATRIAL PHASE</small><b id="metric-atria">Diastole</b></div><div><small>VENTRICULAR PHASE</small><b id="metric-ventricles">Diastole</b></div></div><p class="control-note">The 3D pulse follows an educational timing pattern derived from the selected synthetic case heart rate.</p></div><div class="bottom-panel reviewer-panel"><div class="eyebrow">05 / REVIEW & FEEDBACK</div><h3>Reviewer notes</h3><p>Clinical content and both anatomy views remain pending qualified review. Notes are saved only in this browser and are not transmitted.</p><div class="review-checklist"><b>Suggested review topics</b><ul><li>Heart and coronary anatomy</li><li>Labels, explanations, and learning flow</li><li>Safety language and accessibility</li><li>Case content and answer rationale</li></ul></div><label class="review-notes-label" for="review-notes">Notes <small>Do not enter patient-identifying information.</small></label><textarea id="review-notes" rows="4" placeholder="What was clear, confusing, or anatomically inaccurate?"></textarea><div class="review-actions"><button id="save-review-notes" class="control-btn accent">Save on this device</button><button id="download-review-notes" class="control-btn ghost">Download notes</button><span id="review-notes-status" role="status" aria-live="polite">Not saved</span></div></div></section>
    <footer class="app-footer"><span>CathLab AI · Interactive 3D educational prototype</span><span>Clinical content pending qualified cardiology review · No patient-care use</span></footer>
  </main>`;
  const picker = document.querySelector<HTMLSelectElement>('#case-picker')!;
  picker.innerHTML = cases.map(c => `<option value="${esc(c.case_id)}" ${patient?.case_id === c.case_id ? 'selected' : ''}>${esc(c.title)} · ${esc(c.case_id)}</option>`).join('');
  document.querySelector('#review-status')!.textContent = patient?.review_status?.replaceAll('_', ' ') ?? 'Pending review';
  renderPatientCard(); renderAnatomyLesson(); renderLog(); restoreReviewNotes(); wireUI(); init3D();
}
function renderPatientCard() {
  const p = patient;
  const card = document.querySelector<HTMLDivElement>('#patient-card');
  if (!p || !card) return;
  card.innerHTML = `<div class="patient-id"><div class="avatar">${p.presentation.age}</div><div><b>${esc(p.title)}</b><small>${esc(p.case_id)} · Synthetic patient</small></div></div><div class="vital-grid"><div><small>HEART RATE</small><b>${p.presentation.vitals.heart_rate_bpm ?? '—'}<em> bpm</em></b></div><div><small>SBP</small><b>${p.presentation.vitals.systolic_bp_mmhg ?? '—'}<em> mmHg</em></b></div></div><div class="patient-subhead">PRESENTING FEATURES</div><ul class="symptom-list">${p.presentation.symptoms.slice(0, 4).map(s => `<li>${esc(s)}</li>`).join('')}</ul>${p.allergy_history.length ? `<div class="allergy-mini"><b>⚠ Allergy flag</b><p>${p.allergy_history.map(a => `${esc(a.substance)} — ${esc(a.reaction)}`).join('<br>')}</p></div>` : ''}`;
}
const anatomyLessons: Record<string, { title: string; text: string; view: string }> = {
  LAD: { title: 'Anterior interventricular artery', text: 'The LAD travels toward the apex in the anterior interventricular groove. Diagonal and septal branches arise along its course.', view: 'Best seen from the front (anterior) surface.' },
  RCA: { title: 'Right coronary artery', text: 'The RCA begins at the right aortic sinus and follows the right atrioventricular groove. Dominance and branches vary between people.', view: 'Orbit the heart to compare anterior and inferior surfaces.' },
  LCX: { title: 'Circumflex artery', text: 'The LCx follows the left atrioventricular groove toward the lateral and posterior heart. Its course varies with coronary dominance.', view: 'Rotate the model to follow it around the left side.' },
  LM: { title: 'Left main coronary artery', text: 'The left main is a short trunk that commonly divides into the LAD and circumflex branches. Branching anatomy varies.', view: 'The split is easiest to inspect in the Anatomy model view.' }
};
function renderAnatomyLesson() {
  const el = document.querySelector<HTMLDivElement>('#anatomy-lesson');
  const lesson = anatomyLessons[selectedArtery];
  if (el && lesson) el.innerHTML = `<div class="eyebrow">GUIDED ANATOMY · ${esc(selectedArtery)}</div><h3>${esc(lesson.title)}</h3><p>${esc(lesson.text)}</p><small>${esc(lesson.view)}</small>`;
}
const REVIEW_NOTES_KEY = 'cathlab-ai-review-notes-v1';
function restoreReviewNotes() {
  try {
    const text = localStorage.getItem(REVIEW_NOTES_KEY) ?? '';
    const field = document.querySelector<HTMLTextAreaElement>('#review-notes');
    if (field) field.value = text;
    const status = document.querySelector('#review-notes-status');
    if (status) status.textContent = text ? 'Saved in this browser' : 'Not saved';
  } catch {
    const status = document.querySelector('#review-notes-status');
    if (status) status.textContent = 'Local storage unavailable';
  }
}
function saveReviewNotes() {
  const field = document.querySelector<HTMLTextAreaElement>('#review-notes');
  if (!field) return;
  try {
    localStorage.setItem(REVIEW_NOTES_KEY, field.value);
    const status = document.querySelector('#review-notes-status');
    if (status) status.textContent = 'Saved in this browser';
    addLog('Reviewer feedback saved locally on this device.');
  } catch {
    const status = document.querySelector('#review-notes-status');
    if (status) status.textContent = 'Could not save locally';
  }
}
function downloadReviewNotes() {
  const field = document.querySelector<HTMLTextAreaElement>('#review-notes');
  if (!field?.value.trim()) {
    const status = document.querySelector('#review-notes-status');
    if (status) status.textContent = 'Enter notes before downloading';
    return;
  }
  const packet = {
    project: 'CathLab AI educational prototype',
    case_id: patient?.case_id ?? null,
    case_version: patient?.case_version ?? null,
    clinical_review_status: patient?.review_status ?? 'pending_review',
    created_at: new Date().toISOString(),
    transmission: 'This file is created locally; it is not sent to a service.',
    notes: field.value.trim()
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url; link.download = `cathlab-review-${patient?.case_id ?? 'notes'}.json`; link.click();
  URL.revokeObjectURL(url);
  const status = document.querySelector('#review-notes-status');
  if (status) status.textContent = 'Downloaded locally';
}
function renderLog() {
  const el = document.querySelector<HTMLDivElement>('#event-log');
  if (el) el.innerHTML = simEvents.map((e, i) => `<div class="event-item"><span class="event-index">${String(simEvents.length - i).padStart(2, '0')}</span><span class="event-marker ${i === 0 ? 'new' : ''}"></span><span>${esc(e)}</span></div>`).join('');
}
function addLog(message: string) {
  logEvent(message); renderLog();
  const t = document.querySelector('#session-title'); const s = document.querySelector('#session-summary');
  if (t) t.textContent = 'Simulation updated'; if (s) s.textContent = message;
}
function updateControlText() {
  const w = document.querySelector<HTMLOutputElement>('#wire-value'); if (w) w.value = `${Math.round(wireProgress * 100)}%`;
  const range = document.querySelector<HTMLInputElement>('#wire-range'); if (range) range.value = String(Math.round(wireProgress * 100));
  const bs = document.querySelector('#balloon-state'); if (bs) bs.textContent = balloonInflated ? 'Visible (visual)' : 'Hidden';
  const ss = document.querySelector('#stent-state'); if (ss) ss.textContent = deployed ? 'Shown (visual)' : 'Not deployed';
  const st = document.querySelector<HTMLButtonElement>('#stent-toggle'); if (st) { st.disabled = deployed || !balloonInflated; st.textContent = deployed ? 'Stent shown' : 'Show simulated stent'; }
  const bt = document.querySelector<HTMLButtonElement>('#balloon-toggle'); if (bt) bt.textContent = balloonInflated ? 'Hide simulated balloon' : 'Show simulated balloon';
  const ct = document.querySelector<HTMLButtonElement>('#contrast-toggle'); if (ct) ct.textContent = contrastOn ? 'Hide simulated contrast' : 'Show simulated contrast';
  const mv = document.querySelector('#metric-vessel'); if (mv) mv.textContent = selectedArtery;
  const mw = document.querySelector('#metric-wire'); if (mw) mw.textContent = `${Math.round(wireProgress * 100)}%`;
  const ms = document.querySelector('#metric-stent'); if (ms) ms.textContent = deployed ? 'Shown' : 'Not deployed';
  const vt = document.querySelector('#view-title'); if (vt) vt.textContent = `Coronary anatomy · ${selectedArtery}`;
  renderAnatomyLesson();
  updateDevicePosition();
}

function updateCardiacCycle(phase: number, bpm: number, ventricularContraction: number, atrialContraction: number) {
  const atrialSystole = phase >= .84;
  const ventricularSystole = phase >= .02 && phase < .36;
  const active: Record<string, boolean> = {
    'atrial-systole': atrialSystole,
    'atrial-diastole': !atrialSystole,
    'ventricular-systole': ventricularSystole,
    'ventricular-diastole': !ventricularSystole
  };
  const signature = `${Math.round(bpm)}:${Object.entries(active).filter(([, isActive]) => isActive).map(([name]) => name).join(',')}`;
  if (signature === lastCycleDisplay) return;
  lastCycleDisplay = signature;
  const rate = document.querySelector('#cycle-heart-rate');
  if (rate) rate.textContent = String(Math.round(bpm));
  const metricRate = document.querySelector('#metric-rate'); if (metricRate) metricRate.textContent = `${Math.round(bpm)} bpm`;
  const metricAtria = document.querySelector('#metric-atria'); if (metricAtria) metricAtria.textContent = atrialSystole ? 'Systole' : 'Diastole';
  const metricVentricles = document.querySelector('#metric-ventricles'); if (metricVentricles) metricVentricles.textContent = ventricularSystole ? 'Systole' : 'Diastole';
  document.querySelectorAll<HTMLElement>('[data-cycle]').forEach(card => {
    const isActive = active[card.dataset.cycle ?? ''] ?? false;
    card.dataset.active = String(isActive);
    card.setAttribute('aria-current', isActive ? 'step' : 'false');
    const status = card.querySelector('.phase-status');
    if (status) status.textContent = isActive ? 'ACTIVE' : 'REST';
  });
  const liveLabel = document.querySelector('#cycle-live-label');
  if (liveLabel) liveLabel.textContent = atrialSystole
    ? 'Atrial systole · ventricles filling'
    : ventricularSystole
      ? 'Ventricular systole · atria relaxing'
      : 'Diastole · chambers relaxing and filling';
  const atrialPulse = document.querySelector<HTMLElement>('.cycle-pulse');
  if (atrialPulse) {
    atrialPulse.style.setProperty('--pulse-strength', String(Math.max(ventricularContraction, atrialContraction * .75)));
    atrialPulse.style.setProperty('--beat-duration', `${60 / Math.max(35, bpm)}s`);
  }
}

function updateCArmCamera(aspect?: number) {
  if (!fluoroCamera) return;
  const radius = 4.4;
  const projectionTargetY = -.28;
  const position = projectionCameraPosition(cArmObliqueDeg, cArmTiltDeg, radius, projectionTargetY);
  fluoroCamera.position.set(position.x, position.y, position.z);
  fluoroCamera.lookAt(0, projectionTargetY, 0);
  if (aspect && aspect > 0) fluoroCamera.aspect = aspect;
  fluoroCamera.updateProjectionMatrix();
  const obliqueLabel = document.querySelector<HTMLOutputElement>('#oblique-value');
  if (obliqueLabel) obliqueLabel.value = cArmObliqueDeg === 0 ? 'AP 0°' : `${cArmObliqueDeg < 0 ? 'RAO' : 'LAO'} ${Math.abs(cArmObliqueDeg)}°`;
  const tiltLabel = document.querySelector<HTMLOutputElement>('#tilt-value');
  if (tiltLabel) tiltLabel.value = cArmTiltDeg === 0 ? '0°' : `${cArmTiltDeg > 0 ? 'Cranial' : 'Caudal'} ${Math.abs(cArmTiltDeg)}°`;
  const cameraStatus = document.querySelector('#camera-status');
  if (cameraStatus) cameraStatus.textContent = `${cArmObliqueDeg === 0 ? 'AP' : cArmObliqueDeg < 0 ? 'RAO' : 'LAO'} ${Math.abs(cArmObliqueDeg)}° · ${cArmTiltDeg === 0 ? '0°' : `${cArmTiltDeg > 0 ? 'CRANIAL' : 'CAUDAL'} ${Math.abs(cArmTiltDeg)}°`}`;
}

function addTube(group: THREE.Group, curve: THREE.Curve<THREE.Vector3>, radius: number, material: THREE.Material, segments = 64) {
  const geom = new THREE.TubeGeometry(curve, segments, radius, 8, false);
  const m = new THREE.Mesh(geom, material);
  m.castShadow = true; m.receiveShadow = true;
  group.add(m);
  schematicTubes.push(m);
  return m;
}

function projectCurveToHeartSurface(curve: THREE.CatmullRomCurve3, anatomy: THREE.Object3D) {
  const raycaster = new THREE.Raycaster();
  raycaster.set(V(0, 0, 1), V(0, 0, -1));
  const points: THREE.Vector3[] = [];
  const samples = 72;
  for (let i = 0; i < samples; i++) {
    const point = curve.getPointAt(i / (samples - 1));
    raycaster.ray.origin.set(point.x, point.y, 4);
    const hit = raycaster.intersectObject(anatomy, true)[0];
    if (!hit) continue;
    const normal = hit.face?.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)).normalize();
    const outward = normal && normal.z > 0 ? normal : V(0, 0, 1);
    points.push(hit.point.clone().addScaledVector(outward, .012));
  }
  return points.length > 3 ? new THREE.CatmullRomCurve3(points, false, 'centripetal') : curve;
}

function attachSurfaceCoronaries(anatomy: THREE.Object3D) {
  // Replace the free-floating teaching paths with fine vessels projected onto
  // the supplied heart mesh. Their course remains an educational overlay.
  for (const tube of schematicTubes) {
    heartGroup?.remove(tube);
    tube.geometry.dispose();
  }
  schematicTubes.length = 0;
  const paths: Record<string, THREE.CatmullRomCurve3> = {
    LM: curveFor('LM'), LAD: curveFor('LAD'), RCA: curveFor('RCA'), LCX: curveFor('LCX')
  };
  const branchPaths = [
    new THREE.CatmullRomCurve3([V(.03, .20, 0), V(-.14, .25, 0), V(-.27, .18, 0)]),
    new THREE.CatmullRomCurve3([V(.02, -.10, 0), V(-.15, -.02, 0), V(-.28, -.13, 0)]),
    new THREE.CatmullRomCurve3([V(-.29, .44, 0), V(-.40, .34, 0), V(-.45, .23, 0)]),
    new THREE.CatmullRomCurve3([V(.45, .18, 0), V(.51, .04, 0), V(.46, -.10, 0)])
  ];
  const arteryMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8f2937, roughness: .4, clearcoat: .58, clearcoatRoughness: .38,
    emissive: 0x110306, emissiveIntensity: .06
  });
  curves = {
    LM: projectCurveToHeartSurface(paths.LM, anatomy),
    LAD: projectCurveToHeartSurface(paths.LAD, anatomy),
    RCA: projectCurveToHeartSurface(paths.RCA, anatomy),
    LCX: projectCurveToHeartSurface(paths.LCX, anatomy)
  };
  addTube(heartGroup!, curves.LM, .008, arteryMaterial, 72);
  addTube(heartGroup!, curves.LAD, .008, arteryMaterial, 96);
  addTube(heartGroup!, curves.RCA, .007, arteryMaterial, 88);
  addTube(heartGroup!, curves.LCX, .0065, arteryMaterial, 80);
  for (const path of branchPaths) addTube(heartGroup!, projectCurveToHeartSurface(path, anatomy), .0035, arteryMaterial, 48);
  const lesion = heartGroup!.getObjectByName('lesion');
  lesion?.position.copy(curves.LAD.getPointAt(.56));
  updateDevicePosition();
}

function curveFor(artery: string) {
  const z = 0.48;
  const points: Record<string, THREE.Vector3[]> = {
    LAD: [V(.08, .56, z), V(.05, .38, z), V(.02, .16, z), V(.03, -.08, z), V(-.02, -.34, z), V(-.08, -.62, z), V(-.12, -.88, z)],
    RCA: [V(.20, .49, z), V(.34, .42, z), V(.45, .28, z), V(.48, .10, z), V(.40, -.06, z), V(.25, -.16, z)],
    LCX: [V(.07, .55, z), V(-.12, .53, z), V(-.29, .45, z), V(-.41, .33, z), V(-.46, .18, z)],
    LM: [V(.08, .61, z), V(.07, .56, z), V(.07, .51, z)]
  };
  return new THREE.CatmullRomCurve3(points[artery], false, 'catmullrom', .45);
}
function disposeObject(obj: THREE.Object3D) {
  obj.traverse(o => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    if (m.material) { if (Array.isArray(m.material)) m.material.forEach(x => x.dispose()); else m.material.dispose(); }
  });
}
function buildStent(curve: THREE.CatmullRomCurve3) {
  const group = new THREE.Group(); group.userData.artery = selectedArtery;
  const center = curve.getPointAt(.56); const tangent = curve.getTangentAt(.56).normalize();
  const material = new THREE.MeshStandardMaterial({ color: 0xb6d9e5, metalness: .85, roughness: .25 });
  for (let i = 0; i < 9; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.032, .003, 5, 24), material);
    ring.position.copy(center.clone().addScaledVector(tangent, (i - 4) * .024));
    ring.quaternion.setFromUnitVectors(V(0, 0, 1), tangent); group.add(ring);
  }
  for (let i = 0; i < 8; i++) {
    const p1 = center.clone().addScaledVector(tangent, (i - 4) * .024);
    const p2 = center.clone().addScaledVector(tangent, (i - 3.5) * .024);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(.002, .002, p1.distanceTo(p2) + .01, 5), material);
    bar.position.copy(p1.clone().add(p2).multiplyScalar(.5)); bar.quaternion.setFromUnitVectors(V(0, 1, 0), p2.clone().sub(p1).normalize()); group.add(bar);
  }
  return group;
}
function addFallbackAnatomy(group: THREE.Group) {
  // A visibly 3D fallback only. For reference-quality anatomy, supply public/models/heart.glb.
  const tissue = new THREE.MeshPhysicalMaterial({ color: 0x8e2539, roughness: .38, clearcoat: .28, clearcoatRoughness: .45 });
  const muscle = new THREE.MeshPhysicalMaterial({ color: 0x9f3447, roughness: .43, clearcoat: .2 });
  const makeLobe = (x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: THREE.Material, rz = 0) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 36), mat);
    m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.z = rz; m.castShadow = true; m.receiveShadow = true; group.add(m); return m;
  };
  makeLobe(-.20, .12, 0, .55, .76, .35, tissue, -.25);
  makeLobe(.25, .06, .04, .49, .69, .34, muscle, .2);
  makeLobe(.00, -.38, .04, .40, .57, .30, tissue, -.18);
  const vessel = new THREE.MeshPhysicalMaterial({ color: 0xb83f50, roughness: .3, clearcoat: .45 });
  const aorta = new THREE.Mesh(new THREE.TorusGeometry(.28, .075, 18, 64, Math.PI * 1.45), vessel);
  aorta.position.set(.03, .78, .03); aorta.rotation.z = -.15; aorta.castShadow = true; group.add(aorta);
  const tube = (pts: THREE.Vector3[], r: number) => addTube(group, new THREE.CatmullRomCurve3(pts), r, vessel, 72);
  tube([V(.10, .78, .05), V(.12, .97, .03), V(.28, 1.04, .02)], .075);
  tube([V(.10, .75, .05), V(.27, .82, .03), V(.34, .96, .02)], .06);
}
function updateModelStatus(text: string) {
  const el = document.querySelector('#model-status');
  if (el) el.textContent = text;
}
function applyRealisticMaterial(obj: THREE.Object3D) {
  const loader = new THREE.TextureLoader();
  const base = '/models/source/Heart.fbm/hart_UV_low01_';
  const suffix = '.hart_UV_low_defaultMat.png';
  const texture = (name: string, color: boolean) => {
    const t = loader.load(`${base}${name}${suffix}`);
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (renderer) t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  const material = new THREE.MeshPhysicalMaterial({
    map: texture('BaseColor', true),
    normalMap: texture('Normal', false),
    roughnessMap: texture('Roughness', false),
    roughness: 0.82,
    metalness: 0,
    clearcoat: 0.22,
    clearcoatRoughness: 0.38,
    sheen: 0.18,
    sheenColor: new THREE.Color(0xff7777),
    sheenRoughness: 0.62
  });
  obj.traverse(child => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.material = material;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}

function init3D() {
  const host = document.querySelector<HTMLDivElement>('#three-stage');
  if (!host) return;
  if (animationFrame) cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect(); resizeObserver = null;
  if (controls) { controls.dispose(); controls = null; }
  if (renderer) { renderer.dispose(); renderer.domElement.remove(); renderer = null; }
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07101c);
  scene.fog = new THREE.Fog(0x07101c, 5.5, 12);
  camera = new THREE.PerspectiveCamera(38, Math.max(1, host.clientWidth) / Math.max(1, host.clientHeight), .1, 100);
  camera.position.set(0, .05, 4.4);
  fluoroCamera = new THREE.PerspectiveCamera(38, 0.55, .1, 100);
  updateCArmCamera();
  camera.aspect = (Math.max(1, host.clientWidth) * .66) / Math.max(1, host.clientHeight);
  camera.updateProjectionMatrix();
  updateCArmCamera((Math.max(1, host.clientWidth) * .34) / Math.max(1, host.clientHeight));
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch {
    updateModelStatus('3D VIEWER UNAVAILABLE');
    const overlay = document.querySelector('#loading-overlay');
    if (overlay) overlay.innerHTML = 'This browser could not start WebGL.<br><small>Try a browser or device with WebGL enabled. Case information and text notes remain available.</small>';
    addLog('The 3D viewer could not start; the case and review panels remain available.');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  const fluoroVesselMaterial = new THREE.MeshBasicMaterial({ color: 0xffd4bc, side: THREE.DoubleSide });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  host.prepend(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; controls.dampingFactor = .055;
  controls.minDistance = 1.2; controls.maxDistance = 8;
  controls.target.set(0, .05, 0); controls.update();
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D heart with a linked simplified C-arm projection. Use the projection sliders to change the viewing angle.');
  renderer.domElement.addEventListener('pointerdown', event => {
    if (controls) controls.enabled = event.offsetX < host.clientWidth * .66;
  });
  renderer.domElement.addEventListener('pointerup', () => { if (controls) controls.enabled = true; });

  // Soft studio reflections and layered lighting improve the imported tissue material.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.85;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xc6dcff, 0x36121d, 0.55));
  const key = new THREE.DirectionalLight(0xffdfd0, 2.7); key.position.set(3, 4, 5); key.castShadow = true; scene.add(key);
  const rim = new THREE.PointLight(0x36a9e0, 1.6, 10); rim.position.set(-3, 1.4, 2); scene.add(rim);
  const fill = new THREE.PointLight(0xe34a5c, 0.9, 8); fill.position.set(1, -2, 2); scene.add(fill);

  heartGroup = new THREE.Group(); scene.add(heartGroup);
  curves = { LAD: curveFor('LAD'), RCA: curveFor('RCA'), LCX: curveFor('LCX'), LM: curveFor('LM') };
  const vesselMat = new THREE.MeshPhysicalMaterial({ color: 0xe14e60, roughness: .27, clearcoat: .45 });
  const branchMat = new THREE.MeshPhysicalMaterial({ color: 0xb83d53, roughness: .32, clearcoat: .35 });
  addTube(heartGroup, curves.LM, .027, vesselMat);
  addTube(heartGroup, curves.LAD, .020, vesselMat);
  addTube(heartGroup, curves.RCA, .019, vesselMat);
  addTube(heartGroup, curves.LCX, .018, vesselMat);
  addTube(heartGroup, new THREE.CatmullRomCurve3([V(.08, .18, .54), V(.28, .12, .54), V(.38, -.02, .51), V(.40, -.15, .49)]), .009, branchMat, 60);
  addTube(heartGroup, new THREE.CatmullRomCurve3([V(-.04, -.23, .53), V(-.28, -.30, .51), V(-.39, -.45, .49)]), .009, branchMat, 60);
  addTube(heartGroup, new THREE.CatmullRomCurve3([V(-.48, .31, .52), V(-.43, .14, .53), V(-.28, .06, .52)]), .008, branchMat, 60);

  const lesion = new THREE.Mesh(new THREE.SphereGeometry(.045, 24, 16), new THREE.MeshPhysicalMaterial({ color: 0xf4c66b, emissive: 0x59320a, emissiveIntensity: .65, roughness: .28 }));
  lesion.name = 'lesion'; lesion.position.copy(curves.LAD.getPointAt(.56)); lesion.scale.set(.8, 1.65, .8); heartGroup.add(lesion);

  wire = new THREE.Mesh(new THREE.SphereGeometry(.018, 18, 14), new THREE.MeshStandardMaterial({ color: 0x65e8ff, emissive: 0x1384a0, emissiveIntensity: 1.7, metalness: .55, roughness: .22 }));
  wire.name = 'guidewire-tip'; heartGroup.add(wire);
  const wireCurve = new THREE.CatmullRomCurve3([V(.02, .70, .57), V(.02, .49, .58), V(.04, .28, .59), V(.03, .05, .60), V(-.06, -.25, .57), V(-.16, -.53, .53)]);
  const wireTrack = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 90, .0045, 6, false), new THREE.MeshStandardMaterial({ color: 0x4fcce8, emissive: 0x0e5d79, emissiveIntensity: .4, transparent: true, opacity: .82 }));
  wireTrack.name = 'guidewire-track'; heartGroup.add(wireTrack);

  balloon = new THREE.Mesh(new THREE.CapsuleGeometry(.022, .13, 6, 12), new THREE.MeshPhysicalMaterial({ color: 0x67b8ff, transparent: true, opacity: .76, roughness: .2, metalness: .12, emissive: 0x164c9e, emissiveIntensity: .2 }));
  balloon.visible = false; heartGroup.add(balloon);
  stentGroup = buildStent(curves.LAD); stentGroup.visible = false; heartGroup.add(stentGroup);

  const positions = new Float32Array(180 * 3);
  // Fixed seeded positions make the educational contrast effect reproducible.
  let seed = 731;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 180; i++) {
    positions[i * 3] = (rand() - .5) * 1.3;
    positions[i * 3 + 1] = (rand() - .5) * 1.8;
    positions[i * 3 + 2] = .53 + rand() * .15;
  }
  const pgeo = new THREE.BufferGeometry(); pgeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  contrastParticles = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: 0x9cecff, size: .014, transparent: true, opacity: .75, depthWrite: false }));
  contrastParticles.visible = false; heartGroup.add(contrastParticles);

  modelLoaded = false;
  updateModelStatus('LOADING HEART MODEL');
  const loader = new FBXLoader();
  loader.load(MODEL_URL, anatomy => {
    if (!heartGroup) return;
    if (loadedAnatomy) { heartGroup.remove(loadedAnatomy); disposeObject(loadedAnatomy); }
    anatomyMixer = null;
    loadedAnatomy = anatomy;
    // Center and normalize the imported model so different GLB sizes can be previewed.
    const box = new THREE.Box3().setFromObject(loadedAnatomy);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.25 / maxDim;
    loadedAnatomy.scale.setScalar(scale);
    // FBX coordinates are hundreds of units wide. Scale the center offset too,
    // or subtracting it before scaling leaves the heart far outside the camera.
    loadedAnatomy.position.copy(center).multiplyScalar(-scale);
    loadedAnatomy.position.z += .02;
    applyRealisticMaterial(loadedAnatomy);
    heartGroup.add(loadedAnatomy);
    heartGroup.updateMatrixWorld(true);
    attachSurfaceCoronaries(loadedAnatomy);
    setAnatomyView(anatomyView);
    // FBX files may carry authored motion. Play it when available; the timed
    // heartbeat below remains active so a static original mesh still feels alive.
    if (anatomy.animations.length) {
      anatomyMixer = new THREE.AnimationMixer(loadedAnatomy);
      anatomy.animations.forEach(clip => anatomyMixer?.clipAction(clip).play());
    }
    modelLoaded = true;
    updateModelStatus(referenceAnatomy ? 'TEXTURED + REFERENCE ANATOMY READY' : 'TEXTURED HEART LOADED');
    document.querySelector('#loading-overlay')?.remove();
    addLog('Heart FBX loaded with its surface textures. Schematic vessel overlays and device markers are hidden.');
  }, undefined, () => {
    // Keep a 3D fallback visible, but explain that the external model file is missing.
    if (!heartGroup || modelLoaded) return;
    addFallbackAnatomy(heartGroup);
    updateModelStatus('FALLBACK MODEL · FBX NOT FOUND');
    const overlay = document.querySelector('#loading-overlay');
    if (overlay) overlay.innerHTML = `Heart model file not found.<br><small>Included model: <code>public/models/source/Heart.fbx</code>. Keep its texture folder beside it, then refresh.</small>`;
    addLog('Detailed FBX model not found; showing the built-in 3D fallback.');
  });

  new GLTFLoader().load(REFERENCE_MODEL_URL, gltf => {
    if (!heartGroup) return;
    if (referenceAnatomy) { heartGroup.remove(referenceAnatomy); disposeObject(referenceAnatomy); }
    referenceAnatomy = gltf.scene;
    const box = new THREE.Box3().setFromObject(referenceAnatomy);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 2.65 / (Math.max(size.x, size.y, size.z) || 1);
    referenceAnatomy.scale.setScalar(scale);
    referenceAnatomy.position.copy(center).multiplyScalar(-scale);
    referenceAnatomy.position.z += .02;
    referenceAnatomy.visible = anatomyView === 'reference';
    referenceAnatomy.traverse(child => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; }
    });
    const arteryMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8f2938, roughness: .48, clearcoat: .14, clearcoatRoughness: .58, side: THREE.DoubleSide });
    for (const arteryTree of referenceAnatomy.children.filter(child => /coronary/i.test(child.name))) {
      arteryTree.traverse(child => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.material = arteryMaterial;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });
    }
    heartGroup.add(referenceAnatomy);
    heartGroup.updateMatrixWorld(true);
    const referenceBtn = document.querySelector<HTMLButtonElement>('#view-reference-btn');
    if (referenceBtn) { referenceBtn.disabled = false; referenceBtn.title = 'Show reference anatomy with separate coronary artery trees'; }
    const credit = document.querySelector('#model-credit');
    if (credit) credit.innerHTML = anatomyView === 'reference'
      ? 'Reference model: <a href="https://organui.com/docs/components/heart" target="_blank" rel="noopener noreferrer">BodyParts3D 4.0, DBCLS · CC BY 4.0</a> · generic reference anatomy; expert review pending.'
      : 'Textured heart supplied with this project · natural surface artery detail; choose Anatomy for highlighted coronary trees.';
    updateModelStatus('TEXTURED + REFERENCE ANATOMY READY');
    document.querySelector('#loading-overlay')?.remove();
    addLog('Loaded the CC BY 4.0 reference model with separate left and right coronary trees.');
  }, undefined, () => {
    const referenceBtn = document.querySelector<HTMLButtonElement>('#view-reference-btn');
    if (referenceBtn) { referenceBtn.disabled = true; referenceBtn.title = 'Reference anatomy model could not be loaded.'; }
    if (anatomyView === 'reference') setAnatomyView('surface');
    addLog('Reference anatomy model could not be loaded; the supplied textured heart remains available.');
  });

  updateDevicePosition();
  const resize = () => {
    if (!renderer || !camera || !host.isConnected) return;
    const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
    const mainWidth = Math.floor(w * .66);
    camera.aspect = mainWidth / h; camera.updateProjectionMatrix();
    updateCArmCamera((w - mainWidth) / h);
    renderer.setSize(w, h);
  };
  resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const animationClock = new THREE.Clock();
  const tick = () => {
    animationFrame = requestAnimationFrame(tick);
    anatomyMixer?.update(Math.min(animationClock.getDelta(), .05));
    controls?.update();
    if (heartGroup) {
      schematicTubes.forEach(mesh => {
        if (Array.isArray(mesh.material)) return;
        const mat = mesh.material as THREE.Material;
        if (anatomyView !== 'surface' || schematicOverlayMode === 'hidden') {
          mesh.visible = false;
        } else {
          mesh.visible = true;
          mat.transparent = true;
          mat.opacity = schematicOverlayMode === 'translucent' ? 0.25 : 1.0;
          mat.needsUpdate = true;
        }
      });
      // Apply the patient-specific heartbeat to the imported anatomy itself.
      const bpm = patient?.presentation.vitals.heart_rate_bpm ?? 72;
      const cycle = 60 / Math.max(35, Math.min(200, bpm));
      const phase = (performance.now() / 1000 % cycle) / cycle;
      const bump = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));
      const ventricularContraction = bump(phase, .19, .13);
      const atrialContraction = bump(phase, .91, .07);
      updateCardiacCycle(phase, bpm, ventricularContraction, atrialContraction);
      // Deliberately visible squeeze-and-release: a strong ventricular pulse
      // and a smaller atrial kick, synchronized to the displayed case BPM.
      const motionScale = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? .65 : 1;
      const radialPulse = motionScale * (.11 * ventricularContraction + .035 * atrialContraction);
      const longAxisSqueeze = motionScale * (.085 * ventricularContraction + .02 * atrialContraction);
      heartGroup.scale.set(1 + radialPulse, 1 - longAxisSqueeze, 1 + radialPulse);
      // Keep the pumping-heart view focused on anatomy: no devices or lesion markers.
      if (wire) wire.visible = false;
      if (balloon) balloon.visible = false;
      if (stentGroup) stentGroup.visible = false;
      const lesion = heartGroup.getObjectByName('lesion');
      if (lesion) lesion.visible = false;
      const wireTrack = heartGroup.getObjectByName('guidewire-track');
      if (wireTrack) wireTrack.visible = false;
      if (contrastParticles) contrastParticles.visible = false;
      if (contrastParticles?.visible) contrastParticles.rotation.y -= .002;
    }
    if (renderer && scene && camera && fluoroCamera) {
      const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
      const mainWidth = Math.floor(width * .66);
      renderer.setScissorTest(true);
      renderer.setViewport(0, 0, mainWidth, height);
      renderer.setScissor(0, 0, mainWidth, height);
      renderer.render(scene, camera);
      const originalBackground = scene.background;
      const originalOverride = scene.overrideMaterial;
      const visibility: Array<[THREE.Object3D, boolean]> = [];
      const setSavedVisibility = (object: THREE.Object3D | null | undefined, value: boolean) => {
        if (!object) return;
        visibility.push([object, object.visible]);
        object.visible = value;
      };
      setSavedVisibility(loadedAnatomy, false);
      setSavedVisibility(referenceAnatomy, Boolean(referenceAnatomy));
      if (referenceAnatomy) for (const child of referenceAnatomy.children) setSavedVisibility(child, /coronary/i.test(child.name));
      for (const tube of schematicTubes) setSavedVisibility(tube, false);
      for (const object of [wire, balloon, stentGroup, heartGroup?.getObjectByName('lesion'), heartGroup?.getObjectByName('guidewire-track'), contrastParticles]) {
        setSavedVisibility(object, false);
      }
      // Project the reference coronary meshes alone, so this pane contains no
      // device, lesion, or mismatched heart-silhouette overlay.
      scene.background = new THREE.Color(0x06110f);
      scene.overrideMaterial = fluoroVesselMaterial;
      renderer.setViewport(mainWidth, 0, width - mainWidth, height);
      renderer.setScissor(mainWidth, 0, width - mainWidth, height);
      renderer.render(scene, fluoroCamera);
      for (const [object, visible] of visibility) object.visible = visible;
      scene.background = originalBackground;
      scene.overrideMaterial = originalOverride;
      renderer.setScissorTest(false);
    }
  };
  tick();
}
function updateDevicePosition() {
  const curve = curves[selectedArtery] ?? curves.LAD;
  if (!curve || !heartGroup) return;
  const pos = curve.getPointAt(Math.max(.01, Math.min(.98, wireProgress)));
  if (wire) { wire.position.copy(pos.clone().add(V(0, 0, .045))); wire.visible = false; }
  if (balloon) {
    const bp = curve.getPointAt(.56); const tangent = curve.getTangentAt(.56).normalize();
    balloon.position.copy(bp.clone().add(V(0, 0, .055)));
    balloon.quaternion.setFromUnitVectors(V(0, 1, 0), tangent);
    balloon.visible = false;
    balloon.scale.set(balloonInflated ? 1.5 : 1, balloonInflated ? 1.15 : 1, balloonInflated ? 1.5 : 1);
  }
  if (stentGroup) {
    if (deployed && stentGroup.userData.artery !== selectedArtery) {
      heartGroup.remove(stentGroup); disposeObject(stentGroup); stentGroup = buildStent(curve); heartGroup.add(stentGroup);
    }
    stentGroup.visible = false;
  }
  const lesion = heartGroup.getObjectByName('lesion');
  if (lesion) { lesion.position.copy(curve.getPointAt(.56)); lesion.visible = false; }
  const track = heartGroup.getObjectByName('guidewire-track');
  if (track) track.visible = false;
  if (contrastParticles) contrastParticles.visible = false;
  document.querySelectorAll<HTMLButtonElement>('[data-artery]').forEach(b => b.classList.toggle('active', b.dataset.artery === selectedArtery));
}
function resetSimulation() {
  wireProgress = .08; deployed = false; balloonInflated = false; contrastOn = false; angiographyMode = false;
  document.querySelector('#three-stage')?.classList.remove('angiography');
  const sm = document.querySelector('#stage-mode'); if (sm) sm.textContent = 'ANATOMY MODE';
  simEvents = ['Simulation reset. Anatomy is ready for a new hands-on session.'];
  updateControlText(); renderLog();
}
function wireUI() {
  document.querySelector<HTMLSelectElement>('#case-picker')?.addEventListener('change', e => loadCase((e.target as HTMLSelectElement).value));
  document.querySelectorAll<HTMLButtonElement>('[data-artery]').forEach(b => b.addEventListener('click', () => {
    selectedArtery = b.dataset.artery ?? 'LAD'; wireProgress = .08; balloonInflated = false; deployed = false;
    addLog(`Target vessel changed to ${arteryNames[selectedArtery]}.`); updateControlText();
  }));
  document.querySelector<HTMLInputElement>('#wire-range')?.addEventListener('input', e => { wireProgress = Number((e.target as HTMLInputElement).value) / 100; updateControlText(); });
  document.querySelector('#wire-forward')?.addEventListener('click', () => { wireProgress = Math.min(.98, wireProgress + .08); updateControlText(); addLog(`Guidewire moved to ${Math.round(wireProgress * 100)}% of the schematic vessel path.`); });
  document.querySelector('#wire-back')?.addEventListener('click', () => { wireProgress = Math.max(.01, wireProgress - .08); updateControlText(); addLog(`Guidewire moved to ${Math.round(wireProgress * 100)}% of the schematic vessel path.`); });
  document.querySelector('#balloon-toggle')?.addEventListener('click', () => { balloonInflated = !balloonInflated; if (!balloonInflated) deployed = false; updateControlText(); addLog(balloonInflated ? 'Simulated balloon visual shown at the conceptual target.' : 'Simulated balloon visual hidden.'); });
  
  document.querySelector('#overlay-opaque-btn')?.addEventListener('click', () => { updateOverlayMode('opaque'); });
  document.querySelector('#overlay-trans-btn')?.addEventListener('click', () => { updateOverlayMode('translucent'); });
  document.querySelector('#overlay-hidden-btn')?.addEventListener('click', () => { updateOverlayMode('hidden'); });
  document.querySelector('#view-surface-btn')?.addEventListener('click', () => setAnatomyView('surface'));
  document.querySelector('#view-reference-btn')?.addEventListener('click', () => {
    if (referenceAnatomy) setAnatomyView('reference');
    else addLog('Reference anatomy is still loading.');
  });
  document.querySelector<HTMLInputElement>('#oblique-range')?.addEventListener('input', e => {
    cArmObliqueDeg = Number((e.target as HTMLInputElement).value); updateCArmCamera(fluoroCamera?.aspect);
  });
  document.querySelector<HTMLInputElement>('#oblique-range')?.addEventListener('change', () => addLog(`Simplified C-arm projection set to ${cArmObliqueDeg === 0 ? 'AP 0°' : `${cArmObliqueDeg < 0 ? 'RAO' : 'LAO'} ${Math.abs(cArmObliqueDeg)}°`}.`));
  document.querySelector<HTMLInputElement>('#tilt-range')?.addEventListener('input', e => {
    cArmTiltDeg = Number((e.target as HTMLInputElement).value); updateCArmCamera(fluoroCamera?.aspect);
  });
  document.querySelector<HTMLInputElement>('#tilt-range')?.addEventListener('change', () => addLog(`Simplified cranial/caudal projection set to ${cArmTiltDeg}°.`));
  document.querySelector('#save-review-notes')?.addEventListener('click', saveReviewNotes);
  document.querySelector('#download-review-notes')?.addEventListener('click', downloadReviewNotes);

  document.querySelector('#stent-toggle')?.addEventListener('click', () => { if (!balloonInflated) return; deployed = !deployed; updateControlText(); addLog(deployed ? 'Conceptual stent scaffold shown at the simulated target.' : 'Conceptual stent scaffold hidden.'); });
  const toggleContrast = () => {
    contrastOn = !contrastOn; angiographyMode = contrastOn;
    document.querySelector('#three-stage')?.classList.toggle('angiography', angiographyMode);
    const sm = document.querySelector('#stage-mode'); if (sm) sm.textContent = contrastOn ? 'ANGIOGRAPHY MODE' : 'ANATOMY MODE';
    updateControlText(); addLog(contrastOn ? 'Simulated contrast visualization enabled.' : 'Simulated contrast visualization disabled.');
  };
  document.querySelector('#contrast-toggle')?.addEventListener('click', toggleContrast);
  document.querySelector('#toggle-angio')?.addEventListener('click', toggleContrast);
  document.querySelector('#reset-camera')?.addEventListener('click', () => {
    if (camera && controls) { camera.position.set(0, .05, 4.4); controls.target.set(0, .05, 0); controls.update(); }
    cArmObliqueDeg = 0; cArmTiltDeg = 0;
    const obliqueRange = document.querySelector<HTMLInputElement>('#oblique-range'); if (obliqueRange) obliqueRange.value = '0';
    const tiltRange = document.querySelector<HTMLInputElement>('#tilt-range'); if (tiltRange) tiltRange.value = '0';
    updateCArmCamera(fluoroCamera?.aspect);
    addLog('Camera view reset.');
  });
  document.querySelector('#reset-sim')?.addEventListener('click', resetSimulation);
  document.querySelector('#clear-log')?.addEventListener('click', () => { simEvents = []; renderLog(); });
  updateControlText();
}
async function loadCase(id: string) {
  try {
    const res = await fetch(`${API}/api/cases/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Case unavailable');
    patient = await res.json() as CaseResponse;
    renderShell(); addLog(`Loaded synthetic case ${patient.case_id}.`);
  } catch {
    const box = document.querySelector('#session-summary');
    if (box) box.textContent = 'Could not load the selected case. Check that the backend is running.';
  }
}
async function start() {
  root.innerHTML = '<main class="boot-screen"><div class="boot-logo">✚</div><p class="eyebrow">INITIALIZING SIMULATION BAY</p><h1>CathLab <span>AI</span></h1><div class="boot-line"></div><p>Loading patient cases and 3D anatomy engine…</p></main>';
  try {
    const response = await fetch(`${API}/api/cases`);
    if (!response.ok) throw new Error('API unavailable');
    const data = await response.json() as { cases: CaseSummary[] };
    cases = data.cases;
    if (!cases.length) throw new Error('No cases');
    const firstId = cases.some(c => c.case_id === 'CASE-ACS-001') ? 'CASE-ACS-001' : cases[0].case_id;
    const patientResponse = await fetch(`${API}/api/cases/${encodeURIComponent(firstId)}`);
    if (!patientResponse.ok) throw new Error('Initial case unavailable');
    patient = await patientResponse.json() as CaseResponse;
    renderShell();
  } catch {
    root.innerHTML = `<main class="boot-screen"><div class="boot-logo">✚</div><h1>CathLab <span>AI</span></h1><div class="connection-error"><b>Backend connection unavailable</b><p>Start the FastAPI backend and refresh this page.</p><code>${esc(API)}</code></div><p class="disclaimer">Educational simulation only. Not for real-patient diagnosis, treatment, or procedural guidance.</p></main>`;
  }
}
start();
