
/* =========================================================================
   AQUALINK — real-time bridge between this 3D simulation (File 1) and the
   AquaYield dashboard (File 2).

   Strategy: BroadcastChannel is used as the primary transport because it is
   instant, needs no server/socket infrastructure, and is supported by every
   modern browser. A localStorage 'storage'-event relay is layered on top as
   an automatic fallback for browsers/contexts where BroadcastChannel isn't
   available. Both mechanisms only work when the two pages share the same
   origin — e.g. serve this folder with `python3 -m http.server` and open
   both pages as http://localhost:8000/... in two tabs. Opening the raw
   files directly via file:// gives each document an isolated storage
   partition in Chromium, so nothing will sync in that case.
   ========================================================================= */
const AquaLink = (() => {
  const CHANNEL = 'aquayield-sync-v1';
  const LS_KEY   = '__aquayield_sync_msg__';
  let bc = null;
  try { bc = new BroadcastChannel(CHANNEL); } catch(e) { bc = null; }
  const listeners = [];
  function onMessage(fn){ listeners.push(fn); }
  function dispatch(msg){ listeners.forEach(fn => { try{ fn(msg); }catch(e){ console.error(e); } }); }
  if(bc){ bc.onmessage = (e) => dispatch(e.data); }
  window.addEventListener('storage', (e) => {
    if(e.key !== LS_KEY || !e.newValue) return;
    try{ dispatch(JSON.parse(e.newValue)); }catch(err){}
  });
  function send(msg){
    const payload = Object.assign({ _t: Date.now(), _r: Math.random() }, msg);
    if(bc){ try{ bc.postMessage(payload); }catch(e){} }
    try{ localStorage.setItem(LS_KEY, JSON.stringify(payload)); }catch(e){}
  }
  return { send, onMessage };
})();

/* ---------- shared tank + parameter model ---------- */
const SAFE_RANGES = {
  do:      { min:5,    max:8,   unit:'mg/L' },
  ph:      { min:6.5,  max:8.5, unit:'' },
  temp:    { min:24,   max:30,  unit:'°C' },
  ammonia: { min:0,    max:0.5, unit:'mg/L' },
  turb:    { min:0,    max:15,  unit:'NTU' },
};
const SLIDER_DEFS = [
  { key:'do',      label:'Dissolved Oxygen', min:0,  max:15, step:0.1  },
  { key:'ph',      label:'pH',               min:0,  max:14, step:0.1  },
  { key:'temp',    label:'Temperature',      min:10, max:40, step:0.1  },
  { key:'ammonia', label:'Ammonia (NH₃)',    min:0,  max:2,  step:0.01 },
  { key:'turb',    label:'Turbidity',        min:0,  max:30, step:0.5  },
];
const TANKS = [
  { id:1, name:'Tank 1',     x:-11, params:{ do:6.5, ph:7.2, temp:28.4, ammonia:0.15, turb:12 } },
  { id:2, name:'Tank 2',  x:0,   params:{ do:5.8, ph:7.0, temp:31.2, ammonia:0.30, turb:10 } },
  { id:3, name:'Tank 3',   x:11,  params:{ do:7.0, ph:7.4, temp:25.0, ammonia:0.10, turb:8  } },
];
let activeTank = 0;

function tankHealth(t){
  let worst = 'good';
  Object.keys(SAFE_RANGES).forEach(k=>{
    const r = SAFE_RANGES[k], v = t.params[k];
    if(v < r.min || v > r.max){
      const span = r.max - r.min;
      const dev = v < r.min ? r.min - v : v - r.max;
      const sev = dev > span*0.2 ? 'crit' : 'warn';
      if(sev === 'crit') worst = 'crit';
      else if(sev === 'warn' && worst !== 'crit') worst = 'warn';
    }
  });
  return worst;
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07161A, 0.024);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth/window.innerHeight, 0.1, 100);
let camDist = 11, camYaw = 0.55, camPitch = 0.34;

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
document.getElementById('scene').appendChild(renderer.domElement);

