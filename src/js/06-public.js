/* ============ the public website ============ */
const CODE = '47193';
const isStock = () => store.get('gh-stock') === '1';
const isUnlocked = () => store.get('gh-unlocked') === '1';
let CLEAN = [];
const onClean = fn => CLEAN.push(fn);
function every(ms, fn) { const id = setInterval(fn, ms); onClean(() => clearInterval(id)); return id; }
function later(ms, fn) { const id = setTimeout(fn, ms); onClean(() => clearTimeout(id)); return id; }
function loop(fn) { let on = true, id; const f = t => { if (!on) return; fn(t); id = requestAnimationFrame(f); }; id = requestAnimationFrame(f); onClean(() => { on = false; cancelAnimationFrame(id); }); }
function listen(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); onClean(() => el.removeEventListener(ev, fn, opt)); }

function toast(msg, ms = 3200) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.id); toast.id = setTimeout(() => { t.hidden = true; }, ms); }
function openModal(html, cls = '') {
  const m = $('#modal'); m.className = 'modal ' + cls; $('#modal-body').innerHTML = html; m.hidden = false;
  $('#modal-x').focus();
}
function closeModal() { const m = $('#modal'); m.hidden = true; $('#modal-body').innerHTML = ''; if (closeModal.after) { const f = closeModal.after; closeModal.after = null; f(); } }

const PIG_MINI = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 15 Q7 4 15 5 Q20 8 25 5 Q33 4 32 15 Q32 25 30 30 Q28 38 25 35 Q23 28 20 28 Q17 28 15 35 Q12 38 10 30 Q8 25 8 15Z" fill="#fff" stroke="#12A89D" stroke-width="2.4" stroke-linejoin="round"/><circle cx="15.5" cy="16" r="1.8" fill="#10202a"/><circle cx="24.5" cy="16" r="1.8" fill="#10202a"/><path d="M15 21 q5 4 10 0" stroke="#10202a" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;

