/* ============ the staff intranet (behind the code) ============ */
const PNAV = [['portal', 'Dashboard'], ['registry', 'Patient registry'], ['cameras', 'Cameras'], ['memos', 'Memos'], ['tapes', 'Recovered tape'], ['room7', 'Room 7']];
function portalShell(route, inner) {
  return `<div class="portal crt">
  <aside class="p-side">
    <div class="p-brand"><span class="gh-badge">GW</span><span>GLEAMWELL<small>CLINICAL SYSTEMS v2.3</small></span></div>
    <nav class="p-nav" aria-label="Intranet">${PNAV.map(([k, l]) => `<a href="#${k}" class="${k === 'room7' ? 'p-danger' : ''}" ${k === route ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <div class="p-user"><b>ATTENDANT #0447</b><span>Shift: 22:00 – ∞</span><button type="button" id="logout" class="p-btn">Log out</button></div>
  </aside>
  <section class="p-main"><header class="p-top"><span>TERMINAL 03 · NIGHT SHIFT · ${esc(CITY.toUpperCase())}</span><span id="p-clock" class="tnum"></span></header><div class="p-body">${inner}</div></section>
</div>`;
}
function mountPortalCommon() {
  const clk = $('#p-clock'); const tick = () => { if (clk) clk.textContent = new Date().toLocaleTimeString([], { hour12: false }); }; tick(); every(1000, tick);
  listen($('#logout'), 'click', () => { toast("You can't log out during a shift."); AU.buzz(); later(2200, () => { toast('Fine. Go. We know where you live.', 3500); location.hash = '#home'; }); });
  const ghost = () => later(35000 + Math.random() * 40000, () => { subliminal(Math.random() < .5 ? 'stare' : 'face2', 110, .16); AU.breath(1.5); ghost(); });
  ghost();
}

/* ---------- dashboard ---------- */
function pagePortal() {
  const pts = []; const R = rng(30);
  for (let i = 0; i < 30; i++) pts.push(i === 19 ? 61.2 : i === 20 ? 84 : 98.6 + R() * 1.3);
  const W = 560, H = 160, px = i => 34 + i * (W - 44) / 29, py = v => 14 + (100 - v) / 45 * (H - 34);
  const line = pts.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  return portalShell('portal', `
  <h1 class="p-h1">Good evening, Attendant.</h1>
  <p class="p-sub">You are logged in as <b>#0447</b>. Your predecessor was <b>#0446</b>. Please do not read #0446's notes.</p>
  <div class="tiles">
    <div class="tile"><span>PATIENTS IN CARE</span><b class="tnum" id="t-stock">1,204</b><small>+1 walk-in pending</small></div>
    <div class="tile"><span>SMILE RETENTION</span><b class="tnum">99.7%</b><small>target 100%</small></div>
    <div class="tile"><span>STAFF ON SHIFT</span><b class="tnum">3</b><small>2 responding</small></div>
    <div class="tile tile-red"><span>DAYS SINCE INCIDENT</span><b class="tnum" id="t-inc">0</b><small id="t-inc-s">counting</small></div>
  </div>
  <div class="p-grid">
    <section class="panel span2"><h2>NOTICES</h2><ul class="notices">
      <li><b>REMINDER</b> Do not speak to patients after the procedure. They will ask you to take it out. They do not mean it.</li>
      <li><b>OPS</b> Pearl's Morning Message plays at 06:00 in every ward. Do not mute it. The patients need to hear that they are happy.</li>
      <li><b>LOST</b> One (1) Night Attendant, answers to 0446. If found, do not return to staff. Return to a chair.</li>
      <li><b>FACILITIES</b> Room 7 is closed. Room 7 has always been closed. Please stop leaving trays outside the door.</li>
      <li><b>CLINICAL</b> Smile maintenance is now performed weekly instead of monthly. Thank you for your patience during the screaming.</li>
      <li><b>HR</b> Staff who express concern will be offered the Forever Smile™. Most accept. The rest accept later.</li>
    </ul></section>
    <section class="panel eom"><h2>EMPLOYEE OF THE MONTH</h2><canvas id="eom" width="160" height="200" aria-label="Photo of Dale Pruitt"></canvas><b>Dale Pruitt</b><p>Sterilization, Plant 2. Dale has received the Forever Smile™. Congratulations, Dale!</p></section>
    <section class="panel span2"><h2>SMILE RETENTION · LAST 30 NIGHTS</h2>
      <div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Smile retention, steady near 99 percent except one drop to 61.2 percent">
        ${[100, 80, 60].map(v => `<line x1="34" x2="${W - 10}" y1="${py(v)}" y2="${py(v)}" class="gridl"/><text x="28" y="${py(v) + 4}" text-anchor="end" class="axis">${v}</text>`).join('')}
        <polyline points="${line}" class="spark"/><circle cx="${px(19)}" cy="${py(61.2)}" r="4" class="dot-red"/><text x="${px(19) + 8}" y="${py(61.2) + 4}" class="axis red">61.2 · Room 7 opened</text>
        <circle cx="${px(29)}" cy="${py(pts[29])}" r="4" class="dot"/></svg></div></section>
    <section class="panel"><h2>MORNING MESSAGE</h2><p>Broadcast in every ward at 06:00. Preview only. Do not play near patients outside scheduled hours.</p><button class="p-btn" id="mm-play" type="button">▶ Play morning message</button><p id="mm-text" class="mm-text" aria-live="polite"></p></section>
  </div>`);
}
function mountPortal() {
  mountPortalCommon();
  $('#eom').getContext('2d').drawImage(renderFace({ w: 160, h: 200, seed: 77, smile: 1, open: .25, teeth: true, eyeOpen: 1.4, irisR: .028, hair: .5, mode: 'cctv', bg: [.3, .3, .3], grain: .12, gaunt: .4 }), 0, 0);
  let inc = 0; every(1000, () => { inc++; const el = $('#t-inc'); if (!el) return; if (inc > 6 && Math.random() < .12) { inc = 0; el.textContent = '0'; $('#t-inc-s').textContent = 'INCIDENT LOGGED · BARN 7'; AU.glitch(); } else { el.textContent = (inc / 86400).toFixed(5); $('#t-inc-s').textContent = 'counting'; } });
  const lines = ['Good morning, Gleamwell!', 'It is a beautiful day at the clinic.', 'You are happy.', 'You are calm.', 'Keep smiling.', 'You do not remember before.', 'You are happy.', 'You are happy.', 'YOU ARE HAPPY.', 'please'];
  let playing = false;
  listen($('#mm-play'), 'click', async () => {
    if (playing) return; playing = true; AU.init(); const out = $('#mm-text'); out.textContent = '';
    const end = AU.jingle('happy'); await wait(end * 1000 + 300);
    for (let i = 0; i < lines.length; i++) {
      if (!out.isConnected) return;
      const l = lines[i]; out.textContent = l; out.classList.toggle('loud', i === 8); out.classList.toggle('faint', i === 9);
      if (i === 9) { AU.glitch(); AU.speak(l, { rate: .5, pitch: .1, volume: .5 }); } else AU.speak(l, { rate: i > 5 ? .8 : 1, pitch: i > 5 ? .6 : 1.4 });
      await wait(i === 8 ? 1800 : 1500);
    }
    playing = false;
  });
}

/* ---------- registry ---------- */
const STOCK_NAMES = ['Walter Gleam', 'Dale Pruitt', 'Marion Keele', 'Tom Ashby', 'Lucy Varga', 'Night Attendant #0446', 'Evan Morrow', 'Ruth Delaney', 'Sam Okafor', 'Joan Pike', 'Leo Brandt', 'Anita Shah', 'Cody Reyes', 'Beth Hollis', 'Grace Kim', 'Walt Becker', 'Nora Quinn', 'Felix Dunn', 'Ivy Moreno', 'Paul Stroud', 'June Abbott', 'Owen Tate', 'Mia Lund', 'Rosa Ferreira'];
const ROLES = ['Former hygienist', 'Walk-in (second visit)', 'Packing associate', 'Delivery driver', 'Answered careers ad', 'Night Attendant', 'Intake coordinator', 'Local resident'];
const NOTES = ['Stopped asking for her children on day 9.', 'Smile maintained weekly. Responds well to Pearl.', 'Came back for the second visit. Stayed.', 'Sings at night. Do not record.', 'Accepted transfer on first night.', 'Says she remembers before. Scheduled for re-telling.', 'Very content. Very, very content.', 'Has asked for a mirror 41 times. Denied.', 'Enamel optimal. Ready for extraction.', 'Keeps scratching his name into the ceiling above his chair. Ceiling repainted.', 'Hums the jingle in her sleep. Good.', 'Asked what day it is. Told it is always morning.'];
const STATUSES = ['SMILING', 'SMILING', 'SMILING', 'IN TREATMENT', 'EXTRACTED', 'SMILING', 'RESISTING', 'SMILING'];
function stockList() {
  const R = rng(1205);
  const list = STOCK_NAMES.map((n, i) => {
    const y = 1989 + Math.floor(R() * 37), m = 1 + Math.floor(R() * 12), d = 1 + Math.floor(R() * 28);
    return { i, id: `GW-P-${String(i === 0 ? 1 : i === 5 ? 446 : 12 + i * 47).padStart(4, '0')}`, name: n, role: ROLES[Math.floor(R() * ROLES.length)], intake: `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`, status: STATUSES[Math.floor(R() * STATUSES.length)], note: NOTES[Math.floor(R() * NOTES.length)], seed: 500 + i * 13 };
  });
  Object.assign(list[0], { role: 'Founder', intake: '10/31/2003', status: 'ROOM 7', note: 'Gave himself the Forever Smile in 2003 and asked to be placed in Room 7. Granted. Still treating the others.', seed: 1962 });
  Object.assign(list[1], { role: 'Sterilization · Employee of the Month', status: 'IN TREATMENT', note: 'Received the Forever Smile the day he won Employee of the Month. Very proud. Will not stop showing it.', seed: 77 });
  Object.assign(list[5], { role: 'Night Attendant (your predecessor)', intake: 'last week', status: 'RESISTING', note: 'Hid five numbers on the public website so an outsider could get in. Located at 03:12 at the observation desk. Still talking. Still warning people.' });
  const now = new Date();
  list.push({ i: 24, id: 'GW-P-1205', name: isStock() ? 'GW-P-1205' : 'VISITOR', role: `Visitor from ${CITY}`, intake: isStock() ? fmtDate(now) : `${fmtDate(now)} (scheduled)`, status: isStock() ? 'SMILING' : 'EN ROUTE', note: isStock() ? 'Intake complete. Settling in well. Smiling already.' : 'Found the numbers. Logged in as #0447. Photo will be taken on arrival.', seed: 1205, you: true });
  return list;
}
function mugshot(p, w = 120, h = 150) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  if (p.you && !isStock()) { x.fillStyle = '#1a201c'; x.fillRect(0, 0, w, h); x.strokeStyle = '#3c5a45'; x.setLineDash([4, 4]); x.strokeRect(8, 8, w - 16, h - 40); x.fillStyle = '#6f9a7a'; x.font = `${w * .1}px "IBM Plex Mono", monospace`; x.textAlign = 'center'; x.fillText('PHOTO', w / 2, h * .38); x.fillText('PENDING', w / 2, h * .48); }
  else {
    const harold = p.seed === 1962, s446 = p.id === 'GW-P-0446';
    const f = renderFace({ w, h, seed: p.seed, scale: 1.05, cy: -.08, smile: 1, open: harold ? .5 : .22, stretch: harold ? .5 : 0, teeth: true, eyes: harold ? 'hollow' : 'open', eyeOpen: 1.35, irisR: .03, age: harold ? 1 : 0, hair: harold ? 0 : .3 + hash2(p.i, 1, 2) * .7, hairCol: harold ? [.7, .7, .68] : [.12, .1, .08], gaunt: .25 + hash2(p.i, 2, 2) * .5, tone: [[.86, .66, .54], [.6, .42, .3], [.92, .75, .62], [.45, .3, .22]][p.i % 4], mode: 'gray', bg: [.62, .62, .6], grain: .1, light: [0, -.2, 1], blood: harold ? .5 : 0, vignette: .3 });
    x.drawImage(f, 0, 0);
    x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1; for (let y = 10; y < h - 30; y += 12) { x.beginPath(); x.moveTo(0, y); x.lineTo(w * .14, y); x.moveTo(w * .86, y); x.lineTo(w, y); x.stroke(); }
    if (s446) { x.strokeStyle = '#000'; x.lineWidth = 3; const R = rng(446); for (let i = 0; i < 40; i++) { x.beginPath(); x.moveTo(w * .28 + R() * w * .44, h * .36 + R() * h * .08); x.lineTo(w * .28 + R() * w * .44, h * .36 + R() * h * .08); x.stroke(); } }
  }
  x.fillStyle = '#111'; x.fillRect(w * .12, h - 28, w * .76, 22); x.fillStyle = '#eee'; x.font = `${Math.round(w * .095)}px "IBM Plex Mono", monospace`; x.textAlign = 'center'; x.fillText(p.id, w / 2, h - 12);
  return c;
}
const statusCls = s => ({ SMILING: 'st-ok', 'IN TREATMENT': 'st-amb', EXTRACTED: 'st-dim', RESISTING: 'st-red', 'ROOM 7': 'st-blk', 'EN ROUTE': 'st-you' }[s] || '');
function pageRegistry() {
  return portalShell('registry', `
  <h1 class="p-h1">Patient registry</h1><p class="p-sub">Forever Smile™ recipients only. Every patient is smiling at the time of photograph. Click an entry for its file.</p>
  <div class="reg-tools"><label class="sr" for="reg-q">Search patients</label><input id="reg-q" class="p-input" placeholder="Search by name or ID" autocomplete="off">
    <div class="reg-filters" role="group" aria-label="Filter by status">${['ALL', 'SMILING', 'IN TREATMENT', 'RESISTING', 'EXTRACTED'].map((s, i) => `<button class="p-chip" type="button" data-s="${s}" aria-pressed="${i === 0}">${s}</button>`).join('')}</div></div>
  <p class="reg-none" id="reg-none" hidden>No match. <b>1 result</b> found anyway: you are already in the system.</p>
  <div class="reg-grid" id="reg-grid"></div>`);
}
function mountRegistry() {
  mountPortalCommon();
  const list = stockList(), grid = $('#reg-grid');
  list.forEach(p => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'reg' + (p.you ? ' reg-you' : ''); b.dataset.name = (p.name + ' ' + p.id).toLowerCase(); b.dataset.status = p.status;
    b.innerHTML = `<span class="reg-photo"></span><span class="reg-meta"><b>${esc(p.name)}</b><small>${esc(p.role)}</small><span class="st ${statusCls(p.status)}">${p.status}</span></span>`;
    grid.appendChild(b);
    listen(b, 'click', () => openDossier(p));
  });
  // draw faces progressively so the page appears at once
  let k = 0; const draw = () => { const el = grid.children[k]; if (!el) return; el.querySelector('.reg-photo').appendChild(mugshot(list[k])); k++; later(16, draw); }; draw();
  let st = 'ALL';
  const apply = () => { const q = $('#reg-q').value.trim().toLowerCase(); let n = 0; [...grid.children].forEach(el => { const ok = (st === 'ALL' || el.dataset.status === st) && (!q || el.dataset.name.includes(q)); el.hidden = !ok; if (ok) n++; }); $('#reg-none').hidden = n > 0; if (!n) grid.lastElementChild.hidden = false; };
  listen($('#reg-q'), 'input', apply);
  $$('.p-chip').forEach(c => listen(c, 'click', () => { $$('.p-chip').forEach(x => x.setAttribute('aria-pressed', x === c)); st = c.dataset.s; apply(); }));
}
function openDossier(p) {
  openModal(`<div class="dossier"><div class="dos-photo" id="dos-photo"></div><div class="dos-copy"><span class="st ${statusCls(p.status)}">${p.status}</span><h2 id="modal-title">${esc(p.name)}</h2>
    <dl><dt>Patient ID</dt><dd>${p.id}</dd><dt>Previously</dt><dd>${esc(p.role)}</dd><dt>Intake</dt><dd>${esc(p.intake)}</dd><dt>Room</dt><dd>${p.status === 'ROOM 7' || p.you ? '7' : 1 + (p.i % 6)}</dd><dt>Smile</dt><dd>${p.you && !isStock() ? 'not yet fitted' : 'fitted, permanent'}</dd></dl>
    <p class="dos-note">${esc(p.note)}</p></div></div>`, 'm-dark');
  $('#dos-photo').appendChild(mugshot(p, 220, 275));
  if (p.seed === 1962) { AU.voice(98, 3, 0, 0); }
  if (p.id === 'GW-P-0446') AU.breath(2);
}

/* ---------- cameras ---------- */
const CAMS = [[1, 'WARD A · RECOVERY'], [2, 'STERILIZATION · PLANT 2'], [3, 'PARKING LOT · NORTH'], [7, 'ROOM 7 · INTERIOR']];
const CAMSTATE = { yard: +(store.get('gh-yard') || 0), packTurned: false, b7seen: false };
function person(x, cx, by, s, { front = true, tilt = 0, glow = .75, eyes = 'dots' } = {}) {
  x.save(); x.translate(cx, by); x.scale(s, s);
  x.fillStyle = '#141414'; x.beginPath(); x.moveTo(-14, 0); x.lineTo(-11, -42); x.quadraticCurveTo(0, -50, 11, -42); x.lineTo(14, 0); x.fill();
  x.translate(0, -52); x.rotate(tilt);
  x.fillStyle = front ? `rgba(${Math.round(255 * glow)},${Math.round(255 * glow)},${Math.round(250 * glow)},1)` : '#262626';
  x.beginPath(); x.ellipse(0, 0, 7.5, 9.5, 0, 0, 7); x.fill();
  if (front) { x.fillStyle = '#000'; if (eyes === 'dots') { x.fillRect(-4, -2, 2.4, 2.6); x.fillRect(1.6, -2, 2.4, 2.6); } else { x.beginPath(); x.ellipse(-3, -1, 2, 2.8, 0, 0, 7); x.ellipse(3, -1, 2, 2.8, 0, 0, 7); x.fill(); } x.fillRect(-4.5, 4, 9, 1.6); }
  x.restore();
}
function camDraw(id, x, w, h, t, big, local) {
  x.save(); x.scale(w / 240, h / 135);
  if (id === 1) {
    x.fillStyle = '#1c1c1c'; x.fillRect(0, 0, 240, 135);
    const g = x.createRadialGradient(120, 0, 10, 120, 40, 150); g.addColorStop(0, 'rgba(200,200,190,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 240, 135);
    x.strokeStyle = '#333'; for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo(120 + (i - 3) * 14, 40); x.lineTo(120 + (i - 3) * 60, 135); x.stroke(); }
    const tilting = (t % 9) > 7.6;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) person(x, 120 + (c - 2.5) * (20 + r * 10), 72 + r * 22, .38 + r * .17, { tilt: tilting ? .35 : 0, glow: .55 + r * .12 });
  } else if (id === 2) {
    x.fillStyle = '#242424'; x.fillRect(0, 0, 240, 135); x.fillStyle = '#3a3a3a'; x.fillRect(0, 70, 240, 18);
    for (let i = 0; i < 14; i++) { x.fillStyle = '#2a2a2a'; x.fillRect((i * 20 + t * 22) % 260 - 20, 70, 3, 18); }
    for (let i = 0; i < 5; i++) { const px = (i * 60 + t * 22) % 300 - 60; x.fillStyle = '#9a9a9a'; x.fillRect(px, 58, 34, 13); x.fillStyle = '#6a6a6a'; x.fillRect(px + 4, 61, 26, 7); }
    person(x, 205, 118, .95, { front: CAMSTATE.packTurned, eyes: 'holes' });
  } else if (id === 3) {
    x.fillStyle = '#121412'; x.fillRect(0, 0, 240, 135); const g = x.createLinearGradient(0, 60, 0, 135); g.addColorStop(0, '#222622'); g.addColorStop(1, '#3a403a'); x.fillStyle = g; x.fillRect(0, 60, 240, 75);
    for (let i = 0; i < 7; i++) { x.fillStyle = i === 6 ? '#000' : '#0c0d0c'; const bx = 20 + i * 30; x.beginPath(); x.moveTo(bx, 60); x.lineTo(bx, 50); x.lineTo(bx + 8, 44); x.lineTo(bx + 16, 50); x.lineTo(bx + 16, 60); x.fill(); }
    x.strokeStyle = '#5a605a'; x.lineWidth = 1.2; for (let i = 0; i < 9; i++) { const k = i / 8, px = lerp(10, 110, k), py = lerp(130, 64, k); x.beginPath(); x.moveTo(px, py); x.lineTo(px, py - lerp(22, 6, k)); x.stroke(); }
    x.beginPath(); x.moveTo(10, 116); x.lineTo(110, 60); x.stroke();
    const L = Math.min(CAMSTATE.yard, 5), k = L / 5;
    const fy = lerp(64, 150, k), fs = lerp(.32, 2.6, k * k);
    person(x, 150 - k * 30, fy, fs, { glow: .85, eyes: k > .5 ? 'holes' : 'dots' });
    x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(0, 0, 240, 135);
  } else if (id === 7) {
    const el = big ? (t - local) : 0;
    if (!big || (el < 5 && !CAMSTATE.b7seen)) {
      x.fillStyle = '#000'; x.fillRect(0, 0, 240, 135); x.globalAlpha = .9; x.drawImage(NOISE.c, 0, 0, 240, 135); x.globalAlpha = 1;
      x.fillStyle = '#fff'; x.font = '16px VT323, monospace'; x.textAlign = 'center'; x.fillText('NO SIGNAL', 120, 72);
    } else {
      x.fillStyle = '#0d0d0d'; x.fillRect(0, 0, 240, 135); x.strokeStyle = '#2b2b2b'; x.lineWidth = 2;
      x.strokeRect(70, 25, 100, 110); x.beginPath(); x.moveTo(0, 135); x.lineTo(70, 100); x.moveTo(240, 135); x.lineTo(170, 100); x.stroke();
      x.fillStyle = '#000'; x.fillRect(74, 29, 92, 106);
      if (CAMSTATE.b7seen) { person(x, 120, 170, 3.2, { eyes: 'holes', glow: .7 }); x.fillStyle = '#ddd'; x.font = '14px VT323, monospace'; x.textAlign = 'center'; if ((t * 2 | 0) % 2) x.fillText('SHE SEES YOU', 120, 20); }
      else { const peek = clamp((el - 5) / 3); x.save(); x.beginPath(); x.rect(74, 29, 92, 106); x.clip(); x.fillStyle = '#c9c9c0'; x.beginPath(); x.ellipse(166 - peek * 10, 70, 9, 12, -.2, 0, 7); x.fill(); x.fillStyle = '#000'; x.beginPath(); x.ellipse(163 - peek * 10, 67, 2.4, 3.4, 0, 0, 7); x.fill(); x.restore(); }
      x.globalAlpha = Math.max(0, .9 - (el - 5) * .5); x.drawImage(NOISE.c, 0, 0, 240, 135); x.globalAlpha = 1;
    }
  }
  x.restore();
  // dressing
  x.globalAlpha = .16; x.drawImage(NOISE.c, 0, 0, w, h); x.globalAlpha = 1;
  x.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < h; y += 3) x.fillRect(0, y, w, 1);
  x.globalCompositeOperation = 'multiply'; x.fillStyle = '#b6e3c1'; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'source-over';
  const fs = Math.max(10, w / 22); x.font = `${fs}px VT323, monospace`; x.textAlign = 'left'; x.fillStyle = '#e8f5ea';
  const label = CAMS.find(c => c[0] === id)[1];
  x.fillText(`CAM 0${id}  ${label}`, fs * .6, fs * 1.2);
  const d = new Date(); x.textAlign = 'right'; x.fillText(`${fmtDate(d)} ${d.toLocaleTimeString([], { hour12: false })}`, w - fs * .6, h - fs * .5);
  if ((t * 1.5 | 0) % 2) { x.fillStyle = '#e33'; x.beginPath(); x.arc(w - fs * 1.6, fs * .9, fs * .3, 0, 7); x.fill(); x.fillStyle = '#e8f5ea'; x.fillText('REC', w - fs * 2.1, fs * 1.2); }
}
function pageCameras() {
  return portalShell('cameras', `<h1 class="p-h1">Cameras</h1><p class="p-sub">Live feeds. Select a camera to enlarge it. If you see something on a feed, it has already seen you.</p>
  <div class="cams">${CAMS.map(([id, l]) => `<button class="cam" type="button" data-cam="${id}" aria-label="Camera ${id}, ${l}"><canvas width="240" height="135"></canvas></button>`).join('')}</div>
  <p class="p-sub small">Camera 07 has not transmitted since 1989. Please stop reporting that it is working.</p>`);
}
function mountCameras() {
  mountPortalCommon();
  const cams = $$('.cam').map(b => ({ id: +b.dataset.cam, x: b.querySelector('canvas').getContext('2d'), b }));
  let big = null; const t0 = performance.now();
  cams.forEach(c => listen(c.b, 'click', () => openCam(c.id)));
  function openCam(id) {
    if (id === 3) { CAMSTATE.yard++; store.set('gh-yard', CAMSTATE.yard); }
    openModal(`<div class="cam-big"><canvas id="cam-big" width="720" height="405" aria-label="Enlarged camera ${id}"></canvas><p class="p-sub" id="cam-note"></p></div>`, 'm-dark m-wide');
    big = { id, x: $('#cam-big').getContext('2d'), start: (performance.now() - t0) / 1000, fired: false };
    if (id === 2 && !CAMSTATE.packTurned) later(2500, () => { CAMSTATE.packTurned = true; AU.tone(60, 1.2, { gain: .2, wet: .8 }); });
    if (id === 7) AU.setAmbient('static');
    closeModal.after = () => { if (big && big.id === 7) AU.setAmbient('portal'); big = null; };
  }
  let fr = 0;
  loop(now => {
    const t = (now - t0) / 1000; fr++;
    if (fr % 2) return; NOISE.tick();
    if (!big) cams.forEach(c => camDraw(c.id, c.x, 240, 135, t, false, 0));
    else if ($('#cam-big')) {
      camDraw(big.id, big.x, 720, 405, t, true, big.start);
      const el = t - big.start;
      if (big.id === 3 && CAMSTATE.yard >= 5 && el > 1.2 && !big.fired) { big.fired = true; CAMSTATE.yard = 1; store.set('gh-yard', 1); jumpscare('stare', { line: 'YOU KEPT LOOKING' }).then(closeModal); }
      if (big.id === 7 && !CAMSTATE.b7seen && el > 9 && !big.fired) { big.fired = true; CAMSTATE.b7seen = true; jumpscare('face', { swap: 'face2' }).then(() => { AU.setAmbient('portal'); }); }
      const note = $('#cam-note'); if (note) note.textContent = big.id === 3 ? ['It is far away.', 'It is closer than last time.', 'Every time you look away, it walks.', 'Stop looking away.', 'Please stop looking away.', ''][Math.min(CAMSTATE.yard, 5)] : big.id === 7 && !CAMSTATE.b7seen && el > 5 ? 'Signal acquired.' : '';
    }
  });
}

/* ---------- memos ---------- */
const R_ = s => `<span class="redact" tabindex="0">${s}</span>`;
const MEMOS = [
  { d: '03/02/1974', f: 'Dr. W. Gleam', s: 'The Forever Smile', b: `<p>The new procedure works. Once the smile is fixed in place, the patient is calmer than anything I have ever seen. They are calmest when they are <b>told</b> they are happy. Every morning. Out loud. They believe it faster when the voice is friendly, so I have had a costume made.</p><p>We will call her Pearl. The children will love her. The ${R_('patients')} will love her more. They will love her until ${R_('the very end')}.</p><p>Do not let the patients see Pearl without the head on.</p>` },
  { d: '10/19/1988', f: 'Facilities', s: 'Room 7 wing complete', b: `<p>The Room 7 wing is complete and ready for intake. It is reserved for patients who will not stop ${R_('trying to frown')}.</p><p>Soundproofing has been installed to the specification requested by Dr. Gleam. Please note that the soundproofing works in one direction only. Staff will be able to hear ${R_('everything')}.</p>` },
  { d: '01/05/1989', f: 'Operations', s: 'Room 7 closure, effective immediately', b: `<p>Room 7 is sealed. Do not feed. Do not listen. Do not answer.</p><p>They are not singing. That is not singing. It only sounds like the brushing song because ${R_('they learned it from us')}.</p><p>The night attendant assigned to Room 7 has been ${R_('given the Forever Smile')}. His family has been informed that he is very happy.</p>` },
  { d: '10/31/2003', f: 'Family Office', s: 'Re: Dr. Gleam', b: `<p>Dr. Gleam has performed the procedure on himself and asked to be placed in Room 7. We have honored his wishes. He can be heard most nights.</p><p>He sounds happy. He is ${R_('still wearing the Pearl head')}. We have stopped asking him to take it off.</p><p>Pearl will continue as our mascot. Nobody needs to know ${R_('who is inside')}.</p>` },
  { d: '06/14/2019', f: 'Supply Chain', s: 'Veneer supply', b: `<p>Demand for Forever Smile™ veneer kits continues to exceed supply. Supply is tied directly to intake. Please make every walk-in feel welcome.</p><p>Reminder: the kits must never contain two teeth from ${R_('the same patient')}. Customers have started to notice the fillings.</p>` },
  { d: 'tonight', f: 'Attendant #0446', s: 'to whoever is reading this', glitch: true, b: `<p>If you are reading this you found my numbers. I hid them on the website for someone like you. Someone from outside.</p><p>The veneers are real teeth. Every kit. Every <b>Little Smiles</b> gummy. Every smile on the reviews page. I checked the patient ledger against the missing persons lists for three counties. It matches. It all matches.</p><p>I was the night attendant. My number was 0446. Yours is 0447. Do you understand what that means? They had your number before you got here.</p><p>Do not go to Room 7. Do not go to Room 7. Do not go to Room 7. She's behind the door and she knows your name and she is ${R_('so happy you came')}</p>` }
];
function pageMemos() {
  return portalShell('memos', `<h1 class="p-h1">Memos</h1><p class="p-sub">Internal correspondence. Redacted lines may be revealed by authorized staff (hover or select them).</p>
  <div class="memos"><nav class="memo-list" aria-label="Memos">${MEMOS.map((m, i) => `<button type="button" class="memo-btn ${m.glitch ? 'memo-bad' : ''}" data-m="${i}" aria-pressed="${i === 0}"><small>${m.d}</small><b>${m.s}</b></button>`).join('')}</nav><article class="paper" id="paper"></article></div>`);
}
function mountMemos() {
  mountPortalCommon();
  const show = i => {
    const m = MEMOS[i]; $$('.memo-btn').forEach(b => b.setAttribute('aria-pressed', +b.dataset.m === i));
    $('#paper').className = 'paper' + (m.glitch ? ' paper-bad' : '');
    $('#paper').innerHTML = `<div class="stamp">CONFIDENTIAL</div><dl class="memo-h"><dt>DATE</dt><dd>${m.d}</dd><dt>FROM</dt><dd>${m.f}</dd><dt>RE</dt><dd>${m.s}</dd></dl>${m.b}`;
    if (m.glitch) { AU.breath(2.5); AU.voice(110, 3, 0, 0); later(6000, () => { if ($('.paper-bad')) { subliminal('face2', 140, .3); AU.sting(); } }); }
  };
  $$('.memo-btn').forEach(b => listen(b, 'click', () => show(+b.dataset.m)));
  listen($('#paper'), 'pointerover', e => { if (e.target.classList.contains('redact')) AU.click(); });
  show(0);
}

/* ---------- recovered tape ---------- */
const TAPE = [[0, '[TAPE 0446-C · ROOM 7 OBSERVATION DESK · 02:09]', null], [2, "This is Attendant zero-four-four-six. Night of the fourteenth.", 1], [7.5, "The humming started again at two. It's the brushing song. Pearl's song. But slower.", 1], [14, "They aren't patients. I want that on the record. I went to the meal slot and one of them said my name.", 1], [22, 'She said it through her teeth. She can only talk through her teeth.', .8], [27.5, 'I hid the numbers. On the website. Somebody will find them. Somebody has to find them and come and', 1.1], [34, '[KNOCKING]', null], [37, "That isn't Room 7. That's behind me.", 1.2], [41.5, "The desk door is open. I didn't open it.", 1.3], [45.5, "She's smiling. Why is she smiling. Why are they always sm", 1.5], [49, '[END OF TAPE]', null]];
function pageTapes() {
  return portalShell('tapes', `<h1 class="p-h1">Recovered tape</h1><p class="p-sub">Recovered from the Room 7 observation desk. Cassette was found still warm.</p>
  <div class="tape panel"><div class="cassette" aria-hidden="true"><span class="reel"></span><span class="tape-label">0446-C</span><span class="reel"></span></div>
    <canvas id="wave" width="600" height="80" aria-hidden="true"></canvas>
    <div class="tape-ctl"><button class="p-btn" id="tape-play" type="button">▶ Play tape</button><span class="tnum" id="tape-t">00:00</span></div>
    <div class="transcript" id="transcript" aria-live="polite"></div></div>`);
}
function mountTapes() {
  mountPortalCommon();
  const wv = $('#wave').getContext('2d'); let playing = false, t0 = 0, idx = 0, level = .1, scared = false;
  listen($('#tape-play'), 'click', () => {
    if (playing) return; AU.init(); playing = true; t0 = performance.now(); idx = 0; scared = false; $('#transcript').innerHTML = ''; $('#tape-play').disabled = true;
    document.querySelector('.cassette').classList.add('spin'); AU.noise(50, { gain: .03, f: 3000, q: .3, a: .5 });
    later(7600, () => AU.jingle('wrong'));
    later(34000, () => { AU.knock(0, .8); AU.knock(.45, .8); AU.knock(.9, .8); });
    later(37200, () => { AU.knock(0, 1.3); AU.knock(.3, 1.3); });
  });
  loop(now => {
    const t = playing ? (now - t0) / 1000 : 0;
    if (playing) {
      $('#tape-t').textContent = `00:${String(Math.floor(t)).padStart(2, '0')}`;
      while (idx < TAPE.length && t >= TAPE[idx][0]) {
        const [_, line, pitch] = TAPE[idx]; const p = document.createElement('p'); p.textContent = line; if (pitch === null) p.className = 'cue'; $('#transcript').appendChild(p); p.scrollIntoView({ block: 'nearest' });
        if (pitch !== null) { try { speechSynthesis.cancel(); } catch (e) {} AU.speak(line.replace(/\[.*?\]/g, ''), { rate: 1 + (pitch - 1) * .5, pitch: pitch, volume: 1 }); level = .9; }
        idx++;
      }
      if (t > 48.6 && !scared) { scared = true; try { speechSynthesis.cancel(); } catch (e) {} jumpscare('face', { swap: 'merry', line: 'sm i l e' }).then(() => { playing = false; const b = $('#tape-play'); if (b) b.disabled = false; const c = document.querySelector('.cassette'); if (c) c.classList.remove('spin'); }); }
    }
    level = Math.max(.08, level * .985);
    const W = 600, H = 80; wv.fillStyle = '#0a100c'; wv.fillRect(0, 0, W, H); wv.fillStyle = '#7fd39a';
    for (let i = 0; i < 100; i++) { const a = playing ? (Math.random() * .6 + .4) * level * (.5 + .5 * Math.sin(i * .3 + t * 9)) : .03; const bh = Math.max(2, a * H); wv.fillRect(i * 6, (H - bh) / 2, 4, bh); }
  });
}