// ---------- lighting ----------
scene.add(new THREE.AmbientLight(0x3a5a52, 1.4));
const key = new THREE.DirectionalLight(0xdfffef, 3.4);
key.position.set(5, 8, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024,1024);
key.shadow.camera.left=-6; key.shadow.camera.right=6; key.shadow.camera.top=6; key.shadow.camera.bottom=-6;
scene.add(key);
const rim = new THREE.DirectionalLight(0x6fe8c8, 2.6);
rim.position.set(-6, 3, -5);
scene.add(rim);
const fill = new THREE.PointLight(0x1c5c4c, 1.8, 20);
fill.position.set(0, 1, 5);
scene.add(fill);
const topGlow = new THREE.PointLight(0xbfffe8, 1.6, 14);
topGlow.position.set(0, 2.4, 1.5);
scene.add(topGlow);

// ---------- materials ----------
const matBody   = new THREE.MeshPhysicalMaterial({ color:0x3a4442, roughness:0.5, metalness:0.25, clearcoat:0.35, clearcoatRoughness:0.3 });
const matTrim   = new THREE.MeshPhysicalMaterial({ color:0x1F7A55, roughness:0.35, metalness:0.3, clearcoat:0.4, clearcoatRoughness:0.2 });
const matDark   = new THREE.MeshStandardMaterial({ color:0x14201d, roughness:0.6, metalness:0.15 });
const matScreen = new THREE.MeshStandardMaterial({ color:0x0b3b33, emissive:0x36e0c2, emissiveIntensity:0.55, roughness:0.35 });
const matLed    = new THREE.MeshStandardMaterial({ color:0x33ff9c, emissive:0x33ff9c, emissiveIntensity:1.4 });
const matCable  = new THREE.MeshStandardMaterial({ color:0x1a1f1e, roughness:0.8 });
const matSteel  = new THREE.MeshStandardMaterial({ color:0x8a9390, roughness:0.3, metalness:0.8 });
const matPanel  = new THREE.MeshStandardMaterial({ color:0x0d2440, roughness:0.25, metalness:0.5, emissive:0x0b1830, emissiveIntensity:0.3 });
const matTank   = new THREE.MeshPhysicalMaterial({ color:0xd7dcd8, roughness:0.55, metalness:0.05, clearcoat:0.15, side:THREE.DoubleSide });

// realistic water: physically-based transmission for true refraction of what's behind/inside it
const matWater  = new THREE.MeshPhysicalMaterial({
  color: 0xbfe9e2,
  roughness: 0.04,
  metalness: 0,
  transmission: 1.0,
  thickness: 2.4,
  ior: 1.33,
  attenuationColor: new THREE.Color(0x1c6d78),
  attenuationDistance: 3.2,
  clearcoat: 0.6,
  clearcoatRoughness: 0.05,
  transparent: true,
  opacity: 1,
});

// probe body: brushed-steel contrast against the water
const matProbeBody = new THREE.MeshPhysicalMaterial({ color:0xdfe6e3, roughness:0.22, metalness:0.85, clearcoat:0.5, clearcoatRoughness:0.15 });

// glowing sensor tips — one accent colour per parameter so the cluster reads clearly underwater
const tipColors = {
  DO:      0x5AD6FF,
  pH:      0xFFC24B,
  Temp:    0xFF6E5A,
  Ammonia: 0xC792FF,
  Turb:    0x5AF0C4,
};
function tipMat(hex){
  return new THREE.MeshStandardMaterial({ color:hex, emissive:hex, emissiveIntensity:1.6, roughness:0.25, metalness:0.1 });
}

// ---------- root group ----------
const rig = new THREE.Group();
scene.add(rig);

