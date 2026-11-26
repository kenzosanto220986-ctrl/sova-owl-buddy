// Local-only storage (localStorage). Nothing leaves the device.
const K = { settings: 'sova.settings.v1', sessions: 'sova.sessions.v1', firstRun: 'sova.firstRunDone', lastEnd: 'sova.lastEnd' };
export const DEFAULTS = { mix: 2, el: true, en: true, sessionMin: 15, camera: false, mic: true, subtitles: true, rate: 0.92 };

const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const store = {
  settings: () => ({ ...DEFAULTS, ...read(K.settings, {}) }),
  saveSettings: (s) => write(K.settings, s),
  sessions: () => read(K.sessions, []),
  addSession: (s) => { const all = read(K.sessions, []); all.unshift(s); write(K.sessions, all.slice(0, 30)); },
  firstRunDone: () => !!read(K.firstRun, false),
  setFirstRunDone: (v = true) => write(K.firstRun, v),
  lastEnd: () => read(K.lastEnd, 0),
  setLastEnd: (t) => write(K.lastEnd, t),
  wipe: () => Object.values(K).forEach((k) => localStorage.removeItem(k)),
  exportAll: () => ({ settings: read(K.settings, {}), sessions: read(K.sessions, []), exportedAt: new Date().toISOString() }),
};
