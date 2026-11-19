/* ============ procedural face renderer ============
   Height-field sculpted head, lit per pixel, then graded (colour / sepia / cctv / red).
   Every portrait, mugshot and jumpscare on the site comes out of this one function. */
const FACE_DEFAULTS = {
  w: 240, h: 300, seed: 1, smile: .3, open: 0, stretch: 0, teeth: false, eyes: 'open', eyeOpen: 1,
  look: [0, 0], iris: [.36, .24, .14], irisR: .042, gaunt: 0, age: 0, hair: .6, hairCol: [.13, .09, .07],
  tone: [.86, .66, .54], bg: [.55, .55, .55], bg2: null, light: [-.45, -.55, .75], ambient: .2, mode: 'color',
  grain: .05, blood: 0, vignette: .55, scale: 1, tilt: 0, cy: 0, cx: 0, clothes: [.16, .17, .2], contrast: 1,
  lips: .5, bright: 1, sockets: 0, wet: .25
};
function renderFace(opt) {
  const o = Object.assign({}, FACE_DEFAULTS, opt);
  const { w, h } = o;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d'); const img = ctx.createImageData(w, h); const D = img.data;
  const R = rng(o.seed * 9973 + 7), s = o.seed;
  const eyeX = .29 + (R() - .5) * .04, eyeY = -.1 + (R() - .5) * .025, noseL = 1 + (R() - .5) * .3;
  const jaw = .2 + R() * .12 + o.gaunt * .14, headA = .7 + (R() - .5) * .07 - o.gaunt * .04;
  let L = o.light; const ll = Math.hypot(...L); L = L.map(v => v / ll);
  const unit = 1 / (h * .34 * o.scale);
  const ct = Math.cos(o.tilt), st = Math.sin(o.tilt);
  const mw = .19 + .25 * o.smile + .1 * o.stretch, my = .44 + .07 * o.stretch;
  const ohMax = o.open * (.03 + .3 * o.stretch);
  const sockDepth = .1 + .18 * o.gaunt + o.sockets + (o.eyes === 'hollow' || o.eyes === 'pin' ? .2 : 0);
  const mouthC = u => my - o.smile * .14 * (u / mw) * (u / mw) + o.smile * .02;
  const streams = [];
  if (o.blood > 0) for (const side of [-1, 1]) for (let i = 0; i < 3; i++) streams.push({ x: side * eyeX + (R() - .5) * .1, y0: eyeY + .04, len: o.blood * (.25 + R() * .55), wd: .008 + R() * .01 });
  function sock(fx, fy) { const ex = fx > 0 ? eyeX : -eyeX, dx = fx - ex, dy = fy - eyeY; return Math.exp(-(dx * dx / (.026 + .012 * o.gaunt) + dy * dy / (.013 + .009 * o.gaunt))); }
  function headR(fx, fy) { const a = headA * (1 - jaw * Math.pow(Math.max(0, fy), 1.6)); return (fx / a) * (fx / a) + (fy / (fy < 0 ? 1.02 : .98)) * (fy / (fy < 0 ? 1.02 : .98)); }
  function height(fx, fy) {
    const r = headR(fx, fy); if (r >= 1) return -1;
    let z = Math.sqrt(1 - r);
    const ax = Math.abs(fx);
    z -= sockDepth * sock(fx, fy);
    z += .05 * Math.exp(-((ax - eyeX) ** 2 / .05 + (fy + .24) ** 2 / .004));
    z += .16 * noseL * Math.exp(-fx * fx / .0045) * sstep(-.16, .04, fy) * (1 - sstep(.2, .3, fy));
    z += .1 * Math.exp(-(fx * fx / .008 + (fy - .22) ** 2 / .0045));
    z -= .045 * Math.exp(-((ax - .055) ** 2 / .0008 + (fy - .275) ** 2 / .0006));
    z += .05 * Math.exp(-((ax - .36) ** 2 / .02 + (fy - .06) ** 2 / .02));
    z -= .12 * o.gaunt * Math.exp(-((ax - .37) ** 2 / .012 + (fy - .32) ** 2 / .025));
    z += .04 * Math.exp(-(fx * fx / .03 + (fy - .83) ** 2 / .01));
    if (ax < mw * 1.1) { const c = mouthC(fx), oh = ohMax * Math.sqrt(Math.max(0, 1 - (fx / mw) ** 2)); const d = Math.abs(fy - c) - oh; z += .025 * Math.exp(-(d * d) / .0006) - (d < 0 ? .06 : 0); }
    return z;
  }
  const bg2 = o.bg2 || o.bg.map(v => v * .55);
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      let X = (px - w / 2) * unit - o.cx, Y = (py - h * .47) * unit - o.cy;
      const fx = X * ct + Y * st, fy = -X * st + Y * ct;
      // background
      const sx = (px / w - .5) * 2, sy = (py / h - .5) * 2;
      const vg = 1 - o.vignette * (sx * sx * .6 + sy * sy * .6);
      let col = [lerp(o.bg[0], bg2[0], (sy + 1) / 2) * vg, lerp(o.bg[1], bg2[1], (sy + 1) / 2) * vg, lerp(o.bg[2], bg2[2], (sy + 1) / 2) * vg];
      const bgcol = col.slice();
      // body / neck
      const ax = Math.abs(fx);
      if (fy > 1.08 + .25 * fx * fx && ax < 1.5) { const sh = .55 + .45 * sstep(1.5, 0, ax); col = o.clothes.map(v => v * sh * vg); }
      else if (fy > .55 && ax < .3 - .04 * Math.max(0, fy - .9) && fy < 1.35) { const sh = (.35 + .4 * sstep(.3, 0, ax)) * sstep(.55, 1.0, fy) * 1; col = o.tone.map(v => v * (.25 + sh * .6)); }
      const r = headR(fx, fy);
      // hair (behind/around head)
      const hairLine = -.48 + .07 * Math.sin(fx * 5 + s) + .12 * (fbm(fx * 3, 1.3, s) - .5);
      const rh = (fx / (headA * 1.08)) ** 2 + ((fy + .02) / 1.07) ** 2;
      const inHair = o.hair > 0 && rh < 1 && (fy < hairLine || (r >= .955 && fy < -.15 + .35 * o.hair));
      if (r < 1) {
        const e = .012;
        const h0 = height(fx, fy), hx = height(fx + e, fy), hy = height(fx, fy + e);
        let nx = -(hx < 0 ? 0 : hx - h0) / e * .5, ny = -(hy < 0 ? 0 : hy - h0) / e * .5, nz = 1;
        const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
        const diff = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
        const rx = 2 * diff * nz - L[2]; const spec = Math.pow(Math.max(0, rx), 18) * o.wet;
        const G = sock(fx, fy);
        const ao = 1 - .55 * G * Math.min(1, sockDepth * 3);
        const shade = (o.ambient + (1 - o.ambient) * diff) * ao;
        const blot = fbm(fx * 7, fy * 7, s + 5);
        let alb = o.tone.map((v, i) => v * (.9 + .22 * (blot - .5)));
        const cheek = Math.exp(-((ax - .34) ** 2 / .02 + (fy - .16) ** 2 / .02));
        alb[0] += .05 * cheek; alb[2] -= .03 * cheek;
        if (o.age > 0) {
          const fore = sstep(-.35, -.55, fy) * (1 - sstep(-.75, -.85, fy));
          const wr = Math.sin(fy * 95 + fbm(fx * 4, fy * 2, s) * 6);
          let dark = fore * Math.max(0, wr) * .12 * o.age;
          const nlab = Math.abs(ax - (.13 + (fy - .25) * .55)); if (fy > .25 && fy < .55) dark += .14 * o.age * Math.exp(-nlab * nlab / .0004);
          const crow = Math.exp(-((ax - eyeX - .15) ** 2 / .002 + (fy - eyeY) ** 2 / .006)); dark += crow * .1 * o.age * Math.max(0, Math.sin(fy * 140));
          alb = alb.map(v => v * (1 - dark));
        }
        col = alb.map(v => v * shade + spec * .6);
        // eyes
        const ex = fx > 0 ? eyeX : -eyeX, dx = fx - ex, dy = fy - eyeY;
        if (o.eyes === 'hollow' || o.eyes === 'pin') {
          const pit = sstep(.12, .75, G);
          col = col.map(v => v * (1 - .985 * pit));
          if (o.eyes === 'pin') { const pd = Math.hypot(dx - o.look[0] * .02, dy - o.look[1] * .01); const glow = Math.exp(-pd * pd / .00006) + .25 * Math.exp(-pd * pd / .0007); col = col.map(v => v + glow * .95); }
        } else {
          const hw = .118, hh = .052 * o.eyeOpen;
          const ee = (dx / hw) ** 2 + (dy / hh) ** 2;
          if (o.eyes === 'closed') { if (Math.abs(dy - .01) < .006 && Math.abs(dx) < hw) col = col.map(v => v * .35); }
          else if (ee < 1) {
            const lid = .55 + .45 * sstep(-hh, hh * .2, dy);
            const vein = Math.pow(Math.max(0, 1 - Math.abs(fbm(dx * 30, dy * 30, s + 9) - .5) * 9), 3) * sstep(.25, 1, ee);
            let sc = [.9 - .1 * ee, .86 - .25 * ee - .3 * vein, .8 - .25 * ee - .3 * vein];
            const icx = o.look[0] * .045, icy = o.look[1] * .02;
            const ir = Math.hypot(dx - icx, dy - icy), IR = o.irisR;
            if (ir < IR) {
              const ang = Math.atan2(dy - icy, dx - icx);
              const streak = .6 + .5 * vnoise(ang * 7 + 20, ir * 90, s + 3);
              const ring = 1 - .55 * sstep(IR * .7, IR, ir);
              sc = o.iris.map(v => v * streak * ring);
              if (ir < IR * .42) sc = [.02, .02, .02];
            }
            const hl = Math.hypot(dx - icx + .014, dy - icy + .014); if (hl < .009) sc = [.98, .98, .98];
            const edge = 1 - sstep(.7, 1, ee) * .6;
            col = sc.map(v => v * lid * edge * (.55 + .45 * o.bright));
          }
        }
        // mouth
        if (ax < mw * 1.06) {
          const c = mouthC(fx), oh = ohMax * Math.sqrt(Math.max(0, 1 - (fx / mw) ** 2));
          const d = Math.abs(fy - c) - oh;
          if (d < .024 && d >= 0) { const wgt = o.lips * (1 - d / .024) * sstep(mw * 1.06, mw * .8, ax); col = col.map((v, i) => lerp(v, [.5, .24, .23][i] * shade, wgt)); if (oh < .004 && d < .005) col = col.map(v => v * .3); }
          if (d < 0) {
            const t = (fy - (c - oh)) / (2 * oh + 1e-6);
            let m = [.05, .015, .015];
            if (o.teeth) {
              const tw = .036 * (1 + .3 * (ax / mw)), tu = fx / tw, fr = tu - Math.floor(tu);
              const gap = sstep(0, .14, fr) * sstep(1, .86, fr);
              const fade = 1 - .75 * (ax / mw) ** 2;
              const big = oh < .035;
              let tooth = 0;
              if (big) { tooth = Math.abs(t - .5) > .04 ? 1 : 0; }
              else { if (t < .3) tooth = 1 - t * 1.6; else if (t > .74) tooth = (t - .74) * 2.4; }
              if (tooth > 0) { const tc = [.88, .84, .72].map(v => v * (.45 + .55 * gap) * fade * Math.min(1, tooth + .4) * (.6 + .4 * diff)); m = tc; }
              if (t < .05 || t > .95) m = [.45, .13, .13].map(v => v * fade);
            }
            col = m;
          }
        }
        // blood
        for (const b of streams) {
          if (fy > b.y0 && fy < b.y0 + b.len) {
            const wob = b.x + .012 * Math.sin(fy * 30 + b.x * 50);
            const wd = b.wd * (1 - .6 * (fy - b.y0) / b.len) + .004 * (fy > b.y0 + b.len - .03 ? 1 : 0);
            if (Math.abs(fx - wob) < wd) col = [.32 * (.7 + .5 * diff), .02, .02];
          }
        }
        // edge AA into background
        const edgeA = sstep(1, .955, r); if (edgeA < 1) { const bgc = inHair ? o.hairCol.map(v => v * .7) : bgcol; col = col.map((v, i) => lerp(bgc[i], v, edgeA)); }
      }
      if (inHair && (r >= .955 || fy < hairLine)) {
        const strand = .5 + .9 * fbm(fx * 26, fy * 3, s + 3);
        const hs = .35 + .65 * Math.max(0, -fy * L[1] + .3 - (fx * L[0]));
        col = o.hairCol.map(v => v * strand * hs * (o.hair > .5 ? 1 : .8));
      }
      // grade
      let lum = .3 * col[0] + .59 * col[1] + .11 * col[2];
      if (o.mode === 'gray') col = [lum, lum, lum];
      else if (o.mode === 'sepia') col = [lum * 1.08 + .03, lum * .88 + .01, lum * .64];
      else if (o.mode === 'cctv') col = [lum * .78, lum * 1.0, lum * .84];
      else if (o.mode === 'red') col = [lum * 1.15, lum * .42, lum * .38];
      const g = (hash2(px, py, s + 77) - .5) * o.grain;
      const i4 = (py * w + px) * 4;
      for (let k = 0; k < 3; k++) D[i4 + k] = clamp(((col[k] - .5) * o.contrast + .5) * o.bright + g) * 255;
      D[i4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}
