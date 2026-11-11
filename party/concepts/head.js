/* PARTY DOCTOR PARTY: the travelling paper-cut head.
   One head lives on the page and hops between "stations" as you scroll, in stop-motion steps:
     hero (doctoral hat) -> robe (lands on a gown) -> plot (becomes the data point) -> rsvp (party hat)
   Markup it looks for:
     <div class="pdp-station" data-station data-hat="#accent" data-hat2="#second"></div>   any box to sit in
     <div class="pdp-robe" data-station data-c1="#velvet" data-c2="#hood"><div class="slot" data-slot></div></div>
     <div class="pdp-plot" data-plot data-station></div>
     data-hattype="party" on a station switches the hat. */
(() => {
  const BASE = (document.currentScript && document.currentScript.src.replace(/head\.js.*$/, '')) || '';
  const HEADS = {
    f00_0: { crown: [50.77, 20.77], roll: -3.7 },
    f26_0: { crown: [43.75, 13.27], roll: 1.1 },
    f27_0: { crown: [45.48, 13.08], roll: 3.0 },
    f02_0: { crown: [57.6, 16.15], roll: -7.6 },
    f01_0: { crown: [67.98, 9.42], roll: -16.5, noHat: true },
    f18_3: { crown: [25.29, 15.0], roll: 12.3 }
  };
  // Where the head comes to rest after a flip or a fall: mostly the neutral face, but not always.
  const REST = [['f00_0', 5], ['f26_0', 2.2], ['f27_0', 2.2], ['f02_0', 1.6], ['f01_0', 0.9], ['f18_3', 0.6]];
  const FACES = Object.keys(HEADS);
  function pickRest(prev) {
    const opts = REST.filter(([n]) => n === 'f00_0' || n !== prev);   // only the neutral face may repeat
    let r = Math.random() * opts.reduce((t, [, w]) => t + w, 0);
    for (const [n, w] of opts) if ((r -= w) < 0) return n;
    return 'f00_0';
  }
  function clipSequence(from) {          // 4-6 shuffled faces, never the same twice in a row, ending on a weighted pick
    const seq = []; let last = from;
    const len = 4 + Math.floor(Math.random() * 3);
    while (seq.length < len) { const n = FACES[Math.floor(Math.random() * FACES.length)]; if (n !== last) { seq.push(n); last = n; } }
    let end = pickRest(last); if (end === last) end = 'f00_0';
    seq.push(end); return seq;
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const src = (n, v) => (window.PDP_HEADS && window.PDP_HEADS[`${n}_${v}`]) || `${BASE}heads/${n}_${v}.webp`;
  Object.keys(HEADS).forEach(n => [0, 1, 2].forEach(v => { const i = new Image(); i.src = src(n, v); }));
  const PAPER = '#faf7f0', INK = '#17131c';

  const st = document.createElement('style');
  st.textContent = `
  .pdp-station { aspect-ratio:1; }
  .pdp-traveler { position:absolute; left:0; top:0; width:120px; aspect-ratio:1; z-index:40; cursor:pointer; transform-origin:50% 50%; -webkit-tap-highlight-color:transparent; }
  .pdp-traveler img { position:absolute; inset:0; width:100%; height:100%; user-select:none; -webkit-user-drag:none;
    filter:drop-shadow(0 3px 0 rgba(0,0,0,.18)) drop-shadow(0 10px 14px rgba(0,0,0,.18)); }
  .pdp-traveler .hat { position:absolute; pointer-events:none; filter:drop-shadow(0 2px 0 rgba(0,0,0,.2)); }
  .pdp-traveler .hat[hidden] { display:none; }
  .letter-row { display:grid; gap:24px; align-items:end; }
  @media (min-width:720px) { .letter-row { grid-template-columns:1fr 210px; gap:40px; } }
  .pdp-robe { position:relative; width:min(190px,52vw); justify-self:center; }
  .pdp-robe::before { content:""; display:block; padding-top:85%; } /* head room, % of the robe's own width */
  html, body { overflow-x:clip; }
  /* the head can hang past the screen edge (leaning robe); a clipping layer keeps phones from widening the page */
  body { position:relative; }
  .pdp-layer { position:absolute; inset:0; overflow:clip; pointer-events:none; z-index:40; }
  .pdp-layer .pdp-traveler { pointer-events:auto; }
  @media (max-width:719px) {   /* phones: the robe leans in from outside the right edge, next to the letter */
    .letter-row { grid-template-columns:1fr 64px; gap:6px; align-items:center; }
    .letter-row .pdp-robe { width:134px; justify-self:start; margin-left:14px; transform:rotate(-11deg); transform-origin:50% 100%; }
  }
  .pdp-robe .slot { position:absolute; left:-6%; width:112%; aspect-ratio:1; top:0; margin-top:16%; }
  .pdp-robe svg { display:block; width:100%; height:auto; filter:drop-shadow(0 3px 0 rgba(0,0,0,.15)) drop-shadow(0 10px 14px rgba(0,0,0,.15)); }
  .pdp-plot { --plot-ink:#1b1b1f; --plot-accent:#e8458b; --plot-band:#e8458b; position:relative; }
  .pdp-plot svg { display:block; width:100%; height:auto; overflow:visible; font-family:inherit; }
  .pdp-plot .ctl { display:grid; gap:6px; margin-top:14px; }
  .pdp-plot .ctl label { font-weight:700; font-size:16px; }
  .pdp-plot .ctl output { font-size:15px; opacity:.85; }
  .pdp-plot input[type=range] { width:100%; accent-color:var(--plot-accent); height:28px; cursor:pointer; }`;
  document.head.appendChild(st);

  /* ---------- hats ---------- */
  const mortarSVG = (acc) => `<svg class="hat mortar" viewBox="0 0 140 92" aria-hidden="true">
    <path d="M30 32 V56 Q70 74 110 56 V32 Z" fill="#2a2530" stroke="${PAPER}" stroke-width="5" paint-order="stroke"/>
    <path d="M70 6 L136 27 L70 48 L4 27 Z" fill="${INK}" stroke="${PAPER}" stroke-width="6" stroke-linejoin="round" paint-order="stroke"/>
    <g class="tassel"><path d="M70 27 L124 31 L124 62" fill="none" stroke="${acc}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M119 60 h10 l3 18 h-16 z" fill="${acc}" stroke="${PAPER}" stroke-width="2.5" paint-order="stroke"/></g>
    <circle cx="70" cy="27" r="4.5" fill="${acc}"/>
  </svg>`;
  const partySVG = (c1, c2) => `<svg class="hat party" viewBox="0 0 100 124" aria-hidden="true">
    <path d="M50 10 L88 110 Q50 120 12 110 Z" fill="${c1}" stroke="${PAPER}" stroke-width="6" stroke-linejoin="round" paint-order="stroke"/>
    <g fill="${c2}"><path d="M38 42 L62 42 L66 52 L34 52 Z"/><path d="M28 70 L72 70 L76 80 L24 80 Z"/></g>
    <path d="M12 110 Q50 120 88 110 L90 116 Q50 127 10 116 Z" fill="${c2}" stroke="${PAPER}" stroke-width="3" paint-order="stroke"/>
    <g transform="translate(50 9)"><path d="M0 -10 L3 -3 L10 -4 L5 1 L8 8 L0 4 L-8 8 L-5 1 L-10 -4 L-3 -3 Z" fill="${c2}" stroke="${PAPER}" stroke-width="3" paint-order="stroke" stroke-linejoin="round"/></g>
  </svg>`;

  /* ---------- robe ---------- */
  const robeSVG = (c1, c2) => `<svg viewBox="0 0 300 360" aria-hidden="true">
    <path d="M150 36 C120 36 96 44 70 60 L28 96 C14 150 8 210 6 262 L66 270 L76 172 L70 354 L230 354 L224 172 L234 270 L294 262 C292 210 286 150 272 96 L230 60 C204 44 180 36 150 36 Z"
      fill="#1d1a22" stroke="${PAPER}" stroke-width="7" stroke-linejoin="round" paint-order="stroke"/>
    <g stroke="${c1}" stroke-width="9" stroke-linecap="round"><path d="M20 156 L62 162"/><path d="M17 180 L62 186"/><path d="M14 204 L62 210"/>
      <path d="M280 156 L238 162"/><path d="M283 180 L238 186"/><path d="M286 204 L238 210"/></g>
    <g stroke="${c1}" stroke-width="13"><path d="M134 72 L124 352"/><path d="M166 72 L176 352"/></g>
    <path d="M104 46 L150 128 L196 46 Q150 66 104 46 Z" fill="${c2}" stroke="${PAPER}" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/>
    <path d="M134 38 L150 66 L166 38 Z" fill="${PAPER}"/>
  </svg>`;
  document.querySelectorAll('.pdp-robe').forEach(r => r.insertAdjacentHTML('beforeend', robeSVG(r.dataset.c1 || '#e8458b', r.dataset.c2 || '#19a7d8')));

  /* ---------- plot ---------- */
  // Drawn in a 640-unit-wide viewBox; text sizes are set in screen pixels and converted, so labels stay readable on phones.
  const W = 640;
  let H = 300, L = 30, R = 30, T = 40, B = 60, PW = 0, PH = 0, k = 1;
  const f = x => 0.06 + 0.86 * Math.pow(x, 1.8) - 0.16 * Math.exp(-Math.pow((x - 0.6) / 0.06, 2));
  const X = x => L + x * PW, Y = y => T + (1 - y) * PH;
  let plot = null, head = null;
  const PT = {
    en: { x: 'How much doctor (x) →', doctor: 'doctor', pred: 'Predicted', done: 'A doctor. Time to party.', party: '19 Dec: party',
      good: ['Happiness and success', 'Humility', 'Kindness', 'Curiosity', 'Generosity', 'Patience', 'Gratitude', 'Calm', 'Wisdom', 'Modesty'],
      bad: ['Megalomania', 'Pretentiousness', 'Smugness', 'Self-importance', 'Jargon', 'Vanity'] },
    sv: { x: 'Hur mycket doktor (x) →', doctor: 'doktor', pred: 'Förväntad', done: 'Doktor. Dags att festa.', party: '19 dec: fest',
      good: ['Lycka och framgång', 'Ödmjukhet', 'Vänlighet', 'Nyfikenhet', 'Generositet', 'Tålamod', 'Tacksamhet', 'Lugn', 'Visdom', 'Blygsamhet'],
      bad: ['Storhetsvansinne', 'Pretentiöshet', 'Självgodhet', 'Självupptagenhet', 'Jargong', 'Fåfänga'] }
  };
  let LANG = (document.documentElement.lang || 'en').slice(0, 2) === 'sv' ? 'sv' : 'en';
  window.PDP_setLang = l => { LANG = l === 'sv' ? 'sv' : 'en'; if (plot) plot.redraw(); };
  document.querySelectorAll('[data-plot]').forEach(el => {
    el.innerHTML = `<div class="plotbox"></div>
    <div class="ctl"><label for="pdpx">x = <b class="xv">20%</b> <span class="xd">${PT[LANG].doctor}</span></label>
      <input id="pdpx" type="range" min="0" max="100" step="1" value="20">
      <output class="yv"></output></div>`;
    const box = el.querySelector('.plotbox'), input = el.querySelector('input');
    const xv = el.querySelector('.xv'), yv = el.querySelector('.yv');
    let svg, pt, ylab, drawnFor = 0;

    function draw() {
      const cw = el.clientWidth || 600;
      if (Math.abs(cw - drawnFor) < 2) return; drawnFor = cw;
      k = W / cw;                                   // viewBox units per screen pixel
      const px = p => +(p * k).toFixed(1);
      const fsTick = px(cw < 520 ? 13 : 14), fsLab = px(cw < 520 ? 14 : 15), fsNote = px(cw < 520 ? 12 : 13);
      H = cw < 520 ? Math.round(W * 0.62) : 300;    // a little taller on phones
      L = fsTick * 1.1; R = fsTick * 1.6; T = fsLab * 2.1; B = fsTick * 1.9 + fsLab * 1.7;
      PW = W - L - R; PH = H - T - B;
      let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += rnd(); return (s - 3) / 1.1; };
      const xs = Array.from({ length: 101 }, (_, i) => i / 100);
      const line = xs.map((x, i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`).join('');
      const band = xs.map((x, i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(Math.min(1, f(x) + 0.05 + 0.08 * (1 - x))).toFixed(1)}`).join('')
        + xs.slice().reverse().map(x => `L${X(x).toFixed(1)} ${Y(Math.max(0, f(x) - 0.05 - 0.08 * (1 - x))).toFixed(1)}`).join('') + 'Z';
      const dots = Array.from({ length: 34 }, () => { const x = rnd() * 0.96 + 0.02; const y = Math.min(.98, Math.max(.02, f(x) + gauss() * 0.075)); return `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="${px(3)}"/>`; }).join('');
      const ticks = [0, .25, .5, .75, 1].map(t => `<path d="M${X(t)} ${T + PH} v${px(4)}"/><text x="${X(t)}" y="${T + PH + fsTick * 1.45}" text-anchor="middle" stroke="none">${Math.round(t * 100)}%</text>`).join('');
      box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Plot: the y axis rises with how much doctor">
        <g fill="none" stroke="var(--plot-ink)" stroke-width="${px(1.6)}"><path d="M${L} ${T - px(6)} V${T + PH} H${L + PW + px(4)}"/></g>
        <g stroke="var(--plot-ink)" stroke-width="${px(1.2)}" fill="var(--plot-ink)" font-size="${fsTick}">${ticks}</g>
        <path d="${band}" fill="var(--plot-band)" opacity=".16"/>
        <g fill="var(--plot-ink)" opacity=".38">${dots}</g>
        <path d="${line}" fill="none" stroke="var(--plot-accent)" stroke-width="${px(3)}" stroke-linecap="round"/>
        <path d="M${X(1)} ${T} V${T + PH}" stroke="var(--plot-ink)" stroke-width="${px(1)}" stroke-dasharray="${px(3)} ${px(4)}" opacity=".6"/>
        <text x="${X(1) - px(6)}" y="${T + PH - px(8)}" text-anchor="end" font-size="${fsNote}" font-weight="700" fill="var(--plot-ink)">${PT[LANG].party}</text>
        <text x="${X(1)}" y="${T - fsLab * 0.75}" text-anchor="end" font-size="${fsNote}" fill="var(--plot-ink)" opacity=".7">n = 1</text>
        <text class="ylab" x="${L - px(2)}" y="${T - fsLab * 0.75}" font-size="${fsLab}" font-weight="700" fill="var(--plot-ink)"></text>
        <text x="${L + PW / 2}" y="${H - fsLab * 0.4}" text-anchor="middle" font-size="${fsLab}" font-weight="700" fill="var(--plot-ink)">${PT[LANG].x}</text>
        <circle class="pt" r="${px(4)}" fill="none" stroke="var(--plot-accent)" stroke-width="${px(2)}"/>
      </svg>`;
      svg = box.querySelector('svg'); pt = box.querySelector('.pt'); ylab = box.querySelector('.ylab');
      if (plot) { ylab.textContent = '↑ ' + plot.trait + ' (y)'; plot.update(); }
    }

    plot = {
      x: 0.2, kind: 'good', ti: 0,
      get trait() { return PT[LANG][this.kind][this.ti]; },
      redraw() { drawnFor = 0; draw(); el.querySelector('.xd').textContent = PT[LANG].doctor; },
      point() { const r = svg.getBoundingClientRect(); return { x: r.left + scrollX + X(this.x) / W * r.width, y: r.top + scrollY + Y(f(this.x)) / H * r.height, w: Math.max(84, Math.min(130, r.width * 0.2)) }; },
      update() {
        pt.setAttribute('cx', X(this.x)); pt.setAttribute('cy', Y(f(this.x)));
        xv.textContent = Math.round(this.x * 100) + '%';
        yv.textContent = this.x >= 1 ? `y = 0.92 ${this.trait.toLowerCase()}. ${PT[LANG].done}` : `${PT[LANG].pred} ${this.trait.toLowerCase()}: y = ${f(this.x).toFixed(2)}`;
      }
    };
    draw();
    addEventListener('resize', () => { draw(); if (head) head.follow(); });
    input.addEventListener('input', () => { plot.x = input.value / 100; plot.update(); if (head) head.follow(); });
    // The y axis keeps changing its mind: a short blink of something bad, then it lands on something good.
    const setTrait = (kind, i) => { plot.kind = kind; plot.ti = i; ylab.textContent = '↑ ' + plot.trait + ' (y)'; plot.update(); };
    const rnd = n => Math.floor(Math.random() * n);
    let lastGood = 0;
    if (!reduce) setInterval(() => {
      setTrait('bad', rnd(PT.en.bad.length));
      setTimeout(() => { let g; do { g = rnd(PT.en.good.length); } while (g === lastGood); lastGood = g; setTrait('good', g); }, 420 + Math.random() * 260);
    }, 3400);
  });

  /* ---------- the travelling head ---------- */
  const stations = [...document.querySelectorAll('[data-station]')];
  if (!stations.length) return;
  const first = stations[0];
  const C1 = first.dataset.hat || '#e8458b', C2 = first.dataset.hat2 || '#f7c934';
  const el = document.createElement('div');
  el.className = 'pdp-traveler';
  el.innerHTML = `<img alt="Jesper's head in a hat" draggable="false">${mortarSVG(C1)}${partySVG(C1, C2)}`;
  const layer = document.createElement('div'); layer.className = 'pdp-layer';
  layer.appendChild(el); document.body.appendChild(layer);
  const img = el.querySelector('img'), mortar = el.querySelector('.mortar'), party = el.querySelector('.party'), tassel = el.querySelector('.tassel');

  let name = 'f00_0', v = 0, wob = 0, busy = false, moving = false, at = 0, hatType = 'mortar';
  const cur = { x: 0, y: 0, w: 120, rot: 0 };
  const hatFor = i => stations[i].dataset.hattype === 'party' ? 'party' : 'mortar';

  function paint() {
    const h = HEADS[name];
    img.src = src(name, v);
    const showHat = !h.noHat;
    // SVG elements ignore .hidden, so toggle display directly
    mortar.style.display = showHat && hatType === 'mortar' ? '' : 'none';
    party.style.display = showHat && hatType === 'party' ? '' : 'none';
    const sway = [0, -3, 2][wob % 3];
    if (hatType === 'mortar') {
      mortar.style.width = '50%';
      mortar.style.left = (h.crown[0] - 25) + '%';
      mortar.style.top = (h.crown[1] - 14) + '%';
      mortar.style.transform = `rotate(${-h.roll + 3 + sway}deg)`;
      mortar.style.transformOrigin = '50% 70%';
      tassel.style.transform = `rotate(${[0, 6, -4][wob % 3]}deg)`; tassel.style.transformOrigin = '124px 31px';
    } else {
      party.style.width = '30%';
      party.style.left = (h.crown[0] - 15) + '%';
      party.style.top = (h.crown[1] - 31) + '%';
      party.style.transform = `rotate(${-h.roll + 10 + sway}deg)`;
      party.style.transformOrigin = '50% 96%';
    }
    el.style.left = cur.x + 'px'; el.style.top = cur.y + 'px'; el.style.width = cur.w + 'px';
    el.style.transform = `rotate(${cur.rot}deg)`;
    dispatchEvent(new Event('pdp-move'));
  }

  function target(i) {
    const s = stations[i];
    if (s.hasAttribute('data-plot') && plot) { const p = plot.point(); return { x: p.x - p.w * 0.5, y: p.y - p.w * 0.56, w: p.w, rot: 0 }; }
    const box = s.querySelector('[data-slot]') || s, r = box.getBoundingClientRect();
    const m = getComputedStyle(s).transform, mm = m && m !== 'none' ? m.match(/matrix\(([^)]+)\)/) : null;
    const rot = mm ? Math.atan2(+mm[1].split(',')[1], +mm[1].split(',')[0]) * 180 / Math.PI : 0;
    const w = box.offsetWidth || r.width, cx = r.left + r.width / 2 + scrollX, cy = r.top + r.height / 2 + scrollY;
    return { x: cx - w / 2, y: cy - w / 2, w, rot };
  }

  function activeIndex() {
    let a = 0;
    const R = stations.map(s => s.getBoundingClientRect());
    // Move on when the next stop peeks in and you're past the current one, or when the current one is nearly gone.
    // The hero lets go as soon as the next stop peeks in; the plot holds on longer so the slider can be played with.
    const leave = i => i === 0 ? 1 : stations[i].hasAttribute('data-plot') ? 0.28 : 0.45;
    for (let i = 1; i < R.length; i++) {
      const prevC = R[i - 1].top + R[i - 1].height / 2;
      if ((R[i].top < innerHeight * 0.88 && prevC < innerHeight * leave(i - 1)) || prevC < innerHeight * 0.12) a = i;
    }
    return a;
  }

  let timer = null;
  function travel(to) {
    clearTimeout(timer);
    const t = target(to), from = { ...cur }, down = t.y > from.y, dir = Math.random() < .5 ? -1 : 1;
    const nextHat = hatFor(to);
    at = to;
    if (reduce) { Object.assign(cur, t); hatType = nextHat; paint(); return; }
    const N = 7, frames = [];
    for (let k = 1; k <= N; k++) {
      const u = k / N, e = down ? u * u : 1 - (1 - u) * (1 - u);
      frames.push({ x: from.x + (t.x - from.x) * u, y: from.y + (t.y - from.y) * e, w: from.w + (t.w - from.w) * u, rot: from.rot + (t.rot - from.rot) * u + dir * Math.sin(u * Math.PI) * 24 });
    }
    if (down) frames.push({ ...t, y: t.y - t.w * 0.06, rot: t.rot - dir * 4 }, { ...t });
    moving = true;
    let k = 0;
    (function step() {
      Object.assign(cur, frames[k]); v = (v + 1) % 3; wob++;
      if (k >= Math.floor(frames.length / 2)) hatType = nextHat;
      paint();
      if (++k < frames.length) timer = setTimeout(step, 85);
      else { moving = false; if (!busy) name = pickRest(name); Object.assign(cur, target(at)); paint(); const a = activeIndex(); if (a !== at) travel(a); }
    })();
  }

  function snap() { if (moving) return; Object.assign(cur, target(at)); paint(); }
  head = { follow() { if (stations[at].hasAttribute('data-plot')) snap(); } };

  // RSVP button: scroll down slowly, stopping at each station so the fall can be watched.
  let touring = false, stop = false;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const glide = (y, ms) => new Promise(res => {
    const y0 = scrollY, d = y - y0, t0 = performance.now();
    (function f(t) {
      if (stop) return res();
      const u = Math.min(1, (t - t0) / ms), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      scrollTo(0, y0 + d * e); u < 1 ? requestAnimationFrame(f) : res();
    })(t0);
  });
  async function tour(ev) {
    if (ev) ev.preventDefault();
    if (touring) return;
    const last = stations[stations.length - 1].closest('section') || stations[stations.length - 1];
    if (reduce) { last.scrollIntoView(); return; }
    touring = true; stop = false;
    for (let i = at + 1; i < stations.length && !stop; i++) {
      const r = (stations[i].querySelector('[data-slot]') || stations[i]).getBoundingClientRect();
      const y = i === stations.length - 1 ? scrollY + last.getBoundingClientRect().top - 20 : scrollY + r.top - innerHeight * 0.3;
      await glide(Math.max(0, y), 1500);
      for (let w = 0; w < 30 && !stop && (moving || at < i); w++) await sleep(80);   // wait for the landing
      if (i < stations.length - 1) await sleep(700);
    }
    touring = false;
  }
  ['wheel', 'touchstart', 'keydown'].forEach(e => addEventListener(e, () => { if (touring) stop = true; }, { passive: true }));
  document.querySelectorAll('[data-pdp-tour]').forEach(b => b.addEventListener('click', tour));

  at = activeIndex(); hatType = hatFor(at); Object.assign(cur, target(at)); paint();
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { ticking = false; const a = activeIndex(); if (a !== at && !moving) travel(a); });
  }, { passive: true });
  addEventListener('resize', snap);
  if (document.fonts) document.fonts.ready.then(snap);
  addEventListener('load', snap);
  if ('ResizeObserver' in window) new ResizeObserver(() => snap()).observe(document.body);

  if (reduce) return;
  setInterval(() => { if (!busy && !moving) { v = (v + 1) % 3; wob++; paint(); } }, 260);   // the boil
  function clip() {
    if (busy || moving) return; busy = true;
    const seq = clipSequence(name); let i = 0;
    (function step() {
      name = seq[i]; v = i % 3; wob++; paint();
      if (++i < seq.length) setTimeout(step, 340); else { busy = false; }
    })();
  }
  el.addEventListener('click', clip);
  setTimeout(clip, 1400);
  setInterval(() => { if (at === 0) clip(); }, 11000);
})();