// tank (cylindrical RAS tank, cut away) + solid water volume for real refraction
// ---- 3 distinct, interactive tanks, one per dashboard dropdown entry ----
function buildTank(xOffset){
  const g = new THREE.Group();
  const tankWall = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 2.1, 64, 1, true, -0.15, Math.PI*1.7), matTank);
  tankWall.position.y = -2.35;
  tankWall.receiveShadow = true;
  g.add(tankWall);

  const waterVolume = new THREE.Mesh(
    new THREE.CylinderGeometry(4.3, 4.3, 1.75, 64, 1, false, -0.15, Math.PI*1.7),
    matWater.clone()
  );
  waterVolume.position.y = -2.42;
  g.add(waterVolume);

  const tankFloor = new THREE.Mesh(new THREE.CircleGeometry(4.4, 64, -0.15, Math.PI*1.7), matTank);
  tankFloor.rotation.x = -Math.PI/2;
  tankFloor.position.y = -3.4;
  tankFloor.receiveShadow = true;
  g.add(tankFloor);

  // large invisible hit target so tanks are easy to click/tap
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 3.2, 24), new THREE.MeshBasicMaterial({ visible:false }));
  hit.position.y = -2.0;
  g.add(hit);

  g.position.x = xOffset;
  rig.add(g);
  return { group:g, waterVolume, hit };
}
const tankMeshes = TANKS.map(t => buildTank(t.x));

// name-tag sprites hovering above each tank, colour-coded by live health
function labelSprite(text, hex){
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(9,26,23,0.82)';
  roundRectPath(ctx, 4, 4, 504, 120, 22); ctx.fill();
  ctx.strokeStyle = '#'+hex.toString(16).padStart(6,'0'); ctx.lineWidth = 4;
  roundRectPath(ctx, 4, 4, 504, 120, 22); ctx.stroke();
  ctx.fillStyle = '#'+hex.toString(16).padStart(6,'0');
  ctx.beginPath(); ctx.arc(46, 64, 14, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#EAF3EF';
  ctx.font = '600 34px "Space Grotesk", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 76, 68);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map:tex, transparent:true, depthTest:false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.6, 0.65, 1);
  sprite.renderOrder = 10;
  return sprite;
}
function roundRectPath(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}
const healthHex = { good:0x33B47C, warn:0xE8B75E, crit:0xE86A5E };
const tankLabels = TANKS.map((t,i)=>{
  const s = labelSprite(t.name.replace('Tank '+(i+1)+' — ',''), healthHex[tankHealth(t)]);
  s.position.set(t.x, 2.6, 1.2);
  rig.add(s);
  return s;
});
function refreshTankLabel(i){
  const t = TANKS[i];
  const hex = healthHex[tankHealth(t)];
  const newSprite = labelSprite(t.name.replace('Tank '+(i+1)+' — ',''), hex);
  newSprite.position.copy(tankLabels[i].position);
  rig.remove(tankLabels[i]);
  tankLabels[i] = newSprite;
  rig.add(newSprite);
}

// ---------- device body (instrument cluster — follows the active tank) ----------
const instrumentRig = new THREE.Group();
rig.add(instrumentRig);
const device = new THREE.Group();
device.position.set(0, 0.05, 3.55);

function roundedBox(w,h,d,r,mat){
  const shape = new THREE.Shape();
  const x=-w/2, y=-h/2;
  shape.moveTo(x, y+r);
  shape.lineTo(x, y+h-r);
  shape.quadraticCurveTo(x,y+h,x+r,y+h);
  shape.lineTo(x+w-r,y+h);
  shape.quadraticCurveTo(x+w,y+h,x+w,y+h-r);
  shape.lineTo(x+w,y+r);
  shape.quadraticCurveTo(x+w,y,x+w-r,y);
  shape.lineTo(x+r,y);
  shape.quadraticCurveTo(x,y,x,y+r);
  const geo = new THREE.ExtrudeGeometry(shape, { depth:d, bevelEnabled:true, bevelThickness:0.03, bevelSize:0.03, bevelSegments:3, curveSegments:8 });
  geo.center();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

const body = roundedBox(1.9, 2.5, 1.15, 0.16, matBody);
device.add(body);

const trim = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.16, 1.2), matTrim);
trim.position.y = -0.86;
trim.castShadow = true;
device.add(trim);

