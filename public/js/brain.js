// Sova's "brain". v1 = ScriptedBrain (the adventures in adventures.js).
// RemoteBrain is the plug-in point for Claude / OpenAI through the small backend in /server.
// The backend should use the system prompt from the concept doc (section 11) and return JSON:
// { sova_says: [{lang:'ru'|'el'|'en', t:'...'}], target_words:[...], ui:{mood, end_session}, parent_note:'' }
import { CONFIG } from './config.js';
import { R } from './adventures.js';

export const brain = {
  mode: () => (CONFIG.BRAIN === 'remote' && CONFIG.API_BASE ? 'remote' : 'scripted'),

  // Called when David says something that does not match any picture choice.
  async freeTalk(heard, context) {
    if (this.mode() === 'remote') {
      try {
        const res = await fetch(`${CONFIG.API_BASE}/api/sova/turn`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ child_said: heard, context }), // never camera frames
        });
        if (res.ok) { const j = await res.json(); if (Array.isArray(j.sova_says) && j.sova_says.length) return j.sova_says; }
      } catch (e) { console.warn('Remote brain unavailable, using script', e); }
    }
    // Scripted fallback: warm acknowledgement, then gently back to the pictures.
    return [R('Ух ты, интересно! Давай выберем картинку пальчиком.')];
  },
};
