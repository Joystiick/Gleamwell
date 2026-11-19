/* ============ utilities ============ */
const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
function hash2(x, y, s) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1103515245);
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, s, oct = 4) { let t = 0, a = .5, f = 1, n = 0; for (let i = 0; i < oct; i++) { t += a * vnoise(x * f, y * f, s + i * 17); n += a; f *= 2; a *= .5; } return t / n; }
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const store = {
  mem: {},
  get(k) { try { const v = localStorage.getItem(k); return v === null ? (this.mem[k] ?? null) : v; } catch (e) { return this.mem[k] ?? null; } },
  set(k, v) { this.mem[k] = v; try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { delete this.mem[k]; try { localStorage.removeItem(k); } catch (e) {} }
};
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SETTINGS = { intense: !prefersReduced, sound: true };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TZ = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } })();
const CITY = (/^(UTC|GMT|Etc\/)/.test(TZ) || !TZ) ? 'your town' : TZ.split('/').pop().replace(/_/g, ' ');
const fmtTime = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const fmtDate = d => d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
