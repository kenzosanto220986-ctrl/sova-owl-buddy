// SOVA v2: progress, rewards and safe migration from v1. localStorage only.
import { nodes, WORLD_IDS, STORY_SLOTS } from './levels.js';
import { ADVENTURES } from './adventures.js';

const KEY = 'sova.progress.v2', BACKUP = 'sova.v1backup';

export const WORLD_BADGE = {
  dino: { name: 'Dino Expert', ru: 'Знаток динозавров' }, space: { name: 'Space Captain', ru: 'Капитан космоса' },
  cars: { name: 'Race Champion', ru: 'Чемпион гонок' }, jungle: { name: 'Jungle Ranger', ru: 'Смотритель джунглей' },
};
export const BADGES = [
  { id: 'first-star', name: 'First Star', ru: 'Первая звезда', emblem: 'star' },
  { id: 'explorer', name: 'Explorer', ru: 'Путешественник', emblem: 'map' },
  { id: 'dino', name: 'Dino Expert', ru: 'Знаток динозавров', emblem: 'dino', world: true },
  { id: 'space', name: 'Space Captain', ru: 'Капитан космоса', emblem: 'rocket', world: true },
  { id: 'cars', name: 'Race Champion', ru: 'Чемпион гонок', emblem: 'car', world: true },
  { id: 'jungle', name: 'Jungle Ranger', ru: 'Смотритель джунглей', emblem: 'lion', world: true },
  { id: 'word-wizard', name: 'Word Wizard', ru: 'Волшебник слов', emblem: 'book' },
  { id: 'math-star', name: 'Math Star', ru: 'Звезда математики', emblem: 'num' },
  { id: 'story-teller', name: 'Story Teller', ru: 'Сказочник', emblem: 'book2' },
  { id: 'acorn-100', name: 'Acorn Collector', ru: 'Собиратель желудей', emblem: 'acorn' },
  { id: 'stage-master', name: 'Stage Master', ru: 'Мастер этапа', emblem: 'trophy' },
  { id: 'guest-pythagoras', name: "Pythagoras' Helper", ru: 'Помощник Пифагора', emblem: 'tri' },
  { id: 'guest-einstein', name: "Einstein's Helper", ru: 'Помощник Эйнштейна', emblem: 'planet' },
  { id: 'guest-tesla', name: "Tesla's Helper", ru: 'Помощник Теслы', emblem: 'plug' },
  { id: 'guest-darwin', name: "Darwin's Helper", ru: 'Помощник Дарвина', emblem: 'frog' },
];
export const OUTFITS = [
  { id: 'none', ru: 'Шарфик', name: 'Scarf', price: 0 },
  { id: 'bowtie', ru: 'Бабочка', name: 'Bow tie', price: 15 },
  { id: 'sunglasses', ru: 'Очки', name: 'Sunglasses', price: 25 },
  { id: 'party', ru: 'Колпачок', name: 'Party hat', price: 30 },
  { id: 'flower', ru: 'Цветок', name: 'Flower', price: 30 },
  { id: 'chef', ru: 'Колпак повара', name: 'Chef hat', price: 45 },
  { id: 'pirate', ru: 'Пиратская шляпа', name: 'Pirate hat', price: 60 },
  { id: 'tophat', ru: 'Цилиндр', name: 'Top hat', price: 70 },
  { id: 'cape', ru: 'Плащ героя', name: 'Hero cape', price: 90 },
  { id: 'wizard', ru: 'Шляпа волшебника', name: 'Wizard hat', price: 120 },
  { id: 'goldcrown', ru: 'Золотая корона', name: 'Gold crown', price: 160 },
];

const fresh = () => ({ v: 2, acorns: 0, acornsEarned: 0, badges: {}, owned: ['none'], outfit: 'none', startStage: 1, unlockAll: false,
  worlds: Object.fromEntries(WORLD_IDS.map((w) => [w, { lv: {}, fast: 0 }])), skills: {}, words: [], stats: { levels: 0, mathOk: 0, stories: 0, bosses: 0 }, created: Date.now() });

