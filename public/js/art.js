// SOVA art: the animated owl, picture-button icons and story scenes (all inline SVG, no image files).

export const C = {
  cream: '#FBF3E4', teal: '#4EB3A8', gold: '#F4C45A', terra: '#E07A5F', leaf: '#7CB342',
  navy: '#1B3A4B', amber: '#E8A838', caramel: '#C98B4E', honey: '#E3A857', peach: '#F6A27A',
};

/* ---------------- Sova the owl ---------------- */
export function owlSVG(accessory = 'scarf', opts = {}) {
  const { outfit = 'none', costume = null } = opts;
  if (costume) accessory = 'none';
  if (outfit !== 'none' && !costume && ['bandana', 'goggles', 'crown'].includes(accessory) && OUTFIT_HEAD.has(outfit)) accessory = 'scarf';
  const acc = {
    scarf: `<path d="M62 150 Q100 172 138 150 L136 164 Q100 184 64 164Z" fill="${C.teal}"/><path d="M124 160 l16 30 l-14 4 l-10 -28z" fill="${C.teal}"/>`,
    bandana: `<path d="M48 70 Q100 40 152 70 L150 84 Q100 60 50 84Z" fill="${C.leaf}"/><path d="M146 76 l22 -10 l-6 18z M146 80 l20 10 l-18 4z" fill="#5E9A2E"/><circle cx="80" cy="62" r="4" fill="#A8D672"/><circle cx="118" cy="60" r="4" fill="#A8D672"/>`,
    helmet: `<ellipse cx="100" cy="98" rx="84" ry="80" fill="rgba(190,230,255,.28)" stroke="#E9F6FF" stroke-width="6"/><path d="M40 60 Q60 30 92 24" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/><rect x="58" y="160" width="84" height="16" rx="8" fill="#DDE6EE" stroke="#9FB3C2" stroke-width="3"/><circle cx="100" cy="168" r="4" fill="${C.terra}"/>`,
    goggles: `<rect x="40" y="58" width="120" height="12" rx="6" fill="#B23A2B"/><circle cx="74" cy="64" r="20" fill="rgba(255,120,90,.35)" stroke="#D84B36" stroke-width="7"/><circle cx="126" cy="64" r="20" fill="rgba(255,120,90,.35)" stroke="#D84B36" stroke-width="7"/><circle cx="68" cy="58" r="5" fill="#fff" opacity=".8"/><circle cx="120" cy="58" r="5" fill="#fff" opacity=".8"/>`,
    crown: `<path d="M50 52 Q100 30 150 52" stroke="#5E9A2E" stroke-width="6" fill="none"/>${[[56,50,C.terra],[78,40,C.gold],[100,36,'#E86AA6'],[122,40,C.gold],[144,50,C.terra]].map(([x,y,c])=>`<g transform="translate(${x} ${y})"><circle r="8" fill="${c}"/><circle r="3.5" fill="#FFF3C4"/></g>`).join('')}<path d="M64 46 q-8 -10 2 -14 M136 46 q8 -10 -2 -14" stroke="${C.leaf}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  }[accessory] || '';
  const front = accessory === 'helmet' || accessory === 'goggles' || accessory === 'crown' || accessory === 'bandana';
  return `
<svg class="owl" viewBox="0 0 200 210" role="img" aria-label="Sova the owl">
  <ellipse cx="100" cy="200" rx="58" ry="8" fill="rgba(27,58,75,.15)"/>
  ${outfit === 'cape' && !costume ? OUTFITS_SVG.cape : ''}
  <g class="owl-body">
    <path d="M52 36 L66 66 L44 70Z" fill="${C.caramel}"/><path d="M148 36 L134 66 L156 70Z" fill="${C.caramel}"/>
    <g class="wing wing-l"><path d="M44 104 Q16 130 34 176 Q52 170 60 140Z" fill="${C.caramel}"/></g>
    <g class="wing wing-r"><path d="M156 104 Q184 130 166 176 Q148 170 140 140Z" fill="${C.caramel}"/></g>
    <ellipse cx="100" cy="118" rx="64" ry="76" fill="${C.honey}"/>
    <ellipse cx="100" cy="138" rx="42" ry="50" fill="${C.cream}"/>
    ${[[86,122],[104,114],[116,132],[94,146],[110,158],[84,164]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${C.gold}"/>`).join('')}
    <path d="M86 122 L104 114 L116 132 L94 146 L110 158" stroke="${C.gold}" stroke-width="1" fill="none" opacity=".7"/>
    <path d="M60 84 Q74 60 98 76 M140 84 Q126 60 102 76" fill="none"/>
    <circle cx="74" cy="84" r="26" fill="#FFF8EC"/><circle cx="126" cy="84" r="26" fill="#FFF8EC"/>
    <g class="eyes">
      <g class="eye"><circle cx="74" cy="86" r="17" fill="${C.amber}"/><circle class="pupil" cx="76" cy="88" r="9" fill="#2A1A0E"/><circle cx="80" cy="82" r="4" fill="#fff"/></g>
      <g class="eye"><circle cx="126" cy="86" r="17" fill="${C.amber}"/><circle class="pupil" cx="124" cy="88" r="9" fill="#2A1A0E"/><circle cx="128" cy="82" r="4" fill="#fff"/></g>
      <g class="lids"><rect class="lid" x="52" y="58" width="44" height="0" fill="${C.honey}"/><rect class="lid" x="104" y="58" width="44" height="0" fill="${C.honey}"/></g>
    </g>
    <path class="brow brow-l" d="M58 60 Q72 52 88 60" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path class="brow brow-r" d="M112 60 Q128 52 142 60" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g class="beak"><path class="beak-top" d="M90 104 Q100 98 110 104 L100 118Z" fill="${C.peach}"/><path class="beak-bottom" d="M93 110 L107 110 L100 124Z" fill="#E98B62"/></g>
    <ellipse cx="60" cy="112" rx="8" ry="5" fill="#F3A08A" opacity=".55"/><ellipse cx="140" cy="112" rx="8" ry="5" fill="#F3A08A" opacity=".55"/>
    <path d="M80 192 l-6 8 M86 192 v9 M92 192 l6 8 M108 192 l-6 8 M114 192 v9 M120 192 l6 8" stroke="${C.peach}" stroke-width="5" stroke-linecap="round"/>
    ${front ? '' : acc}
  </g>
  ${front ? `<g class="owl-acc">${acc}</g>` : ''}
  ${costume ? COSTUMES[costume] || '' : (outfit !== 'cape' ? OUTFITS_SVG[outfit] || '' : '')}
</svg>`;
}

/* ---------------- Small icons for picture buttons ---------------- */
const wrap = (inner, vb = '0 0 100 100') => `<svg viewBox="${vb}" aria-hidden="true">${inner}</svg>`;

export const icon = {
  egg: (c = '#F7E7C6', spots = '#E0B872') => wrap(`<ellipse cx="50" cy="56" rx="28" ry="36" fill="${c}" stroke="#C99A55" stroke-width="3"/><circle cx="40" cy="44" r="5" fill="${spots}"/><circle cx="60" cy="62" r="6" fill="${spots}"/><circle cx="46" cy="72" r="4" fill="${spots}"/>`),
  dots: (n, color = C.terra) => {
    const pos = [[50,50],[30,30,70,70],[25,25,50,50,75,75],[30,30,70,30,30,70,70,70],[25,25,75,25,50,50,25,75,75,75]][n-1] || [];
    let s = `<rect x="6" y="6" width="88" height="88" rx="18" fill="#fff" stroke="${color}" stroke-width="4"/>`;
    for (let i = 0; i < pos.length; i += 2) s += `<circle cx="${pos[i]}" cy="${pos[i+1]}" r="10" fill="${color}"/>`;
    return wrap(s);
  },
  num: (n, color = C.navy) => wrap(`<circle cx="50" cy="50" r="42" fill="#fff" stroke="${color}" stroke-width="5"/><text x="50" y="68" text-anchor="middle" font-size="52" font-weight="800" fill="${color}" font-family="Comfortaa, sans-serif">${n}</text>`),
  rock: (shape) => shape === 'triangle'
    ? wrap(`<path d="M50 12 L90 86 L10 86Z" fill="#A89A8A" stroke="#7E7064" stroke-width="4" stroke-linejoin="round"/><path d="M40 50 l10 -6" stroke="#CFC4B6" stroke-width="4" stroke-linecap="round"/>`)
    : wrap(`<ellipse cx="50" cy="56" rx="40" ry="32" fill="#A89A8A" stroke="#7E7064" stroke-width="4"/><path d="M30 46 q8 -8 16 -6" stroke="#CFC4B6" stroke-width="4" fill="none" stroke-linecap="round"/>`),
  shape: (type, color = C.teal) => {
    const s = {
      circle: `<circle cx="50" cy="50" r="38" fill="${color}"/>`,
      square: `<rect x="14" y="14" width="72" height="72" rx="8" fill="${color}"/>`,
      triangle: `<path d="M50 10 L92 86 L8 86Z" fill="${color}" stroke-linejoin="round"/>`,
      star: `<path d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 72 L21 92 L32 58 L4 38 L38 38Z" fill="${color}"/>`,
    }[type];
    return wrap(s);
  },
  foot: (size) => { const k = size === 'big' ? 1 : .55; return wrap(`<g transform="translate(50 54) scale(${k})"><ellipse cx="0" cy="12" rx="26" ry="30" fill="#8C6A4B"/><ellipse cx="-22" cy="-24" rx="9" ry="13" fill="#8C6A4B"/><ellipse cx="0" cy="-32" rx="9" ry="13" fill="#8C6A4B"/><ellipse cx="22" cy="-24" rx="9" ry="13" fill="#8C6A4B"/></g>`); },
  car: (color = '#E04B3A') => wrap(`<path d="M10 62 Q12 44 28 42 L38 28 Q42 24 50 24 L66 24 Q72 24 76 30 L84 42 Q92 44 92 62 L92 68 L10 68Z" fill="${color}"/><path d="M40 30 L50 30 L50 42 L32 42Z M56 30 L68 30 L76 42 L56 42Z" fill="#CFEFFF"/><circle cx="30" cy="70" r="11" fill="#2B2B2B"/><circle cx="30" cy="70" r="4" fill="#ccc"/><circle cx="74" cy="70" r="11" fill="#2B2B2B"/><circle cx="74" cy="70" r="4" fill="#ccc"/><circle cx="88" cy="52" r="3" fill="#FFE58A"/>`),
  garage: (color) => wrap(`<path d="M8 40 L50 10 L92 40 L92 92 L8 92Z" fill="${color}"/><rect x="22" y="48" width="56" height="44" rx="4" fill="#F4EEE2"/><path d="M22 60 h56 M22 72 h56 M22 84 h56" stroke="#D8CFC0" stroke-width="3"/>`),
  sign: (type) => ({
    triangle: wrap(`<rect x="46" y="60" width="8" height="38" fill="#777"/><path d="M50 6 L92 70 L8 70Z" fill="#fff" stroke="#E04B3A" stroke-width="9" stroke-linejoin="round"/><text x="50" y="60" text-anchor="middle" font-size="28" font-weight="900" fill="#333">!</text>`),
    circle: wrap(`<rect x="46" y="60" width="8" height="38" fill="#777"/><circle cx="50" cy="38" r="32" fill="#3D7DD8" stroke="#fff" stroke-width="5"/><path d="M36 38 a14 14 0 1 1 6 12" stroke="#fff" stroke-width="5" fill="none"/><path d="M38 52 l6 -2 l-4 -6" fill="#fff"/>`),
    square: wrap(`<rect x="46" y="60" width="8" height="38" fill="#777"/><rect x="18" y="8" width="64" height="60" rx="6" fill="#3D7DD8" stroke="#fff" stroke-width="4"/><text x="50" y="52" text-anchor="middle" font-size="34" font-weight="900" fill="#fff" font-family="sans-serif">P</text>`),
  })[type],
  turtle: () => wrap(`<ellipse cx="50" cy="58" rx="32" ry="22" fill="#6FA83E"/><path d="M30 56 Q50 30 70 56" fill="#8BC34A" stroke="#4E7D27" stroke-width="3"/><circle cx="86" cy="58" r="10" fill="#9CCC65"/><circle cx="89" cy="55" r="2" fill="#222"/><rect x="26" y="72" width="10" height="12" rx="4" fill="#9CCC65"/><rect x="62" y="72" width="10" height="12" rx="4" fill="#9CCC65"/>`),
  rocket: () => wrap(`<path d="M50 6 Q72 26 70 64 L30 64 Q28 26 50 6Z" fill="#F4EEE2" stroke="#9FB3C2" stroke-width="3"/><circle cx="50" cy="34" r="9" fill="#7FC7F0" stroke="#5B8BA8" stroke-width="3"/><path d="M30 50 L16 70 L30 66Z M70 50 L84 70 L70 66Z" fill="${C.terra}"/><path d="M38 66 Q50 96 62 66Z" fill="${C.gold}"/><path d="M44 66 Q50 84 56 66Z" fill="${C.terra}"/>`),
  moon: (phase) => {
    if (phase === 'full') return wrap(`<circle cx="50" cy="50" r="38" fill="#FFF1B8"/><circle cx="38" cy="40" r="6" fill="#EADB98"/><circle cx="60" cy="62" r="8" fill="#EADB98"/>`);
    if (phase === 'half') return wrap(`<circle cx="50" cy="50" r="38" fill="#2C4A63"/><path d="M50 12 A38 38 0 0 1 50 88Z" fill="#FFF1B8"/>`);
    return wrap(`<path d="M62 12 A38 38 0 1 0 62 88 A30 30 0 1 1 62 12Z" fill="#FFF1B8"/>`);
  },
  planet: (color = '#E9A15B', ring = true) => wrap(`<circle cx="50" cy="50" r="30" fill="${color}"/><path d="M28 42 q22 -8 44 0" stroke="rgba(255,255,255,.35)" stroke-width="5" fill="none"/>${ring ? `<ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="#F4D58A" stroke-width="5" transform="rotate(-14 50 52)"/>` : ''}`),
  face: (mood) => {
    const mouth = { happy: 'M32 60 Q50 80 68 60', ok: 'M34 66 L66 66', sad: 'M32 72 Q50 56 68 72' }[mood];
    const col = { happy: C.gold, ok: '#BFD7D3', sad: '#A9C4E4' }[mood];
    return wrap(`<circle cx="50" cy="50" r="44" fill="${col}"/><circle cx="36" cy="42" r="6" fill="#3A2A1A"/><circle cx="64" cy="42" r="6" fill="#3A2A1A"/><path d="${mouth}" stroke="#3A2A1A" stroke-width="6" fill="none" stroke-linecap="round"/>`);
  },
  replay: () => wrap(`<circle cx="50" cy="50" r="46" fill="${C.gold}"/><path d="M68 36 A24 24 0 1 0 74 56" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M60 22 L74 36 L56 44Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`),
  ear: () => wrap(`<circle cx="50" cy="50" r="46" fill="${C.gold}"/><path d="M30 40 L44 40 L60 26 L60 74 L44 60 L30 60Z" fill="#fff"/><path d="M68 36 Q78 50 68 64 M74 28 Q90 50 74 72" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`),
  thumb: () => wrap(`<circle cx="50" cy="50" r="46" fill="${C.leaf}"/><path d="M28 48 h12 v30 h-12z M44 48 l10 -22 q8 0 6 12 l-2 8 h16 q8 0 6 9 l-5 18 q-2 5 -8 5 h-23z" fill="#fff"/>`),
  arrow: () => wrap(`<circle cx="50" cy="50" r="46" fill="${C.teal}"/><path d="M34 50 h30 M52 34 l16 16 l-16 16" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  home: () => wrap(`<path d="M50 14 L88 46 L78 46 L78 86 L22 86 L22 46 L12 46Z" fill="#fff"/><ellipse cx="50" cy="66" rx="10" ry="9" fill="${C.terra}"/><circle cx="38" cy="54" r="4.5" fill="${C.terra}"/><circle cx="50" cy="50" r="4.5" fill="${C.terra}"/><circle cx="62" cy="54" r="4.5" fill="${C.terra}"/>`),
  sunset: () => wrap(`<path d="M10 66 h80" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M22 66 a28 28 0 0 1 56 0Z" fill="#fff"/><path d="M50 18 v10 M20 32 l7 7 M80 32 l-7 7" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M26 80 h48" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`),
  lock: () => wrap(`<rect x="22" y="44" width="56" height="44" rx="10" fill="currentColor"/><path d="M34 44 V32 a16 16 0 0 1 32 0 V44" stroke="currentColor" stroke-width="9" fill="none"/><circle cx="50" cy="64" r="6" fill="#fff"/>`),
  mic: () => wrap(`<rect x="36" y="14" width="28" height="46" rx="14" fill="#fff"/><path d="M26 48 a24 24 0 0 0 48 0" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M50 72 v14 M38 88 h24" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`),
  cam: () => wrap(`<rect x="8" y="28" width="60" height="44" rx="10" fill="currentColor"/><path d="M68 44 L92 30 V70 L68 56Z" fill="currentColor"/>`),
  lion: () => wrap(`${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;return `<circle cx="${50+34*Math.cos(a)}" cy="${52+34*Math.sin(a)}" r="14" fill="#C9772E"/>`}).join('')}<circle cx="50" cy="52" r="30" fill="#F1B25A"/><circle cx="40" cy="46" r="4" fill="#2A1A0E"/><circle cx="60" cy="46" r="4" fill="#2A1A0E"/><path d="M44 58 h12 l-6 6z" fill="#7A3E1E"/><path d="M42 66 q8 6 16 0" stroke="#7A3E1E" stroke-width="3" fill="none"/>`),
  frog: () => wrap(`<ellipse cx="50" cy="62" rx="38" ry="28" fill="#6BBF59"/><circle cx="32" cy="34" r="14" fill="#6BBF59"/><circle cx="68" cy="34" r="14" fill="#6BBF59"/><circle cx="32" cy="34" r="7" fill="#fff"/><circle cx="68" cy="34" r="7" fill="#fff"/><circle cx="33" cy="35" r="3.5" fill="#222"/><circle cx="67" cy="35" r="3.5" fill="#222"/><path d="M30 66 Q50 82 70 66" stroke="#2F6B2A" stroke-width="5" fill="none" stroke-linecap="round"/>`),
  parrot: () => wrap(`<ellipse cx="50" cy="60" rx="24" ry="32" fill="#E04B3A"/><circle cx="50" cy="30" r="20" fill="#E04B3A"/><path d="M56 30 q16 2 12 16 q-6 -6 -12 -4z" fill="#F4C45A"/><circle cx="46" cy="26" r="5" fill="#fff"/><circle cx="47" cy="26" r="2.5" fill="#222"/><path d="M30 56 Q20 76 36 88 L44 64Z" fill="#3D7DD8"/><path d="M70 56 Q80 76 64 88 L56 64Z" fill="#7CB342"/>`),
  elephant: () => wrap(`<ellipse cx="54" cy="58" rx="36" ry="28" fill="#9AA8B5"/><ellipse cx="26" cy="46" rx="18" ry="22" fill="#B4C0CB"/><circle cx="40" cy="44" r="16" fill="#9AA8B5"/><path d="M30 52 Q20 72 30 86" stroke="#9AA8B5" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="40" cy="40" r="3" fill="#222"/><rect x="34" y="78" width="12" height="16" rx="4" fill="#9AA8B5"/><rect x="66" y="78" width="12" height="16" rx="4" fill="#9AA8B5"/>`),
  mouse: () => wrap(`<ellipse cx="54" cy="64" rx="26" ry="18" fill="#B9B0A6"/><circle cx="34" cy="54" r="14" fill="#B9B0A6"/><circle cx="28" cy="40" r="9" fill="#E7C3C0"/><circle cx="42" cy="40" r="9" fill="#E7C3C0"/><circle cx="30" cy="54" r="3" fill="#222"/><circle cx="20" cy="58" r="3" fill="#E86AA6"/><path d="M80 66 q16 4 12 -14" stroke="#B9B0A6" stroke-width="4" fill="none" stroke-linecap="round"/>`),
  dino: (color = '#F08A3E') => wrap(`<ellipse cx="50" cy="60" rx="30" ry="22" fill="${color}"/><circle cx="76" cy="40" r="15" fill="${color}"/><path d="M22 60 Q6 60 4 48 Q14 54 24 52Z" fill="${color}"/><path d="M68 28 l4 -12 l4 12 M78 26 l6 -10 l2 12" fill="#FFF1D6" stroke="#FFF1D6" stroke-width="2"/><circle cx="80" cy="38" r="3" fill="#222"/><path d="M78 47 q6 3 10 -1" stroke="#7A3E1E" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="34" y="76" width="10" height="14" rx="4" fill="${color}"/><rect x="58" y="76" width="10" height="14" rx="4" fill="${color}"/><path d="M36 46 q6 -6 12 0 q6 -6 12 0" stroke="rgba(255,255,255,.45)" stroke-width="3" fill="none"/>`),
  drop: () => wrap(`<path d="M50 8 Q80 50 78 64 a28 28 0 0 1 -56 0 Q20 50 50 8Z" fill="#5BB7E8"/><path d="M36 60 q2 12 12 14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`),
  banana: () => wrap(`<path d="M18 30 Q22 82 82 74 Q86 68 80 66 Q36 68 30 26Z" fill="#F4D03F" stroke="#C8A21A" stroke-width="3"/><path d="M18 30 l-4 -8 l10 2z" fill="#7A5A1E"/>`),
  leafroof: () => wrap(`<path d="M8 52 Q50 0 92 52 Q50 36 8 52Z" fill="#5E9A2E"/><path d="M50 22 v62" stroke="#7A5A1E" stroke-width="6"/><circle cx="50" cy="70" r="7" fill="#3D7DD8"/>`),
};

/* ---------------- World card art (home map) ---------------- */
export const worldArt = {
  dino: `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="#BDE3A3"/><circle cx="250" cy="40" r="26" fill="#FFE08A"/><path d="M0 140 Q70 90 150 130 T300 120 V200 H0Z" fill="#8CC765"/><path d="M0 170 Q90 140 180 170 T300 160 V200 H0Z" fill="#6FAE48"/><path d="M40 120 L58 80 L76 120Z" fill="#A89A8A"/>${icon.dino().replace('<svg viewBox="0 0 100 100" aria-hidden="true">','<svg x="110" y="60" width="130" height="130" viewBox="0 0 100 100">')}<ellipse cx="62" cy="160" rx="12" ry="15" fill="#F7E7C6"/><ellipse cx="86" cy="164" rx="10" ry="13" fill="#F7E7C6"/></svg>`,
  space: `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="${C.navy}"/>${Array.from({length:26},(_,i)=>`<circle cx="${Math.floor(Math.abs(Math.sin(i*12.9898)*43758.5453)%1*300)}" cy="${Math.floor(Math.abs(Math.sin(i*78.233)*12543.17)%1*200)}" r="${1+(i%3)}" fill="#fff" opacity=".8"/>`).join('')}<circle cx="70" cy="70" r="34" fill="#E9A15B"/><ellipse cx="70" cy="72" rx="56" ry="13" fill="none" stroke="#F4D58A" stroke-width="5" transform="rotate(-14 70 72)"/><circle cx="240" cy="150" r="20" fill="#7FC7F0"/>${icon.rocket().replace('<svg viewBox="0 0 100 100" aria-hidden="true">','<svg x="150" y="30" width="110" height="140" viewBox="0 0 100 100">')}</svg>`,
  cars: `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="#BFE6F2"/><circle cx="50" cy="40" r="24" fill="#FFE08A"/><rect x="190" y="40" width="40" height="90" fill="#F4C45A"/><rect x="236" y="62" width="44" height="68" fill="#E07A5F"/><rect y="130" width="300" height="70" fill="#5B6670"/><path d="M0 165 h300" stroke="#fff" stroke-width="5" stroke-dasharray="22 16"/>${Array.from({length:6},(_,i)=>`<rect x="${250+(i%2)*10}" y="${10+Math.floor(i/2)*10}" width="10" height="10" fill="${(i+Math.floor(i/2))%2?'#222':'#fff'}"/>`).join('')}<rect x="248" y="10" width="3" height="60" fill="#444"/>${icon.car().replace('<svg viewBox="0 0 100 100" aria-hidden="true">','<svg x="50" y="92" width="150" height="100" viewBox="0 0 100 100">')}</svg>`,
  jungle: `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="#CFEFC9"/><path d="M0 0 Q40 60 0 110Z M300 0 Q250 70 300 120Z" fill="#4E8F3A"/><path d="M20 0 Q80 40 60 90 Q40 40 20 0Z M280 10 Q220 50 240 100 Q260 50 280 10Z" fill="#6FAE48"/><path d="M0 170 Q150 130 300 170 V200 H0Z" fill="#7CB342"/>${icon.lion().replace('<svg viewBox="0 0 100 100" aria-hidden="true">','<svg x="90" y="60" width="120" height="120" viewBox="0 0 100 100">')}${icon.parrot().replace('<svg viewBox="0 0 100 100" aria-hidden="true">','<svg x="220" y="40" width="60" height="70" viewBox="0 0 100 100">')}</svg>`,
};

/* ---------------- Scene backgrounds ---------------- */
const nest = (x, y, w) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w*0.28}" fill="#9C6B3E"/><path d="M${x-w} ${y} Q${x} ${y+w*0.55} ${x+w} ${y}" fill="#7A5230"/>`;

export const bg = {
  dino: (inner) => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="skyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7B8"/><stop offset="1" stop-color="#CFEBB4"/></linearGradient></defs><rect width="800" height="420" fill="url(#skyD)"/><circle cx="680" cy="80" r="44" fill="#FFD36E" class="sun"/><path d="M0 260 Q160 170 340 240 T800 220 V420 H0Z" fill="#9BCF72"/><path d="M0 330 Q220 280 420 330 T800 320 V420 H0Z" fill="#7CB342"/><path d="M80 260 q20 -60 40 0 M700 300 q16 -50 32 0" fill="#5E9A2E"/>${inner}</svg>`,
  space: (inner) => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice"><rect width="800" height="420" fill="${C.navy}"/>${Array.from({length:60},(_,i)=>`<circle class="twinkle" style="animation-delay:${(i%7)*.4}s" cx="${Math.floor(Math.abs(Math.sin(i*12.9898)*43758.5453)%1*800)}" cy="${Math.floor(Math.abs(Math.sin(i*78.233)*12543.17)%1*420)}" r="${1+(i%3)}" fill="#fff"/>`).join('')}<circle cx="720" cy="360" r="120" fill="#2E5B7A" opacity=".6"/>${inner}</svg>`,
  cars: (inner) => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice"><rect width="800" height="420" fill="#BFE6F2"/><circle cx="90" cy="70" r="40" fill="#FFE08A"/><rect x="460" y="80" width="90" height="190" fill="#F4C45A"/><rect x="560" y="130" width="110" height="140" fill="#E07A5F"/><rect x="680" y="100" width="90" height="170" fill="#4EB3A8"/>${[0,1,2].map(i=>`<rect x="${480+i*24}" y="110" width="14" height="18" fill="#fff" opacity=".7"/>`).join('')}<rect y="270" width="800" height="150" fill="#5B6670"/><path d="M0 345 h800" stroke="#fff" stroke-width="8" stroke-dasharray="44 30"/>${inner}</svg>`,
  jungle: (inner) => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice"><rect width="800" height="420" fill="#D7F2CF"/><path d="M0 0 Q90 120 0 240Z M800 0 Q690 140 800 260Z" fill="#4E8F3A"/><path d="M60 0 Q180 80 130 200 Q90 90 60 0Z M740 0 Q620 90 670 210 Q710 100 740 0Z" fill="#6FAE48"/><path d="M0 340 Q400 270 800 340 V420 H0Z" fill="#7CB342"/><path d="M200 0 v120 M600 0 v90" stroke="#5E9A2E" stroke-width="6"/>${inner}</svg>`,
};

// place a 100x100 icon in a scene
export const put = (svgIcon, x, y, size, cls = '') => `<g class="${cls}" style="transform-origin:${x + size / 2}px ${y + size / 2}px">` + svgIcon.replace('<svg viewBox="0 0 100 100" aria-hidden="true">', `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100">`) + '</g>';
export { nest };

/* ---------------- v2: outfits Sova can wear (bought with golden acorns) ---------------- */
const OUTFIT_HEAD = new Set(['party', 'wizard', 'pirate', 'tophat', 'chef', 'goldcrown', 'flower']);
export const OUTFITS_SVG = {
  none: '',
  bowtie: `<g><path d="M100 168 L76 156 L76 182Z M100 168 L124 156 L124 182Z" fill="#E04B3A"/><circle cx="100" cy="168" r="7" fill="#B23A2B"/></g>`,
  sunglasses: `<g><rect x="50" y="70" width="46" height="30" rx="12" fill="#1F2937"/><rect x="104" y="70" width="46" height="30" rx="12" fill="#1F2937"/><path d="M96 82 h8" stroke="#1F2937" stroke-width="5"/><path d="M58 76 l12 0" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/></g>`,
  party: `<g><path d="M100 -6 L126 52 Q100 60 74 52Z" fill="#4EB3A8"/><path d="M88 22 l8 10 M106 14 l6 12 M112 38 l-8 8" stroke="#F4C45A" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="-8" r="9" fill="#E07A5F"/></g>`,
  flower: `<g transform="translate(140 46)"><circle r="16" fill="#E86AA6"/><circle cx="-12" cy="-10" r="10" fill="#F49AC4"/><circle cx="12" cy="-10" r="10" fill="#F49AC4"/><circle cx="-12" cy="10" r="10" fill="#F49AC4"/><circle cx="12" cy="10" r="10" fill="#F49AC4"/><circle r="8" fill="#FFE08A"/></g>`,
  chef: `<g><rect x="66" y="34" width="68" height="22" rx="6" fill="#fff" stroke="#E5E5E5" stroke-width="3"/><circle cx="76" cy="20" r="18" fill="#fff"/><circle cx="100" cy="10" r="22" fill="#fff"/><circle cx="124" cy="20" r="18" fill="#fff"/></g>`,
  pirate: `<g><path d="M36 52 Q100 -10 164 52 Q100 36 36 52Z" fill="#222"/><circle cx="100" cy="30" r="9" fill="#fff"/><path d="M94 26 l12 8 M106 26 l-12 8" stroke="#222" stroke-width="3"/><path d="M42 50 Q100 34 158 50" stroke="#F4C45A" stroke-width="4" fill="none"/></g>`,
  tophat: `<g><rect x="56" y="44" width="88" height="12" rx="6" fill="#222"/><rect x="72" y="0" width="56" height="48" rx="6" fill="#222"/><rect x="72" y="32" width="56" height="9" fill="#E07A5F"/></g>`,
  wizard: `<g><path d="M100 -24 L138 50 L62 50Z" fill="#3D3B8E"/><ellipse cx="100" cy="50" rx="52" ry="10" fill="#3D3B8E"/><path d="M96 10 l3 7 7 0 -6 4 2 7 -6 -4 -6 4 2 -7 -6 -4 7 0Z M112 32 l2 4 4 0 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 0Z" fill="#F4C45A"/></g>`,
  goldcrown: `<g><path d="M60 54 L60 24 L80 40 L100 14 L120 40 L140 24 L140 54Z" fill="#F4C45A" stroke="#C99A2E" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="40" r="6" fill="#E04B3A"/><circle cx="76" cy="46" r="4" fill="#4EB3A8"/><circle cx="124" cy="46" r="4" fill="#4EB3A8"/></g>`,
  cape: `<path d="M44 96 Q20 200 40 206 L160 206 Q180 200 156 96Z" fill="#8E3BB0"/>`,
};

/* ---------------- v2: boss costumes (Sova plays a storybook guest) ---------------- */
export const COSTUMES = {
  pythagoras: `<g><path d="M70 112 Q100 196 130 112 Q118 130 100 128 Q82 130 70 112Z" fill="#F5F5F5" stroke="#DDD" stroke-width="2"/>
    <path d="M44 56 Q100 22 156 56" stroke="#5E9A2E" stroke-width="7" fill="none"/>${[52, 68, 84, 116, 132, 148].map((x, i) => `<ellipse cx="${x}" cy="${i < 3 ? 52 - i * 6 : 40 + (i - 3) * 6}" rx="9" ry="5" fill="#7CB342" transform="rotate(${i < 3 ? -30 : 30} ${x} 48)"/>`).join('')}
    <path d="M40 150 Q100 210 160 150 L160 200 L40 200Z" fill="#fff" opacity=".9"/><path d="M60 150 L150 196" stroke="#4EB3A8" stroke-width="8"/>
    <text x="100" y="186" font-size="20" text-anchor="middle" fill="#1B3A4B" font-weight="900">a²+b²</text></g>`,
  tesla: `<g><path d="M52 50 Q100 10 150 50 Q130 36 100 38 Q72 36 52 50Z" fill="#2A1A0E"/><path d="M80 112 Q90 104 100 112 Q110 104 120 112 Q110 118 100 114 Q90 118 80 112Z" fill="#2A1A0E"/>
    <path d="M100 160 L80 150 L80 172Z M100 160 L120 150 L120 172Z" fill="#1B3A4B"/>
    <path d="M168 20 L152 54 L166 54 L150 92 L186 44 L170 44 L184 20Z" fill="#F4C45A" stroke="#C99A2E" stroke-width="2"/></g>`,
  einstein: `<g>${Array.from({ length: 14 }, (_, i) => { const a = Math.PI + (i / 13) * Math.PI; return `<circle cx="${100 + 70 * Math.cos(a)}" cy="${70 + 46 * Math.sin(a)}" r="16" fill="#F2F2F2" stroke="#DADADA" stroke-width="2"/>`; }).join('')}
    <circle cx="32" cy="84" r="16" fill="#F2F2F2"/><circle cx="168" cy="84" r="16" fill="#F2F2F2"/>
    <path d="M78 112 Q100 100 122 112 Q100 122 78 112Z" fill="#EDEDED" stroke="#CCC" stroke-width="2"/>
    <text x="100" y="186" font-size="22" text-anchor="middle" fill="#1B3A4B" font-weight="900">E=mc²</text></g>`,
  darwin: `<g><path d="M62 110 Q100 210 138 110 Q120 132 100 128 Q80 132 62 110Z" fill="#F0F0F0" stroke="#D5D5D5" stroke-width="2"/>
    <path d="M54 62 Q72 52 90 62 M110 62 Q128 52 146 62" stroke="#EEE" stroke-width="9" stroke-linecap="round" fill="none"/>
    <ellipse cx="160" cy="150" rx="18" ry="12" fill="#6FA83E"/><path d="M146 146 Q160 130 174 146" fill="#8BC34A"/><circle cx="182" cy="150" r="6" fill="#9CCC65"/>
    <rect x="22" y="120" width="26" height="34" rx="3" fill="#8A5A2B"/><path d="M26 128 h18 M26 136 h18 M26 144 h12" stroke="#F6E6C8" stroke-width="3"/></g>`,
};

/* ---------------- v2: extra icons ---------------- */
export const icon2 = {
  butterfly: (c = '#E86AA6') => `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="30" cy="38" rx="22" ry="20" fill="${c}"/><ellipse cx="70" cy="38" rx="22" ry="20" fill="${c}"/><ellipse cx="34" cy="70" rx="16" ry="14" fill="${c}" opacity=".85"/><ellipse cx="66" cy="70" rx="16" ry="14" fill="${c}" opacity=".85"/><rect x="46" y="26" width="8" height="58" rx="4" fill="#3A2A1A"/><path d="M48 26 q-8 -14 -14 -14 M52 26 q8 -14 14 -14" stroke="#3A2A1A" stroke-width="3" fill="none"/></svg>`,
  clock: (h, m) => { const ma = (m / 60) * 360, ha = ((h % 12) / 12) * 360 + (m / 60) * 30; return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#1B3A4B" stroke-width="5"/>${Array.from({ length: 12 }, (_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return `<text x="${50 + 34 * Math.cos(a)}" y="${54 + 34 * Math.sin(a)}" font-size="10" text-anchor="middle" font-weight="800" fill="#1B3A4B">${i || 12}</text>`; }).join('')}<line x1="50" y1="50" x2="50" y2="28" stroke="#E07A5F" stroke-width="6" stroke-linecap="round" transform="rotate(${ha} 50 50)"/><line x1="50" y1="50" x2="50" y2="14" stroke="#1B3A4B" stroke-width="4" stroke-linecap="round" transform="rotate(${ma} 50 50)"/><circle cx="50" cy="50" r="4" fill="#1B3A4B"/></svg>`; },
  coin: (v) => v >= 5
    ? `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="4" y="22" width="92" height="56" rx="8" fill="${v === 5 ? '#B8B8B8' : '#E8A0A0'}" stroke="#8A8A8A" stroke-width="3"/><circle cx="50" cy="50" r="16" fill="rgba(255,255,255,.5)"/><text x="50" y="58" font-size="24" text-anchor="middle" font-weight="900" fill="#333">${v}€</text></svg>`
    : `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="${v === 2 ? '#E9D9A6' : '#D9C27A'}" stroke="#B89A3E" stroke-width="5"/><circle cx="50" cy="50" r="26" fill="${v === 2 ? '#C9CED3' : '#E9D9A6'}"/><text x="50" y="60" font-size="26" text-anchor="middle" font-weight="900" fill="#5A4A1E">${v}€</text></svg>`,
  pie: (n, k, c = '#E8A838') => { let s = ''; for (let i = 0; i < n; i++) { const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2; s += `<path d="M50 50 L${50 + 42 * Math.cos(a0)} ${50 + 42 * Math.sin(a0)} A42 42 0 ${n === 1 ? 1 : 0} 1 ${50 + 42 * Math.cos(a1)} ${50 + 42 * Math.sin(a1)}Z" fill="${i < k ? c : '#FFF8EC'}" stroke="#8A5A2B" stroke-width="2.5"/>`; } return `<svg viewBox="0 0 100 100" aria-hidden="true">${s}</svg>`; },
  heart: (c = '#E86AA6') => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 88 C10 60 6 32 26 20 C38 14 48 22 50 32 C52 22 62 14 74 20 C94 32 90 60 50 88Z" fill="${c}"/></svg>`,
  light: (on) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="32" y="4" width="36" height="92" rx="14" fill="#333"/>${['#E04B3A', '#F4C45A', '#7CB342'].map((c, i) => `<circle cx="50" cy="${22 + i * 28}" r="11" fill="${c}" opacity="${i === on ? 1 : .2}"/>`).join('')}</svg>`,
  sun: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="22" fill="#F4C45A"/>${Array.from({ length: 8 }, (_, i) => `<line x1="50" y1="12" x2="50" y2="22" stroke="#F4C45A" stroke-width="6" stroke-linecap="round" transform="rotate(${i * 45} 50 50)"/>`).join('')}</svg>`,
  plug: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="30" y="34" width="40" height="40" rx="8" fill="#4EB3A8"/><rect x="38" y="16" width="6" height="20" fill="#888"/><rect x="56" y="16" width="6" height="20" fill="#888"/><path d="M50 74 v22" stroke="#333" stroke-width="6"/><path d="M52 42 L42 56 L50 56 L46 68 L58 52 L50 52Z" fill="#F4C45A"/></svg>`,
  bone: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-30 50 50)"><rect x="22" y="42" width="56" height="16" rx="8" fill="#F4EEE2" stroke="#C9B79A" stroke-width="3"/><circle cx="22" cy="42" r="10" fill="#F4EEE2" stroke="#C9B79A" stroke-width="3"/><circle cx="22" cy="58" r="10" fill="#F4EEE2" stroke="#C9B79A" stroke-width="3"/><circle cx="78" cy="42" r="10" fill="#F4EEE2" stroke="#C9B79A" stroke-width="3"/><circle cx="78" cy="58" r="10" fill="#F4EEE2" stroke="#C9B79A" stroke-width="3"/></g></svg>`,
  acorn: () => `<svg viewBox="0 0 60 70" aria-hidden="true"><path d="M10 30 Q10 64 30 66 Q50 64 50 30Z" fill="#F4C45A" stroke="#C99A2E" stroke-width="3"/><path d="M6 30 Q30 8 54 30Z" fill="#8A5A2B"/><path d="M30 14 q2 -10 10 -10" stroke="#8A5A2B" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M20 40 q-2 10 4 16" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/></svg>`,
  starSmall: (on) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 72 L21 92 L32 58 L4 38 L38 38Z" fill="${on ? '#F4C45A' : '#E6DCCB'}" stroke="${on ? '#C99A2E' : '#CDBFA8'}" stroke-width="4" stroke-linejoin="round"/></svg>`,
  trophy: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M28 14 h44 v20 a22 22 0 0 1 -44 0Z" fill="#F4C45A" stroke="#C99A2E" stroke-width="3"/><path d="M28 20 h-12 q0 18 14 20 M72 20 h12 q0 18 -14 20" stroke="#C99A2E" stroke-width="5" fill="none"/><rect x="44" y="56" width="12" height="16" fill="#C99A2E"/><rect x="30" y="72" width="40" height="12" rx="4" fill="#8A5A2B"/></svg>`,
  book: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M10 22 Q30 14 50 24 Q70 14 90 22 V80 Q70 72 50 82 Q30 72 10 80Z" fill="#fff" stroke="#8A5A2B" stroke-width="4"/><path d="M50 24 V82" stroke="#8A5A2B" stroke-width="4"/><path d="M20 36 h20 M20 48 h20 M60 36 h20 M60 48 h20" stroke="#E07A5F" stroke-width="4" stroke-linecap="round"/></svg>`,
  lockSmall: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="24" y="44" width="52" height="40" rx="10" fill="#B9A58C"/><path d="M36 44 V34 a14 14 0 0 1 28 0 V44" stroke="#B9A58C" stroke-width="8" fill="none"/></svg>`,
  map: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 22 L36 12 L64 22 L88 12 V78 L64 88 L36 78 L12 88Z" fill="#fff"/><path d="M36 12 V78 M64 22 V88" stroke="#4EB3A8" stroke-width="4"/><path d="M22 60 q14 -20 28 -6 t26 -14" stroke="#E07A5F" stroke-width="4" fill="none" stroke-dasharray="6 5"/></svg>`,
};
