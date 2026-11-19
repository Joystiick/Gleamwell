/* ============ jumpscares ============ */
const SCARE_SRC = {};
function scareSource(kind) {
  if (SCARE_SRC[kind]) return SCARE_SRC[kind];
  let c;
  if (kind === 'face') c = renderFace({ w: 300, h: 400, seed: 666, scale: 1.55, cy: -.05, smile: 1, open: 1, stretch: 1, teeth: true, eyes: 'hollow', gaunt: 1, hair: .15, hairCol: [.05, .04, .04], light: [.1, .8, .6], ambient: .04, bg: [.01, .01, .01], mode: 'gray', blood: 1.2, contrast: 1.5, grain: .12, clothes: [0, 0, 0], tilt: .12, vignette: .9 });
  else if (kind === 'face2') c = renderFace({ w: 300, h: 400, seed: 13, scale: 1.7, cy: -.12, smile: 1, open: .45, stretch: .5, teeth: true, eyes: 'pin', gaunt: .8, hair: 0, light: [0, .7, .7], ambient: .03, bg: [0, 0, 0], mode: 'red', contrast: 1.6, grain: .14, clothes: [0, 0, 0], tilt: -.2, vignette: .9 });
  else if (kind === 'stare') c = renderFace({ w: 300, h: 400, seed: 21, scale: 1.45, smile: .95, open: .3, teeth: true, eyeOpen: 1.5, irisR: .026, gaunt: .5, hair: .4, light: [0, -.2, 1], ambient: .15, bg: [.05, .05, .05], mode: 'cctv', contrast: 1.3, grain: .2, vignette: .9 });
  else if (kind === 'merry') {
    c = document.createElement('canvas'); c.width = 400; c.height = 500; const x = c.getContext('2d');
    const g = x.createRadialGradient(200, 230, 20, 200, 250, 330); g.addColorStop(0, '#3a0808'); g.addColorStop(1, '#000'); x.fillStyle = g; x.fillRect(0, 0, 400, 500);
    if (MERRY_TRUE_IMG.complete && MERRY_TRUE_IMG.naturalWidth) { x.drawImage(MERRY_TRUE_IMG, -40, 0, 480, 600); }
    x.globalCompositeOperation = 'multiply'; x.fillStyle = '#b06060'; x.fillRect(0, 0, 400, 500); x.globalCompositeOperation = 'source-over';
    grainify(x, 400, 500, .22, 7, true);
  }
  return (SCARE_SRC[kind] = c);
}
const MERRY_TRUE_IMG = svgToImage(merrySVG({ truth: 'blood', wave: false }));
function tinted(src, color) {
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const x = c.getContext('2d');
  x.drawImage(src, 0, 0); x.globalCompositeOperation = 'multiply'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); return c;
}
let scaring = false;
function jumpscare(kind = 'face', { dur = 1150, line = '', swap = null, level = 1 } = {}) {
  if (scaring) return Promise.resolve(); scaring = true;
  return new Promise(resolve => {
    const wrap = $('#scare'), cv = $('#scare-cv'), x = cv.getContext('2d');
    const W = cv.width = innerWidth, H = cv.height = innerHeight;
    const src = scareSource(kind), alt = swap ? scareSource(swap) : null;
    const red = tinted(src, '#ff2020'), cyan = tinted(src, '#20ffff');
    wrap.hidden = false; AU.scream(level);
    const intense = SETTINGS.intense, start = performance.now(), D = intense ? dur : 800;
    if (intense) document.body.classList.add('quake');
    const frame = now => {
      const t = clamp((now - start) / D);
      const s0 = alt && t > .55 && t < .7 ? alt : src;
      const sw = s0.width, sh = s0.height;
      const zoom = intense ? .88 + .4 * (1 - Math.pow(1 - t, 3)) : 1;
      const sc = Math.max(H / sh, W / sw * .5) * zoom;
      const A = intense ? 46 * (1 - t * .7) : 0;
      const ox = (Math.random() - .5) * A, oy = (Math.random() - .5) * A;
      const dw = sw * sc, dh = sh * sc, dx = (W - dw) / 2 + ox, dy = (H - dh) / 2 + oy;
      x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      x.drawImage(s0, dx, dy, dw, dh);
      if (intense) {
        const ca = 8 + 26 * Math.random();
        x.globalCompositeOperation = 'screen'; x.globalAlpha = .55;
        if (s0 === src) { x.drawImage(red, dx + ca, dy, dw, dh); x.drawImage(cyan, dx - ca, dy + ca * .3, dw, dh); }
        x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
        for (let i = 0; i < 5; i++) { if (Math.random() < .55) { const y = Math.random() * H, hh = 8 + Math.random() * 70; x.drawImage(cv, 0, y, W, hh, (Math.random() - .5) * 120, y, W, hh); } }
        if (t < .07) { x.fillStyle = `rgba(255,255,255,${1 - t / .07})`; x.fillRect(0, 0, W, H); }
        if (t > .38 && t < .42) { x.globalCompositeOperation = 'difference'; x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over'; }
      }
      NOISE.tick(); x.globalAlpha = .2; x.globalCompositeOperation = 'overlay'; x.drawImage(NOISE.c, 0, 0, W, H); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
      x.fillStyle = 'rgba(0,0,0,.3)'; for (let y = 0; y < H; y += 3) x.fillRect(0, y, W, 1);
      if (line) { x.font = `${Math.min(W, H) * .09}px "IM Fell English", Georgia, serif`; x.textAlign = 'center'; x.fillStyle = '#e8d8c8'; x.fillText(line, W / 2 + (Math.random() - .5) * A * .4, H * .88); }
      if (t > .9) { x.fillStyle = `rgba(0,0,0,${(t - .9) * 10})`; x.fillRect(0, 0, W, H); }
      if (t < 1) requestAnimationFrame(frame);
      else { wrap.hidden = true; document.body.classList.remove('quake'); scaring = false; resolve(); }
    };
    requestAnimationFrame(frame);
  });
}
/* a face that is there for a fraction of a second, and then isn't */
function subliminal(kind = 'stare', ms = 120, alpha = .35) {
  if (!SETTINGS.intense || scaring) return;
  const wrap = $('#ghost'); const cv = $('#ghost-cv'); const src = scareSource(kind);
  cv.width = src.width; cv.height = src.height; cv.getContext('2d').drawImage(src, 0, 0);
  wrap.style.opacity = alpha; wrap.hidden = false; setTimeout(() => { wrap.hidden = true; }, ms);
}
