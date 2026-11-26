# Sova · Сова · Σόβα — v1

A playful AI owl learning web app for David (age 5). Russian first, with Greek and English words sprinkled in.
Product bible: `/workspace/owl-buddy/owl-buddy-concept.md`.

**This is a completely separate app** — its own folder (`/workspace/sova-app`), its own git repo (`sova-owl-buddy`)
and its own hosting service (`sova-owl-buddy` on Render). It shares nothing with any other app.

## What's in v1
- Home map with Sova (animated SVG owl: blinks, breathes, talking beak, world accessories), 4 world cards, big mic, acorn session timer, hidden parent lock.
- 8 scripted adventures (2 per world): Wobbly Eggs, Tiko's Footprints, Rocket Windows, Where Did the Moon Go?, Rainbow Garage, Signs on the Street, Who Says That?, Big, Small and Thirsty.
  Each: picture-tap answers, gentle hints (never "wrong"), repeat-after-me word cards (ru / el / en), celebrations.
- Voice: browser `speechSynthesis` — ru-RU base, el-GR / en-US for target words, slower for target words; text fallback.
- Listening: `webkitSpeechRecognition` (ru-RU; el-GR/en-US on repeat-after-me) where supported; otherwise tap-only.
- Camera (off by default, parent toggle): `getUserMedia` + MediaPipe Face Landmarker on-device → present / gone / looking away / smile.
  Sova pauses when David leaves, nudges once if he looks away, notes smiles. Nothing is stored or sent. Red "camera on" badge.
- Session flow: first-run AI disclosure → wake → greeting + feelings check-in → map → adventures → wind-down at the session cap → guilt-free goodbye → parent summary → 5-min rest.
- Parent Corner (PIN 1234): last session + history, language-mix slider + Greek/English toggles, 10/15/20-min cap, camera, mic, subtitles, voice check, download/delete data.
- All data in `localStorage` on the device.

## Structure
```
public/            the deployed static site (no build step)
  index.html, styles.css, manifest.webmanifest, icons
  js/app.js        screens + session engine
  js/adventures.js all worlds/adventures/words (edit here to add episodes)
  js/art.js        owl, icons, scenes (pure SVG)
  js/voice.js      speech output (browser now, ElevenLabs later)
  js/listen.js     speech recognition
  js/camera.js     on-device face signals
  js/brain.js      scripted now, Claude/OpenAI later
  js/config.js     switches: BRAIN, VOICE, API_BASE, PIN
server/            backend stub for later (not deployed)
screenshots/       test screenshots
```
Run locally: `cd public && python3 -m http.server 8765` → http://127.0.0.1:8765

## Plugging in a real AI brain + voice later
1. Get keys: **Anthropic (Claude) API key** (or OpenAI) and an **ElevenLabs API key + a voice ID** (a warm multilingual voice that does Russian, Greek and English).
2. Deploy `server/` as its own small web service (e.g. a new Render web service `sova-owl-brain`, start command `node server/index.mjs`)
   with env vars `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `ALLOWED_ORIGIN=https://sova-owl-buddy.onrender.com`.
   It uses the Sova system prompt from the concept doc (`server/sova-system-prompt.txt`).
3. In `public/js/config.js` set `API_BASE` to that URL and `BRAIN: 'remote'`, `VOICE: 'remote'`. Push → the site redeploys.
   Endpoints: `POST /api/sova/turn` `{child_said, context}` → `{sova_says:[{lang,t}], ...}`; `POST /api/sova/tts` `{segments}` → `audio/mpeg`.
   Everything falls back to the scripted brain / browser voice if the backend is down. Camera frames never go to the backend.
4. Next steps from the roadmap: let the brain generate new beats (`ui.choices`, `scene`), Whisper STT for better Greek/English listening, and a parent account.

Keys must never be put in `public/` — that folder is public.