let P = null;
export function load() {
  try { P = JSON.parse(localStorage.getItem(KEY)); } catch { P = null; }
  if (!P || P.v !== 2) { P = fresh(); migrateV1(P); save(); }
  for (const w of WORLD_IDS) P.worlds[w] ||= { lv: {}, fast: 0 };
  return P;
}
export const save = () => localStorage.setItem(KEY, JSON.stringify(P));
export const get = () => P || load();

function migrateV1(p) {
  const raw = (k) => localStorage.getItem(k);
  const v1 = { settings: raw('sova.settings.v1'), sessions: raw('sova.sessions.v1'), firstRun: raw('sova.firstRunDone'), lastEnd: raw('sova.lastEnd') };
  if (!v1.sessions && !v1.settings) return;
  if (!localStorage.getItem(BACKUP)) localStorage.setItem(BACKUP, JSON.stringify({ ...v1, backedUpAt: new Date().toISOString() }));
  let sessions = []; try { sessions = JSON.parse(v1.sessions) || []; } catch {}
  for (const s of sessions) {
    for (const w of s.words || []) if (!p.words.find((x) => x.ru === w.ru)) p.words.push(w);
    for (const title of s.adventures || []) {
      const adv = ADVENTURES.find((a) => a.title === title); if (!adv) continue;
      const idx = ADVENTURES.filter((a) => a.world === adv.world).indexOf(adv);
      const n = Object.keys(STORY_SLOTS).find((k) => STORY_SLOTS[k] === idx);
      p.worlds[adv.world].lv[`1-${n}`] = { stars: 2, passed: true, plays: 1, migrated: true };
    }
  }
  if (sessions.length) { p.acorns = p.acornsEarned = 10 * Math.min(sessions.length, 5); p.migratedFromV1 = { sessions: sessions.length, at: Date.now() }; }
}

/* ---------- unlocking ---------- */
export function isUnlocked(world, node) {
  const p = get(); if (p.unlockAll) return true;
  if (node.stage < p.startStage) return true;
  const list = nodes(world); const i = list.findIndex((x) => x.id === node.id);
  if (i === 0 || (node.stage === p.startStage && node.n === 1)) return true;
  return !!p.worlds[world].lv[list[i - 1].id]?.passed;
}
export const levelState = (world, id) => get().worlds[world].lv[id] || null;
export function currentNode(world) {
  const list = nodes(world); return list.find((n) => isUnlocked(world, n) && !levelState(world, n.id)?.passed && n.stage >= get().startStage) || list[list.length - 1];
}
export function worldSummary(world) {
  const p = get(); const lv = p.worlds[world].lv; const vals = Object.values(lv);
  return { stars: vals.reduce((a, b) => a + (b.stars || 0), 0), passed: vals.filter((v) => v.passed).length, stage: currentNode(world).stage };
}

/* ---------- recording a finished level ---------- */
export function starsFor(firstTry, total) { const r = total ? firstTry / total : 0; return r >= 0.9 ? 3 : r >= 0.6 ? 2 : 1; }

