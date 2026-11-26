// SOVA v1 — app engine and screens.
import { owlSVG, icon, icon2, worldArt, C } from './art.js';
import { nodes, nodeById, levelPlan, practicePlan, storyAdventure, BOSSES, WORLD_IDS } from './levels.js';
import { STAGES, SKILL_NAMES } from './questions.js';
import * as PG from './progress.js';
import { ADVENTURES, WORLDS, adventuresFor, R, G, E } from './adventures.js';
import { speak, stopSpeaking, onSpeaking, voiceReport } from './voice.js';
import { listen, canListen, matchKeys, stopListening } from './listen.js';
import { startCamera, stopCamera, cameraOn, cameraStats, resetCameraStats } from './camera.js';
import { brain } from './brain.js';
import { store } from './store.js';
import { CONFIG } from './config.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const screenEl = $('#screen');
const NAME = CONFIG.CHILD_NAME;

let settings = store.settings();
PG.load();
let L = null;                 // running generated level
const outfit = () => PG.get().outfit;
const owl = (acc = 'scarf', o = {}) => owlSVG(acc, { outfit: outfit(), ...o });
const langCtx = () => ({ langs: enabledLangs() });
let session = null;           // current play session
let cur = null;               // { adv, i, wrong }
let screen = '';
let paused = false;
let busy = false;
let lastAwayNudge = 0;
let idleTimer = null;
let homeVisits = 0;

/* ------------------ helpers ------------------ */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const enabledLangs = () => [settings.el && 'el', settings.en && 'en'].filter(Boolean);
const filterSegs = (segs) => {
  const langs = enabledLangs();
  let out = segs.filter((s) => s.lang === 'ru' || langs.includes(s.lang));
  if (settings.mix === 1 && langs.length === 2) out = out.filter((s) => s.lang !== 'en'); // light sprinkle: one foreign language per line
  return out.filter((s) => !s.x);
};
const segHTML = (segs) => segs.map((s, i) => (i && !/^[.,!?]/.test(s.t) ? ' ' : '') + (s.hl ? `<b class="hl hl-${s.lang}">${s.t}</b>` : `<span>${s.t}</span>`)).join('');

function say(segs, { bubble = true } = {}) {
  segs = filterSegs(segs);
  if (bubble) $$('.bubble-text').forEach((b) => (b.innerHTML = segHTML(segs)));
  return speak(segs, { rate: settings.rate });
}
onSpeaking((on) => document.body.classList.toggle('speaking', on));

const PRAISE = {
  ru: [[R('Хут-хут! Ты справился!')], [R('Ух ты! Какая идея!')], [R('Хут-хут! Вот это да!')], [R('Ура! Получилось!')]],
  el: [[G('Χουτ-χουτ! Τα κατάφερες!', { hl: false })], [G('Πω πω! Τι ιδέα!', { hl: false })]],
  en: [[E('Hoot-hoot! You did it!', { hl: false })], [E('Whoa! What an idea!', { hl: false })]],
};

/* tiny synth sounds (no audio files) */
let actx = null;
function tone(freqs, dur = 0.18, type = 'sine', gain = 0.12) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    let t = actx.currentTime;
    freqs.forEach((f) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.85, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.02); t += dur * 0.9;
    });
  } catch {}
}
const hoot = () => tone([520, 440, 520, 430], 0.2);
const chime = () => tone([660, 880, 1175], 0.14, 'triangle', 0.1);
const boop = () => tone([300, 260], 0.12, 'sine', 0.08);

function confetti() {
  const box = document.createElement('div'); box.className = 'confetti';
  const cols = [C.gold, C.terra, C.teal, C.leaf, '#E86AA6'];
  box.innerHTML = Array.from({ length: 36 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${cols[i % 5]};animation-delay:${Math.random() * 0.4}s;transform:rotate(${Math.random() * 360}deg)"></i>`).join('');
  document.body.appendChild(box); setTimeout(() => box.remove(), 2600);
}
function owlDo(cls, ms = 1400) { $$('.owl').forEach((o) => { o.classList.remove(cls); void o.getBoundingClientRect(); o.classList.add(cls); setTimeout(() => o.classList.remove(cls), ms); }); }

/* acorn session timer */
function acornHTML() {
  return `<div class="acorn" title="Session time"><svg viewBox="0 0 60 70"><defs><clipPath id="acClip"><path d="M10 30 Q10 64 30 66 Q50 64 50 30Z"/></clipPath></defs>
    <path d="M10 30 Q10 64 30 66 Q50 64 50 30Z" fill="#F6E6C8" stroke="#B9824A" stroke-width="3"/>
    <rect class="acorn-fill" x="0" y="66" width="60" height="0" fill="${C.honey}" clip-path="url(#acClip)"/>
    <path d="M6 30 Q30 8 54 30Z" fill="#8A5A2B"/><path d="M30 14 q2 -10 10 -10" stroke="#8A5A2B" stroke-width="4" fill="none" stroke-linecap="round"/></svg></div>`;
}
function updateAcorn() {
  if (!session) return;
  const p = Math.min(1, session.playMs / (settings.sessionMin * 60000));
  $$('.acorn-fill').forEach((r) => { r.setAttribute('y', 66 - 40 * p); r.setAttribute('height', 40 * p); });
}

/* ------------------ global chrome ------------------ */
function renderCamPill() {
  const pill = $('#campill');
  pill.hidden = !cameraOn();
}
document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeaking(); });

setInterval(() => {
  if (!session || paused || document.hidden || !['home', 'adventure', 'greet', 'map', 'level', 'result', 'rewards', 'celebrate', 'boss'].includes(screen)) return;
  session.playMs += 1000; updateAcorn();
  const cap = settings.sessionMin * 60000;
  if (session.playMs >= cap && !session.timeUp) { session.timeUp = true; if (['home', 'map', 'rewards'].includes(screen) && !busy) goodbye(); }
  if (session.playMs >= cap + 3 * 60000 && screen !== 'goodbye') goodbye(); // hard stop
}, 1000);

/* ------------------ camera signals ------------------ */
async function maybeStartCamera() {
  if (!settings.camera || cameraOn()) return;
  try { resetCameraStats(); await startCamera(onCam); } catch (e) { console.warn('camera', e); stopCamera(); toast('Camera could not start: ' + (e.message || e)); }
  renderCamPill();
}
function onCam(sig) {
  if (!session || !['home', 'adventure', 'map', 'level'].includes(screen)) return;
  if (sig === 'gone' && !paused) {
    paused = true; stopSpeaking(); stopListening();
    document.body.classList.add('paused');
    say([R(`${NAME}, где ты? Я подожду здесь.`)], { bubble: false });
  } else if (sig === 'back' && paused) {
    paused = false; document.body.classList.remove('paused');
    say([R('Вот ты где! Продолжаем.')], { bubble: false }).then(() => { if (['adventure', 'level'].includes(screen) && !busy) replayLine(); });
  } else if (sig === 'away' && !paused && Date.now() - lastAwayNudge > 60000) {
    lastAwayNudge = Date.now(); owlDo('surprise'); hoot();
    say([R('Я здесь! Хочешь сюрприз?')], { bubble: false });
  } else if (sig === 'smile') {
    owlDo('happy', 900);
  }
}
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 4200); }

/* ------------------ screens ------------------ */
function show(name, html) {
  screen = name; clearTimeout(idleTimer); stopListening();
  screenEl.className = `screen screen-${name}`;
  screenEl.innerHTML = html;
  renderCamPill(); updateAcorn();
}

function start() {
  const since = (Date.now() - store.lastEnd()) / 60000;
  if (store.lastEnd() && since < CONFIG.COOLDOWN_MIN) return rest(Math.ceil(CONFIG.COOLDOWN_MIN - since));
  if (!store.firstRunDone()) return disclosure();
  wake();
}