const screen = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.72, 0.04), matScreen);
screen.position.set(0, 0.42, 0.6);
device.add(screen);
const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.85, 0.02), matDark);
bezel.position.set(0, 0.42, 0.585);
device.add(bezel);

const led = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), matLed);
led.position.set(0.62, 0.9, 0.6);
device.add(led);
const ledGlow = new THREE.PointLight(0x33ff9c, 0.7, 1.4);
ledGlow.position.copy(led.position);
device.add(ledGlow);

for(let i=0;i<4;i++){
  const vent = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.02,0.02), matDark);
  vent.position.set(0, -0.15 - i*0.09, 0.6);
  device.add(vent);
}

const clampArm = new THREE.Mesh(new THREE.BoxGeometry(0.14,0.14,0.9), matSteel);
clampArm.position.set(0,-0.3,0.05);
clampArm.castShadow = true;
device.add(clampArm);
const clampJaw = new THREE.Mesh(new THREE.TorusGeometry(0.22,0.05,10,20,Math.PI), matSteel);
clampJaw.rotation.x = Math.PI/2;
clampJaw.position.set(0,-0.3,-0.35);
device.add(clampJaw);

const solarGroup = new THREE.Group();
const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 0.95), matPanel);
solarGroup.add(solarPanel);
const grid = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.5,0.9,4,3)),
  new THREE.LineBasicMaterial({ color:0x3a6cff, transparent:true, opacity:0.5 })
);
grid.rotation.x = -Math.PI/2;
grid.position.y = 0.03;
solarGroup.add(grid);
solarGroup.position.set(0, 1.42, -0.1);
solarGroup.rotation.x = -0.18;
device.add(solarGroup);

instrumentRig.add(device);

// ---------- cables + upgraded probe cluster ----------
const probeDefs = [
  { key:"DO",      label:"DO probe",      x:-0.9,  z:0.9,  depth:1.55 },
  { key:"pH",      label:"pH probe",      x:-0.35, z:1.25, depth:1.75 },
  { key:"Temp",    label:"Temp probe",    x:0.2,   z:1.3,  depth:1.4  },
  { key:"Ammonia", label:"Ammonia probe", x:0.75,  z:0.95, depth:1.65 },
  { key:"Turb",    label:"Turbidity",     x:0.35,  z:1.7,  depth:1.5  },
];
const probeAnchors = [];
const probeTips = {};
probeDefs.forEach(p=>{
  const start = new THREE.Vector3(-0.2 + p.x*0.15, -1.15, 0.5);
  const mid   = new THREE.Vector3(p.x, -0.7, p.z);
  const end   = new THREE.Vector3(p.x, -1.6 - p.depth*0.55, p.z);
  const curve = new THREE.CatmullRomCurve3([
    device.position.clone().add(start),
    device.position.clone().add(mid).add(new THREE.Vector3(0,0.3,0)),
    end,
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.028, 8, false), matCable);
  tube.castShadow = true;
  instrumentRig.add(tube);

  const probe = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.062,0.062,0.5,16), matProbeBody);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,0.06,16), matSteel);
  collar.position.y = 0.2;
  const tip  = new THREE.Mesh(new THREE.SphereGeometry(0.07,20,20), tipMat(tipColors[p.key]));
  tip.position.y = -0.28;
  probe.add(stem, collar, tip);
  probe.position.copy(end).add(new THREE.Vector3(0,-0.2,0));
  instrumentRig.add(probe);
  probeTips[p.key] = tip;

  const tipGlow = new THREE.PointLight(tipColors[p.key], 0.55, 1.1);
  tipGlow.position.copy(probe.position).add(new THREE.Vector3(0,-0.28,0));
  instrumentRig.add(tipGlow);

  probeAnchors.push({ label:p.label, pos: end.clone().add(new THREE.Vector3(0,0.15,0)) });
});

