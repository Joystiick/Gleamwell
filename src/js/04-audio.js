/* ============ sound: everything is synthesised, nothing is loaded ============ */
const AU = {
  ctx: null, master: null, verb: null, amb: [], ambName: 'none',
  init() {
    if (this.ctx) { this.ctx.resume && this.ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    const ctx = this.ctx = new AC();
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -10; comp.ratio.value = 6; comp.connect(ctx.destination);
    this.master = ctx.createGain(); this.master.gain.value = SETTINGS.sound ? .85 : 0; this.master.connect(comp);
    const len = ctx.sampleRate * 3, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    this.verb = ctx.createConvolver(); this.verb.buffer = ir; const vg = ctx.createGain(); vg.gain.value = .55; this.verb.connect(vg); vg.connect(this.master);
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1; this.noiseBuf = nb;
    const curve = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 6); } this.curve = curve;
    this.setAmbient(this.ambName, true);
    return true;
  },
  get t() { return this.ctx ? this.ctx.currentTime : 0; },
  ok() { return !!(this.ctx && SETTINGS.sound); },
  mute(on) { SETTINGS.sound = on; if (this.master) this.master.gain.setTargetAtTime(on ? .85 : 0, this.t, .1); if (!on) try { speechSynthesis.cancel(); } catch (e) {} },
  env(g, t, a, peak, rel) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + rel); },
  tone(f, dur, { type = 'sine', gain = .2, a = .01, when = 0, wet = 0, detune = 0, dest = null } = {}) {
    if (!this.ok()) return; const t = this.t + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = f; o.detune.value = detune; this.env(g, t, a, gain, dur); o.connect(g); g.connect(dest || this.master);
    if (wet) { const s = this.ctx.createGain(); s.gain.value = wet; g.connect(s); s.connect(this.verb); }
    o.start(t); o.stop(t + a + dur + .05); return o;
  },
  noise(dur, { gain = .3, f = 1000, q = 1, type = 'bandpass', when = 0, a = .005, wet = 0, sweep = 0 } = {}) {
    if (!this.ok()) return; const t = this.t + when, n = this.ctx.createBufferSource(); n.buffer = this.noiseBuf; n.loop = true;
    const bf = this.ctx.createBiquadFilter(); bf.type = type; bf.frequency.setValueAtTime(f, t); if (sweep) bf.frequency.exponentialRampToValueAtTime(sweep, t + dur); bf.Q.value = q;
    const g = this.ctx.createGain(); this.env(g, t, a, gain, dur); n.connect(bf); bf.connect(g); g.connect(this.master);
    if (wet) { const s = this.ctx.createGain(); s.gain.value = wet; g.connect(s); s.connect(this.verb); }
    n.start(t); n.stop(t + dur + a + .05);
  },
  beep(f = 880) { this.tone(f, .08, { type: 'square', gain: .05 }); },
  buzz() { this.tone(110, .35, { type: 'sawtooth', gain: .16 }); this.tone(116, .35, { type: 'square', gain: .08 }); },
  click() { this.noise(.03, { gain: .2, f: 3000, q: 2 }); },
  knock(when = 0, loud = 1) { this.tone(90, .18, { gain: .7 * loud, when, wet: .4 }); this.noise(.06, { gain: .5 * loud, f: 400, q: 1.5, when, wet: .4 }); },
  thump(when = 0, amt = 1) { if (!this.ok()) return; const t = this.t + when, o = this.ctx.createOscillator(), g = this.ctx.createGain(); o.frequency.setValueAtTime(75, t); o.frequency.exponentialRampToValueAtTime(36, t + .2); this.env(g, t, .012, .6 * amt, .26); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + .35); },
  heartbeat(n = 1, gap = .9) { for (let i = 0; i < n; i++) { this.thump(i * gap); this.thump(i * gap + .2, .6); } },
  creak(dur = 2.2) {
    if (!this.ok()) return; const t = this.t, o = this.ctx.createOscillator(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); for (let i = 0; i < 18; i++) o.frequency.linearRampToValueAtTime(60 + Math.random() * 90, t + dur * i / 18);
    f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 4; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.35, t + .2); g.gain.linearRampToValueAtTime(.0001, t + dur);
    o.connect(f); f.connect(g); g.connect(this.master); const s = this.ctx.createGain(); s.gain.value = .5; g.connect(s); s.connect(this.verb); o.start(t); o.stop(t + dur + .1);
  },
  breath(dur = 2.4, when = 0) { this.noise(dur, { gain: .14, f: 1600, q: .8, when, a: dur * .45, wet: .3, sweep: 900 }); },
  glitch() { for (let i = 0; i < 6; i++) this.tone(200 + Math.random() * 2400, .03, { type: 'square', gain: .08, when: i * .035 }); },
  scream(level = 1) {
    if (!this.ok()) return; const ctx = this.ctx, t = this.t, L = SETTINGS.intense ? level : level * .35;
    const sh = ctx.createWaveShaper(); sh.curve = this.curve; const out = ctx.createGain(); out.gain.setValueAtTime(.55 * L, t); out.gain.exponentialRampToValueAtTime(.001, t + 1.6);
    sh.connect(out); out.connect(this.master); const wet = ctx.createGain(); wet.gain.value = .6; out.connect(wet); wet.connect(this.verb);
    [470, 655, 930, 1380, 1720].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i % 2 ? 'sawtooth' : 'square';
      o.frequency.setValueAtTime(f * .7, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + .18); o.frequency.exponentialRampToValueAtTime(f * 1.2, t + 1.4);
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 23 + i * 4; lg.gain.value = f * .06; lfo.connect(lg); lg.connect(o.frequency);
      const g = ctx.createGain(); g.gain.value = .3 - i * .04; o.connect(g); g.connect(sh); o.start(t); o.stop(t + 1.6); lfo.start(t); lfo.stop(t + 1.6);
    });
    this.noise(1.3, { gain: .8 * L, f: 2500, q: .5, type: 'highpass', wet: .5 });
    const b = ctx.createOscillator(), bg = ctx.createGain(); b.frequency.setValueAtTime(90, t); b.frequency.exponentialRampToValueAtTime(28, t + .7); this.env(bg, t, .005, 1 * L, .8); b.connect(bg); bg.connect(this.master); b.start(t); b.stop(t + .9);
  },
  sting() { this.tone(1975, 1.6, { type: 'sawtooth', gain: .08, wet: .8 }); this.tone(2093, 1.6, { type: 'sawtooth', gain: .08, wet: .8 }); this.noise(.4, { gain: .4, f: 5000, type: 'highpass', wet: .6 }); },
  // the Gladhaven jingle. 'happy' in the shop; 'wrong' behind the door
  JINGLE: [[67, .5], [64, .5], [67, .5], [72, 1], [71, .5], [69, .5], [67, 1], [64, .5], [65, .5], [67, .5], [69, .5], [67, 1.5], [60, 1.5]],
  jingle(mode = 'happy', when = 0) {
    if (!this.ok()) return 0;
    const wrong = mode === 'wrong', beat = wrong ? .62 : .26; let t = when;
    for (const [m0, d] of this.JINGLE) {
      let m = m0; if (wrong && [64, 69, 71].includes(m)) m -= 1;
      const f = 440 * Math.pow(2, (m - 69) / 12) * (wrong ? .5 : 1);
      if (wrong) { for (let v = 0; v < 4; v++) this.voice(f * (v === 3 ? .5 : 1), d * beat * 1.1, t, (v - 1.5) * 14); }
      else { this.tone(f, d * beat * .9, { type: 'triangle', gain: .14, when: t, wet: .15 }); this.tone(f * 2, d * beat * .5, { type: 'square', gain: .025, when: t }); }
      t += d * beat;
    }
    return t;
  },
  voice(f, dur, when, detune) {
    const ctx = this.ctx, t = this.t + when, o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = detune;
    const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = 5 + Math.random(); vg.gain.value = f * .012; vib.connect(vg); vg.connect(o.frequency);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .12); g.gain.linearRampToValueAtTime(.0001, t + dur);
    [[750, 6], [1150, 8], [2600, 10]].forEach(([ff, q], i) => { const b = ctx.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = ff; b.Q.value = q; const bg = ctx.createGain(); bg.gain.value = [1, .6, .25][i]; o.connect(b); b.connect(bg); bg.connect(g); });
    g.connect(this.master); const s = ctx.createGain(); s.gain.value = 1.2; g.connect(s); s.connect(this.verb);
    o.start(t); o.stop(t + dur + .1); vib.start(t); vib.stop(t + dur + .1);
  },
  speak(text, { rate = .8, pitch = .3, volume = .9 } = {}) {
    if (!SETTINGS.sound || !('speechSynthesis' in window)) return;
    try { const u = new SpeechSynthesisUtterance(text); u.rate = rate; u.pitch = pitch; u.volume = volume; speechSynthesis.speak(u); } catch (e) {}
  },
  stopAmb() { this.amb.forEach(n => { try { n.stop ? n.stop() : clearInterval(n); } catch (e) {} }); this.amb = []; },
  setAmbient(name, force) {
    if (this.ambName === name && !force) return; this.ambName = name; if (!this.ctx) return; this.stopAmb();
    const ctx = this.ctx, bus = ctx.createGain(); bus.gain.value = 0; bus.gain.setTargetAtTime(1, ctx.currentTime, .8); bus.connect(this.master);
    const osc = (f, type, g, filt) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; const gg = ctx.createGain(); gg.gain.value = g; if (filt) { o.connect(filt); filt.connect(gg); } else o.connect(gg); gg.connect(bus); o.start(); this.amb.push(o); return o; };
    const noiseLoop = (g, f, q, type = 'bandpass') => { const n = ctx.createBufferSource(); n.buffer = this.noiseBuf; n.loop = true; const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; const gg = ctx.createGain(); gg.gain.value = g; n.connect(b); b.connect(gg); gg.connect(bus); n.start(); this.amb.push(n); return { b, gg }; };
    if (name === 'clinic') {
      noiseLoop(.012, 400, .4, 'lowpass');
      const chords = [[261.6, 329.6, 392], [220, 277.2, 329.6], [246.9, 311.1, 370], [196, 246.9, 293.7]]; let ci = 0;
      this.amb.push(setInterval(() => { chords[ci++ % 4].forEach((f, i) => this.tone(f, 2.6, { type: 'sine', gain: .022, a: .6, when: i * .04, wet: .5 })); }, 3200));
      this.amb.push(setInterval(() => { if (Math.random() < .35) { const o = this.tone(2350, 1.6, { type: 'sawtooth', gain: .006, a: .3, wet: .9 }); if (o) o.frequency.linearRampToValueAtTime(2600, this.t + 1.4); } }, 9000));
    } else if (name === 'portal') {
      osc(60, 'sine', .05); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500; osc(120, 'square', .012, lp);
      noiseLoop(.012, 3800, 6);
      this.amb.push(setInterval(() => { if (Math.random() < .45) { this.noise(.25, { gain: .18, f: 300 + Math.random() * 500, q: 3, wet: 1 }); this.tone(140 + Math.random() * 60, .5, { type: 'triangle', gain: .05, wet: 1 }); } }, 7000));
    } else if (name === 'barn') {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 160; lp.Q.value = 8;
      [41.2, 41.6, 61.7].forEach(f => osc(f, 'sawtooth', .07, lp));
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .08; lg.gain.value = 70; lfo.connect(lg); lg.connect(lp.frequency); lfo.start(); this.amb.push(lfo);
      noiseLoop(.03, 900, 1);
      this.amb.push(setInterval(() => this.heartbeat(1), 1300));
    } else if (name === 'static') {
      noiseLoop(.06, 2000, .3, 'highpass');
    }
  }
};
