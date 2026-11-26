// SOVA v2: procedural question templates (ages 5–10), themed per world.
// Every generator returns { skill, say:[segments], scene:svg, choices:[{icon|label, ok, keys}], hint:[segments], okSay?, word?, order? }
import { icon, bg, put, C } from './art.js';
import { icon2 } from './art.js';
import { R, G, E } from './adventures.js';

/* ---------- seeded RNG ---------- */
export function rng(seed) { let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; s = s || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const shuffle = (r, a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const L = (seg) => seg; // readability

/* ---------- Russian number words (for speech recognition keys) ---------- */
const RU_NUM = ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать', 'двадцать'];
const numKeys = (n) => [String(n), RU_NUM[n]].filter(Boolean);

function numChoices(r, ans, { spread = 2, min = 0, n = 3, asIcon = false, fmt = (x) => String(x) } = {}) {
  const set = new Set([ans]);
  let guard = 0;
  while (set.size < n && guard++ < 50) { const d = int(r, 1, spread) * (r() < 0.5 ? -1 : 1); const v = ans + d; if (v >= min) set.add(v); }
  let k = 1; while (set.size < n) set.add(ans + spread + k++);
  return shuffle(r, [...set]).map((v) => ({ ok: v === ans, keys: numKeys(v), ...(asIcon ? { icon: icon.num(v) } : { label: fmt(v) }) }));
}

/* ---------- themes ---------- */
const COLORS = [
  { id: 'red', c: '#E04B3A', ru: 'красный', ruF: 'красную', ruN: 'красное', el: 'κόκκινο', en: 'red' },
  { id: 'blue', c: '#3D7DD8', ru: 'синий', ruF: 'синюю', ruN: 'синее', el: 'μπλε', en: 'blue' },
  { id: 'yellow', c: '#F4C45A', ru: 'жёлтый', ruF: 'жёлтую', ruN: 'жёлтое', el: 'κίτρινο', en: 'yellow' },
  { id: 'green', c: '#7CB342', ru: 'зелёный', ruF: 'зелёную', ruN: 'зелёное', el: 'πράσινο', en: 'green' },
];
const SHAPES = [
  { id: 'circle', ru: 'круг', el: 'κύκλος', en: 'circle', keys: ['круг', 'circle', 'κύκλ'] },
  { id: 'square', ru: 'квадрат', el: 'τετράγωνο', en: 'square', keys: ['квадрат', 'square', 'τετράγων'] },
  { id: 'triangle', ru: 'треугольник', el: 'τρίγωνο', en: 'triangle', keys: ['треуг', 'triangle', 'τρίγων'] },
  { id: 'star', ru: 'звезда', el: 'αστέρι', en: 'star', keys: ['звезд', 'star', 'αστέρ'] },
];
// counting items (gen = genitive plural for "Сколько ...?")
export const THEME = {
  dino: {
    items: [{ ic: () => icon.egg(), gen: 'яиц' }, { ic: () => icon.dino(), gen: 'динозавров' }, { ic: () => icon.foot('small'), gen: 'следов' }, { ic: () => icon2.bone(), gen: 'косточек' }],
    colored: (c) => icon.dino(c), coloredRu: 'динозавра', gender: 'm',
    words: [
      { ru: 'яйцо', el: 'αυγό', en: 'egg', ic: () => icon.egg(), syl: 'Я', fl: { ru: 'Я', el: 'Α', en: 'E' } },
      { ru: 'динозавр', el: 'δεινόσαυρος', en: 'dinosaur', ic: () => icon.dino(), syl: 'ДИ', fl: { ru: 'Д', el: 'Δ', en: 'D' } },
      { ru: 'камень', el: 'πέτρα', en: 'stone', ic: () => icon.rock('circle'), syl: 'КА', fl: { ru: 'К', el: 'Π', en: 'S' } },
      { ru: 'кость', el: 'κόκαλο', en: 'bone', ic: () => icon2.bone(), syl: 'КО', fl: { ru: 'К', el: 'Κ', en: 'B' } },
    ],
  },
  space: {
    items: [{ ic: () => icon.shape('star', C.gold), gen: 'звёзд' }, { ic: () => icon.planet('#E9A15B', false), gen: 'планет' }, { ic: () => icon.rocket(), gen: 'ракет' }, { ic: () => icon.moon('crescent'), gen: 'лун' }],
    colored: (c) => icon.planet(c, false), coloredRu: 'планету', gender: 'f',
    words: [
      { ru: 'звезда', el: 'αστέρι', en: 'star', ic: () => icon.shape('star', C.gold), syl: 'ЗВЕЗ', fl: { ru: 'З', el: 'Α', en: 'S' } },
      { ru: 'луна', el: 'φεγγάρι', en: 'moon', ic: () => icon.moon('full'), syl: 'ЛУ', fl: { ru: 'Л', el: 'Φ', en: 'M' } },
      { ru: 'ракета', el: 'πύραυλος', en: 'rocket', ic: () => icon.rocket(), syl: 'РА', fl: { ru: 'Р', el: 'Π', en: 'R' } },
      { ru: 'солнце', el: 'ήλιος', en: 'sun', ic: () => icon2.sun(), syl: 'СОЛ', fl: { ru: 'С', el: 'Η', en: 'S' } },
    ],
  },
  cars: {
    items: [{ ic: () => icon.car('#E04B3A'), gen: 'машин' }, { ic: () => icon.sign('triangle'), gen: 'знаков' }, { ic: () => icon.car('#3D7DD8'), gen: 'машинок' }, { ic: () => icon2.light(2), gen: 'светофоров' }],
    colored: (c) => icon.car(c), coloredRu: 'машину', gender: 'f',
    words: [
      { ru: 'машина', el: 'αυτοκίνητο', en: 'car', ic: () => icon.car('#E04B3A'), syl: 'МА', fl: { ru: 'М', el: 'Α', en: 'C' } },
      { ru: 'дорога', el: 'δρόμος', en: 'road', ic: () => icon.sign('circle'), syl: 'ДО', fl: { ru: 'Д', el: 'Δ', en: 'R' } },
      { ru: 'светофор', el: 'φανάρι', en: 'traffic light', ic: () => icon2.light(0), syl: 'СВЕ', fl: { ru: 'С', el: 'Φ', en: 'T' } },
      { ru: 'черепаха', el: 'χελώνα', en: 'turtle', ic: () => icon.turtle(), syl: 'ЧЕ', fl: { ru: 'Ч', el: 'Χ', en: 'T' } },
    ],
  },
  jungle: {
    items: [{ ic: () => icon.lion(), gen: 'львов' }, { ic: () => icon.frog(), gen: 'лягушек' }, { ic: () => icon.banana(), gen: 'бананов' }, { ic: () => icon.parrot(), gen: 'попугаев' }],
    colored: (c) => icon2.butterfly(c), coloredRu: 'бабочку', gender: 'f',
    words: [
      { ru: 'лев', el: 'λιοντάρι', en: 'lion', ic: () => icon.lion(), syl: 'ЛЕВ', fl: { ru: 'Л', el: 'Λ', en: 'L' } },
      { ru: 'лягушка', el: 'βάτραχος', en: 'frog', ic: () => icon.frog(), syl: 'ЛЯ', fl: { ru: 'Л', el: 'Β', en: 'F' } },
      { ru: 'слон', el: 'ελέφαντας', en: 'elephant', ic: () => icon.elephant(), syl: 'СЛОН', fl: { ru: 'С', el: 'Ε', en: 'E' } },
      { ru: 'попугай', el: 'παπαγάλος', en: 'parrot', ic: () => icon.parrot(), syl: 'ПО', fl: { ru: 'П', el: 'Π', en: 'P' } },
      { ru: 'мышка', el: 'ποντίκι', en: 'mouse', ic: () => icon.mouse(), syl: 'МЫШ', fl: { ru: 'М', el: 'Π', en: 'M' } },
    ],
  },
};

/* ---------- scene layout helpers ---------- */
function grid(items, { x0 = 60, y0 = 70, w = 680, h = 300, max = 90 } = {}) {
  const n = items.length; const cols = n <= 5 ? n : n <= 10 ? 5 : n <= 15 ? 5 : 5; const rows = Math.ceil(n / cols);
  const size = Math.min(max, w / cols - 10, h / rows - 10);
  return items.map((svg, i) => { const c = i % cols, rr = Math.floor(i / cols); const x = x0 + (w - cols * (size + 10)) / 2 + c * (size + 10); const y = y0 + (h - rows * (size + 10)) / 2 + rr * (size + 10); return put(svg, x, y, size, 'wobble'); }).join('');
}
const card = (txt, size = 64, color = '#1B3A4B') => `<rect x="150" y="120" width="500" height="180" rx="30" fill="rgba(255,255,255,.92)"/><text x="400" y="${210 + size * 0.35}" font-size="${size}" text-anchor="middle" font-weight="800" fill="${color}" font-family="Comfortaa, Nunito, sans-serif">${txt}</text>`;
const big = (svg) => put(svg, 310, 110, 180, 'peek');

/* ---------- templates ---------- */
const T = {};

// STAGE 1 — age 5
T.count10 = (w, r, d) => {
  const it = pick(r, THEME[w].items); const n = int(r, d < .5 ? 2 : 4, d < .5 ? 6 : 10);
  return { skill: 'count10', scene: bg[w](grid(Array.from({ length: n }, it.ic))), say: [R(`Сколько тут ${it.gen}? Посчитай пальчиком!`)],
    choices: numChoices(r, n, { spread: 2, min: 1, asIcon: true }), hint: [R(`Давай считать медленно, по одному. Трогай каждый!`)], okSay: [R(`Да, ${n}!`)] };
};
T.shapes = (w, r) => {
  const opts = shuffle(r, SHAPES).slice(0, 3); const t = pick(r, opts); const col = pick(r, COLORS).c;
  return { skill: 'shapes', scene: bg[w](opts.map((s, i) => put(icon.shape(s.id, [C.teal, C.terra, C.gold][i]), 130 + i * 200, 140, 150)).join('')),
    say: [R(`Найди ${t.ru === 'звезда' ? 'звезду' : t.ru}!`), G(t.el), E(t.en)], word: { ru: t.ru, el: t.el, en: t.en },
    choices: opts.map((s) => ({ icon: icon.shape(s.id, col), ok: s.id === t.id, keys: s.keys })), hint: [R(t.id === 'triangle' ? 'У треугольника три уголка.' : t.id === 'square' ? 'У квадрата четыре одинаковые стороны.' : t.id === 'circle' ? 'Круг круглый, как мячик, без уголков.' : 'У звезды есть лучики.')] };
};
T.colors = (w, r) => {
  const opts = shuffle(r, COLORS).slice(0, 3); const t = pick(r, opts); const th = THEME[w];
  const adj = th.gender === 'f' ? t.ruF : t.ru;
  return { skill: 'colors', scene: bg[w](opts.map((c, i) => put(th.colored(c.c), 130 + i * 200, 150, 150, 'wobble')).join('')),
    say: [R(`Найди ${adj} ${th.coloredRu}!`), G(t.el), E(t.en)], word: { ru: t.ru, el: t.el, en: t.en },
    choices: opts.map((c) => ({ icon: th.colored(c.c), ok: c.id === t.id, keys: [c.ru.slice(0, 4), c.en, c.el] })), hint: [R(`${t.ru[0].toUpperCase() + t.ru.slice(1)} — как ${{ red: 'клубника', blue: 'море', yellow: 'солнышко', green: 'травка' }[t.id]}.`)] };
};
T.words = (w, r, d, ctx) => {
  const ws = shuffle(r, THEME[w].words).slice(0, 3); const t = pick(r, ws); const lang = pick(r, ctx.langs.length ? ctx.langs : ['ru']);
  const seg = lang === 'el' ? G(t.el) : lang === 'en' ? E(t.en) : R(t.ru);
  return { skill: 'words', say: lang === 'ru' ? [R(`Где ${t.ru}?`)] : [R(`${lang === 'el' ? 'По-гречески' : 'По-английски'}:`), seg, R('. Где это? Нажми!')], word: { ru: t.ru, el: t.el, en: t.en },
    scene: bg[w](`<text x="400" y="100" font-size="70" text-anchor="middle" fill="#1B3A4B">?</text>`),
    choices: ws.map((x) => ({ icon: x.ic(), ok: x === t, keys: [x.ru.slice(0, 4), x.en, x.el.slice(0, 4)] })), hint: [R(`Это ${t.ru}.`), seg, R('. Найди его!')] };
};
T.moreLess = (w, r) => {
  const it = pick(r, THEME[w].items); let a = int(r, 1, 6), b = int(r, 1, 6); if (a === b) b = a + 2; const more = r() < 0.6;
  const left = Array.from({ length: a }, it.ic), right = Array.from({ length: b }, it.ic);
  const sc = `<rect x="30" y="60" width="350" height="320" rx="24" fill="rgba(255,255,255,.55)"/><rect x="420" y="60" width="350" height="320" rx="24" fill="rgba(255,255,255,.55)"/>` + grid(left, { x0: 40, y0: 70, w: 330, h: 300, max: 80 }) + grid(right, { x0: 430, y0: 70, w: 330, h: 300, max: 80 });
  const ans = more ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
  const mk = (n) => `<svg viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="16" fill="#fff" stroke="#4EB3A8" stroke-width="4"/>${Array.from({ length: n }, (_, i) => `<circle cx="${22 + (i % 3) * 28}" cy="${22 + Math.floor(i / 3) * 28}" r="10" fill="#E07A5F"/>`).join('')}</svg>`;
  return { skill: 'moreLess', scene: bg[w](sc), say: [R(more ? 'Где больше? Слева или справа?' : 'Где меньше? Слева или справа?')],
    choices: [{ icon: mk(a), ok: ans === 0, keys: ['слев', 'left'] }, { icon: mk(b), ok: ans === 1, keys: ['справ', 'right'] }], hint: [R('Посчитай слева, потом справа, и сравни.')] };
};

// STAGE 2 — age 6
T.count20 = (w, r, d) => {
  const it = pick(r, THEME[w].items); const n = int(r, 10, d < .5 ? 15 : 20);
  return { skill: 'count20', scene: bg[w](grid(Array.from({ length: n }, it.ic), { max: 60, y0: 60, h: 320 })), say: [R(`Сколько ${it.gen}? Подсказка: в ряду по пять!`)],
    choices: numChoices(r, n, { spread: 3, min: 1 }), hint: [R('Считай пятёрками: пять, десять, а потом дальше по одному.')] };
};
T.addsub10 = (w, r, d) => {
  const it = pick(r, THEME[w].items); const add = r() < (d < .5 ? .7 : .5);
  let a, b, ans; if (add) { a = int(r, 1, 6); b = int(r, 1, Math.min(4, 10 - a)); ans = a + b; } else { a = int(r, 4, 10); b = int(r, 1, Math.min(4, a - 1)); ans = a - b; }
  const items = Array.from({ length: a }, it.ic).join ? null : null;
  const left = grid(Array.from({ length: a }, it.ic), { x0: 20, w: 340, max: 70 });
  const right = grid(Array.from({ length: b }, it.ic), { x0: 440, w: 340, max: 70 });
  const sc = left + `<text x="400" y="250" font-size="90" text-anchor="middle" font-weight="900" fill="#1B3A4B">${add ? '+' : '−'}</text>` + right + `<text x="400" y="400" font-size="48" text-anchor="middle" font-weight="900" fill="#1B3A4B">${a} ${add ? '+' : '−'} ${b} = ?</text>`;
  return { skill: 'addsub10', scene: bg[w](sc), say: [R(add ? `Было ${a}, пришло ещё ${b}. Сколько стало?` : `Было ${a}, ${b} ушли домой. Сколько осталось?`)],
    choices: numChoices(r, ans, { spread: 2, min: 0, asIcon: true }), hint: [R(add ? `Начни с ${a} и досчитай ещё ${b}.` : `Начни с ${a} и отсчитай назад ${b}.`)], math: true };
};
T.letters = (w, r, d, ctx) => {
  const alph = pick(r, ['ru', ...ctx.langs]); const ws = THEME[w].words; const t = pick(r, ws); const letter = t.fl[alph];
  const pool = { ru: 'АБВГДЕЖЗИКЛМНОПРСТУФХЧЯ', el: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΩ', en: 'ABCDEFGHIJKLMNOPRSTUVW' }[alph];
  const opts = new Set([letter]); while (opts.size < 3) opts.add(pool[Math.floor(r() * pool.length)]);
  const word = t[alph]; const seg = alph === 'el' ? G(word) : alph === 'en' ? E(word) : R(`«${word}»`);
  const col = { ru: C.terra, el: C.teal, en: '#3D7DD8' }[alph];
  return { skill: 'letters', scene: bg[w](big(t.ic())), say: [R('С какой буквы начинается слово'), seg, R('?')],
    choices: shuffle(r, [...opts]).map((l) => ({ label: l, ok: l === letter, keys: [l.toLowerCase()], color: col })), hint: [R('Послушай первый звук:'), seg], word: { ru: t.ru, el: t.el, en: t.en } };
};
T.syllables = (w, r) => {
  const ws = THEME[w].words; const t = pick(r, ws); const others = shuffle(r, ['МА', 'ЛУ', 'РА', 'ПО', 'КО', 'ДИ', 'СО', 'ЛЯ', 'ЗВЕЗ', 'СЛОН', 'ЧЕ', 'ДО', 'МЫШ', 'ЛЕВ'].filter((s) => s !== t.syl)).slice(0, 2);
  return { skill: 'syllables', scene: bg[w](big(t.ic())), say: [R(`Скажем по слогам: ${t.ru}. С чего начинается слово «${t.ru}»?`)],
    choices: shuffle(r, [t.syl, ...others]).map((s) => ({ label: s, ok: s === t.syl, keys: [s.toLowerCase()] })), hint: [R(`Хлопни в ладоши на каждый слог: ${t.ru}. Первый кусочек — какой?`)] };
};
T.neighbors = (w, r, d) => {
  const n = int(r, 2, 19); const after = r() < 0.5; const ans = after ? n + 1 : n - 1;
  return { skill: 'neighbors', scene: bg[w](card(after ? `${n}, ?` : `?, ${n}`, 110)), say: [R(after ? `Какое число идёт после ${n}?` : `Какое число стоит перед ${n}?`)],
    choices: numChoices(r, ans, { spread: 2, min: 0 }), hint: [R('Посчитай вслух до этого числа.')], math: true };
};

// STAGE 3 — age 7
T.addsub100 = (w, r, d) => {
  const add = r() < 0.5; let a, b;
  if (d < 0.4) { a = int(r, 1, 8) * 10; b = int(r, 1, 9 - a / 10) * 10; if (!add) { a = int(r, 3, 9) * 10; b = int(r, 1, a / 10 - 1) * 10; } }
  else { a = int(r, 12, 70); b = int(r, 3, add ? Math.min(29, 99 - a) : Math.min(29, a - 2)); }
  const ans = add ? a + b : a - b; const what = { dino: 'косточек', space: 'звёзд', cars: 'километров', jungle: 'бананов' }[w];
  return { skill: 'addsub100', scene: bg[w](card(`${a} ${add ? '+' : '−'} ${b} = ?`, 96)), say: [R(add ? `У нас ${a} ${what}, и ещё ${b}. Сколько всего?` : `Было ${a} ${what}, ${b} убрали. Сколько осталось?`)],
    choices: numChoices(r, ans, { spread: d < .4 ? 10 : 9, min: 0 }), hint: [R('Сначала десятки, потом единицы.')], math: true };
};
T.read = (w, r, d, ctx) => {
  const alph = pick(r, ['ru', ...ctx.langs]); const ws = shuffle(r, THEME[w].words).slice(0, 3); const t = pick(r, ws);
  const txt = alph === 'ru' ? t.ru.toUpperCase() : alph === 'el' ? t.el.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : t.en.toUpperCase();
  return { skill: 'read', scene: bg[w](card(txt, txt.length > 9 ? 56 : 80, { ru: C.navy, el: '#16766B', en: '#B4482E' }[alph])), say: [R(alph === 'ru' ? 'Прочитай слово сам! Что тут написано?' : alph === 'el' ? 'Это слово по-гречески. Прочитай!' : 'Это слово по-английски. Прочитай!')],
    choices: ws.map((x) => ({ icon: x.ic(), ok: x === t, keys: [x.ru.slice(0, 4), x.en, x.el.slice(0, 4)] })), hint: [R('Читай по буквам, потом вместе.'), alph === 'el' ? G(t.el) : alph === 'en' ? E(t.en) : R(t.ru)], word: { ru: t.ru, el: t.el, en: t.en }, readOnly: true };
};
T.time = (w, r, d) => {
  const h = int(r, 1, 12); const m = d < 0.5 ? pick(r, [0, 0, 30]) : pick(r, [0, 15, 30, 45]);
  const fmt = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
  const opts = new Set([fmt(h, m)]); while (opts.size < 3) opts.add(fmt(int(r, 1, 12), pick(r, d < .5 ? [0, 30] : [0, 15, 30, 45])));
  const who = { dino: 'Тико идёт спать', space: 'ракета взлетает', cars: 'начинается гонка', jungle: 'Мики обедает' }[w];
  return { skill: 'time', scene: bg[w](put(icon2.clock(h, m), 290, 70, 230)), say: [R(`Посмотри на часы! В какое время ${who}?`)],
    choices: shuffle(r, [...opts]).map((t) => ({ label: t, ok: t === fmt(h, m), keys: [t] })), hint: [R('Короткая стрелка показывает часы, длинная — минуты. Длинная внизу — это половина.')] };
};
T.compare = (w, r, d) => {
  const a = int(r, 10, 99); let b = int(r, 10, 99); if (a === b) b++;
  return { skill: 'compare', scene: bg[w](card(`${a}  ?  ${b}`, 100)), say: [R(`Что больше: ${a} или ${b}?`)],
    choices: [{ label: String(a), ok: a > b, keys: [String(a)] }, { label: String(b), ok: b > a, keys: [String(b)] }], hint: [R('Сначала сравни десятки — первую цифру.')], math: true };
};

// STAGE 4 — age 8
T.times = (w, r, d) => {
  const a = int(r, 2, d < .5 ? 5 : 9), b = int(r, 2, d < .5 ? 5 : 10); const ans = a * b; const it = pick(r, THEME[w].items);
  const sc = a * b <= 25 ? grid(Array.from({ length: a * b }, it.ic), { max: 56 }) + `<text x="400" y="405" font-size="40" text-anchor="middle" font-weight="900" fill="#1B3A4B">${a} × ${b} = ?</text>` : card(`${a} × ${b} = ?`, 100);
  const set = new Set([ans, ans + a, ans - b > 0 ? ans - b : ans + b + 1]); while (set.size < 3) set.add(ans + set.size + 1);
  return { skill: 'times', scene: bg[w](sc), say: [R(`${a} раз по ${b}. Сколько будет?`)],
    choices: shuffle(r, [...set]).map((v) => ({ label: String(v), ok: v === ans, keys: [String(v)] })), hint: [R(`Это ${a} группы по ${b}. Прибавляй ${b} ${a} раз.`)], math: true };
};
T.money = (w, r, d) => {
  const vals = d < .5 ? [1, 2] : [1, 2, 5, 10]; const n = int(r, 2, d < .5 ? 3 : 4); const coins = Array.from({ length: n }, () => pick(r, vals)); const sum = coins.reduce((a, b) => a + b, 0);
  const what = { dino: 'билет в музей динозавров', space: 'модель ракеты', cars: 'игрушечную машинку', jungle: 'книжку про зверей' }[w];
  return { skill: 'money', scene: bg[w](coins.map((v, i) => put(icon2.coin(v), 400 - (n * 150) / 2 + i * 150 + 5, 150, 140)).join('')), say: [R(`Давид копит на ${what}. Сколько тут евро?`)],
    choices: numChoices(r, sum, { spread: 3, min: 1, fmt: (v) => `${v} €` }), hint: [R('Сначала большие монеты, потом добавляй маленькие.')], math: true };
};
const SENT = {
  ru: { dino: [['Тико ест зелёные ___.', 'листья', ['камни', 'звёзды']], ['Из яйца вылупился ___.', 'динозаврик', ['автобус', 'банан']]],
        space: [['Ночью на небе светит ___.', 'луна', ['машина', 'лев']], ['Ракета летит в ___.', 'космос', ['суп', 'гараж']]],
        cars: [['Машина едет по ___.', 'дороге', ['облаку', 'реке']], ['На красный свет надо ___.', 'стоять', ['ехать', 'прыгать']]],
        jungle: [['Лягушка живёт у ___.', 'воды', ['луны', 'машины']], ['Попугай умеет ___.', 'летать', ['плавать', 'читать']]] },
  en: { dino: [['The egg is in the ___.', 'nest', ['sky', 'car']], ['The dinosaur eats ___.', 'leaves', ['rocks', 'stars']]],
        space: [['The rocket flies to the ___.', 'stars', ['sea', 'shop']], ['At night we see the ___.', 'moon', ['sun', 'car']]],
        cars: [['The car stops at the red ___.', 'light', ['cake', 'frog']], ['A car has four ___.', 'wheels', ['wings', 'legs']]],
        jungle: [['The frog can ___.', 'jump', ['fly', 'read']], ['The lion has a big ___.', 'mane', ['wheel', 'rocket']]] },
  el: { dino: [['Ο δεινόσαυρος τρώει ___.', 'φύλλα', ['πέτρες', 'αστέρια']]], space: [['Τη νύχτα βλέπουμε το ___.', 'φεγγάρι', ['αυτοκίνητο', 'ψάρι']]],
        cars: [['Το αυτοκίνητο έχει τέσσερις ___.', 'ρόδες', ['φτερά', 'ουρές']]], jungle: [['Ο βάτραχος ζει στο ___.', 'νερό', ['φεγγάρι', 'αυτοκίνητο']]] },
};
T.sentences = (w, r, d, ctx) => {
  const lang = pick(r, ['ru', 'ru', ...ctx.langs]); const [s, ok, bad] = pick(r, SENT[lang][w]);
  const seg = (t) => (lang === 'el' ? G(t, { hl: false }) : lang === 'en' ? E(t, { hl: false }) : R(t));
  const col = { ru: C.navy, el: '#16766B', en: '#B4482E' }[lang];
  return { skill: 'sentences', scene: bg[w](card(s.replace('___', '…'), s.length > 26 ? 34 : 42, col)), say: [R('Прочитай и найди пропавшее слово:'), seg(s.replace('___', '…'))],
    choices: shuffle(r, [ok, ...bad]).map((t) => ({ label: t, ok: t === ok, keys: [t.slice(0, 4).toLowerCase()], lang })), hint: [R('Подставь каждое слово и подумай: так бывает?')] };
};

// STAGE 5 — age 9–10
T.fractions = (w, r, d) => {
  if (r() < 0.5) {
    const n = pick(r, d < .5 ? [2, 4] : [3, 4, 6, 8]); const k = int(r, 1, n - 1); const what = { dino: 'пирога для Тико', space: 'планеты', cars: 'колеса', jungle: 'арбуза' }[w];
    const opts = new Set([`${k}/${n}`]); const val = k / n; let g = 0; while (opts.size < 3 && g++ < 60) { const dd = pick(r, [n, n, 2, 3, 4, 6, 8]); const kk = int(r, 1, dd - 1); if (Math.abs(kk / dd - val) > 1e-9) opts.add(`${kk}/${dd}`); }
    return { skill: 'fractions', scene: bg[w](put(icon2.pie(n, k, { dino: C.terra, space: '#7FC7F0', cars: C.gold, jungle: C.leaf }[w]), 290, 80, 230)), say: [R(`Какая часть ${what} закрашена?`)],
      choices: shuffle(r, [...opts]).map((t) => ({ label: t, ok: t === `${k}/${n}`, keys: [t] })), hint: [R(`Посчитай все кусочки — это знаменатель, внизу. Закрашенные — сверху.`)], math: true };
  }
  const den = pick(r, [2, 3, 4]); const tot = den * int(r, 2, 6); const ans = tot / den; const it = pick(r, THEME[w].items);
  return { skill: 'fractions', scene: bg[w](grid(Array.from({ length: tot }, it.ic), { max: 50 })), say: [R(`Тут ${tot} ${it.gen}. Сколько будет ${{ 2: 'половина', 3: 'одна треть', 4: 'одна четверть' }[den]}?`)],
    choices: numChoices(r, ans, { spread: 2, min: 1 }), hint: [R(`Раздели ${tot} на ${den} равные кучки.`)], math: true };
};
T.measure = (w, r, d) => {
  const kind = int(r, 0, 2);
  if (kind === 0) {
    const conv = pick(r, [['1 метр', 'сантиметров', 100, '1 м = ? см'], ['1 час', 'минут', 60, '1 ч = ? мин'], ['1 килограмм', 'граммов', 1000, '1 кг = ? г'], ['1 минута', 'секунд', 60, '1 мин = ? с'], ['1 километр', 'метров', 1000, '1 км = ? м']]);
    const set = shuffle(r, [conv[2], ...[10, 100, 60, 1000, 24].filter((x) => x !== conv[2]).slice(0, 2)]);
    return { skill: 'measure', scene: bg[w](card(conv[3], 80)), say: [R(`Сколько ${conv[1]} в ${conv[0].replace('1 ', 'одном ').replace('метр', 'метре').replace('час', 'часе').replace('килограмм', 'килограмме').replace('минута', 'минуте').replace('километр', 'километре')}?`)],
      choices: set.map((v) => ({ label: String(v), ok: v === conv[2], keys: [String(v)] })), hint: [R('Вспомни линейку и часы: в метре сто сантиметров, в часе шестьдесят минут.')], math: true };
  }
  const pairs = { dino: [['Тираннозавр', 12, 'машина', 4], ['Диплодок', 24, 'автобус', 12]], space: [['Ракета', 60, 'дом', 20], ['Ракета', 90, 'дерево', 30]], cars: [['Грузовик', 12, 'машина', 4], ['Поезд', 80, 'вагон', 20]], jungle: [['Жираф', 6, 'ребёнок', 1], ['Удав', 8, 'кот', 2]] }[w];
  const [A, a, B, b] = pick(r, pairs); const ans = a / b;
  return { skill: 'measure', scene: bg[w](`<rect x="60" y="150" width="${680}" height="60" rx="14" fill="${C.terra}"/><text x="400" y="192" font-size="30" text-anchor="middle" font-weight="900" fill="#fff">${A}: ${a} м</text>${Array.from({ length: ans }, (_, i) => `<rect x="${60 + i * (680 / ans) + 3}" y="240" width="${680 / ans - 6}" height="50" rx="12" fill="${C.teal}"/>`).join('')}<text x="400" y="340" font-size="28" text-anchor="middle" font-weight="900" fill="#1B3A4B">${B}: ${b} м</text>`),
    say: [R(`${A} длиной ${a} метров, а ${B} — ${b}. Сколько раз ${B} поместится в длину?`)], choices: numChoices(r, ans, { spread: 2, min: 1 }), hint: [R(`Подели ${a} на ${b}.`)], math: true };
};
const SCI = {
  dino: [['Как мы узнали о динозаврах, если их никто не видел?', 'по окаменелым костям', ['по телевизору', 'по их письмам']], ['Травоядный динозавр ест…', 'растения', ['камни', 'других динозавров']], ['Динозавры жили…', 'миллионы лет назад', ['в прошлом году', 'на Луне']]],
  space: [['Почему бывает день и ночь?', 'Земля вращается', ['Солнце выключается', 'Луна закрывает небо']], ['Ближайшая к нам звезда — это…', 'Солнце', ['Луна', 'Марс']], ['Почему в космосе нужен скафандр?', 'там нет воздуха', ['там слишком весело', 'там много дождя']]],
  cars: [['Электромобиль получает энергию из…', 'аккумулятора', ['бензина в колесах', 'облаков']], ['Почему зимой машины едут медленнее?', 'на льду скользко', ['колёса спят', 'дорога короче']], ['Что зажигает лампочку?', 'электрический ток', ['вода', 'песок']]],
  jungle: [['Лягушка, когда вырастает, сначала была…', 'головастиком', ['птенцом', 'щенком']], ['Кто из них млекопитающее (кормит малышей молоком)?', 'слон', ['лягушка', 'попугай']], ['Зачем хамелеону менять цвет?', 'чтобы прятаться', ['чтобы петь', 'чтобы летать']]],
};
T.science = (w, r) => {
  const [q, ok, bad] = pick(r, SCI[w]);
  return { skill: 'science', scene: bg[w](put({ dino: icon2.bone(), space: icon.planet('#7FC7F0'), cars: icon2.plug(), jungle: icon.frog() }[w], 320, 110, 160, 'peek')), say: [R(q)],
    choices: shuffle(r, [ok, ...bad]).map((t) => ({ label: t, ok: t === ok, keys: [t.slice(0, 5)] })), hint: [R('Подумай как учёный: что можно проверить и увидеть?')], wide: true };
};
const STORIES = {
  dino: [[icon.egg(), 'Сначала было яйцо'], [icon.dino('#F7B36B'), 'потом вылупился малыш'], [icon.dino(), 'и он вырос большим']],
  space: [[icon2.light(0), 'Сначала обратный отсчёт'], [icon.rocket(), 'потом ракета взлетела'], [icon.moon('full'), 'и прилетела к Луне']],
  cars: [[icon2.light(0), 'Сначала красный свет'], [icon2.light(1), 'потом жёлтый'], [icon2.light(2), 'и зелёный — поехали!']],
  jungle: [[icon.drop(), 'Сначала пошёл дождь'], [icon.leafroof(), 'звери спрятались под листьями'], [icon2.sun(), 'а потом вышло солнце']],
};
T.story = (w, r) => {
  const st = STORIES[w]; const order = shuffle(r, [0, 1, 2]);
  return { skill: 'story', scene: bg[w](card('1 → 2 → 3', 70)), say: [R('Собери историю! Нажимай картинки по порядку: что было сначала, потом и в конце?')],
    order: true, choices: order.map((i) => ({ icon: st[i][0], step: i })), storyText: st.map((s) => s[1]).join(', ') + '.', hint: [R('Что случается первым? Подумай, как бывает в жизни.')] };
};

/* ---------- stage definitions ---------- */
export const STAGES = [
  { n: 1, age: '5', ru: 'Этап 1', skills: ['count10', 'shapes', 'colors', 'words', 'moreLess'] },
  { n: 2, age: '6', ru: 'Этап 2', skills: ['count20', 'addsub10', 'letters', 'syllables', 'neighbors'] },
  { n: 3, age: '7', ru: 'Этап 3', skills: ['addsub100', 'read', 'time', 'compare'] },
  { n: 4, age: '8', ru: 'Этап 4', skills: ['times', 'money', 'sentences', 'addsub100'] },
  { n: 5, age: '9–10', ru: 'Этап 5', skills: ['fractions', 'measure', 'science', 'story'] },
];
export const SKILL_NAMES = {
  count10: 'Counting to 10', shapes: 'Shapes', colors: 'Colors (3 languages)', words: 'First words (Greek/English)', moreLess: 'More / less',
  count20: 'Counting to 20', addsub10: 'Add & subtract within 10', letters: 'First letters (Д/Δ/D)', syllables: 'First syllables', neighbors: 'Number order',
  addsub100: 'Add & subtract to 100', read: 'Reading simple words', time: 'Telling time', compare: 'Comparing numbers',
  times: 'Times tables', money: 'Money (€)', sentences: 'Simple sentences', fractions: 'Fractions', measure: 'Measurement & units', science: 'Science reasoning', story: 'Story building (sequence)',
  story_adv: 'Story adventures',
};

export function makeQuestion(skill, world, seed, d, ctx) { return T[skill](world, rng(seed), d, ctx); }