export function recordLevel(world, node, { firstTry, total, avgSec = 99, errors = 0 }) {
  const p = get(); const W = p.worlds[world]; const prev = W.lv[node.id] || { stars: 0, passed: false, plays: 0 };
  const stars = starsFor(firstTry, total); const passed = stars >= 2;
  const gained = Math.max(0, stars - (prev.stars || 0));
  const rec = { stars: Math.max(stars, prev.stars || 0), passed: prev.passed || passed, plays: (prev.plays || 0) + 1, last: Date.now() };
  W.lv[node.id] = rec;
  let acorns = gained * 5; const out = { stars, passed, acorns: 0, badges: [], skippedTo: null, stageComplete: false, firstPass: passed && !prev.passed };
  p.stats.levels++;
  if (node.type === 'story' && passed && !prev.passed) p.stats.stories++;
  if (node.type === 'boss' && passed && !prev.passed) { acorns += 25; p.stats.bosses++; out.stageComplete = true; }
  // adaptive skip-ahead: two lightning-fast perfect quiz levels in a row
  if (node.type === 'quiz' && stars === 3 && errors === 0 && avgSec < 6) W.fast = (W.fast || 0) + 1; else W.fast = 0;
  if (W.fast >= 2 && passed) {
    const list = nodes(world); const i = list.findIndex((x) => x.id === node.id); const nx = list[i + 1], nx2 = list[i + 2];
    if (nx && nx2 && nx.type === 'quiz' && nx.stage === node.stage && nx2.stage === node.stage && !W.lv[nx.id]?.passed) { W.lv[nx.id] = { stars: 0, passed: true, skipped: true, plays: 0 }; out.skippedTo = nx2.id; W.fast = 0; }
  }
  out.badges = checkBadges(world, node, out);
  acorns += out.badges.length * 10;
  addAcorns(acorns); out.acorns = acorns;
  save(); return out;
}
export function addAcorns(n) { const p = get(); p.acorns += n; p.acornsEarned += n; save(); }
export function recordSkill(skill, ok, math) { const p = get(); const s = (p.skills[skill] ||= { ok: 0, bad: 0 }); ok ? s.ok++ : s.bad++; if (ok && math) p.stats.mathOk++; save(); }
export function recordWord(w) { const p = get(); if (w && !p.words.find((x) => x.ru === w.ru)) { p.words.push({ ru: w.ru, el: w.el, en: w.en }); save(); } }

function award(id, list) { const p = get(); if (!p.badges[id]) { p.badges[id] = { at: Date.now(), tier: 1 }; list.push(id); } }
function checkBadges(world, node, out) {
  const p = get(); const got = [];
  if (out.stars > 0) award('first-star', got);
  if (WORLD_IDS.every((w) => Object.keys(p.worlds[w].lv).length)) award('explorer', got);
  if (p.words.length >= 15) award('word-wizard', got);
  if (p.stats.mathOk >= 40) award('math-star', got);
  if (p.stats.stories >= 2) award('story-teller', got);
  if (p.acornsEarned >= 100) award('acorn-100', got);
  if (node.type === 'boss' && out.passed) {
    const guest = { dino: 'pythagoras', space: 'einstein', cars: 'tesla', jungle: 'darwin' }[world];
    award(`guest-${guest}`, got);
    if (!p.badges[world]) award(world, got); else { p.badges[world].tier = Math.max(p.badges[world].tier, node.stage); }
    if (WORLD_IDS.every((w) => p.worlds[w].lv[`${node.stage}-B`]?.passed)) award('stage-master', got);
  }
  return got;
}

/* ---------- shop ---------- */
export function buy(id) {
  const p = get(); const o = OUTFITS.find((x) => x.id === id); if (!o || p.owned.includes(id)) return false;
  if (p.acorns < o.price) return false; p.acorns -= o.price; p.owned.push(id); p.outfit = id; save(); return true;
}
export function equip(id) { const p = get(); if (p.owned.includes(id)) { p.outfit = id; save(); } }

/* ---------- parent tools ---------- */
export function setStartStage(n) { get().startStage = n; save(); }
export function setUnlockAll(v) { get().unlockAll = !!v; save(); }
export function resetProgress() { P = fresh(); save(); }
export function skillReport() {
  const out = { mastered: [], struggling: [], practicing: [] };
  for (const [k, s] of Object.entries(get().skills)) { const n = s.ok + s.bad, r = n ? s.ok / n : 0; (n >= 6 && r >= 0.8 ? out.mastered : n >= 4 && r < 0.6 ? out.struggling : out.practicing).push({ skill: k, ok: s.ok, n, pct: Math.round(r * 100) }); }
  return out;
}
export const exportProgress = () => get();
export const v1Backup = () => { try { return JSON.parse(localStorage.getItem(BACKUP)); } catch { return null; } };