function disclosure() {
  show('disclosure', `
    <div class="center-stack">
      <div class="owl-hero">${owlSVG('scarf')}</div>
      <div class="card-soft">
        <p class="big-ru">Я Сова — сова из историй и звёздной пыли. Меня придумали люди с компьютером, чтобы играть и учиться вместе.</p>
        <p class="small-en">Sova is an AI owl who loves stories. She is a computer program, not a living owl and not a real friend. Please stay nearby while David plays.</p>
      </div>
      <button class="btn-play" id="go" aria-label="Let's play">${icon.arrow()}<span>Поехали!</span></button>
    </div>`);
  $('#go').onclick = () => { store.setFirstRunDone(true); greet(true); };
}

function wake() {
  show('wake', `
    <header class="topbar"><div class="spacer"></div><button class="lockbtn" id="lock" aria-label="Parent corner">${icon.lock()}</button></header>
    <div class="center-stack">
      <div class="owl-hero sleepy">${owlSVG('scarf')}<div class="zzz">z<span>z</span><span>z</span></div></div>
      <button class="btn-play" id="go" aria-label="Wake Sova">${icon.arrow()}<span>Разбуди Сову!</span></button>
      <p class="small-en">Tap to wake Sova (sound on)</p>
    </div>`);
  $('#go').onclick = () => greet(false);
  $('#lock').onclick = () => pin();
}

function rest(min) {
  show('rest', `
    <header class="topbar"><div class="spacer"></div><button class="lockbtn" id="lock" aria-label="Parent corner">${icon.lock()}</button></header>
    <div class="center-stack night">
      <div class="owl-hero sleepy">${owlSVG('scarf')}<div class="zzz">z<span>z</span><span>z</span></div></div>
      <p class="big-ru">Сова отдыхает. Поиграем чуть позже!</p>
      <p class="small-en">Sova is resting for about ${min} more minute${min > 1 ? 's' : ''}. A grown-up can start a new session from the Parent Corner.</p>
    </div>`);
  $('#lock').onclick = () => pin();
  setTimeout(() => { if (screen === 'rest') start(); }, min * 60000);
}

function newSession() {
  session = { id: Date.now(), start: Date.now(), playMs: 0, worlds: [], adventures: [], words: [], practiced: [], tips: [], correct: 0, tries: 0, checkin: null, timeUp: false, played: {}, levels: [], stars: 0, acorns: 0, badges: [] };
  paused = false; homeVisits = 0;
}

async function greet(first) {
  newSession();
  show('greet', `
    <div class="center-stack">
      <div class="owl-hero wakeup">${owlSVG('scarf')}</div>
      <div class="bubble"><div class="bubble-text"></div></div>
      <div class="choices faces" hidden>
        <button class="pic" data-m="happy" aria-label="happy">${icon.face('happy')}</button>
        <button class="pic" data-m="ok" aria-label="okay">${icon.face('ok')}</button>
        <button class="pic" data-m="sad" aria-label="sad">${icon.face('sad')}</button>
      </div>
    </div>`);
  maybeStartCamera();
  hoot();
  await say([R(`Привет, ${NAME}! Я Сова. Полетели?`)]);
  await say(first ? [R('Я — сова из историй и звёздной пыли. Меня придумали люди с компьютером, чтобы играть и учиться вместе.'), R('Я не живая сова и не настоящий друг. Настоящие друзья — это мама, папа и ребята в детском саду.')] : [R('Я — Сова из историй, умная компьютерная сова.')]);
  if (screen !== 'greet') return;
  $('.faces').hidden = false;
  say([R('Как ты сегодня?')]);
  $$('.faces .pic').forEach((b) => (b.onclick = async () => {
    if (busy) return; busy = true;
    session.checkin = b.dataset.m; b.classList.add('picked');
    const reply = { happy: [R('Ура! Тогда летим играть!')], ok: [R('Хорошо! Давай поиграем немножко.')], sad: [R('Бывает. Если грустно, можно позвать маму или папу. А можно поиграть тихонько.')] }[b.dataset.m];
    await say(reply); busy = false; home();
  }));
}

function walletHTML() { return `<div class="wallet" aria-label="Golden acorns">${icon2.acorn()}<b id="walletN">${PG.get().acorns}</b></div>`; }
function home() {
  if (session?.timeUp) return goodbye();
  homeVisits++;
  show('home', `
    <header class="topbar">${acornHTML()}${walletHTML()}<div class="spacer"></div><button class="navbtn trophy-btn" id="rewards" aria-label="Rewards">${icon2.trophy()}</button><button class="lockbtn" id="lock" aria-label="Parent corner">${icon.lock()}</button></header>
    <div class="home-hero">
      <div class="owl-mid">${owl('scarf')}</div>
      <div class="bubble"><div class="bubble-text"></div></div>
    </div>
    <div class="worlds">
      ${Object.values(WORLDS).map((w) => { const sm = PG.worldSummary(w.id); return `<button class="world w-${w.id}" data-w="${w.id}" aria-label="${w.name}"><div class="world-art">${worldArt[w.id]}</div><span class="world-name">${w.ru}</span><span class="world-prog">${icon2.starSmall(true)}<b>${sm.stars}</b><i>${STAGES[sm.stage - 1].ru}</i></span></button>`; }).join('')}
    </div>
    <div class="bottombar"><button class="mic ${micReady() ? '' : 'mic-off'}" id="mic" aria-label="Talk to Sova">${icon.mic()}</button></div>`);
  $('#lock').onclick = () => pin();
  $('#rewards').onclick = () => rewards();
  $$('.world').forEach((b) => (b.onclick = () => worldMap(b.dataset.w)));
  $('#mic').onclick = () => micHome();
  const line = homeVisits === 1 ? [R('Куда полетим? К динозаврам, в космос, к машинкам или к зверям?')] : [R('Куда теперь полетим?')];
  say(line);
  idleTimer = setTimeout(() => { if (screen === 'home' && !busy) { const w = rnd(Object.keys(WORLDS)); $(`.w-${w}`)?.classList.add('nudge'); say([R(`Может, посмотрим ${{ dino: 'на динозавров', space: 'на звёзды', cars: 'на машинки', jungle: 'на зверей' }[w]}?`)]); } }, 22000);
}

const micReady = () => settings.mic && canListen();
async function micHome() {
  if (!micReady()) { say([R('Нажми на картинку пальчиком!')]); $$('.world').forEach((w) => w.classList.add('nudge')); return; }
  stopSpeaking(); $('#mic').classList.add('listening');
  const heard = await listen({ lang: 'ru-RU' });
  $('#mic')?.classList.remove('listening');
  if (screen !== 'home') return;
  const w = Object.values(WORLDS).find((x) => matchKeys(heard, x.keys));
  if (w) return worldMap(w.id);
  if (heard) { const segs = await brain.freeTalk(heard, { screen: 'home' }); say(segs); }
  else say([R('Я не расслышала. Нажми на картинку!')]);
}

function levelLayout(wid, owlMarkup, { dots = 0 } = {}) {
  return `
    <header class="topbar">
      <button class="navbtn home-btn" id="homeBtn" aria-label="Back to map">${icon2.map()}</button>
      ${acornHTML()}
      <div class="qdots" id="qdots">${'<i></i>'.repeat(dots)}</div>
      <button class="navbtn sunset-btn" id="doneBtn" aria-label="I'm done for now">${icon.sunset()}</button>
    </header>
    <div class="scene" id="scene"></div>
    <div class="talk-row">
      <div class="owl-small">${owlMarkup}</div>
      <div class="bubble"><div class="bubble-text"></div></div>
      <div class="talk-btns">
        <button class="roundbtn" id="replay" aria-label="Hear Sova again">${icon.replay()}</button>
        <button class="mic ${micReady() ? '' : 'mic-off'}" id="mic" aria-label="Talk to Sova">${icon.mic()}</button>
      </div>
    </div>
    <div class="controls" id="controls"></div>`;
}
function trackWorld(wid) { if (!session.worlds.includes(wid)) session.worlds.push(wid); }

