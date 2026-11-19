/* ============ illustration: Pearl the tooth, the clinic, the products ============ */
let svgUid = 0;
function merrySVG({ truth = false, wave = true } = {}) {
  const u = 'm' + (++svgUid);
  const eyeCute = (cx) => `
    <ellipse cx="${cx}" cy="92" rx="11.5" ry="13.5" fill="#fff" stroke="#24414d" stroke-width="2.5"/>
    <g class="pupil-g"><circle class="mpupil" cx="${cx}" cy="94" r="6.5" fill="#10202a"/><circle cx="${cx - 2.5}" cy="91" r="2.2" fill="#fff"/></g>`;
  const eyeTrue = (cx) => `
    <clipPath id="${u}c${cx}"><path d="M${cx - 15} 93 Q${cx} 78 ${cx + 15} 93 Q${cx} 104 ${cx - 15} 93Z"/></clipPath>
    <path d="M${cx - 18} 84 Q${cx} 72 ${cx + 18} 84" fill="none" stroke="#a7b6bd" stroke-width="2"/>
    <g clip-path="url(#${u}c${cx})">
      <rect x="${cx - 16}" y="76" width="32" height="30" fill="url(#${u}scl)"/>
      <path d="M${cx - 15} 92 l6 1 l3 -2 M${cx + 15} 93 l-5 -1 l-3 2 M${cx - 13} 96 l5 -1" stroke="#c0283a" stroke-width=".7" fill="none" opacity=".8"/>
      <g class="pupil-g"><circle class="mpupil" cx="${cx}" cy="91.5" r="6.8" fill="url(#${u}iris)"/><circle cx="${cx}" cy="91.5" r="2.6" fill="#050304"/><circle cx="${cx - 2.4}" cy="89.2" r="1.3" fill="#fff" opacity=".95"/></g>
      <path d="M${cx - 16} 86 Q${cx} 79 ${cx + 16} 86 L${cx + 16} 76 L${cx - 16} 76Z" fill="#000" opacity=".28"/>
    </g>
    <path d="M${cx - 15} 93 Q${cx} 78 ${cx + 15} 93" fill="none" stroke="#3d2228" stroke-width="1.6"/>
    <path d="M${cx - 13} 96 Q${cx} 103 ${cx + 13} 96" fill="none" stroke="#c9a3a8" stroke-width="1.4"/>`;
  const mouthCute = `<path d="M76 128 Q100 150 124 128" fill="#3a1c26" stroke="#24414d" stroke-width="3" stroke-linejoin="round"/><path d="M80 130 Q100 138 120 130 L118 134 Q100 141 82 134Z" fill="#fff"/><path d="M92 141 Q100 147 108 141" fill="#e8708a"/>`;
  let teeth = '';
  for (let i = 0; i < 12; i++) { const x = 64 + i * 6.1, y = 125 + Math.pow((i - 5.5) / 5.5, 2) * -6 + 2; teeth += `<rect x="${x}" y="${y}" width="5.6" height="${8 + (i % 3)}" rx="1.6" fill="#efe6cf" stroke="#a89878" stroke-width=".6"/>`; }
  for (let i = 0; i < 10; i++) { const x = 70 + i * 6.1, y = 144 - Math.pow((i - 4.5) / 4.5, 2) * 4; teeth += `<rect x="${x}" y="${y - 7}" width="5.4" height="7.5" rx="1.4" fill="#ddd2b6" stroke="#8f8064" stroke-width=".6"/>`; }
  const mouthTrue = `<path d="M60 123 Q100 116 140 123 Q132 156 100 158 Q68 156 60 123Z" fill="#1a0507"/>
    <path d="M60 123 Q100 116 140 123 L140 128 Q100 121 60 128Z" fill="#9c3040"/>${teeth}
    <path d="M60 123 Q100 116 140 123 Q132 156 100 158 Q68 156 60 123Z" fill="none" stroke="#5a1520" stroke-width="2.2"/>
    ${truth === 'blood' ? '<path d="M136 134 q3 14 1 30 q-2 4 -3 0 q-1 -14 -2 -26z" fill="#6a0606"/><path d="M66 138 q-2 10 0 18 q2 3 3 -1 q0 -9 -1 -16z" fill="#6a0606"/>' : ''}`;
  const body = 'M40 74 Q38 22 74 24 Q100 36 126 24 Q162 22 160 74 Q160 122 150 154 L141 214 Q137 240 122 234 Q111 229 108 202 Q104 184 100 184 Q96 184 92 202 Q89 229 78 234 Q63 240 59 214 L50 154 Q40 122 40 74Z';
  const feet = truth
    ? '<path d="M60 214 Q63 238 78 234 Q86 230 89 214Z M111 214 Q114 230 122 234 Q137 238 140 214Z" fill="#7a0a0a" opacity=".85"/><path d="M68 236 q2 10 0 14 M131 236 q-1 8 1 13" stroke="#6a0606" stroke-width="3" stroke-linecap="round"/>'
    : '<ellipse cx="71" cy="236" rx="20" ry="9" fill="#12A89D"/><ellipse cx="129" cy="236" rx="20" ry="9" fill="#12A89D"/><ellipse cx="66" cy="233" rx="7" ry="2.5" fill="#7fe0d6"/><ellipse cx="124" cy="233" rx="7" ry="2.5" fill="#7fe0d6"/>';
  return `<svg class="merry ${truth ? 'merry-true' : ''}" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pearl the Gleamwell tooth">
  <defs>
    <radialGradient id="${u}head" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="${truth ? '#e6e0d2' : '#EEF6F8'}"/><stop offset="1" stop-color="${truth ? '#b7ab92' : '#C6DCE3'}"/></radialGradient>
    <radialGradient id="${u}scl" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#f6f1ea"/><stop offset=".7" stop-color="#e6d6cf"/><stop offset="1" stop-color="#c79a98"/></radialGradient>
    <radialGradient id="${u}iris" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#6b5a2a"/><stop offset=".55" stop-color="#7d6a3a"/><stop offset=".85" stop-color="#4a3c1a"/><stop offset="1" stop-color="#1e1608"/></radialGradient>
  </defs>
  <g class="m-arm-l"><path d="M48 150 Q28 166 30 194" stroke="${truth ? '#d9d1bf' : '#E8F2F5'}" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="30" cy="198" r="10" fill="#fff" stroke="#b9cfd8" stroke-width="2.5"/></g>
  <g class="${wave ? 'm-wave' : ''}" style="transform-origin:150px 146px">
    <path d="M150 146 Q172 128 176 104" stroke="${truth ? '#d9d1bf' : '#E8F2F5'}" stroke-width="12" stroke-linecap="round" fill="none"/>
    ${truth ? '' : '<g transform="rotate(28 178 100)"><rect x="174" y="40" width="8" height="66" rx="4" fill="#12A89D"/><rect x="172" y="36" width="12" height="18" rx="3" fill="#0E8A81"/><path d="M172 38 h12 M172 42 h12 M172 46 h12 M172 50 h12" stroke="#fff" stroke-width="2"/></g>'}
    <circle cx="178" cy="100" r="10" fill="#fff" stroke="#b9cfd8" stroke-width="2.5"/>
  </g>
  <path d="${body}" fill="url(#${u}head)" stroke="${truth ? '#8f8470' : '#AFC8D1'}" stroke-width="3" stroke-linejoin="round"/>
  ${feet}
  <path d="M58 52 Q62 34 80 34" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none" opacity=".9"/>
  ${truth ? '<path d="M118 40 q6 10 2 22 M70 170 q-4 12 2 20" stroke="#8a7a58" stroke-width="2" fill="none" opacity=".6"/>' : '<path d="M164 30 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 l9 -3z" fill="#7fe0d6"/>'}
  <ellipse cx="58" cy="114" rx="10" ry="6.5" fill="#F7A8B8" opacity="${truth ? .2 : .7}"/><ellipse cx="142" cy="114" rx="10" ry="6.5" fill="#F7A8B8" opacity="${truth ? .2 : .7}"/>
  ${truth ? eyeTrue(72) + eyeTrue(128) : eyeCute(72) + eyeCute(128)}
  ${truth ? mouthTrue : mouthCute}
</svg>`;
}
function svgToImage(svg) {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', '<svg width="800" height="1000" '));
  return img;
}