// ---------- variant toggle ----------
let outdoor = false;
solarGroup.visible = false;
document.getElementById('btn-indoor').onclick = () => setVariant(false);
document.getElementById('btn-outdoor').onclick = () => setVariant(true);
function setVariant(o){
  outdoor = o;
  solarGroup.visible = o;
  document.getElementById('btn-indoor').classList.toggle('active', !o);
  document.getElementById('btn-outdoor').classList.toggle('active', o);
}

// ---------- interaction: drag rotate + wheel zoom + click tanks ----------
const sceneEl = document.getElementById('scene');
let dragging = false, lastX=0, lastY=0, autoSpin = true, movedSinceDown = false;
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();
sceneEl.addEventListener('pointerdown', e=>{ dragging=true; autoSpin=false; lastX=e.clientX; lastY=e.clientY; movedSinceDown=false; sceneEl.classList.add('dragging'); });
window.addEventListener('pointerup', (e)=>{
  dragging=false; sceneEl.classList.remove('dragging');
  if(!movedSinceDown){ handleClick(e); }
});
window.addEventListener('pointermove', e=>{
  if(!dragging) return;
  const dx=e.clientX-lastX, dy=e.clientY-lastY;
  if(Math.abs(dx)+Math.abs(dy) > 3) movedSinceDown = true;
  lastX=e.clientX; lastY=e.clientY;
  camYaw -= dx*0.006;
  camPitch = Math.max(0.08, Math.min(1.1, camPitch - dy*0.005));
});
sceneEl.addEventListener('wheel', e=>{
  camDist = Math.max(5.5, Math.min(20, camDist + e.deltaY*0.01));
  e.preventDefault();
}, { passive:false });

function handleClick(e){
  pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);

  // tank selection — clicking any tank hull switches the active tank
  const tankHits = raycaster.intersectObjects(tankMeshes.map(tm => tm.hit));
  if(tankHits.length){
    const idx = tankMeshes.findIndex(tm => tm.hit === tankHits[0].object);
    if(idx > -1){ selectTank(idx); return; }
  }
}

let camFocusX = TANKS[activeTank].x;
function updateCamera(){
  const targetX = TANKS[activeTank].x;
  camFocusX += (targetX - camFocusX) * 0.06;
  camera.position.set(
    camFocusX + Math.sin(camYaw)*Math.cos(camPitch)*camDist,
    Math.sin(camPitch)*camDist*0.85 + 0.4,
    Math.cos(camYaw)*Math.cos(camPitch)*camDist
  );
  camera.lookAt(camFocusX, -0.1, 1.0);
}

// ---------- tank selector chips + sensor control panel + AquaLink wiring ----------
const tankSelectorEl = document.getElementById('tankSelector');
const sliderHostEl = document.getElementById('sliderHost');
const panelTankNameEl = document.getElementById('panelTankName');
const syncBadgeEl = document.getElementById('syncBadge');
const syncTextEl = document.getElementById('syncText');

function renderTankChips(){
  tankSelectorEl.innerHTML = TANKS.map((t,i)=>{
    const h = tankHealth(t);
    return `<div class="tank-chip ${i===activeTank?'active':''} ${h==='warn'?'warn':h==='crit'?'crit':''}" data-i="${i}">
      <span class="hdot"></span>Tank ${t.id}
    </div>`;
  }).join('');
  tankSelectorEl.querySelectorAll('.tank-chip').forEach(chip=>{
    chip.addEventListener('click', ()=> selectTank(parseInt(chip.dataset.i,10)));
  });
}

function renderSliders(){
  sliderHostEl.innerHTML = SLIDER_DEFS.map(d=>{
    const val = TANKS[activeTank].params[d.key];
    return `
    <div class="slider-row" data-key="${d.key}">
      <div class="srow-top">
        <label>${d.label}</label>
        <span class="sval" id="sval-${d.key}">${val}${SAFE_RANGES[d.key].unit}</span>
      </div>
      <input type="range" id="slide-${d.key}" min="${d.min}" max="${d.max}" step="${d.step}" value="${val}">
    </div>`;
  }).join('');
  SLIDER_DEFS.forEach(d=>{
    document.getElementById('slide-'+d.key).addEventListener('input', (e)=>{
      const v = parseFloat(e.target.value);
      TANKS[activeTank].params[d.key] = v;
      updateSliderReadout(d.key, v);
      applyProbeTipFeedback();
      refreshTankLabel(activeTank);
      renderTankChips();
      transmitReading();
    });
  });
}