function enterStory(wid, node) {
  if (busy) return;
  const adv = storyAdventure(wid, node);
  trackWorld(wid);
  session.adventures.push(adv.id); session.practiced.push(adv.practiced); session.tips.push(adv.tip);
  cur = { adv, i: 0, wrong: 0, lvl: { world: wid, node, firstTry: 0, total: 0 } };
  hoot(); stopSpeaking();
  show('adventure', levelLayout(wid, owl(WORLDS[wid].accessory)));
  screenEl.classList.add(`world-${wid}`);
  $('#homeBtn').onclick = () => { stopSpeaking(); busy = false; worldMap(wid); };
  $('#doneBtn').onclick = () => { stopSpeaking(); busy = false; goodbye(); };
  $('#replay').onclick = () => replayLine();
  $('#mic').onclick = () => micAdventure();
  playBeat();
}

let lastLine = [];
function replayLine() { if (lastLine.length) say(lastLine); }

function wordBeatSegs(w) {
  const langs = enabledLangs();
  if (!langs.length) return [R(`Это — ${w.ru}! Скажи: ${w.ru}!`)];
  const name = { el: 'По-гречески', en: 'По-английски' };
  const hint = { el: w.elHint, en: w.enHint };
  const segs = [R(`${w.ru[0].toUpperCase() + w.ru.slice(1)}. ${name[langs[0]]} —`), { lang: langs[0], t: w[langs[0]], hl: true }, R(`. Скажи: ${hint[langs[0]]}!`)];
  if (langs[1] && settings.mix >= 2) segs.push(R(`А ${name[langs[1]].toLowerCase()} —`), { lang: langs[1], t: w[langs[1]], hl: true });
  if (langs[1] && settings.mix >= 3) segs.push(R(`. Скажи: ${hint[langs[1]]}!`));
  return segs;
}

async function playBeat() {
  if (screen !== 'adventure') return;
  const { adv, i } = cur; const b = adv.beats[i];
  cur.wrong = 0;
  if (session.timeUp && !b.celebrate) {
    // protect the ending: skip to a short wind-down
    await say([R('Ой, наше время почти закончилось. Давай закончим приключение!')]);
    return goodbye();
  }
  $('#scene').innerHTML = b.scene();
  $('#scene').classList.remove('pop'); void $('#scene').offsetWidth; $('#scene').classList.add('pop');
  const ctrl = $('#controls'); ctrl.innerHTML = '';
  ctrl.className = 'controls';

  if (b.word) {
    const langs = enabledLangs();
    ctrl.classList.add('repeat');
    ctrl.innerHTML = `
      <div class="wordcard">
        <div class="wc-icon">${b.word.icon}</div>
        <div class="wc-words"><span class="wc-ru">${b.word.ru}</span>${langs.map((l) => `<b class="hl hl-${l}">${b.word[l]}</b>`).join('')}</div>
      </div>
      <button class="bigbtn ear" id="hearWord" aria-label="Hear the word">${icon.ear()}</button>
      <button class="bigbtn thumb" id="saidIt" aria-label="I said it">${icon.thumb()}</button>`;
    lastLine = wordBeatSegs(b.word);
    $('#hearWord').onclick = () => { const l = enabledLangs(); speak(l.map((x) => ({ lang: x, t: b.word[x], hl: true })), { rate: settings.rate }); };
    $('#saidIt').onclick = () => wordAttempt(b.word);
    await say(lastLine);
    return;
  }
  if (b.choices) {
    ctrl.classList.add('pics', `n${b.choices.length}`);
    ctrl.innerHTML = b.choices.map((c, k) => `<button class="pic" data-k="${k}">${c.icon}</button>`).join('');
    $$('.pic', ctrl).forEach((el) => (el.onclick = () => choose(+el.dataset.k)));
    lastLine = b.say; await say(b.say);
    return;
  }
  // story / celebration beat
  lastLine = b.say;
  if (b.celebrate) { confetti(); chime(); owlDo('celebrate', 2200); }
  ctrl.innerHTML = `<button class="bigbtn next" id="next" aria-label="Next">${icon.arrow()}</button>`;
  $('#next').onclick = () => advance();
  await say(b.say);
  if (b.celebrate) $('#next')?.classList.add('glow');
}

async function choose(k, via = null) {
  if (busy || paused || screen !== 'adventure') return;
  const b = cur.adv.beats[cur.i]; const c = b.choices[k];
  busy = true; stopSpeaking(); session.tries++;
  const btn = $$('#controls .pic')[k];
  if (c.ok) {
    session.correct++;
    if (cur.lvl) { cur.lvl.total++; if (!cur.wrong) cur.lvl.firstTry++; PG.recordSkill('story_adv', !cur.wrong); }
    btn?.classList.add('right'); confetti(); chime(); owlDo('celebrate');
    const praiseLang = via && ['el', 'en'].includes(via) && enabledLangs().includes(via) ? via : 'ru';
    const segs = [...(b.okSay || []), ...rnd(PRAISE[praiseLang])];
    if (settings.mix >= 3 && praiseLang === 'ru' && enabledLangs().length) segs.push(...rnd(PRAISE[rnd(enabledLangs())]));
    if (cameraStats.smiles && session.correct % 3 === 0) segs.push(R('Ты улыбаешься? Тебе весело?'));
    await say(segs);
    busy = false; advance();
  } else {
    cur.wrong++; boop();
    btn?.classList.add('nope'); setTimeout(() => btn?.classList.remove('nope'), 700);
    const segs = c.reply || b.hint || [R('Хм, давай попробуем ещё!')];
    busy = false;
    if (cur.wrong >= 2) { const okIdx = b.choices.findIndex((x) => x.ok); $$('#controls .pic')[okIdx]?.classList.add('hintpulse'); }
    await say(segs);
  }
}

async function wordAttempt(w, heard = null) {
  if (busy) return; busy = true; stopSpeaking();
  if (!session.words.find((x) => x.ru === w.ru)) session.words.push({ ru: w.ru, el: w.el, en: w.en });
  PG.recordWord(w);
  $('#saidIt')?.classList.add('right'); confetti(); chime(); owlDo('celebrate');
  const langs = enabledLangs();
  const segs = [R(rnd(['Хут-хут! Ты попробовал!', 'Ура! Здорово сказал!', 'Ух ты, как красиво!']))];
  if (langs[0]) segs.push({ lang: langs[0], t: w[langs[0]], hl: true }, R('!'));
  await say(segs);
  busy = false; advance();
}

function advance() {
  if (screen !== 'adventure') return;
  cur.i++;
  if (cur.i >= cur.adv.beats.length) return finishAdventure();
  playBeat();
}
async function finishAdventure() {
  busy = false;
  if (cur?.lvl) { const l = cur.lvl; return levelResult(l.world, l.node, { firstTry: l.firstTry, total: Math.max(1, l.total), avgSec: 99, errors: l.total - l.firstTry }); }
  if (session.timeUp) return goodbye();
  home();
}

async function micAdventure() {
  if (busy || paused) return;
  const b = cur.adv.beats[cur.i];
  if (!micReady()) { say([R('Нажми на картинку пальчиком!')]); $$('#controls .pic, #saidIt, #next').forEach((p) => p.classList.add('nudge')); return; }
  stopSpeaking(); $('#mic').classList.add('listening');
  const lang = b.word ? (enabledLangs()[0] === 'en' ? 'en-US' : enabledLangs()[0] === 'el' ? 'el-GR' : 'ru-RU') : 'ru-RU';
  const heard = await listen({ lang });
  $('#mic')?.classList.remove('listening');
  if (screen !== 'adventure') return;
  if (b.word) { if (heard) return wordAttempt(b.word, heard); return say([R('Я не расслышала. Скажи ещё раз — или нажми на пальчик!')]); }
  if (b.choices && heard) {
    const k = b.choices.findIndex((c) => matchKeys(heard, c.keys));
    if (k >= 0) { const c = b.choices[k]; const via = /[α-ωά-ώ]/i.test(heard) ? 'el' : /[a-z]/i.test(heard) ? 'en' : 'ru'; return choose(k, via); }
    const segs = await brain.freeTalk(heard, { world: cur.adv.world, adventure: cur.adv.id, beat: cur.i });
    return say(segs);
  }
  if (!b.choices && heard) return advance();
  say([R('Я не расслышала. Нажми на картинку!')]);
}

