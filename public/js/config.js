// SOVA configuration. v1 runs 100% in the browser with no keys.
// To plug in a real AI brain + ElevenLabs voice later, deploy the small backend in /server
// and set API_BASE to its URL, then switch BRAIN / VOICE to 'remote'. See README.md.
export const CONFIG = {
  BRAIN: 'scripted',   // 'scripted' (built-in adventures) | 'remote' (Claude/OpenAI via /server)
  VOICE: 'browser',    // 'browser' (Web Speech API) | 'remote' (ElevenLabs via /server)
  API_BASE: '',        // e.g. 'https://sova-owl-brain.onrender.com'
  CHILD_NAME: 'Давид',
  COOLDOWN_MIN: 5,     // minutes before a new session can start without a parent OK
  PIN: '1234',
};
