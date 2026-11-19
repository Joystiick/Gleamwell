/* ============ Barn 7 ============ */
function pageBarn() {
  return `<div class="barn" id="barn">
    <canvas id="barn-cv" aria-hidden="true"></canvas>
    <div class="barn-ui" id="barn-ui">
      <div class="b-warn" id="b-stage0">
        <p class="b-tag">GLEAMWELL CLINICAL · RESTRICTED</p>
        <h1 class="b-title">ROOM 7</h1>
        <p class="b-sub">ACCESS PERMANENTLY REVOKED · SEALED 01/05/1989</p>
        <p class="b-body">This area is not part of your shift. Nothing inside needs treatment. Nothing inside is asking for you.</p>
        <button class="b-hold" id="b-hold" type="button"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="ring-bg"/><circle cx="60" cy="60" r="54" class="ring" id="b-ring"/></svg><span>Hold to override</span></button>
        <a href="#portal" class="b-back">Return to the terminal</a>
      </div>
      <div class="b-story" id="b-story" hidden><div class="b-lines" id="b-lines" aria-live="polite"></div><div class="b-choices" id="b-choices"></div></div>
      <p class="b-hint" id="b-hint" hidden></p>
    </div>
  </div>`;
}
function mountBarn() {
  const cv = $('#barn-cv'), x = cv.getContext('2d');
  let W = 0, H = 0; const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }; fit(); listen(window, 'resize', fit);
  let stage = 0, mode = 'door', light = { x: innerWidth / 2, y: innerHeight * .55 }, lightOn = true, doorOpen = 0;
  listen(window, 'pointermove', e => { light.x = e.clientX; light.y = e.clientY; }, { passive: true });
  listen(window, 'pointerdown', e => { light.x = e.clientX; light.y = e.clientY; }, { passive: true });
  // the room of faces
  const faces = [];
  function buildRoom() {
    const R = rng(7);
    for (let i = 0; i < 12; i++) {
      const z = .35 + R() * .65; const seed = 700 + i * 7;
      const base = { w: 120, h: 150, seed, scale: 1.05, smile: 1, open: .22, teeth: true, eyeOpen: 1.4, irisR: .028, hair: R() * .8, gaunt: .3 + R() * .5, mode: 'gray', bg: [0, 0, 0], light: [0, -.1, 1], ambient: .2, grain: .06, vignette: 1, clothes: [.05, .05, .05], tone: [[.86, .66, .54], [.6, .42, .3], [.92, .75, .62]][i % 3] };
      faces.push({ x: .08 + R() * .84, y: .38 + (1 - z) * .2, z, a: renderFace(base), b: renderFace({ ...base, eyes: 'hollow', open: .6, stretch: .5, blood: .6 }), lit: 0, seen: false });
    }
    faces.sort((a, b) => a.z - b.z);
  }
  function drawDoor(t) {
    x.fillStyle = '#030202'; x.fillRect(0, 0, W, H);
    const dw = Math.min(W * .5, H * .55), dh = dw * 1.35, dx = (W - dw) / 2, dy = H * .52 - dh / 2;
    const flick = .75 + .25 * Math.sin(t * 13) * Math.sin(t * 3.1);
    const g = x.createLinearGradient(0, dy + dh, 0, dy + dh + 120); g.addColorStop(0, `rgba(255,190,120,${.35 * flick})`); g.addColorStop(1, 'rgba(255,190,120,0)'); x.fillStyle = g; x.fillRect(dx - 80, dy + dh, dw + 160, 120);
    x.fillStyle = `rgba(255,200,140,${.9 * flick})`; x.fillRect(dx + 4, dy + dh - 3, dw - 8, 3);
    if (doorOpen > 0) { const ow = dw / 2 * doorOpen; x.fillStyle = '#000'; x.fillRect(W / 2 - ow, dy, ow * 2, dh); }
    for (const side of [-1, 1]) {
      x.save(); x.translate(W / 2, dy); x.scale(side * (1 - doorOpen * .85), 1);
      const wg = x.createLinearGradient(0, 0, dw / 2, 0); wg.addColorStop(0, '#1b1210'); wg.addColorStop(1, '#2a1c17'); x.fillStyle = wg; x.fillRect(0, 0, dw / 2, dh);
      x.strokeStyle = '#120b09'; x.lineWidth = 3; for (let i = 1; i < 6; i++) { x.beginPath(); x.moveTo(dw / 12 * i, 0); x.lineTo(dw / 12 * i, dh); x.stroke(); }
      x.fillStyle = '#0a0806'; x.beginPath(); x.arc(dw / 4, dh * .3, dw * .09, 0, 7); x.fill(); x.strokeStyle = '#4a3a32'; x.lineWidth = 5; x.stroke(); if (side > 0 && Math.sin(t * .7) > .6) { x.fillStyle = 'rgba(215,205,190,.55)'; x.beginPath(); x.ellipse(dw / 4, dh * .31, dw * .045, dw * .06, 0, 0, 7); x.fill(); x.fillStyle = '#000'; x.fillRect(dw / 4 - dw * .025, dh * .3, dw * .014, dw * .014); x.fillRect(dw / 4 + dw * .011, dh * .3, dw * .014, dw * .014); x.fillStyle = '#eee'; x.fillRect(dw / 4 - dw * .025, dh * .3 + dw * .03, dw * .05, dw * .008); } x.fillStyle = '#3a2a24'; x.fillRect(dw / 2 - 18, dh * .5, 10, 46);
      x.restore();
    }
    x.fillStyle = '#5a1010'; x.font = `${dw * .09}px "IM Fell English", Georgia, serif`; x.textAlign = 'center'; if (doorOpen < .3) x.fillText('7', W / 2, dy - dw * .05);
    x.globalAlpha = .045; x.drawImage(NOISE.c, 0, 0, W, H); x.globalAlpha = 1;
  }
  let litCount = 0, roomStart = 0, ending = false;
  function drawRoom(t) {
    x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#0f0c0b'; x.lineWidth = 2; for (let i = 0; i < 14; i++) { const fx = i / 13; x.beginPath(); x.moveTo(W * fx, H); x.lineTo(W * .5 + (fx - .5) * W * .3, H * .42); x.stroke(); }
    const r = Math.min(W, H) * .2;
    for (const f of faces) {
      const s = f.z * Math.min(W, H) * .36, fx = f.x * W, fy = H * f.y + (1 - f.z) * -40;
      const d = Math.hypot(light.x - fx, light.y - (fy + s * .6));
      const inLight = lightOn && d < r * 1.1;
      if (inLight) { f.lit += 1 / 60; if (!f.seen && f.lit > .25) { f.seen = true; litCount++; AU.tone(180 + litCount * 20, .4, { type: 'sine', gain: .05, wet: .8 }); } }
      const img = f.lit > 1.3 ? f.b : f.a;
      const lean = clamp((light.x - fx) / W) * 12 * (f.lit > .3 ? 1 : 0);
      x.save(); x.translate(fx, fy); x.rotate(lean * .01);
      x.fillStyle = '#060505'; x.beginPath(); x.moveTo(-s * .45, s * 2.4); x.lineTo(-s * .34, s * 1.05); x.quadraticCurveTo(0, s * .85, s * .34, s * 1.05); x.lineTo(s * .45, s * 2.4); x.fill();
      x.drawImage(img, -s / 2, 0, s, s * 1.25); x.restore();
    }
    // darkness with a hole for the torch
    const flick = lightOn ? (.92 + Math.random() * .08) : 0;
    const g = x.createRadialGradient(light.x, light.y, r * .15, light.x, light.y, r * 1.2);
    g.addColorStop(0, `rgba(0,0,0,${1 - .95 * flick})`); g.addColorStop(.6, `rgba(0,0,0,${1 - .6 * flick})`); g.addColorStop(1, 'rgba(0,0,0,.985)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'multiply'; x.fillStyle = '#ffdcb0'; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over';
    x.globalAlpha = .06; x.drawImage(NOISE.c, 0, 0, W, H); x.globalAlpha = 1;
    const hint = $('#b-hint'); if (hint && !ending) hint.textContent = `Move your light. Count them. ${litCount} / ${faces.length}`;
    if (!ending && (litCount >= faces.length || t - roomStart > 28)) finale();
  }
  async function finale() {
    ending = true; const hint = $('#b-hint');
    hint.textContent = 'Your light is dying.';
    for (let i = 0; i < 5; i++) { lightOn = false; AU.click(); await wait(120 + Math.random() * 200); lightOn = true; await wait(90 + Math.random() * 300); }
    lightOn = false; hint.textContent = ''; AU.setAmbient('none');
    await wait(1800); if (!cv.isConnected) return;
    AU.breath(2.2); AU.speak('welcome home', { rate: .45, pitch: .05, volume: .8 });
    hint.textContent = 'welcome home'; hint.classList.add('whisper');
    await wait(2600); if (!cv.isConnected) return;
    hint.textContent = '';
    await jumpscare('merry', { dur: 1500, swap: 'face', level: 1.2 });
    store.set('gh-stock', '1'); location.hash = '#patient';
  }
  async function story() {
    $('#b-stage0').hidden = true; $('#b-story').hidden = false; AU.setAmbient('barn'); stage = 1;
    const lines = $('#b-lines'), choices = $('#b-choices');
    const say = async (s, ms = 2200) => { const p = document.createElement('p'); p.textContent = s; lines.appendChild(p); requestAnimationFrame(() => p.classList.add('in')); await wait(ms); return cv.isConnected; };
    if (!await say('The door to Room 7 is warm.')) return;
    if (!await say('Someone on the other side is humming the brushing song.', 600)) return;
    const end = AU.jingle('wrong'); await wait(end * 1000);
    if (!await say('They know you are here.', 1500)) return;
    choices.innerHTML = '<button type="button" class="b-btn" id="b-knock">Knock</button><button type="button" class="b-btn" id="b-leave">Leave</button>';
    $('#b-leave').addEventListener('click', async () => { $('#b-leave').remove(); await say("You can't leave. You're on shift.", 100); AU.thump(0, 1.4); });
    $('#b-knock').addEventListener('click', async () => {
      choices.innerHTML = ''; AU.knock(0); AU.knock(.4); AU.knock(.8);
      await wait(1400); if (!await say('The singing stops.', 2600)) return;
      AU.knock(0, 1.6); AU.knock(.25, 1.6); AU.knock(.5, 1.6); document.body.classList.add('quake-s'); later(700, () => document.body.classList.remove('quake-s'));
      if (!await say('Someone knocks back.', 2400)) return;
      if (!await say('The door opens on its own.', 300)) return;
      AU.creak(2.6); const s0 = performance.now(); await new Promise(res => { const f = n => { doorOpen = clamp((n - s0) / 2600); if (doorOpen < 1 && cv.isConnected) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
      $('#b-story').hidden = true; const hint = $('#b-hint'); hint.hidden = false;
      buildRoom(); mode = 'room'; roomStart = performance.now() / 1000;
    });
  }
  // hold to override
  const hold = $('#b-hold'), ring = $('#b-ring'); let hs = 0, hid = null;
  const C = 2 * Math.PI * 54; ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C;
  const down = e => { e.preventDefault(); AU.init(); hs = performance.now(); clearInterval(hid); AU.heartbeat(1); hid = setInterval(() => { const k = clamp((performance.now() - hs) / 3000); ring.style.strokeDashoffset = C * (1 - k); if (Math.random() < .2) AU.thump(0, .6 + k); if (k >= 1) { clearInterval(hid); AU.sting(); story(); } }, 60); };
  const up = () => { if (stage) return; clearInterval(hid); ring.style.strokeDashoffset = C; };
  listen(hold, 'pointerdown', down); listen(hold, 'pointerup', up); listen(hold, 'pointerleave', up); listen(hold, 'pointercancel', up);
  listen(hold, 'keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) down(e); });
  listen(hold, 'keyup', up);
  onClean(() => clearInterval(hid));
  loop(now => { const t = now / 1000; NOISE.tick(); if (mode === 'door') drawDoor(t); else drawRoom(t); });
}

/* ---------- after: you are stock ---------- */
function pageStock() {
  const now = new Date();
  return `<div class="stock-page"><div class="idcard" id="idcard">
    <div class="id-top"><span class="gh-badge">GW</span><div><b>GLEAMWELL FOREVER SMILE™ PATIENT</b><small>Property of Gleamwell Smile Co.</small></div></div>
    <div class="id-body"><canvas id="id-photo" width="180" height="225" aria-label="Your intake photograph"></canvas>
      <dl><dt>Patient ID</dt><dd>GW-P-1205</dd><dt>Name</dt><dd>Not required</dd><dt>Origin</dt><dd>${esc(CITY)}</dd><dt>Intake</dt><dd>${fmtDate(now)} ${fmtTime(now)}</dd><dt>Assigned</dt><dd>Room 7</dd><dt>Status</dt><dd class="st st-ok">SMILING</dd></dl></div>
    <div class="barcode" aria-hidden="true">${Array.from({ length: 48 }, (_, i) => `<i style="width:${1 + (hash2(i, 5, 5) * 4 | 0)}px"></i>`).join('')}</div>
  </div>
  <div class="stock-copy"><h1>Treatment complete.</h1><p>Your Forever Smile™ is fitted. You are happy here. You have always been happy here.</p>
    <div class="stock-ctas"><a class="btn btn-white" href="#home">Return to gleamwell.com</a><a class="btn btn-ghost-d" href="#registry">View the registry</a></div>
    <p class="stock-fine">The site will look normal again. It always does. Some of it will remember you.</p></div></div>`;
}
function mountStock() {
  const p = renderFace({ w: 180, h: 225, seed: 1205, smile: 1, open: .25, teeth: true, eyeOpen: 1.45, irisR: .027, hair: .5, gaunt: .3, mode: 'cctv', bg: [.55, .58, .55], grain: .12, light: [0, -.2, 1] });
  const x = $('#id-photo').getContext('2d'); x.drawImage(p, 0, 0);
  AU.setAmbient('barn'); later(1500, () => AU.speak('You are happy here.', { rate: .7, pitch: .3 }));
}