/* ================== v2: world maps, levels, rewards, bosses ================== */
const STAGE_ROW = 104;
function stageNodePos(i, stageN) { return { x: 50 + 30 * Math.sin(i * 0.85 + stageN), y: 78 + i * STAGE_ROW }; }

function worldMap(wid) {
  if (session?.timeUp) return goodbye();
  busy = false; L = null; cur = null;
  const list = nodes(wid); const current = PG.currentNode(wid); const W = WORLDS[wid];
  const stagesHTML = STAGES.map((st) => {
    const sn = list.filter((n) => n.stage === st.n);
    const H = 78 + sn.length * STAGE_ROW;
    const pts = sn.map((n, i) => { const p = stageNodePos(i, st.n); return `${p.x},${p.y}`; }).join(' ');
    const open = PG.isUnlocked(wid, sn[0]);
    return `<section class="stage ${open ? '' : 'stage-locked'}" style="height:${H}px">
      <div class="stage-head"><b>${st.ru}</b><span>age ${st.age}</span></div>
      <svg class="path" viewBox="0 0 100 ${H}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="14" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="${W.color}" stroke-width="4" stroke-dasharray="2 12" vector-effect="non-scaling-stroke" stroke-linecap="round" opacity=".55"/></svg>
      ${sn.map((n, i) => {
        const p = stageNodePos(i, st.n); const ls = PG.levelState(wid, n.id); const un = PG.isUnlocked(wid, n); const isCur = n.id === current.id;
        const inner = n.type === 'boss' ? `<div class="node-owl">${owlSVG('none', { costume: BOSSES[wid].id })}</div>` : n.type === 'story' ? icon2.book() : `<span>${n.n}</span>`;
        const stars = ls?.skipped && !ls.stars ? '<em>skip</em>' : [1, 2, 3].map((k) => icon2.starSmall((ls?.stars || 0) >= k)).join('');
        return `<button class="node node-${n.type} ${un ? 'open' : 'locked'} ${ls?.passed ? 'passed' : ''} ${isCur ? 'current' : ''}" data-id="${n.id}" style="left:calc(${p.x}% - ${n.type === 'boss' ? 56 : 44}px);top:${p.y - (n.type === 'boss' ? 56 : 44)}px" aria-label="${n.type} ${n.id}">
          <div class="node-disc">${inner}${un ? '' : `<div class="node-lock">${icon2.lockSmall()}</div>`}</div>
          ${un ? `<div class="node-stars">${stars}</div>` : ''}
          ${isCur ? `<div class="node-sova">${owl(W.accessory)}</div>` : ''}
        </button>`;
      }).join('')}
    </section>`;
  }).join('');
  show('map', `
    <header class="topbar">
      <button class="navbtn home-btn" id="homeBtn" aria-label="Home">${icon.home()}</button>
      ${acornHTML()}${walletHTML()}<div class="spacer"></div>
      <div class="map-title">${W.ru}</div>
      <button class="navbtn trophy-btn" id="rewards" aria-label="Rewards">${icon2.trophy()}</button>
    </header>
    <div class="map-talk"><div class="bubble"><div class="bubble-text"></div></div></div>
    <div class="board world-${wid}" id="board">${stagesHTML}</div>`);
  screenEl.classList.add(`world-${wid}`);
  $('#homeBtn').onclick = () => { stopSpeaking(); home(); };
  $('#rewards').onclick = () => rewards(wid);
  $$('.node').forEach((b) => (b.onclick = () => startNode(wid, nodeById(wid, b.dataset.id))));
  requestAnimationFrame(() => $('.node.current')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
  hoot();
  say([R(current.type === 'boss' ? 'Смотри! В конце этапа нас ждёт особый гость!' : 'Выбирай уровень! Тот, где я сижу, — следующий.')]);
}

function startNode(wid, node) {
  if (busy) return;
  if (!PG.isUnlocked(wid, node)) { boop(); $('.node.current')?.classList.add('nudge'); say([R('Этот уровень пока спит. Пройди тот, где я сижу!')]); return; }
  stopSpeaking();
  if (node.type === 'story') return enterStory(wid, node);
  if (node.type === 'boss') return bossIntro(wid, node);
  runLevel(wid, node);
}

function bossIntro(wid, node) {
  const B = BOSSES[wid];
  show('boss', `
    <header class="topbar"><button class="navbtn home-btn" id="homeBtn" aria-label="Back to map">${icon2.map()}</button>${acornHTML()}<div class="spacer"></div></header>
    <div class="center-stack">
      <div class="theater"><div class="curtain l"></div><div class="curtain r"></div>
        <div class="owl-hero boss-owl">${owlSVG('none', { costume: B.id })}</div>
        <div class="nameplate">${B.ru} <small>(понарошку!)</small></div>
      </div>
      <div class="bubble"><div class="bubble-text"></div></div>
      <p class="small-en">Pretend play: Sova plays a storybook version of ${B.name}. It is not the real person.</p>
      <button class="btn-play" id="go" aria-label="Start boss level">${icon.arrow()}<span>Готов!</span></button>
    </div>`);
  $('#homeBtn').onclick = () => { stopSpeaking(); worldMap(wid); };
  $('#go').onclick = () => { stopSpeaking(); runLevel(wid, node); };
  hoot();
  say([R(B.intro), R('Я задам тебе пять загадок. Готов?')]);
}

function runLevel(wid, node, { practice = false, skill = null } = {}) {
  const st = PG.levelState(wid, node.id); const attempt = st?.plays || 0;
  const qs = practice ? practicePlan(wid, node.stage, skill, langCtx(), `${node.id}|${Date.now()}`) : levelPlan(wid, node, attempt, langCtx());
  const boss = node.type === 'boss';
  L = { wid, node, qs, i: 0, firstTry: 0, total: 0, errors: 0, times: [], struggle: {}, practiced: false, boss, practice, wrong: 0, t0: 0, step: 0, announce: practice };
  trackWorld(wid); busy = false;
  show('level', levelLayout(wid, boss ? owlSVG('none', { costume: BOSSES[wid].id }) : owl(WORLDS[wid].accessory), { dots: qs.length }));
  screenEl.classList.add(`world-${wid}`); if (boss) screenEl.classList.add('boss-level');
  $('#homeBtn').onclick = () => { stopSpeaking(); busy = false; worldMap(wid); };
  $('#doneBtn').onclick = () => { stopSpeaking(); busy = false; goodbye(); };
  $('#replay').onclick = () => replayLine();
  $('#mic').onclick = () => micLevel();
  playQ(true);
}

function updateDots() { $$('#qdots i').forEach((d, i) => { d.className = i < L.i ? 'done' : i === L.i ? 'now' : ''; if (L.qs[i]?.practice) d.classList.add('prac'); }); }

async function playQ(first = false) {
  if (screen !== 'level' || !L) return;
  if (session.timeUp) { await say([R('Ой, наше время почти закончилось. Этот уровень подождёт тебя!')]); return goodbye(); }
  const q = L.qs[L.i]; L.wrong = 0; L.step = 0;
  if ($$('#qdots i').length !== L.qs.length) $('#qdots').innerHTML = '<i></i>'.repeat(L.qs.length);
  updateDots();
  $('#scene').innerHTML = q.scene; $('#scene').classList.remove('pop'); void $('#scene').offsetWidth; $('#scene').classList.add('pop');
  const ctrl = $('#controls'); const n = q.choices.length;
  const textual = q.choices.some((c) => c.label);
  ctrl.className = `controls pics n${n} ${textual ? 'text' : ''} ${q.wide ? 'wide' : ''} ${q.practice ? 'practice' : ''}`;
  ctrl.innerHTML = q.choices.map((c, k) => c.label
    ? `<button class="pic lbl ${c.lang ? 'l-' + c.lang : ''}" data-k="${k}" style="${c.color ? `color:${c.color}` : ''}"><span>${c.label}</span></button>`
    : `<button class="pic" data-k="${k}">${c.icon}</button>`).join('');
  $$('.pic', ctrl).forEach((el) => (el.onclick = () => chooseQ(+el.dataset.k)));
  const intro = [];
  if (first && !L.practice && !L.boss) intro.push(R(L.node.stage > 1 || L.node.n > 1 ? `Уровень ${L.node.n}!` : 'Первый уровень!'));
  if (L.announce && q.practice) { intro.push(R('Давай потренируемся вместе — так мозг становится сильнее!')); L.announce = false; }
  lastLine = [...intro, ...q.say];
  if (q.practice) lastLine = [...lastLine, ...q.hint];
  L.t0 = Date.now();
  await say(lastLine);
  if (L) L.t0 = Math.max(L.t0, Date.now() - 1500); // answer time counted from (about) the end of the question
}

async function chooseQ(k, via = null) {
  if (busy || paused || screen !== 'level' || !L) return;
  const q = L.qs[L.i]; const c = q.choices[k]; const btns = $$('#controls .pic'); const btn = btns[k];
  session.tries++;
  if (q.order) {
    if (btn.classList.contains('right')) return;
    if (c.step === L.step) {
      L.step++; btn.classList.add('right'); btn.insertAdjacentHTML('beforeend', `<b class="stepn">${L.step}</b>`); chime();
      if (L.step < q.choices.length) return;
      busy = true; stopSpeaking(); return correctQ(q, [R(q.storyText)]);
    }
    return wrongQ(q, btns, [R('Хм, а что было раньше?')]);
  }
  busy = true; stopSpeaking();
  if (c.ok) { btn?.classList.add('right'); return correctQ(q, q.okSay || [], via); }
  busy = false; wrongQ(q, btns, null, btn);
}

async function correctQ(q, extra = [], via = null) {
  const dt = (Date.now() - L.t0) / 1000;
  session.correct++;
  if (!q.practice) { L.total++; if (!L.wrong) L.firstTry++; L.times.push(dt); PG.recordSkill(q.skill, !L.wrong, q.math); }
  if (q.word) { PG.recordWord(q.word); if (!session.words.find((x) => x.ru === q.word.ru)) session.words.push(q.word); }
  confetti(); chime(); owlDo('celebrate');
  const praiseLang = via && enabledLangs().includes(via) ? via : 'ru';
  const segs = [...extra, ...rnd(PRAISE[praiseLang])];
  if (q.word && !q.readOnly && settings.mix >= 2) enabledLangs().forEach((l) => segs.push({ lang: l, t: q.word[l], hl: true }));
  if (cameraStats.smiles && session.correct % 4 === 0) segs.push(R('Ты улыбаешься? Тебе весело?'));
  await say(segs);
  busy = false; L.i++;
  if (L.i >= L.qs.length) return finishLevel();
  playQ();
}

async function wrongQ(q, btns, line, btn) {
  L.wrong++; if (!q.practice) L.errors++; boop();
  const b = btn || null; b?.classList.add('nope'); setTimeout(() => b?.classList.remove('nope'), 700);
  if (L.wrong === 2 && !q.order) {
    const okIdx = q.choices.findIndex((x) => x.ok); btns[okIdx]?.classList.add('hintpulse');
    L.struggle[q.skill] = (L.struggle[q.skill] || 0) + 1;
    if (L.struggle[q.skill] >= 2 && !L.practiced && !q.practice && !L.practice) {
      L.practiced = true; L.announce = true;
      L.qs.splice(L.i + 1, 0, ...practicePlan(L.wid, L.node.stage, q.skill, langCtx(), `${L.node.id}|${L.i}`).slice(0, 2));
    }
  }
  await say(line || q.hint || [R('Хм, давай попробуем ещё!')]);
}

function finishLevel() {
  const { wid, node } = L;
  if (L.practice) { PG.addAcorns(2); session.acorns += 2; say([R('Отлично потренировались! Плюс два жёлудя. А теперь — снова уровень!')]).then(() => { if (screen === 'level') runLevel(wid, node); }); return; }
  const avgSec = L.times.length ? L.times.reduce((a, b) => a + b, 0) / L.times.length : 99;
  levelResult(wid, node, { firstTry: L.firstTry, total: L.total, avgSec, errors: L.errors, weakest: Object.entries(L.struggle).sort((a, b) => b[1] - a[1])[0]?.[0] || L.qs[0].skill });
}

function levelResult(wid, node, stats) {
  const out = PG.recordLevel(wid, node, stats);
  session.levels.push({ world: wid, id: node.id, stars: out.stars }); session.stars += out.stars; session.acorns += out.acorns; session.badges.push(...out.badges);
  if (!session.practiced.includes(`${WORLDS[wid].name} ${node.id}`)) session.practiced.push(`${WORLDS[wid].name} level ${node.id} (${out.stars}★)`);
  const show2 = () => resultScreen(wid, node, out, stats);
  if (out.stageComplete) return celebrateStage(wid, node, out, show2);
  show2();
}

function badgeSVG(id, earned = true, tier = 1) {
  const d = PG.BADGES.find((b) => b.id === id) || { emblem: 'star' };
  const em = { star: icon.shape('star', C.gold), map: icon2.map(), dino: icon.dino(), rocket: icon.rocket(), car: icon.car(), lion: icon.lion(), book: icon2.book(), num: icon.num(7), book2: icon2.book(), acorn: icon2.acorn(), trophy: icon2.trophy(), tri: icon.shape('triangle', C.terra), planet: icon.planet(), plug: icon2.plug(), frog: icon.frog() }[d.emblem] || '';
  return `<div class="badge ${earned ? 'earned' : 'unearned'}"><div class="medal">${em}</div>${tier > 1 ? `<i class="tier">★${tier}</i>` : ''}</div>`;
}

function resultScreen(wid, node, out, stats) {
  const list = nodes(wid); const next = list[list.findIndex((x) => x.id === (out.skippedTo || node.id)) + (out.skippedTo ? 0 : 1)];
  const p = PG.get();
  show('result', `
    <div class="center-stack result">
      <div class="big-stars">${[1, 2, 3].map((k) => `<div class="bs ${out.stars >= k ? 'on' : ''}" style="animation-delay:${k * 0.35}s">${icon2.starSmall(out.stars >= k)}</div>`).join('')}</div>
      <div class="owl-hero small">${owl(WORLDS[wid].accessory)}</div>
      <div class="bubble"><div class="bubble-text"></div></div>
      <div class="gain">${out.acorns ? `<span class="plus">+${out.acorns}</span>${icon2.acorn()}` : ''}<span class="tot">${icon2.acorn()}<b>${p.acorns}</b></span></div>
      ${out.badges.length ? `<div class="new-badges">${out.badges.map((b) => badgeSVG(b) + `<span>${(PG.BADGES.find((x) => x.id === b) || {}).ru || ''}</span>`).join('')}</div>` : ''}
      <div class="row-big">
        <button class="bigbtn mapb" id="toMap" aria-label="Map">${icon2.map()}</button>
        ${out.passed ? `<button class="bigbtn replayb" id="again" aria-label="Play again">${icon.replay()}</button>` : `<button class="bigbtn practiceb" id="practice" aria-label="Practice together">${icon2.book()}</button>`}
        ${out.passed && next ? `<button class="bigbtn next glow" id="next" aria-label="Next level">${icon.arrow()}</button>` : ''}
      </div>
    </div>`);
  screenEl.classList.add(`world-${wid}`);
  if (out.stars >= 2) { confetti(); chime(); owlDo('celebrate', 2200); } else owlDo('happy');
  const segs = out.stars === 3 ? [R('Три звезды! Хут-хут! Вот это да!')] : out.stars === 2 ? [R('Две звезды! Уровень пройден!')] : [R('Хорошая попытка! Ты старался — это главное. Давай потренируемся вместе и попробуем ещё.')];
  if (out.acorns) segs.push(R(`Ты получил ${out.acorns} золотых желудей!`));
  if (out.badges.length) segs.push(R('И новый значок!'));
  if (out.skippedTo) segs.push(R('Ты такой быстрый, что можно перепрыгнуть через уровень!'));
  if (session.timeUp) segs.push(R('Наше время закончилось. Пора отдыхать!'));
  say(segs);
  const guard = (fn) => () => { stopSpeaking(); if (session.timeUp) return goodbye(); fn(); };
  $('#toMap').onclick = guard(() => worldMap(wid));
  $('#again') && ($('#again').onclick = guard(() => startNode(wid, node)));
  $('#practice') && ($('#practice').onclick = guard(() => runLevel(wid, node, { practice: true, skill: stats.weakest || STAGES[node.stage - 1].skills[0] })));
  $('#next') && ($('#next').onclick = guard(() => startNode(wid, next)));
}

function celebrateStage(wid, node, out, then) {
  const B = BOSSES[wid]; const wb = PG.WORLD_BADGE[wid];
  show('celebrate', `
    <div class="center-stack cele-screen">
      <h1 class="cele-title">${STAGES[node.stage - 1].ru} пройден!</h1>
      <div class="cele-row"><div class="owl-hero small">${owl(WORLDS[wid].accessory)}</div>${badgeSVG(wid, true, PG.get().badges[wid]?.tier || 1)}<div class="owl-hero small">${owlSVG('none', { costume: B.id })}</div></div>
      <div class="bubble"><div class="bubble-text"></div></div>
      <button class="btn-play" id="go">${icon.arrow()}<span>Ура!</span></button>
    </div>`);
  screenEl.classList.add(`world-${wid}`);
  [0, 600, 1200, 1800].forEach((t) => setTimeout(() => screen === 'celebrate' && confetti(), t));
  chime(); setTimeout(chime, 500); hoot();
  say([R(`Ура! ${STAGES[node.stage - 1].ru} в этом мире пройден! Теперь ты — ${wb.ru}!`), R(`${B.ru} говорит спасибо. Это была игра понарошку, но знания — настоящие!`)]);
  $('#go').onclick = () => { stopSpeaking(); then(); };
}

async function micLevel() {
  if (busy || paused || !L) return;
  const q = L.qs[L.i];
  if (!micReady()) { say([R('Нажми на картинку пальчиком!')]); $$('#controls .pic').forEach((p) => p.classList.add('nudge')); return; }
  stopSpeaking(); $('#mic').classList.add('listening');
  const heard = await listen({ lang: 'ru-RU' });
  $('#mic')?.classList.remove('listening');
  if (screen !== 'level') return;
  if (heard && !q.order) {
    const k = q.choices.findIndex((c) => matchKeys(heard, c.keys || []));
    if (k >= 0) return chooseQ(k, /[α-ωά-ώ]/i.test(heard) ? 'el' : /[a-z]/i.test(heard) ? 'en' : 'ru');
    return say(await brain.freeTalk(heard, { world: L.wid, level: L.node.id, skill: q.skill }));
  }
  say([R('Я не расслышала. Нажми на картинку!')]);
}

function rewards(fromWorld = null) {
  const p = PG.get();
  show('rewards', `
    <header class="topbar"><button class="navbtn home-btn" id="homeBtn" aria-label="Back">${fromWorld ? icon2.map() : icon.home()}</button>${acornHTML()}${walletHTML()}<div class="spacer"></div></header>
    <div class="rewards">
      <div class="rw-owl"><div class="owl-hero" id="rwOwl">${owl('scarf')}</div><div class="bubble"><div class="bubble-text"></div></div></div>
      <div class="rw-panels">
        <h2 class="rw-h">${icon2.acorn()} Наряды</h2>
        <div class="shop">${PG.OUTFITS.map((o) => { const own = p.owned.includes(o.id), on = p.outfit === o.id; return `<button class="outfit ${own ? 'own' : ''} ${on ? 'on' : ''} ${!own && p.acorns < o.price ? 'cant' : ''}" data-o="${o.id}" aria-label="${o.name}"><div class="of-owl">${owlSVG('scarf', { outfit: o.id })}</div><div class="of-price">${on ? '✓' : own ? '' : `${icon2.acorn()}<b>${o.price}</b>`}</div></button>`; }).join('')}</div>
        <h2 class="rw-h">${icon2.trophy()} Значки</h2>
        <div class="badges">${PG.BADGES.map((b) => `<div class="bslot" title="${b.name}">${badgeSVG(b.id, !!p.badges[b.id], p.badges[b.id]?.tier || 1)}<span>${b.ru}</span></div>`).join('')}</div>
      </div>
    </div>`);
  $('#homeBtn').onclick = () => { stopSpeaking(); fromWorld ? worldMap(fromWorld) : home(); };
  $$('.outfit').forEach((b) => (b.onclick = () => {
    const id = b.dataset.o; const o = PG.OUTFITS.find((x) => x.id === id);
    if (p.owned.includes(id)) { PG.equip(id); chime(); rewards(fromWorld); say([R(`Красиво! ${o.ru}!`)]); return; }
    if (PG.buy(id)) { confetti(); chime(); rewards(fromWorld); owlDo('celebrate'); say([R(`Ух ты! Новый наряд — ${o.ru.toLowerCase()}! Спасибо за жёлуди!`)]); session && (session.badges.push('outfit:' + id)); return; }
    boop(); say([R(`Нужно ещё ${o.price - p.acorns} желудей. Проходи уровни и собирай звёзды!`)]);
  }));
  say([R('Здесь можно нарядить меня за золотые жёлуди и посмотреть твои значки!')]);
}

/* ------------------ goodbye & summary ------------------ */
function langWords() { return session.words.map((w) => [w.ru, settings.el && w.el, settings.en && w.en].filter(Boolean).join(' / ')); }

async function goodbye() {
  if (!session) return start();
  busy = false; cur = null; paused = false; document.body.classList.remove('paused');
  stopSpeaking(); stopListening();
  const end = Date.now();
  const mood = moodLabel();
  const rec = {
    id: session.id, start: session.start, end, minutes: Math.max(1, Math.round(session.playMs / 60000)),
    worlds: session.worlds.map((w) => WORLDS[w].name), adventures: session.adventures.map((id) => ADVENTURES.find((a) => a.id === id)?.title),
    words: session.words, practiced: [...new Set(session.practiced)], tip: session.tips.at(-1) || 'Ask David to tell you about Sova’s adventure in his own words.',
    checkin: session.checkin, mood, correct: session.correct, tries: session.tries, camera: cameraOn() ? { ...cameraStats } : null,
    levels: session.levels, stars: session.stars, acorns: session.acorns, badges: session.badges.filter((b) => !String(b).startsWith('outfit:')),
  };
  store.addSession(rec); store.setLastEnd(end);
  stopCamera(); renderCamPill();
  const sess = session; session = null;
  show('goodbye', `
    <div class="center-stack sunset">
      <div class="owl-hero waving">${owlSVG('scarf')}</div>
      <div class="bubble"><div class="bubble-text"></div></div>
      <button class="btn-play hug" id="hug" aria-label="Go to mum or dad">${hugIcon()}<span>К маме и папе!</span></button>
    </div>`);
  $('#hug').onclick = () => { stopSpeaking(); summary(rec); };
  const worldsRu = sess.worlds.map((w) => ({ dino: 'в Долине динозавров', space: 'в космосе', cars: 'в Городе гонок', jungle: 'в джунглях' }[w]));
  const segs = [R('Какое приключение!')];
  if (worldsRu.length) segs.push(R(`Мы были ${worldsRu.length > 1 ? worldsRu.slice(0, -1).join(', ') + ' и ' + worldsRu.at(-1) : worldsRu[0]}.`));
  const w = sess.words.slice(0, 2);
  if (w.length) {
    segs.push(R('Мы выучили слова:'));
    w.forEach((x) => { enabledLangs().forEach((l) => segs.push({ lang: l, t: x[l], hl: true })); });
    segs.push(R('.'));
  }
  if (sess.stars) segs.push(R(`Ты собрал ${sess.stars} звёзд${sess.acorns ? ` и ${sess.acorns} желудей` : ''}!`));
  segs.push(R('Я буду здесь, когда захочешь поиграть снова. Иди обними маму или папу!'));
  await say(segs);
}
function hugIcon() { return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86 C10 60 8 34 26 24 C38 18 48 26 50 34 C52 26 62 18 74 24 C92 34 90 60 50 86Z" fill="#fff"/></svg>`; }

function moodLabel() {
  const s = cameraStats;
  const parts = [];
  if (session.checkin) parts.push({ happy: 'started happy', ok: 'started “okay”', sad: 'started a bit sad' }[session.checkin]);
  if (cameraOn() && s.samples > 20) {
    const r = s.smileSamples / s.samples;
    parts.push(r > 0.25 ? 'smiled a lot' : r > 0.08 ? 'smiled sometimes' : 'focused, few smiles');
    if (s.awayEvents + s.goneEvents > 2) parts.push('looked away several times');
  }
  if (session.tries) parts.push(`${session.correct}/${session.tries} taps on target`);
  return parts.join(' · ') || '—';
}

function summaryCard(r) {
  const d = new Date(r.start);
  return `<div class="sum-card">
    <div class="sum-head"><b>${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</b><span>${r.minutes} min</span></div>
    <div><span class="lbl">Worlds</span> ${r.worlds.join(', ') || '—'}</div>
    <div><span class="lbl">Adventures</span> ${r.adventures.join(', ') || '—'}</div>
    <div><span class="lbl">Words</span> ${r.words.map((w) => `${w.ru} / <b class="hl hl-el">${w.el}</b> / <b class="hl hl-en">${w.en}</b>`).join(' · ') || '—'}</div>
    <div><span class="lbl">Practiced</span> ${r.practiced.join('; ') || '—'}</div>
    ${r.levels?.length ? `<div><span class="lbl">Levels</span> ${r.levels.map((l) => `${WORLDS[l.world]?.name.split(' ')[0]} ${l.id} ${'★'.repeat(l.stars)}`).join(', ')} · ${r.stars}★ · +${r.acorns} acorns${r.badges?.length ? ` · new badges: ${r.badges.map((b) => PG.BADGES.find((x) => x.id === b)?.name || b).join(', ')}` : ''}</div>` : ''}
    <div><span class="lbl">Mood</span> ${r.mood}</div>
    <div class="tip"><b>Try at home:</b> ${r.tip}</div>
  </div>`;
}

function summary(rec) {
  show('summary', `
    <div class="parent-wrap">
      <h1>Today with Sova</h1>
      ${summaryCard(rec)}
      <p class="note">Sova is an AI owl guide, not a real friend. Nothing was recorded; this summary is stored only on this device.</p>
      <div class="row"><button class="pbtn" id="recap">▶ Listen to recap</button><button class="pbtn" id="pc">Parent corner</button><button class="pbtn primary" id="fin">Done</button></div>
    </div>`);
  $('#recap').onclick = () => say([R(`Сегодня ${NAME} играл ${rec.minutes} минут.`), ...(rec.words.length ? [R('Новые слова:'), ...rec.words.flatMap((w) => enabledLangs().map((l) => ({ lang: l, t: w[l], hl: true })))] : [])], { bubble: false });
  $('#pc').onclick = () => pin();
  $('#fin').onclick = () => start();
}

/* ------------------ parent corner ------------------ */
function pin() {
  stopSpeaking(); stopListening();
  const back = screen; let code = '';
  show('pin', `
    <div class="parent-wrap pin-wrap">
      <button class="close" id="close" aria-label="Close">✕</button>
      <h1>Parent Corner</h1><p>Enter PIN to come in</p>
      <div class="pin-dots">${'<i></i>'.repeat(4)}</div>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, 'OK'].map((k) => `<button data-k="${k}">${k}</button>`).join('')}</div>
      <p class="hint">demo PIN: ${CONFIG.PIN}</p>
    </div>`);
  const dots = () => $$('.pin-dots i').forEach((d, i) => d.classList.toggle('on', i < code.length));
  $('#close').onclick = () => (session ? home() : start());
  $$('.pad button').forEach((b) => (b.onclick = () => {
    const k = b.dataset.k;
    if (k === '←') code = code.slice(0, -1);
    else if (k === 'OK') { if (code === CONFIG.PIN) return parent(); code = ''; $('.pin-dots').classList.add('nope'); setTimeout(() => $('.pin-dots')?.classList.remove('nope'), 600); }
    else if (code.length < 4) { code += k; if (code.length === 4 && code === CONFIG.PIN) { dots(); return setTimeout(parent, 150); } }
    dots();
  }));
}

function parent() {
  const sessions = store.sessions();
  const vr = voiceReport();
  const s = settings;
  show('parent', `
    <div class="parent-wrap">
      <div class="ph"><h1>Parent Corner</h1><button class="pbtn primary" id="play">▶ Back to play</button></div>
      <section><h2>Last session</h2>${sessions[0] ? summaryCard(sessions[0]) : '<p class="note">No sessions yet.</p>'}
        ${sessions.length > 1 ? `<details><summary>Earlier sessions (${sessions.length - 1})</summary>${sessions.slice(1, 8).map(summaryCard).join('')}</details>` : ''}</section>

      <section id="progress"><h2>Progress</h2>${progressHTML()}</section>

      <section><h2>Levels & difficulty</h2>
        <p class="note">Each world has 5 stages (ages 5 → 10), 10 levels + a guest-star boss per stage. A level passes with 2 of 3 stars; the next one then unlocks. Two perfect, fast levels in a row skip one level ahead; repeated mistakes add a short practice round with hints.</p>
        <label class="tog">Starting stage
          <select id="startStage">${STAGES.map((st) => `<option value="${st.n}" ${PG.get().startStage === st.n ? 'selected' : ''}>${st.ru.replace('Этап', 'Stage')} · age ${st.age}</option>`).join('')}</select></label>
        <label class="tog"><input type="checkbox" id="unlockAll" ${PG.get().unlockAll ? 'checked' : ''}> Unlock all levels (for testing)</label>
        <div class="row"><button class="pbtn danger" id="resetProg">Reset level progress</button></div>
      </section>

      <section><h2>Language mix</h2>
        <p class="note">Russian is always the home base. Choose how much Greek and English Sova sprinkles in.</p>
        <input type="range" min="1" max="3" step="1" id="mix" value="${s.mix}"><div class="range-labels"><span>Mostly Russian</span><span>Balanced</span><span>More Greek &amp; English</span></div>
        <label class="tog"><input type="checkbox" id="el" ${s.el ? 'checked' : ''}> Greek words (Ελληνικά)</label>
        <label class="tog"><input type="checkbox" id="en" ${s.en ? 'checked' : ''}> English words</label>
      </section>

      <section><h2>Session length</h2>
        <div class="seg" id="len">${[10, 15, 20].map((m) => `<button data-m="${m}" class="${s.sessionMin === m ? 'on' : ''}">${m} min</button>`).join('')}</div>
        <p class="note">The acorn fills as time passes. Sova then winds down kindly and needs a ${CONFIG.COOLDOWN_MIN}-minute rest (or your OK) before another session. Two short sessions a day is plenty.</p>
      </section>

      <section><h2>Camera (optional)</h2>
        <label class="tog"><input type="checkbox" id="cam" ${s.camera ? 'checked' : ''}> Let Sova notice David's face</label>
        <p class="note">When on, the camera runs face detection <b>on this device only</b> (MediaPipe) to notice: is David there, is he looking away, is he smiling. Sova then pauses or adapts gently. No video, photos or face data are stored or sent anywhere. A red “camera on” badge is always visible while it runs. It turns off when the session ends.</p>
      </section>

      <section><h2>Microphone & voice</h2>
        <label class="tog"><input type="checkbox" id="mic" ${s.mic ? 'checked' : ''}> Let David answer by talking ${canListen() ? '' : '<em>(not supported in this browser — taps still work)</em>'}</label>
        <label class="tog"><input type="checkbox" id="subs" ${s.subtitles ? 'checked' : ''}> Show Sova's words on screen (for grown-ups)</label>
        <p class="note">Voices found on this device — Russian: <b>${vr.ru || 'none (install a Russian voice in system settings)'}</b>, Greek: <b>${vr.el || 'none'}</b>, English: <b>${vr.en || 'none'}</b>. ${vr.supported ? '' : 'This browser has no speech; Sova will show text only.'}</p>
        <button class="pbtn" id="test">Test Sova's voice</button>
      </section>

      <section><h2>About Sova & safety</h2>
        <p class="note"><b>Sova is an AI owl, not a real friend. David should always know that.</b> She says so in every session, never uses guilt (“I'll be sad if you go”), and always ends by sending him back to mum or dad. This v1 uses pre-written adventures; nothing David says is sent to any server.</p>
      </section>

      <section><h2>Data</h2>
        <p class="note">Everything (settings and session summaries) lives only in this browser's storage.</p>
        <div class="row"><button class="pbtn" id="dl">Download data</button><button class="pbtn danger" id="wipe">Delete all data</button><button class="pbtn" id="newS">Start a new session now</button></div>
      </section>
      <p class="foot">Sova v2 · brain: ${brain.mode()} · voice: ${CONFIG.VOICE}</p>
    </div>`);
  const save = () => { store.saveSettings(settings); };
  $('#mix').oninput = (e) => { settings.mix = +e.target.value; save(); };
  $('#el').onchange = (e) => { settings.el = e.target.checked; save(); };
  $('#en').onchange = (e) => { settings.en = e.target.checked; save(); };
  $$('#len button').forEach((b) => (b.onclick = () => { settings.sessionMin = +b.dataset.m; save(); $$('#len button').forEach((x) => x.classList.toggle('on', x === b)); }));
  $('#cam').onchange = async (e) => {
    settings.camera = e.target.checked; save();
    if (!settings.camera) { stopCamera(); renderCamPill(); }
    else if (session) maybeStartCamera();
  };
  $('#mic').onchange = (e) => { settings.mic = e.target.checked; save(); };
  $('#subs').onchange = (e) => { settings.subtitles = e.target.checked; save(); document.body.classList.toggle('nosubs', !settings.subtitles); };
  $('#test').onclick = () => say([R(`Привет, ${NAME}! Я Сова.`), G('Γεια σου!', { hl: false }), E('Hello!', { hl: false })], { bubble: false });
  $('#dl').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ ...store.exportAll(), progress: PG.exportProgress(), v1Backup: PG.v1Backup() }, null, 2)], { type: 'application/json' })); a.download = 'sova-data.json'; a.click(); };
  $('#wipe').onclick = () => { if (confirm('Delete all Sova settings, progress and session summaries from this device?')) { store.wipe(); localStorage.removeItem('sova.progress.v2'); localStorage.removeItem('sova.v1backup'); PG.load(); settings = store.settings(); toast('All Sova data deleted.'); parent(); } };
  $('#startStage').onchange = (e) => { PG.setStartStage(+e.target.value); toast(`Starting stage set to ${e.target.value}. Earlier stages stay open for practice.`); parent(); };
  $('#unlockAll').onchange = (e) => { PG.setUnlockAll(e.target.checked); toast(e.target.checked ? 'All levels unlocked (testing mode).' : 'Normal unlocking restored.'); };
  $('#resetProg').onclick = () => { if (confirm('Reset stars, acorns, badges and outfits? Session history and settings are kept.')) { PG.resetProgress(); toast('Level progress reset.'); parent(); } };
  $('#newS').onclick = () => { store.setLastEnd(0); session ? home() : greet(false); };
  $('#play').onclick = () => { if (session) home(); else start(); };
}