function updateSliderReadout(key, val){
  const el = document.getElementById('sval-'+key);
  if(!el) return;
  const r = SAFE_RANGES[key];
  el.textContent = (Math.round(val*100)/100) + r.unit;
  el.classList.remove('warn','crit');
  if(val < r.min || val > r.max){
    const span = r.max - r.min, dev = val < r.min ? r.min-val : val-r.max;
    el.classList.add(dev > span*0.2 ? 'crit' : 'warn');
  }
}

function applyProbeTipFeedback(){
  const p = TANKS[activeTank].params;
  const map = { DO:'do', pH:'ph', Temp:'temp', Ammonia:'ammonia', Turb:'turb' };
  Object.keys(map).forEach(tipKey=>{
    const pk = map[tipKey], r = SAFE_RANGES[pk], v = p[pk];
    const tip = probeTips[tipKey];
    if(!tip) return;
    const unsafe = v < r.min || v > r.max;
    const span = r.max - r.min, dev = v < r.min ? r.min-v : v-r.max;
    const crit = unsafe && dev > span*0.2;
    const hex = crit ? 0xE86A5E : (unsafe ? 0xE8B75E : tipColors[tipKey]);
    tip.material.color.setHex(hex);
    tip.material.emissive.setHex(hex);
  });
}

let lastTransmit = 0;
function transmitReading(){
  const now = performance.now();
  if(now - lastTransmit < 40) return; // light throttle, still feels instant
  lastTransmit = now;
  AquaLink.send({ type:'sensorUpdate', tank: TANKS[activeTank].id, params: TANKS[activeTank].params });
}

function selectTank(i, opts={}){
  activeTank = i;
  panelTankNameEl.textContent = 'Tank ' + TANKS[i].id;
  renderTankChips();
  renderSliders();
  applyProbeTipFeedback();
  if(!opts.silent){
    AquaLink.send({ type:'tankSelect', tank: TANKS[i].id });
  }
}

function setConnected(isConnected){
  syncBadgeEl.classList.toggle('connected', isConnected);
  syncTextEl.textContent = isConnected ? 'Live-synced with dashboard' : 'Linking to dashboard…';
}

AquaLink.onMessage((msg)=>{
  if(!msg || !msg.type) return;
  setConnected(true);
  if(msg.type === 'tankSelect'){
    const idx = TANKS.findIndex(t => t.id === msg.tank);
    if(idx > -1 && idx !== activeTank) selectTank(idx, { silent:true });
  } else if(msg.type === 'requestState'){
    TANKS.forEach(t => AquaLink.send({ type:'sensorUpdate', tank:t.id, params:t.params }));
    AquaLink.send({ type:'tankSelect', tank: TANKS[activeTank].id });
  } else if(msg.type === 'ping'){
    AquaLink.send({ type:'pong' });
  }
});

renderTankChips();
renderSliders();
applyProbeTipFeedback();
// announce presence + push current readings so a dashboard opened first is populated instantly
AquaLink.send({ type:'requestState' });
setTimeout(()=>{ TANKS.forEach(t => AquaLink.send({ type:'sensorUpdate', tank:t.id, params:t.params })); }, 300);

// ---------- resize ----------
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


let t = 0;
function animate(){
  requestAnimationFrame(animate);
  t += 0.016;
  if(autoSpin) camYaw += 0.0018;
  led.material.emissiveIntensity = 1.1 + Math.sin(Date.now()*0.004)*0.3;
  updateCamera();
  instrumentRig.position.x += (TANKS[activeTank].x - instrumentRig.position.x) * 0.06;

  renderer.render(scene, camera);
}
animate();
