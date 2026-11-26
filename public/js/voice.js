// Sova's voice. Default: browser speechSynthesis (ru-RU base, el-GR / en-US for sprinkled words).
// RemoteVoice (ElevenLabs via /server) can be switched on in config.js later.
import { CONFIG } from './config.js';

const LANG = { ru: 'ru-RU', el: 'el-GR', en: 'en-US' };
const PREFERRED = {
  ru: [/milena/i, /google русский/i, /svetlana/i, /dariya|daria/i, /irina/i, /female/i],
  el: [/melina/i, /google ελληνικά/i, /athina/i, /female/i],
  en: [/samantha/i, /google us english/i, /aria|jenny|ava/i, /female/i],
};

let voices = [];
const loadVoices = () => { if ('speechSynthesis' in window) voices = speechSynthesis.getVoices(); };
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.addEventListener?.('voiceschanged', loadVoices); }

export function pickVoice(lang) {
  const tag = LANG[lang];
  const pool = voices.filter((v) => v.lang?.replace('_', '-').toLowerCase().startsWith(tag.slice(0, 2)));
  for (const re of PREFERRED[lang]) { const v = pool.find((x) => re.test(x.name)); if (v) return v; }
  return pool.find((v) => v.lang.replace('_', '-') === tag) || pool[0] || null;
}
export const voiceReport = () => ({ supported: 'speechSynthesis' in window, ru: pickVoice('ru')?.name || null, el: pickVoice('el')?.name || null, en: pickVoice('en')?.name || null });

let token = 0;
const listeners = new Set();
export const onSpeaking = (fn) => listeners.add(fn);
const emit = (v) => listeners.forEach((fn) => fn(v));

function speakOne(seg, rate, my) {
  return new Promise((resolve) => {
    if (my !== token) return resolve();
    const text = seg.t.replace(/[«»]/g, '');
    const est = 600 + text.length * 85 / rate;
    if (!('speechSynthesis' in window)) { setTimeout(resolve, est); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG[seg.lang];
    const v = pickVoice(seg.lang); if (v) u.voice = v;
    u.rate = seg.hl ? rate * 0.8 : rate; // slow down for target words
    u.pitch = 1.15;
    let done = false; const fin = () => { if (!done) { done = true; clearTimeout(guard); resolve(); } };
    const guard = setTimeout(fin, est * 2.2 + 1500); // Safari/Chrome sometimes never fire onend
    u.onend = fin; u.onerror = fin;
    speechSynthesis.speak(u);
  });
}

async function remoteSpeak(segs, my) {
  // Expected backend: POST {API_BASE}/api/sova/tts {segments:[{lang,t}]} -> audio/mpeg
  const res = await fetch(`${CONFIG.API_BASE}/api/sova/tts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ segments: segs }) });
  if (!res.ok) throw new Error('tts ' + res.status);
  const url = URL.createObjectURL(await res.blob());
  await new Promise((r) => { const a = new Audio(url); a.onended = r; a.onerror = r; if (my === token) a.play().catch(r); else r(); });
}

export async function speak(segs, { rate = 0.92 } = {}) {
  const my = ++token;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  emit(true);
  try {
    if (CONFIG.VOICE === 'remote' && CONFIG.API_BASE) {
      try { await remoteSpeak(segs, my); return; } catch (e) { console.warn('Remote voice failed, using browser voice', e); }
    }
    for (const s of segs) { if (my !== token) break; await speakOne(s, rate, my); }
  } finally { if (my === token) emit(false); }
}
export function stopSpeaking() { token++; if ('speechSynthesis' in window) speechSynthesis.cancel(); emit(false); }