function progressHTML() {
  const p = PG.get(); const sr = PG.skillReport();
  const worldRows = WORLD_IDS.map((w) => {
    const list = nodes(w); const sm = PG.worldSummary(w);
    const bars = STAGES.map((st) => { const sn = list.filter((n) => n.stage === st.n); const done = sn.filter((n) => PG.levelState(w, n.id)?.passed).length; const stars = sn.reduce((a, n) => a + (PG.levelState(w, n.id)?.stars || 0), 0); return `<div class="pbar" title="Stage ${st.n}: ${done}/${sn.length} levels, ${stars}★"><i style="width:${(done / sn.length) * 100}%"></i><span>S${st.n} ${done}/${sn.length}</span></div>`; }).join('');
    return `<div class="prow"><b>${WORLDS[w].name}</b><span class="pmeta">now: Stage ${sm.stage} · ${sm.stars}★ · ${p.badges[w] ? `${PG.WORLD_BADGE[w].name} ★${p.badges[w].tier}` : 'no world badge yet'}</span><div class="pbars">${bars}</div></div>`;
  }).join('');
  const sk = (arr) => arr.length ? arr.map((x) => `<span class="chip">${SKILL_NAMES[x.skill] || x.skill} <em>${x.pct}% of ${x.n}</em></span>`).join('') : '<span class="note">—</span>';
  const earned = PG.BADGES.filter((b) => p.badges[b.id]).map((b) => b.name);
  return `${worldRows}
    <div class="pkv"><span class="lbl">Acorns</span> ${p.acorns} (earned ${p.acornsEarned}) · outfits: ${p.owned.length - 1} · wearing: ${PG.OUTFITS.find((o) => o.id === p.outfit)?.name}</div>
    <div class="pkv"><span class="lbl">Badges</span> ${earned.join(', ') || '—'}</div>
    <div class="pkv"><span class="lbl">Words</span> ${p.words.length} learned</div>
    <div class="pkv"><span class="lbl">Mastered</span> ${sk(sr.mastered)}</div>
    <div class="pkv"><span class="lbl">Needs practice</span> ${sk(sr.struggling)}</div>
    <div class="pkv"><span class="lbl">Practicing</span> ${sk(sr.practicing)}</div>
    ${p.migratedFromV1 ? `<p class="note">v1 data migrated (${p.migratedFromV1.sessions} sessions → story levels, words and a welcome gift of acorns). A backup of the original v1 data is kept on this device.</p>` : ''}`;
}

/* ------------------ boot ------------------ */
document.body.classList.toggle('nosubs', !settings.subtitles);
$('#campill').innerHTML = `${icon.cam()}<span>Camera on · on this device only</span>`;
window.__sova = { home, worldMap, startNode, rewards, parent, goodbye, pin, PG, nodeById, get session() { return session; }, get L() { return L; }, get cur() { return cur; }, get screen() { return screen; } }; // handy for testing
start();