function heroSVG() {
  let windows = '';
  for (let i = 0; i < 7; i++) {
    const x = 444 + i * 64, y = 284, dark = i === 6;
    windows += `<g ${dark ? 'id="far7" class="far7" role="button" aria-label="Window of room 7"' : ''}><rect x="${x}" y="${y}" width="46" height="44" rx="3" fill="${dark ? '#141b1f' : '#BFE6F2'}" stroke="#0E8A81" stroke-width="3"/>
      ${dark ? `<g id="loftface" opacity="0"><ellipse cx="${x + 23}" cy="${y + 22}" rx="10" ry="13" fill="#d9d0c0"/><circle cx="${x + 19}" cy="${y + 19}" r="2.2" fill="#000"/><circle cx="${x + 27}" cy="${y + 19}" r="2.2" fill="#000"/><path d="M${x + 15} ${y + 27} Q${x + 23} ${y + 34} ${x + 31} ${y + 27}" stroke="#000" stroke-width="1.8" fill="none"/><path d="M${x + 16} ${y + 28} h14" stroke="#fff" stroke-width="1.6"/></g>` : ''}
      ${Array.from({ length: 5 }, (_, k) => `<path d="M${x + 2} ${y + 6 + k * 8} h42" stroke="${dark ? '#2a3338' : '#E9F7FB'}" stroke-width="2"/>`).join('')}</g>`;
  }
  const R = rng(42);
  let flowers = '';
  for (let i = 0; i < 40; i++) { const x = R() * 1200, y = 494 + R() * 50, c = ['#fff', '#FFD66B', '#F7A8B8'][i % 3]; flowers += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + R() * 2.6).toFixed(1)}" fill="${c}"/>`; }
  const tree = (x, s) => `<g transform="translate(${x} 470) scale(${s})"><rect x="-8" y="-70" width="16" height="70" fill="#8a5a3a"/><circle cx="0" cy="-100" r="52" fill="#5BAA45"/><circle cx="-30" cy="-80" r="34" fill="#4E9A3F"/><circle cx="28" cy="-76" r="36" fill="#62B24C"/></g>`;
  return `<svg class="hero-svg" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop class="sky-a" offset="0" stop-color="#8FD7EE"/><stop class="sky-b" offset="1" stop-color="#E6F8FB"/></linearGradient>
    <radialGradient id="sunG"><stop offset="0" stop-color="#FFF4B8"/><stop offset=".6" stop-color="#FFD66B"/><stop offset="1" stop-color="#FFC94A"/></radialGradient>
    <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8DC8A"/><stop offset="1" stop-color="#86C66A"/></linearGradient>
    <linearGradient id="h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CBA55"/><stop offset="1" stop-color="#4E9A3F"/></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4EEF1"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DDDEA"/><stop offset="1" stop-color="#5FB9C9"/></linearGradient>
  </defs>
  <rect width="1200" height="640" fill="url(#sky)"/>
  <g class="stars-n">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(hash2(i, 1, 3) * 1200).toFixed(0)}" cy="${(hash2(i, 2, 3) * 240).toFixed(0)}" r="${(1 + hash2(i, 3, 3) * 1.4).toFixed(1)}" fill="#fff"/>`).join('')}</g>
  <g class="sun" transform="translate(1010 110)"><g class="rays">${Array.from({ length: 12 }, (_, i) => `<rect x="-5" y="-112" width="10" height="32" rx="5" fill="#FFE08A" transform="rotate(${i * 30})"/>`).join('')}</g><circle r="62" fill="url(#sunG)"/></g>
  <g class="moon" transform="translate(1010 110)"><circle r="48" fill="#EDEAD8"/><circle r="48" cx="18" cy="-10" fill="#1a2440"/></g>
  <g class="clouds"><g class="cloud c1"><ellipse cx="200" cy="110" rx="70" ry="26" fill="#fff"/><ellipse cx="240" cy="94" rx="44" ry="30" fill="#fff"/><ellipse cx="170" cy="98" rx="34" ry="22" fill="#fff"/></g>
  <g class="cloud c2"><ellipse cx="700" cy="70" rx="56" ry="20" fill="#fff"/><ellipse cx="730" cy="58" rx="34" ry="24" fill="#fff"/></g></g>
  <path d="M0 300 Q200 250 420 290 T840 280 T1200 290 L1200 640 L0 640Z" fill="url(#h1)"/>
  ${tree(530, .7)}${tree(1110, .8)}
  <g class="clinic" transform="translate(760 472) scale(.8) translate(-660 -472)">
    <rect x="420" y="262" width="480" height="210" fill="url(#wall)" stroke="#C9DCE2" stroke-width="3"/>
    <rect x="410" y="252" width="500" height="16" rx="4" fill="#12A89D"/>
    ${windows}
    <rect x="596" y="364" width="128" height="108" fill="url(#glass)" stroke="#0E8A81" stroke-width="5"/>
    <path d="M660 364 V472" stroke="#0E8A81" stroke-width="4"/><circle cx="652" cy="420" r="3" fill="#0E8A81"/><circle cx="668" cy="420" r="3" fill="#0E8A81"/>
    <rect x="440" y="370" width="130" height="70" rx="3" fill="url(#glass)" stroke="#0E8A81" stroke-width="3"/><rect x="750" y="370" width="130" height="70" rx="3" fill="url(#glass)" stroke="#0E8A81" stroke-width="3"/>
    <rect x="588" y="340" width="144" height="20" rx="4" fill="#fff" stroke="#C9DCE2" stroke-width="2"/>
    <text x="660" y="354" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="10" fill="#0E8A81" letter-spacing="1.5">DENTAL · FOREVER SMILE™</text>
    <rect x="560" y="216" width="200" height="34" rx="8" fill="#fff" stroke="#12A89D" stroke-width="3"/>
    <text x="660" y="240" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="20" fill="#0E8A81" letter-spacing="3">GLEAMWELL</text>
    <path d="M640 212 Q638 168 652 168 Q660 174 668 168 Q682 168 680 212 Q676 200 670 212 Q666 196 660 196 Q654 196 650 212 Q644 200 640 212Z" fill="#fff" stroke="#AFC8D1" stroke-width="3"/>
  </g>
  <path d="M0 470 Q300 452 640 466 T1200 462 L1200 640 L0 640Z" fill="url(#h3)"/>
  ${flowers}
  <rect x="0" y="548" width="1200" height="30" fill="#E4E2DA"/><rect x="0" y="574" width="1200" height="6" fill="#C8C5BB"/>
  <rect x="0" y="580" width="1200" height="60" fill="#4b5157"/>
  ${Array.from({ length: 13 }, (_, i) => `<rect x="${i * 100 + 20}" y="607" width="50" height="6" rx="2" fill="#F2E7B8"/>`).join('')}
  <svg x="930" y="292" width="240" height="300" viewBox="0 0 200 250" id="hero-merry" class="hero-merry">${merrySVG().replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>
</svg>`;
}

function productSVG(kind) {
  const u = 'p' + (++svgUid);
  let art = '';
  const tube = (col, band, label) => `<g transform="rotate(-14 150 115)"><path d="M70 92 L210 86 Q226 86 226 100 L226 130 Q226 144 210 144 L70 138 Z" fill="${col}"/><rect x="70" y="90" width="18" height="50" rx="3" fill="${band}" opacity=".7"/><path d="M60 96 h10 v40 h-10 z" fill="#d9e4e8"/><rect x="226" y="100" width="26" height="30" rx="5" fill="${band}"/><path d="M96 104 q60 -6 116 -2" stroke="#fff" stroke-width="5" opacity=".6" fill="none"/><text x="150" y="127" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="15" fill="${band}">${label}</text></g>`;
  if (kind === 'paste') art = tube('#FFFFFF', '#12A89D', 'WHITEN+');
  if (kind === 'kids') art = tube('#FFD3DD', '#E8708A', 'BUBBLEGUM') + `<g transform="translate(70 150)"><circle r="16" fill="#fff" stroke="#E8708A" stroke-width="2"/><circle cx="-5" cy="-2" r="2" fill="#10202a"/><circle cx="5" cy="-2" r="2" fill="#10202a"/><path d="M-5 5 q5 4 10 0" stroke="#10202a" stroke-width="1.6" fill="none"/></g>`;
  if (kind === 'brush') art = `<rect x="100" y="150" width="100" height="26" rx="10" fill="#E4EEF1"/><rect x="136" y="44" width="28" height="118" rx="13" fill="#fff" stroke="#AFC8D1" stroke-width="2"/><rect x="136" y="110" width="28" height="30" fill="#12A89D"/><circle cx="150" cy="96" r="6" fill="#12A89D"/><rect x="143" y="22" width="14" height="30" rx="5" fill="#fff" stroke="#AFC8D1" stroke-width="2"/><path d="M145 26 h10 M145 31 h10 M145 36 h10" stroke="#7fe0d6" stroke-width="2.5"/>`;
  if (kind === 'strips') art = `<rect x="76" y="56" width="148" height="104" rx="10" fill="#cfd9de"/><rect x="76" y="56" width="148" height="104" rx="10" fill="url(#${u}foil)"/><path d="M118 104 q32 26 64 0" stroke="#12A89D" stroke-width="7" fill="none" stroke-linecap="round"/><text x="150" y="88" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="14" fill="#0E8A81">OVERNIGHT</text><rect x="96" y="160" width="110" height="14" rx="7" fill="#fff" opacity=".9"/><rect x="104" y="174" width="96" height="10" rx="5" fill="#fff" opacity=".7"/>`;
  if (kind === 'gummies') { art = `<rect x="112" y="50" width="76" height="22" rx="5" fill="#E8708A"/><rect x="104" y="70" width="92" height="110" rx="16" fill="#fff" stroke="#E0C9CF" stroke-width="2"/><rect x="104" y="96" width="92" height="50" fill="#FFD3DD"/><text x="150" y="126" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="13" fill="#C0506A">LITTLE SMILES</text>`; [[70, 150, '#FF9AB0'], [222, 140, '#9FE6DF'], [60, 108, '#FFD66B'], [236, 96, '#FF9AB0']].forEach(([x, y, c]) => { art += `<path transform="translate(${x} ${y}) scale(.9)" d="M-12 -6 Q-12 -16 -5 -16 Q0 -13 5 -16 Q12 -16 12 -6 Q12 4 9 9 Q7 16 4 13 Q2 6 0 6 Q-2 6 -4 13 Q-7 16 -9 9 Q-12 4 -12 -6Z" fill="${c}" opacity=".95"/>`; }); }
  if (kind === 'veneers') {
    art = `<rect x="56" y="54" width="188" height="122" rx="14" fill="#2b1f2a"/><rect x="64" y="62" width="172" height="106" rx="10" fill="#3b2a38"/>`;
    for (const [row, cy, r] of [[0, 104, 64], [1, 150, 54]]) {
      const n = row ? 9 : 10;
      for (let i = 0; i < n; i++) { const a = Math.PI * (.15 + .7 * i / (n - 1)), x = 150 - Math.cos(a) * r * 1.25, y = cy - Math.sin(a) * r * .45 * (row ? -1 : 1) * .6;
        const odd = !row && i === 6; const col = odd ? '#e8dcb8' : '#F6F2E8';
        art += `<rect x="${(x - 6).toFixed(1)}" y="${(y - 9).toFixed(1)}" width="12" height="18" rx="4" fill="${col}" stroke="#cbbfa8" stroke-width=".8"/>${odd ? `<rect x="${(x - 2.5).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="5" height="4" rx="1" fill="#8a8f94"/><path d="M${x.toFixed(1)} ${(y + 9).toFixed(1)} q1 6 -1 10" stroke="#7a1010" stroke-width="2.4" fill="none"/>` : ''}`; }
    }
  }
  const bgc = { paste: '#DDF4F1', kids: '#FFE6EC', brush: '#E3F0F7', strips: '#EEF2F5', gummies: '#FFF0C2', veneers: '#ECE3F2' }[kind];
  return `<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="${u}foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f6f8"/><stop offset=".5" stop-color="#c9d5db"/><stop offset="1" stop-color="#eef3f5"/></linearGradient></defs>
  <rect width="300" height="220" fill="${bgc}"/>
  <ellipse cx="150" cy="196" rx="110" ry="10" fill="#000" opacity=".06"/>
  ${art}
  <g transform="translate(14 14)"><rect width="112" height="28" rx="14" fill="#12A89D"/><path transform="translate(16 14) scale(.62)" d="M-12 -6 Q-12 -16 -5 -16 Q0 -13 5 -16 Q12 -16 12 -6 Q12 4 9 9 Q7 16 4 13 Q2 6 0 6 Q-2 6 -4 13 Q-7 16 -9 9 Q-12 4 -12 -6Z" fill="#fff"/><text x="30" y="19" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="11.5" fill="#fff" letter-spacing=".6">GLEAMWELL</text></g>
</svg>`;
}

/* sepia photograph of the Room 7 wing opening, 1988: look closely at the doorway */
function renderBarnPhoto(w = 480, h = 320) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#d9c7a4'); g.addColorStop(1, '#a8916c');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.fillStyle = '#8f7a58'; x.fillRect(0, h * .72, w, h);
  const bx = w * .2, bw = w * .6, by = h * .26;
  x.fillStyle = '#c9b58e'; x.fillRect(bx, by, bw, h * .75 - by);
  x.fillStyle = '#6d5a40'; x.fillRect(bx - 6, by - 8, bw + 12, 10);
  for (let i = 0; i < 6; i++) { x.fillStyle = '#5a4a33'; x.fillRect(bx + 14 + i * (bw - 28) / 6, by + 16, (bw - 28) / 6 - 12, h * .1); }
  x.fillStyle = '#3a2c1c'; x.font = `bold ${h * .055}px Georgia, serif`; x.textAlign = 'center'; x.fillText('WING 7', bx + bw / 2, by + h * .2);
  const dx = bx + bw * .36, dw = bw * .28, dy = by + h * .24, dh = h * .75 - dy;
  x.fillStyle = '#0c0906'; x.fillRect(dx, dy, dw, dh);
  const R = rng(1988);
  for (let i = 0; i < 60; i++) {
    const fx = dx + 6 + R() * (dw - 12), fy = dy + 10 + Math.pow(R(), .7) * (dh - 20), r = 2 + (fy - dy) / dh * 3.2;
    x.fillStyle = `rgba(210,196,168,${.25 + R() * .45})`; x.beginPath(); x.ellipse(fx, fy, r, r * 1.25, 0, 0, 7); x.fill();
    x.fillStyle = 'rgba(0,0,0,.8)'; x.fillRect(fx - r * .5, fy - r * .25, r * .32, r * .32); x.fillRect(fx + r * .2, fy - r * .25, r * .32, r * .32);
    x.fillStyle = 'rgba(240,235,220,.9)'; x.fillRect(fx - r * .45, fy + r * .42, r * .9, r * .22);
  }
  x.strokeStyle = '#3a2c1c'; x.lineWidth = 2; x.beginPath(); x.moveTo(bx - 20, h * .7); x.lineTo(bx + bw + 20, h * .7); x.stroke();
  for (let i = 0; i < 9; i++) {
    const px = w * .14 + i * w * .085, py = h * .78;
    x.fillStyle = i % 3 ? '#2e2418' : '#d8ccb2'; x.fillRect(px - 9, py - 34, 18, 46);
    x.fillStyle = '#cdb994'; x.beginPath(); x.arc(px, py - 42, 8, 0, 7); x.fill();
    x.fillStyle = '#2e2418'; x.fillRect(px - 3, py - 44, 2, 2); x.fillRect(px + 2, py - 44, 2, 2);
  }
  grainify(x, w, h, .2, 1988, true);
  return c;
}
function grainify(x, w, h, amt, seed, old) {
  const d = x.getImageData(0, 0, w, h), D = d.data;
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    const i = (py * w + px) * 4, n = (hash2(px, py, seed) - .5) * 255 * amt;
    const sx = px / w - .5, sy = py / h - .5, v = old ? 1 - (sx * sx + sy * sy) * 1.6 : 1;
    for (let k = 0; k < 3; k++) D[i + k] = clamp((D[i + k] + n) * v / 255) * 255;
  }
  x.putImageData(d, 0, 0);
  if (old) { x.strokeStyle = 'rgba(255,250,235,.35)'; x.lineWidth = 1; const R = rng(seed); for (let i = 0; i < 9; i++) { const sx = R() * w; x.beginPath(); x.moveTo(sx, 0); x.lineTo(sx + (R() - .5) * 30, h); x.stroke(); } }
}

/* shared animated noise */
const NOISE = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 144; const x = c.getContext('2d'); const id = x.createImageData(256, 144);
  return { c, tick() { const a = id.data; for (let i = 0; i < a.length; i += 4) { const v = Math.random() * 255 | 0; a[i] = a[i + 1] = a[i + 2] = v; a[i + 3] = 255; } x.putImageData(id, 0, 0); } }; })();

/* scrawled handwriting onto a canvas */
function scrawl(x, text, cx, cy, size, color = '#7a0b0b', seed = 1) {
  const R = rng(seed);
  x.save(); x.font = `italic ${size}px "IM Fell English", Georgia, serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let k = 0; k < 3; k++) { x.globalAlpha = .55; x.fillStyle = color; x.fillText(text, cx + (R() - .5) * 2.5, cy + (R() - .5) * 2.5); }
  x.restore();
}
