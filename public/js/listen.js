// Optional speech recognition (webkitSpeechRecognition, ru-RU). Falls back to tap-only play.
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = () => !!SR;
let active = null;

export function listen({ lang = 'ru-RU', ms = 6000 } = {}) {
  return new Promise((resolve) => {
    if (!SR) return resolve(null);
    try { active?.abort(); } catch {}
    const r = new SR(); active = r;
    r.lang = lang; r.interimResults = false; r.maxAlternatives = 3; r.continuous = false;
    let out = null; const t = setTimeout(() => { try { r.stop(); } catch {} }, ms);
    r.onresult = (e) => { out = Array.from(e.results[0]).map((a) => a.transcript.toLowerCase()).join(' | '); };
    r.onerror = () => {};
    r.onend = () => { clearTimeout(t); active = null; resolve(out); };
    try { r.start(); } catch { clearTimeout(t); resolve(null); }
  });
}
export const stopListening = () => { try { active?.abort(); } catch {} };
export const matchKeys = (heard, keys = []) => !!heard && keys.some((k) => heard.includes(k.toLowerCase()));
