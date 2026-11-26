// SOVA brain + voice backend (NOT deployed in v1 — a ready stub for later).
// Node 18+, zero dependencies.  Run:  ANTHROPIC_API_KEY=... ELEVENLABS_API_KEY=... node server/index.mjs
// Keys live ONLY here, never in the browser app. No camera data ever reaches this server.
import http from 'node:http';
import { readFileSync } from 'node:fs';

const PORT = process.env.PORT || 8787;
const ORIGIN = process.env.ALLOWED_ORIGIN || 'https://sova-owl-buddy.onrender.com';
const SYSTEM = readFileSync(new URL('./sova-system-prompt.txt', import.meta.url), 'utf8');
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || ''; // pick a warm multilingual voice in ElevenLabs
const TTS_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';

// split a reply into language runs so the client can highlight Greek/English words
function toSegments(text) {
  const out = []; const re = /([\u0370-\u03FF\u1F00-\u1FFF]+(?:[\s'-]+[\u0370-\u03FF\u1F00-\u1FFF]+)*)|([A-Za-z]+(?:[\s'-]+[A-Za-z]+)*)|([^A-Za-z\u0370-\u03FF\u1F00-\u1FFF]+)/g;
  for (const m of text.matchAll(re)) out.push(m[1] ? { lang: 'el', t: m[1], hl: true } : m[2] ? { lang: 'en', t: m[2], hl: true } : { lang: 'ru', t: m[3].trim() });
  return out.filter((s) => s.t);
}

async function turn({ child_said, context }) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, max_tokens: 400, system: SYSTEM,
      messages: [{ role: 'user', content: `Context (JSON): ${JSON.stringify(context || {})}\nDavid just said: "${String(child_said || '').slice(0, 300)}"\nReply as Sova in the compact JSON format.` }],
    }),
  });
  if (!r.ok) throw new Error('anthropic ' + r.status + ' ' + (await r.text()));
  const j = await r.json();
  const text = j.content?.map((c) => c.text || '').join('') || '';
  let parsed; try { parsed = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); } catch { parsed = { sova_says: text }; }
  return { ...parsed, sova_says: typeof parsed.sova_says === 'string' ? toSegments(parsed.sova_says) : parsed.sova_says };
}

async function tts({ segments }) {
  const text = (segments || []).map((s) => s.t).join(' ').slice(0, 1200);
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: TTS_MODEL, voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.35 } }),
  });
  if (!r.ok) throw new Error('elevenlabs ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.end();
  if (req.method === 'GET' && req.url === '/health') return res.end('ok');
  if (req.method !== 'POST') { res.statusCode = 404; return res.end(); }
  let body = ''; for await (const c of req) { body += c; if (body.length > 20000) break; }
  try {
    const data = JSON.parse(body || '{}');
    if (req.url === '/api/sova/turn') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(await turn(data))); }
    if (req.url === '/api/sova/tts') { res.setHeader('content-type', 'audio/mpeg'); return res.end(await tts(data)); }
    res.statusCode = 404; res.end();
  } catch (e) { console.error(e); res.statusCode = 502; res.end(JSON.stringify({ error: String(e.message || e) })); }
}).listen(PORT, () => console.log('Sova backend on :' + PORT));
