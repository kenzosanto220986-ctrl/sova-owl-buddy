# Sova · Сова · Σόβα — v2

A playful AI owl learning web app for David (age 5). Russian first, with Greek and English words sprinkled in.
Product bible: `/workspace/owl-buddy/owl-buddy-concept.md`.

**This is a completely separate app** — its own folder (`/workspace/sova-app`), its own git repo (`sova-owl-buddy`)
and its own hosting service (`sova-owl-buddy` on Render). It shares nothing with any other app.

## What's new in v2 — level progression
- **World maps:** each world is a board-game path of **5 stages × (10 levels + 1 boss) = 55 levels**, 220 in total. Levels unlock one by one; a level passes with **2 of 3 stars** (stars = share of first-try answers: ≥90% → 3, ≥60% → 2).
- **Stages by age:** 1 (5): counting to 10, shapes, colors, first words, more/less · 2 (6): counting to 20, ± within 10, first letters in Cyrillic/Greek/Latin, first syllables, number order · 3 (7): ± to 100, reading words, telling time, comparing · 4 (8): times tables, money (€), simple sentences (ru/el/en) · 5 (9–10): fractions, measurement & units, science reasoning, story sequencing.
- **Procedural:** `js/questions.js` holds ~20 themed templates (dinos/space/cars/animals SVG art) seeded per world+level+attempt, so every level is stable but retries vary. Stage 1 levels 3 and 7 are the v1 scripted story adventures. Reading/letter/sentence tasks only use alphabets the parent has enabled (Russian always).
- **Adaptive:** two perfect, fast levels in a row skip the next level (stays playable for stars); two struggles on the same skill insert a 2-question practice round with hints; a 1-star result offers "practice together" (+2 acorns) and a retry. Nothing is ever taken away.
- **Rewards:** stars, golden acorns (5 per new star, +25 first boss win, +10 per badge), 15 badges (Dino Expert, Space Captain, Race Champion, Jungle Ranger with stage tiers, Word Wizard, Math Star, Story Teller, Explorer, Acorn Collector, Stage Master, guest helpers), 10 outfits for Sova (15–160 acorns), stage-complete celebration.
- **Boss levels:** Professor Pythagoras (Dino Valley/math), Albert Einstein (Space), Captain Tesla (Cars/electricity), Professor Darwin (Jungle) — always introduced as Sova *pretending* ("понарошку, как в театре") with a parent note.
- **Parent corner:** per-world/stage progress bars, stars, badges, skills mastered / needing practice, starting stage (1–5), unlock-all for testing, reset progress; export now includes progress + the v1 backup.
- **Migration:** on first v2 load the original v1 data is copied to `sova.v1backup`; v1 sessions stay intact, played v1 adventures become passed story levels, v1 words carry over, plus a welcome gift of acorns (10 per v1 session, max 50).
- New files: `js/questions.js`, `js/levels.js`, `js/progress.js`; storage key `sova.progress.v2`.

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
  js/adventures.js scripted story adventures (v1)
  js/questions.js  v2 procedural question templates + stages
  js/levels.js     v2 level maps, bosses, level plans
  js/progress.js   v2 stars/acorns/badges/outfits + v1 migration
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