const NAV = [['home', 'Home'], ['story', 'Our Story'], ['products', 'Products'], ['tips', 'Smile Tips'], ['careers', 'Careers'], ['contact', 'Contact']];
let cartN = +(store.get('gh-cart') || 0);
function publicShell(route, inner) {
  return `<div class="pub ${isStock() ? 'is-stock' : ''}">
  <header class="pub-nav"><div class="wrap nav-in">
    <a class="logo" href="#home" aria-label="Gleamwell home"><span class="logo-pig">${PIG_MINI}</span><span class="logo-word">Gleamwell<small>Smile Co. · est. 1962</small></span></a>
    <nav class="nav-links" aria-label="Main">${NAV.map(([k, l]) => `<a href="#${k}" ${k === route ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <a class="cart" href="#products" aria-label="Cart"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"/></svg><span id="cart-n">${cartN}</span></a>
  </div></header>
  <main id="main">${inner}</main>
  <footer class="pub-foot"><div class="wrap foot-in">
    <div class="foot-brand"><span class="logo-pig">${PIG_MINI}</span><div><b>Gleamwell Smile Co.</b><p>1 Harrow Lane, Harlow County<br>Smile forever.</p></div></div>
    <div class="foot-cols">
      <div><b>Shop</b><a href="#products">All products</a><a href="#tips">Smile tips</a><a href="#products">Where to buy</a></div>
      <div><b>Company</b><a href="#story">Our story</a><a href="#careers">Careers</a><a href="#contact">Book a visit</a></div>
      <div><b>Help</b><a href="#contact">FAQ</a><a href="#contact">Product recalls</a><a href="#login" class="staff-link">Staff login</a></div>
    </div>
  </div>
  <div class="wrap foot-legal"><span>© 1962–2026 Gleamwell Smile Co. All smiles reserved${isStock() ? '. Including yours, GW-P-1205' : ''}.</span><span>A fictional company. This site is satire.</span></div></footer>
</div>`;
}

/* ---------- HOME ---------- */
function pageHome() {
  const night = new Date().getHours() < 4;
  const stock = isStock();
  return publicShell('home', `
  <section class="hero ${night ? 'night' : ''}">
    <div class="hero-art">${heroSVG()}</div>
    <div class="wrap hero-copy">
      <span class="kicker">${stock ? 'Welcome back, GW-P-1205' : 'Family-run since 1962'}</span>
      <h1>${night ? "We're closed.<br>Stop smiling." : 'Smile brighter.<br>Smile forever.'}</h1>
      <p>${night ? 'The clinic is closed. Every patient is resting in their chair. Please do not come in to check on them.' : 'For over sixty years the Gleam family has cared for smiles the old-fashioned way, with gentle hands, honest products and a little bit of magic. Our patients never stop smiling. Just ask them.'}</p>
      <div class="ctas"><a class="btn btn-red" href="#products">Shop the smile kit</a><a class="btn btn-white" href="#contact">Book a visit</a></div>
    </div>
  </section>
  <div class="band"><div class="wrap band-in"><span>Family-run since 1962</span><span>11 million smiles</span><span>Gentle, painless care</span><span>Dentist recommended</span><span class="hid">the teeth are real ① 4</span></div></div>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><span class="kicker">The Gleamwell difference</span><h2>Care that sticks with you.</h2></div>
    <div class="values">
      <article class="value"><div class="v-ico v-red"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.3 3.3 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.3 0 5.5 3.3 4.1 6.7C19.5 16.4 12 21 12 21z"/></svg></div><h3>Gentle hands</h3><p>Every patient is greeted by name, settled into a warm chair and cared for by the same family that started it all.</p></article>
      <article class="value"><div class="v-ico v-yellow"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/></svg></div><h3>Smiles that last forever</h3><p>Our Forever Smile™ treatment keeps you smiling at every stage of life. Patients tell us they simply can't stop.</p></article>
      <article class="value"><div class="v-ico v-green"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg></div><h3>From our family to yours</h3><p>Every Gleamwell product carries a little piece of the clinic. Some carry a little more than others.</p></article>
    </div>
  </div></section>

  <section class="sec merry-sec"><div class="wrap merry-in">
    <div class="merry-stage"><button class="merry-btn" id="home-merry" type="button" aria-label="Pearl the tooth">${merrySVG({ truth: false })}</button><div class="speech" id="merry-speech">Hi friend! I'm Pearl!</div></div>
    <div class="merry-copy"><span class="kicker">Meet our mascot</span><h2>Say hello to Pearl.</h2>
      <p>Pearl has been the smiling face of Gleamwell since 1974. Kids adore her, parents trust her, and every morning at six she plays over the clinic speakers to remind our patients how happy they are.</p>
      <p>Pearl is always smiling. Pearl has never once stopped smiling.</p>
      <button class="btn btn-red" id="sing" type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>Sing the brushing song</button>
    </div>
  </div></section>

  <section class="sec sec-tint"><div class="wrap">
    <div class="sec-head row"><div><span class="kicker">Bestsellers</span><h2>Everything for a brighter smile.</h2></div><a class="link-arrow" href="#products">See all products →</a></div>
    <div class="prod-grid">${PRODUCTS.slice(0, 3).map(prodCard).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><span class="kicker">Reviews</span><h2>Families love Gleamwell.</h2></div>
    <div class="reviews">
      ${[['Carla M.', 'Topeka, KS', 'My teeth have never been this white. My sister asked where I got them done and I couldn\'t stop smiling long enough to answer.', 31],
         ['Ben & Tasha O.', 'Fresno, CA', 'Our kids love the Little Smiles gummies. They ask for them every night and they smile all the way through dinner. All the way through.', 32],
         ['Greg L.', 'Akron, OH', 'Had the Forever Smile done in March. Haven\'t stopped smiling since. I can\'t. Five stars.', 33]]
        .map(([n, c, q, s]) => `<figure class="review"><div class="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“${q}”</blockquote><figcaption><canvas class="rev-face" data-seed="${s}" width="56" height="56" aria-hidden="true"></canvas><span><b>${n}</b>${c}</span></figcaption></figure>`).join('')}
    </div>
  </div></section>

  <section class="sec news"><div class="wrap news-in">
    <div><h2>Join the Gleamwell family</h2><p>Brushing tips, new products and coupons, once a month. We'll never share your address.</p></div>
    <form id="news-form" class="news-form"><label class="sr" for="news-email">Email address</label><input id="news-email" type="email" required placeholder="you@example.com"><button class="btn btn-red" type="submit">Sign me up</button></form>
    <p id="news-msg" class="news-msg" role="status"></p>
  </div></section>`);
}
function mountHome() {
  $$('.rev-face').forEach(c => { const f = renderFace({ w: 112, h: 112, seed: +c.dataset.seed, smile: .95, open: .15, teeth: true, scale: .85, cy: .12, hair: .8, tone: [[.86, .66, .54], [.6, .42, .3], [.9, .72, .6]][c.dataset.seed % 3], bg: [.75, .93, .9], grain: .03 }); c.width = 112; c.height = 112; c.getContext('2d').drawImage(f, 0, 0); });
  if (isStock()) $$('#hero-merry .mpupil, #home-merry .mpupil').forEach(p => p.setAttribute('fill', '#5a4a1a'));
  const pupils = $$('.mpupil');
  let idle = performance.now();
  listen(window, 'pointermove', e => {
    for (const p of pupils) {
      const r = p.ownerSVGElement.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height * .37;
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 400) * 3.5;
      p.parentNode.setAttribute('transform', `translate(${(dx / d * k).toFixed(2)} ${(dy / d * k).toFixed(2)})`);
    }
    idle = performance.now(); const lf = $('#loftface'); if (lf && lf.getAttribute('opacity') !== '0' && !$('.hero.night')) lf.setAttribute('opacity', '0');
  }, { passive: true });
  listen(window, 'scroll', () => { idle = performance.now(); }, { passive: true });
  // idle: someone at the window of room 7
  every(1000, () => { if (performance.now() - idle > 30000) { const lf = $('#loftface'); if (lf && lf.getAttribute('opacity') === '0') { lf.setAttribute('opacity', '1'); AU.breath(2); } } });
  const f7 = $('#far7'); if (f7) listen(f7, 'click', () => { AU.knock(0); AU.knock(.3); AU.knock(.6); toast('Room 7 is closed.'); });
  let clicks = 0, clickT = 0;
  const lines = ["Hi friend! I'm Pearl!", 'Brush twice a day!', 'Hee hee! Sparkly!', 'Please stop poking me, friend.', ''];
  listen($('#home-merry'), 'click', async () => {
    const now = performance.now(); if (now - clickT > 2500) clicks = 0; clickT = now; clicks++;
    AU.tone(520 + clicks * 80, .12, { type: 'triangle', gain: .1 });
    $('#merry-speech').textContent = lines[Math.min(clicks - 1, 3)];
    if (clicks >= 5) {
      clicks = 0; const btn = $('#home-merry');
      btn.innerHTML = merrySVG({ truth: true, wave: false }); $('#merry-speech').textContent = 'help us';
      AU.glitch(); AU.speak('help us', { rate: .55, pitch: .1, volume: .6 }); subliminal('stare', 90, .25);
      await wait(1400); if (!btn.isConnected) return;
      btn.innerHTML = merrySVG({ truth: false }); $('#merry-speech').textContent = 'Hee hee! Just kidding, friend!';
    }
  });
  listen($('#sing'), 'click', () => { AU.init(); AU.jingle('happy'); $('#merry-speech').textContent = '♪ Gleamwell, Gleamwell, smile all day ♪'; });
  listen($('#news-form'), 'submit', e => { e.preventDefault(); $('#news-msg').textContent = "Thanks for signing up! We'll be in touch. We already had your address, but it's nice that you offered."; });
  bindProductButtons();
}

/* ---------- STORY ---------- */
function pageStory() {
  const tl = [
    ['1962', 'One chair and a dream', 'Dr. Walter "Doc" Gleam opens a one-chair practice above the hardware store in Harlow County and pulls his first tooth for a quarter.'],
    ['1974', 'The Forever Smile™', 'After years of research, Doc Gleam introduces the Forever Smile™: a treatment that keeps a smile in place for good. Pearl joins the family the same year.'],
    ['1981', 'Gleamwell goes national', 'Gleamwell toothpaste arrives in stores across the country. Families can finally take a little piece of the clinic home.'],
    ['1988', 'The Room 7 wing opens', 'Our newest wing opens with a ribbon-cutting for the whole town.', true],
    ['1989', 'Room 7 closes', ''],
    ['2003', 'Doc Gleam retires', 'Walter steps back from the business and retires to the clinic. He is still there.'],
    ['2026', 'Still family-run', 'Today Gleamwell cares for more than 11 million smiles. Our family keeps growing every year.']
  ];
  return publicShell('story', `
  <section class="page-head"><div class="wrap"><span class="kicker">Our story</span><h1>Sixty years of smiles.</h1><p class="lead">Gleamwell began with one man who believed a smile is the most important thing a person owns. He was right. He was more right than anybody expected.</p></div></section>
  <section class="sec"><div class="wrap founder">
    <figure class="photo-frame" id="founder" tabindex="0" aria-label="Portrait of Dr. Walter Gleam, 1962"><canvas id="founder-a" width="240" height="300"></canvas><canvas id="founder-b" width="240" height="300" aria-hidden="true"></canvas><figcaption>Dr. Walter Gleam, 1962</figcaption></figure>
    <div class="founder-copy"><span class="kicker">Our founder</span><h2>Dr. Walter "Doc" Gleam</h2>
      <p>Walter grew up the son of a dock worker who never once smiled. He swore that one day nobody who sat in his chair would ever have to stop.</p>
      <p>"A smiling patient is a still patient," he liked to say. "And a still patient never fights." He spent the rest of his life making sure every patient at Gleamwell was both.</p>
      <blockquote class="pull">“Hold a smile in place long enough and the person behind it stops arguing.”<cite>Dr. Walter Gleam, 1974</cite></blockquote>
    </div>
  </div></section>
  <section class="sec sec-tint"><div class="wrap">
    <div class="sec-head"><span class="kicker">Timeline</span><h2>How we got here.</h2></div>
    <ol class="timeline">${tl.map(([y, t, d, photo]) => `<li><span class="tl-year">${y}</span><div class="tl-body"><h3>${t}</h3>${d ? `<p>${d}</p>` : ''}${photo ? '<figure class="tl-photo"><canvas id="barn-photo" width="480" height="320" aria-label="Old photograph of the Room 7 wing opening"></canvas><figcaption>Wing 7 ribbon-cutting, June 1988. Everyone came.</figcaption></figure>' : ''}</div></li>`).join('')}</ol>
  </div></section>`);
}
function mountStory() {
  const a = renderFace({ w: 240, h: 300, seed: 1962, smile: .45, open: .1, teeth: true, age: 1, hair: 0, mode: 'sepia', bg: [.72, .7, .66], clothes: [.82, .8, .76], grain: .1, look: [.1, 0] });
  const b = renderFace({ w: 240, h: 300, seed: 1962, smile: 1, open: .35, teeth: true, eyes: 'hollow', age: 1, hair: 0, mode: 'sepia', bg: [.6, .58, .54], clothes: [.82, .8, .76], grain: .14, blood: .6, contrast: 1.25 });
  $('#founder-a').getContext('2d').drawImage(a, 0, 0);
  const bx = $('#founder-b').getContext('2d'); bx.drawImage(b, 0, 0); grainify(bx, 240, 300, .05, 3, true); scrawl(bx, '② 7', 182, 262, 40, '#5a0505', 2);
  const fr = $('#founder'); let timer = null, shown = false;
  const start = () => { clearTimeout(timer); timer = setTimeout(() => { fr.classList.add('reveal'); shown = true; AU.breath(1.6); AU.tone(1400, .8, { type: 'sine', gain: .03, wet: .6 }); }, 2500); };
  const stop = () => { clearTimeout(timer); if (shown) timer = setTimeout(() => { fr.classList.remove('reveal'); shown = false; }, 1600); };
  ['pointerenter', 'pointerdown', 'focus'].forEach(e => listen(fr, e, start));
  ['pointerleave', 'pointerup', 'pointercancel', 'blur'].forEach(e => listen(fr, e, stop));
  onClean(() => clearTimeout(timer));
  const bp = $('#barn-photo'); if (bp) bp.getContext('2d').drawImage(renderBarnPhoto(480, 320), 0, 0);
}

/* ---------- PRODUCTS ---------- */
const STD = { act: 'Sodium fluoride 0.24% (0.15% w/v fluoride ion)', use: 'Anticavity toothpaste', warn: 'Keep out of reach of children under 6. If more than used for brushing is swallowed, get medical help.' };
const PRODUCTS = [
  { id: 'paste', kind: 'paste', cat: 'paste', name: 'Gleamwell Whiten+ Toothpaste', price: 4.49, blurb: 'Clinically brighter in seven days. You won\'t be able to stop smiling.', ...STD },
  { id: 'kids', kind: 'kids', cat: 'kids', name: "Pearl's Bubblegum Kids Toothpaste", price: 3.99, blurb: 'Gentle, sparkly and sugar-free. Pearl\'s personal favorite.', ...STD },
  { id: 'brush', kind: 'brush', cat: 'tools', name: 'Gleamwell Sonic Brush', price: 49.99, blurb: 'Gentle enough for twice a day. Strong enough for anything.', act: 'None', use: 'Removes plaque. Removes everything.', warn: 'Do not use on anyone who is not asleep.' },
  { id: 'strips', kind: 'strips', cat: 'whitening', name: 'Overnight Whitening Strips', price: 24.99, blurb: 'Wear them while you sleep. Wake up smiling. Keep smiling.', act: 'Hydrogen peroxide 6%', use: 'Tooth whitening', warn: 'Do not wear for more than one night. If you wake up still wearing them, do not take them off yourself.' },
  { id: 'gummies', kind: 'gummies', cat: 'kids', name: 'Little Smiles Gummy Vitamins', price: 8.99, blurb: 'A lunchbox favorite shaped like tiny teeth. Made by little smilers, for little smilers.', act: 'Calcium, vitamin D3, fluoride', use: 'Supports strong teeth in children', warn: 'Contains enamel from Gleamwell donors (junior).' },
  { id: 'veneers', kind: 'veneers', cat: 'whitening', name: 'Forever Smile™ Veneer Kit (Limited)', price: 299.0, blurb: 'Small batch. Supply varies with intake. Every set is crafted from genuine enamel.', act: 'Human enamel 100%', use: 'Permanent smile', warn: 'Do not attempt removal. Do not ask where they came from.', limited: true }
];
function prodCard(p) {
  return `<article class="prod" data-cat="${p.cat}"><button class="prod-img" type="button" data-detail="${p.id}" aria-label="Details for ${esc(p.name)}">${productSVG(p.kind)}</button>
  <div class="prod-body"><h3>${p.name}</h3><p>${p.blurb}</p><div class="prod-foot"><span class="price">$${p.price.toFixed(2)}</span><button class="btn btn-sm btn-red" type="button" data-add="${p.id}">Add to cart</button></div></div></article>`;
}
function pageProducts() {
  return publicShell('products', `
  <section class="page-head"><div class="wrap"><span class="kicker">Products</span><h1>Smile essentials, from our family to yours.</h1><p class="lead">Every Gleamwell product is developed, tested and packed by the same family that started it all.</p></div></section>
  <section class="sec"><div class="wrap">
    <div class="chips" role="group" aria-label="Filter products">${[['all', 'All'], ['paste', 'Toothpaste'], ['tools', 'Brushes'], ['whitening', 'Whitening'], ['kids', 'For kids']].map(([k, l], i) => `<button class="chip" type="button" data-f="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
    <div class="prod-grid" id="prod-grid">${PRODUCTS.map(prodCard).join('')}</div>
  </div></section>`);
}
function nutrition(p) {
  return `<div class="nf"><div class="nf-h">Drug Facts</div>
  <table><tbody><tr><th>Active ingredient</th><td>${p.act}</td></tr><tr><th>Purpose</th><td>${p.use}</td></tr></tbody></table>
  <p class="nf-ing"><b>Warnings:</b> ${p.warn}</p>
  ${p.limited ? '<p class="nf-ing"><b>Inactive ingredients:</b> gratitude, porcelain glaze, a little bit of someone.</p><p class="nf-fine">Lot no. ③ 1 · Crafted in Room 7 · Each set is unique and may contain fillings from a previous owner. If a tooth looks familiar, please return it to Gleamwell. Someone is looking for it.</p>' : '<p class="nf-fine">Brush thoroughly at least twice daily, or as directed by a dentist. Store at room temperature.</p>'}</div>`;
}
function bindProductButtons() {
  $$('[data-add]').forEach(b => listen(b, 'click', () => {
    const p = PRODUCTS.find(x => x.id === b.dataset.add);
    if (p.limited) { toast('Sold out. Supply is replenished as new donors arrive. We are always looking for new donors.'); AU.buzz(); return; }
    cartN++; store.set('gh-cart', cartN); const n = $('#cart-n'); if (n) n.textContent = cartN; AU.beep(1320); toast(`Added ${p.name} to your cart.`);
  }));
  $$('[data-detail]').forEach(b => listen(b, 'click', () => {
    const p = PRODUCTS.find(x => x.id === b.dataset.detail);
    openModal(`<div class="pd"><div class="pd-img">${productSVG(p.kind)}</div><div class="pd-copy"><h2 id="modal-title">${p.name}</h2><p class="price">$${p.price.toFixed(2)}</p><p>${p.blurb}</p>${nutrition(p)}</div></div>`, 'm-light');
  }));
}
function mountProducts() {
  $$('.chip').forEach(c => listen(c, 'click', () => {
    $$('.chip').forEach(x => x.setAttribute('aria-pressed', x === c)); const f = c.dataset.f;
    $$('#prod-grid .prod').forEach(p => { p.hidden = !(f === 'all' || p.dataset.cat === f); });
  }));
  bindProductButtons();
}

/* ---------- SMILE TIPS + clinic tour video ---------- */
function pageTips() {
  const R = [
    ['The two-minute brush', '2 min', ['A Gleamwell Sonic Brush', 'A pea-sized blob of Whiten+', 'A mirror'], ['Brush every surface in small circles for two full minutes.', 'Smile at yourself in the mirror until your reflection smiles back.', 'If it keeps smiling after you stop, call the clinic.']],
    ['Floss like Doc Gleam', '1 min', ['Gleamwell floss', 'Patience'], ['Wind the floss around two fingers.', 'Slide it gently between each tooth. Count them as you go.', 'If you count more teeth than you had yesterday, that\'s normal. Keep counting.']],
    ["Pearl's bedtime routine", '5 min', ['Little Smiles gummies', 'Pearl\'s Bubblegum toothpaste', 'A night light'], ['Brush with your little one and sing the brushing song together.', 'Tuck them in nice and snug, smiling. Smiling helps them sleep.', 'Don\'t check on them if you hear them giggling at night. Pearl is with them.']]
  ];
  return publicShell('tips', `
  <section class="page-head"><div class="wrap"><span class="kicker">Smile tips</span><h1>Brush like a Gleam.</h1><p class="lead">Simple habits from our family clinic. Start with a tour of where it all happens.</p></div></section>
  <section class="sec"><div class="wrap">
    <div class="video"><div class="video-screen"><canvas id="tour" width="640" height="360" aria-label="Gleamwell clinic tour video"></canvas><button class="v-big" id="v-big" type="button" aria-label="Play the clinic tour"><svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg></button></div>
      <div class="v-bar"><button id="v-play" type="button" class="v-btn" aria-label="Play">▶</button><label class="sr" for="v-seek">Seek</label><input id="v-seek" type="range" min="0" max="2400" value="0" step="1"><span id="v-time" class="v-time">0:00 / 0:24</span></div>
      <p class="v-cap">Take the Gleamwell clinic tour (1994). Our patients are resting, so we kept them off camera.</p></div>
    <div class="recipes">${R.map(([n, t, ing, st]) => `<article class="recipe"><div class="r-head"><h3>${n}</h3><span class="pill-time">${t}</span></div><h4>You'll need</h4><ul>${ing.map(i => `<li>${i}</li>`).join('')}</ul><h4>How to</h4><ol>${st.map(i => `<li>${i}</li>`).join('')}</ol></article>`).join('')}</div>
  </div></section>`);
}
const MERRY_IMG = svgToImage(merrySVG({ wave: false }));
function mountTips() {
  const cv = $('#tour'), x = cv.getContext('2d'), W = 640, H = 360, DUR = 24;
  let t = 0, playing = false, last = 0, flashed = false, startedSong = false;
  const stare = scareSource('face');
  const seek = $('#v-seek'), play = $('#v-play'), big = $('#v-big'), lab = $('#v-time');
  const fmt = s => `0:${String(Math.floor(s)).padStart(2, '0')}`;
  function sky() { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8FD7EE'); g.addColorStop(1, '#E6F8FB'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  function hills(off = 0) { x.fillStyle = '#86C66A'; x.beginPath(); x.moveTo(0, 240); for (let i = 0; i <= W; i += 20) x.lineTo(i, 236 + Math.sin((i + off) / 90) * 10); x.lineTo(W, H); x.lineTo(0, H); x.fill(); x.fillStyle = '#4b5157'; x.fillRect(0, 316, W, 44); x.fillStyle = '#F2E7B8'; for (let i = 0; i < 8; i++) x.fillRect(((i * 100 - off) % 800 + 800) % 800 - 100, 336, 50, 4); }
  function caption(s) { x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, H - 52, W, 52); x.fillStyle = '#fff'; x.font = '600 22px Fredoka, Nunito, sans-serif'; x.textAlign = 'center'; x.fillText(s, W / 2, H - 19); }
  function pearl(cx, cy, s, bob = 0) { if (MERRY_IMG.complete && MERRY_IMG.naturalWidth) x.drawImage(MERRY_IMG, cx - 80 * s, cy - 100 * s + bob, 160 * s, 200 * s); }
  function clinic(cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); x.fillStyle = '#fff'; x.fillRect(-150, -90, 300, 170); x.fillStyle = '#12A89D'; x.fillRect(-156, -98, 312, 12); x.fillStyle = '#BFE6F2'; for (let i = 0; i < 7; i++) x.fillRect(-138 + i * 40, -72, 30, 28); x.fillStyle = '#141b1f'; x.fillRect(-138 + 6 * 40, -72, 30, 28); x.fillStyle = '#5FB9C9'; x.fillRect(-36, -10, 72, 90); x.strokeStyle = '#0E8A81'; x.lineWidth = 4; x.strokeRect(-36, -10, 72, 90); x.beginPath(); x.moveTo(0, -10); x.lineTo(0, 80); x.stroke(); x.restore(); }
  function draw() {
    x.save();
    if (t < 5) { sky(); hills(t * 30); pearl(W / 2, 200, 1, Math.abs(Math.sin(t * 4)) * -16); x.fillStyle = '#0E8A81'; x.font = '700 40px Fredoka, Nunito, sans-serif'; x.textAlign = 'center'; x.globalAlpha = clamp(t / 1.2); x.fillText('Welcome to Gleamwell!', W / 2, 70); x.globalAlpha = 1; }
    else if (t < 10) { const k = (t - 5) / 5; sky(); hills(150); clinic(W / 2, 220, 1 + k * .35); caption('Our patients love their visits.'); x.fillStyle = 'rgba(255,255,255,.9)'; x.font = '14px Nunito, sans-serif'; x.textAlign = 'center'; x.fillText('(patients not pictured)', W / 2, 40); }
    else if (t < 14.5) { x.fillStyle = '#e6f2f2'; x.fillRect(0, 0, W, H); x.fillStyle = '#6b7880'; x.fillRect(0, 210, W, 40); x.fillStyle = '#4a565e'; for (let i = -1; i < 14; i++) x.fillRect(((i * 60 + t * 80) % (W + 60)) - 60, 210, 6, 40); for (let i = 0; i < 6; i++) { const px = ((i * 130 + t * 80) % (W + 130)) - 130; x.fillStyle = '#fff'; x.beginPath(); x.roundRect ? x.roundRect(px, 176, 100, 34, 10) : x.rect(px, 176, 100, 34); x.fill(); x.fillStyle = '#12A89D'; x.fillRect(px + 8, 184, 26, 18); x.fillStyle = '#0E8A81'; x.fillRect(px + 100, 182, 16, 22); } caption('Every tube is made with care.'); }
    else if (t < 17) { sky(); hills(400); pearl(W / 2, 250, 1.8, Math.sin(t * 6) * 6); caption('See you soon, friend!'); }
    else if (t < 17.22) {
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = .95; x.drawImage(stare, W / 2 - 165, -40, 330, 440); x.globalAlpha = 1;
      x.fillStyle = 'rgba(0,0,0,.4)'; for (let y = 0; y < H; y += 3) x.fillRect(0, y, W, 1); scrawl(x, '④ 9', W - 100, H - 110, 64, '#d01818', 4);
      x.fillStyle = '#d0d0d0'; x.font = '16px "VT323", monospace'; x.textAlign = 'left'; x.fillText('ROOM 7  02:14:09', 18, 28);
    }
    else { const k = clamp((t - 17.22) / 1.5); x.fillStyle = '#F2FBFA'; x.fillRect(0, 0, W, H); x.globalAlpha = k; x.fillStyle = '#0E8A81'; x.font = '700 46px Fredoka, Nunito, sans-serif'; x.textAlign = 'center'; x.fillText('Gleamwell', W / 2, 150); x.fillStyle = '#1C2A30'; x.font = '22px Nunito, sans-serif'; x.fillText('Smile brighter. Smile forever.', W / 2, 190); x.globalAlpha = 1;
      if (t > 21) { x.globalAlpha = clamp((t - 21) / 1.5) * .9; pearl(W / 2, 290, .55, 0); x.globalAlpha = 1; x.fillStyle = '#7a7a7a'; x.font = '14px Nunito, sans-serif'; x.fillText('see you soon', W / 2, 345); } }
    x.globalAlpha = .07; x.drawImage(NOISE.c, 0, 0, W, H); x.globalAlpha = 1;
    x.fillStyle = 'rgba(255,255,255,.75)'; x.font = '18px "VT323", monospace'; x.textAlign = 'right'; x.fillText('GLEAMWELL TOUR \'94', W - 14, 24);
    x.restore();
  }
  function setT(v) { t = clamp(v, 0, DUR); seek.value = Math.round(t * 100); lab.textContent = `${fmt(t)} / 0:24`; }
  function toggle() { AU.init(); playing = !playing; if (t >= DUR - .05) { setT(0); flashed = false; } play.textContent = playing ? '❚❚' : '▶'; play.setAttribute('aria-label', playing ? 'Pause' : 'Play'); big.hidden = true; last = performance.now(); if (playing && t < .5 && !startedSong) { startedSong = true; AU.jingle('happy'); } }
  listen(play, 'click', toggle); listen(big, 'click', toggle); listen(cv, 'click', toggle);
  listen(seek, 'input', () => { big.hidden = true; setT(seek.value / 100); draw(); });
  loop(now => {
    if (playing) { const prev = t; setT(t + (now - last) / 1000); if (prev < 17 && t >= 17 && !flashed) { flashed = true; AU.glitch(); } if (t >= DUR) { playing = false; play.textContent = '▶'; big.hidden = false; } }
    last = now; NOISE.tick(); draw();
  });
}

/* ---------- CAREERS ---------- */
function pageCareers() {
  const jobs = [
    ['Dental Hygienist', 'Full time · Main clinic', ['Clean and polish with a gentle touch', 'Keep every patient calm, quiet and comfortable', 'Smile at the patients. They copy you.']],
    ['Packing Associate', 'Full time · Plant 2', ['Operate filling and capping machines', 'Check every veneer kit for matching sets', 'Report any kits that are warm']],
    ['Night Attendant: Room 7', 'Overnight · Room 7 observation desk', ['Remain at the observation desk until dawn', 'Under no circumstances unlock Room 7', 'Note any humming in the logbook', 'Never answer when you are called by name', 'Only pass meals through the slot', 'Wear the provided earplugs at all times'], true],
    ['Patient Intake Coordinator', 'Full time · Front desk', ['Welcome walk-ins and new arrivals', 'Make sure every patient feels at home', 'Make sure every patient stays']]
  ];
  return publicShell('careers', `
  <section class="page-head"><div class="wrap"><span class="kicker">Careers</span><h1>Join our smiling team.</h1><p class="lead">At Gleamwell you're not just staff, you're family. Once you're part of the Gleamwell family, you're part of it for life.</p></div></section>
  <section class="sec"><div class="wrap">
    <div class="perks">${[['Free dental for life', 'Full Forever Smile™ coverage. Mandatory after year one.'], ['On-site housing', 'Comfortable chairs, sorry, rooms, right in the clinic.'], ['Job security', 'Nobody has ever left Gleamwell.'], ['Family culture', 'Everyone here is smiling. You will be too.']].map(([a, b]) => `<div class="perk"><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <h2 class="h-open">Open positions</h2>
    <div class="jobs">${jobs.map(([t, m, d, filled], i) => `<details class="job" ${i === 2 ? 'id="night-shepherd"' : ''}><summary><span><b>${t}</b><small>${m}</small></span><span class="job-x" aria-hidden="true">+</span></summary><div class="job-body"><h4>Responsibilities</h4><ul>${d.map(l => `<li>${l}</li>`).join('')}</ul>${filled ? '<button class="btn btn-sm btn-white" type="button" id="ns-apply">Apply for this role</button><p class="filled" id="ns-msg" role="status"></p>' : '<button class="btn btn-sm btn-red" type="button" data-jump="apply-form">Apply below</button>'}</div></details>`).join('')}</div>
    <form class="apply" id="apply-form" aria-labelledby="apply-h"><h2 id="apply-h">Apply now</h2>
      <div class="f-row"><label for="a-name">Full name</label><input id="a-name" required autocomplete="name"></div>
      <div class="f-row"><label for="a-email">Email</label><input id="a-email" type="email" required autocomplete="email"></div>
      <div class="f-row"><label for="a-role">Position</label><select id="a-role"><option>Dental Hygienist</option><option>Packing Associate</option><option>Patient Intake Coordinator</option></select></div>
      <div class="f-row"><label for="a-why">Why do you want to join the Gleamwell family?</label><textarea id="a-why" rows="4" required></textarea></div>
      <button class="btn btn-red" type="submit">Submit application</button>
      <div class="apply-result" id="apply-result" role="status" hidden></div>
    </form>
  </div></section>`);
}
function mountCareers() {
  $$('[data-jump]').forEach(b => listen(b, 'click', () => { const f = document.getElementById(b.dataset.jump); f.scrollIntoView({ behavior: 'smooth', block: 'start' }); later(500, () => $('#a-name').focus({ preventScroll: true })); }));
  const ns = $('#ns-apply');
  if (ns) listen(ns, 'click', async () => { const m = $('#ns-msg'); ns.disabled = true; let s = ''; for (let i = 0; i < 7; i++) { s += 'Position filled. '; m.textContent = s; AU.click(); await wait(260); if (!m.isConnected) return; } m.textContent = s + 'Position fi'; });
  listen($('#apply-form'), 'submit', async e => {
    e.preventDefault(); const name = ($('#a-name').value.trim().split(' ')[0] || 'friend');
    const r = $('#apply-result'); r.hidden = false; r.className = 'apply-result'; r.textContent = 'Reviewing your application…';
    await wait(2200); if (!r.isConnected) return;
    r.classList.add('done');
    r.innerHTML = `<b>Congratulations, ${esc(name)}. You have a lovely smile.</b><p>We've reviewed your application, your photos and your dental records. A driver will collect you. Please don't bring anything with you. You won't need it.</p><p>Your first Forever Smile™ appointment is already booked. Your family can come too.</p><p class="sig">— Gleamwell Intake · ref ⑤ 3</p>`;
    AU.knock(.4, .4);
  });
}

/* ---------- CONTACT ---------- */
function pageContact() {
  return publicShell('contact', `
  <section class="page-head"><div class="wrap"><span class="kicker">Book a visit</span><h1>We'd love to see you smile.</h1><p class="lead">Questions about a product, an appointment or the Forever Smile™? The Gleamwell family is here to help.</p></div></section>
  <section class="sec"><div class="wrap contact">
    <div class="contact-info">
      <div class="ci"><b>Visit the clinic</b><span>1 Harrow Lane, Harlow County</span><span>Walk-ins welcome daily. Appointments sometimes run long.</span></div>
      <div class="ci"><b>Call us</b><span>1-800-GLEAM-77</span><span>Mon–Fri, 8am–6pm. After 6pm, someone else answers.</span></div>
      <div class="ci"><b>Product recalls</b><span>There are no active recalls. There have never been any recalls.</span></div>
      <details class="faq-mini"><summary>Does the Forever Smile™ hurt?</summary><p>Only until it doesn't.</p></details>
      <details class="faq-mini"><summary>Why is the window on Room 7 painted over?</summary><p>Room 7 is closed for renovation.</p></details>
      <details class="faq-mini"><summary>There's a filling in my veneer kit that isn't mine.</summary><p>Please don't throw it away. Mail it to the clinic in the envelope provided, along with your name and address.</p></details>
    </div>
    <form class="apply" id="contact-form"><h2>Send a message</h2>
      <div class="f-row"><label for="c-name">Your name</label><input id="c-name" required autocomplete="name"></div>
      <div class="f-row"><label for="c-email">Email</label><input id="c-email" type="email" required autocomplete="email"></div>
      <div class="f-row"><label for="c-msg">Message</label><textarea id="c-msg" rows="5" required></textarea></div>
      <button class="btn btn-red" type="submit">Send message</button>
      <div class="apply-result" id="contact-result" role="status" hidden></div>
    </form>
  </div></section>`);
}
function mountContact() {
  listen($('#contact-form'), 'submit', e => {
    e.preventDefault(); const r = $('#contact-result'); r.hidden = false; r.className = 'apply-result done';
    r.innerHTML = `<b>Thanks, ${esc($('#c-name').value.trim().split(' ')[0] || 'friend')}!</b><p>Someone from the Gleamwell family will make a house call to discuss your message in person. Please leave the porch light on and your mouth open.</p>`;
    later(7000, () => { toast("They're on their way."); AU.knock(0, .5); AU.knock(.35, .5); });
  });
}

/* ---------- STAFF LOGIN ---------- */
function pageLogin() {
  return `<div class="login-wrap crt"><div class="login-card" id="login-card">
    <div class="login-head"><span class="gh-badge">GW</span><div><b>Gleamwell Staff Access</b><small>Authorized personnel only. All access is logged and kept forever.</small></div></div>
    <label for="code" class="login-label">Enter your 5-digit staff code</label>
    <div class="code-boxes" id="code-boxes" aria-hidden="true">${'<span></span>'.repeat(5)}</div>
    <input id="code" class="code-input" inputmode="numeric" pattern="[0-9]*" maxlength="5" autocomplete="off" aria-describedby="login-msg">
    <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLR', 0, '⏎'].map(k => `<button type="button" data-k="${k}" ${k === 'CLR' ? 'aria-label="Clear"' : k === '⏎' ? 'aria-label="Enter"' : ''}>${k}</button>`).join('')}</div>
    <p id="login-msg" class="login-msg" role="status">${isUnlocked() ? 'This terminal remembers you.' : '&nbsp;'}</p>
    <a href="#home" class="login-back">← Back to gleamwell.com</a>
  </div></div>`;
}
let loginFails = 0;
function mountLogin() {
  const input = $('#code'), boxes = $$('#code-boxes span'), msg = $('#login-msg'), card = $('#login-card');
  const show = () => boxes.forEach((b, i) => { b.textContent = input.value[i] ? '•' : ''; b.classList.toggle('on', i === input.value.length); });
  later(50, () => input.focus());
  let busy = false;
  async function submit() {
    if (busy || input.value.length < 5) return; busy = true;
    if (input.value === CODE) {
      AU.init(); [660, 880, 990].forEach((f, i) => AU.tone(f, .1, { type: 'square', gain: .05, when: i * .12 }));
      for (const line of ['VERIFYING ATTENDANT…', 'CHECKING PULSE… 112 BPM', 'SMILE DETECTED', 'WELCOME BACK, ATTENDANT #0447']) { msg.textContent = line; msg.className = 'login-msg ok'; await wait(650); if (!msg.isConnected) return; }
      store.set('gh-unlocked', '1'); location.hash = '#portal'; return;
    }
    loginFails++; AU.buzz(); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    const lines = ['Incorrect code.', "That isn't your number.", 'Are you staff, or are you a patient?', 'Stop guessing.'];
    msg.textContent = lines[Math.min(loginFails - 1, 3)]; msg.className = 'login-msg bad';
    if (loginFails === 4) { await wait(500); await jumpscare('face2', { line: 'STOP GUESSING' }); }
    if (loginFails > 4) msg.textContent = ['We know which house is yours.', 'Find the numbers.', 'They are on the website. They have always been on the website.'][(loginFails - 5) % 3];
    input.value = ''; show(); busy = false;
  }
  listen(input, 'input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 5); AU.beep(700 + input.value.length * 60); show(); if (input.value.length === 5) submit(); });
  listen(input, 'keydown', e => { if (e.key === 'Enter') submit(); });
  $$('.keypad button').forEach(b => listen(b, 'click', () => {
    AU.init(); const k = b.dataset.k;
    if (k === 'CLR') input.value = ''; else if (k === '⏎') { submit(); return; } else if (input.value.length < 5) input.value += k;
    AU.beep(700 + input.value.length * 60); show(); if (input.value.length === 5) submit();
  }));
  show();
}

/* ---------- 404 ---------- */
function page404(name) {
  return publicShell('', `<section class="page-head p404"><div class="wrap"><span class="kicker">Error 404</span><h1>This page has been extracted.</h1><p class="lead">We couldn't find <b>#${esc(name)}</b>. It was here a moment ago. It was making a noise.</p><canvas id="c404" width="200" height="250" aria-hidden="true"></canvas><p><a class="btn btn-red" href="#home">Go home</a></p></div></section>`);
}
function mount404() { const c = $('#c404'); c.getContext('2d').drawImage(renderFace({ w: 200, h: 250, seed: 404, smile: 1, open: .2, teeth: true, eyes: 'closed', mode: 'gray', bg: [.92, .9, .86], hair: 0, grain: .08 }), 0, 0); later(4000, () => { if (!c.isConnected) return; c.getContext('2d').drawImage(renderFace({ w: 200, h: 250, seed: 404, smile: 1, open: .2, teeth: true, eyeOpen: 1.5, irisR: .025, mode: 'gray', bg: [.92, .9, .86], hair: 0, grain: .08 }), 0, 0); AU.sting(); }); }
