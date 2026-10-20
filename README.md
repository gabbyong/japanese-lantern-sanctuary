# Floating Japanese Lantern Sanctuary at Dusk

An interactive 3D architectural and atmospheric study in Three.js, upgraded from a clean Round 0 baseline (`21/100`) to Pass 4 AAA realism (`88/100`) via a 3-stage multi-agent visual hill-climbing ratchet, paired with a spatial **Gemini Lyria RealTime** (`models/lyria-realtime-exp`) Lo-Fi soundtrack.

This folder is **100% self-contained** with zero external `npm install` or build steps required. All required Three.js ES modules are vendored in `./vendor/three/`.

---

## Pages Included

- **`index.html`** — Final Pass 4 AAA 3D scene with smooth 6-DoF WASD + E/Q flight inertia, a 10-waypoint Catmull-Rom guided fly-through tour, quintic Bezier camera preset glides, and interactive Gemini Lyria RealTime Lo-Fi music.
- **`comparison.html`** — Interactive draggable vertical split-curtain comparison of **Round 0 (Baseline)** vs. **Pass 4 (Final AAA)** across all 5 diagnostic camera presets (`overview`, `bridge`, `lantern_closeup`, `water_grazing`, `sanctuary_interior`), both in synchronized live 3D and `1440×900` captured stills, alongside the full 5-pass score table and progression strip.
- **`baseline.html`** — Round 0 Baseline 3D scene using standard geometry, flat lighting, and basic materials.
- **`passes/pass1.html` … `passes/pass4.html`** — Archived snapshots of each hill-climbing pass.
- **`screenshots/pass0/` … `screenshots/pass4/`** — Chromeless `1440×900` diagnostic screenshots and Playwright verification reports (`verification.json`) for every pass.

---

## How to Publish or Run Internally at Google

### Option 1: Pure Static Hosting (x20 / GCS / Internal Web Server)
Because `./vendor/three/` is bundled directly in this folder with relative importmaps, you can copy or upload this directory directly to any static file host:
```bash
# Example: serve with any static server (Python, Caddy, nginx, or x20 static share)
python3 -m http.server 8430
```
- On a pure static host, the built-in procedural Web Audio **Lo-Fi Sanctuary Synth** (warm Rhodes chords, plucked Japanese Koto pentatonic phrases, and vinyl rain) works immediately with zero configuration.
- To enable live **Gemini Lyria RealTime** (`models/lyria-realtime-exp`) streaming on a static host without a backend, pass `?apiKey=YOUR_GEMINI_API_KEY` in the URL or set `sessionStorage.setItem('GEMINI_API_KEY', 'YOUR_KEY')` in DevTools.

### Option 2: Node Server (Local or Cloud VM) with `.env`
`server.mjs` uses only built-in Node.js standard library modules (`node:http`, `node:fs`, `node:path`)—no `npm install` needed:
```bash
cp .env.example .env
# Add your GEMINI_API_KEY to .env
node server.mjs
```
Then open:
- `http://127.0.0.1:8430/index.html`
- `http://127.0.0.1:8430/comparison.html`
- `http://127.0.0.1:8430/baseline.html`

### Option 3: Google Cloud Run / App Engine
Deploy directly with `gcloud`:
```bash
# Cloud Run
gcloud run deploy japanese-lantern-sanctuary \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_gemini_api_key"
```

---

## Controls & Diagnostic API

- **Orbit / Pan / Zoom**: Left-drag to orbit, right-drag to pan, scroll to zoom.
- **Smooth 6-DoF Flight**: Hold `W`, `A`, `S`, `D` (or Arrow keys) to glide horizontally + along your pitch angle; `E` / `Space` to rise; `Q` to descend; hold `Shift` to boost speed.
- **Guided 3D Fly-Through**: Click **Guided fly-through** in the footer (or press `F`) to glide continuously along a closed 10-waypoint Catmull-Rom spline through the cove, arched bridge, floating lanterns, Torii gate, and Sanctuary courtyard.
- **Interactive Lyria Lo-Fi Soundtrack**: Click **Play Lo-Fi Lyria music** in the top-right HUD. As you fly between the 5 Sanctuary acoustic zones (*Outer cove*, *Arched timber bridge*, *Water surface & floating lanterns*, *Torii gate crossing*, *Sanctuary inner courtyard*), the scene dynamically steers `models/lyria-realtime-exp` weighted prompts, density, and brightness, while you can toggle individual sound layers (**Koto & Shakuhachi**, **Warm Rhodes**, **Vinyl & Dusk Rain**, **Deep Sub Groove**).
- **Programmatic Camera API**:
  - `window.__SET_CAMERA_PRESET__(name)` — Jump immediately to `'overview' | 'bridge' | 'lantern_closeup' | 'water_grazing' | 'sanctuary_interior'`
  - `window.__FLY_TO_CAMERA_PRESET__(name, durationSec)` — Smooth quintic Bezier flight to preset
  - `window.__START_FLYTHROUGH__()` / `window.__STOP_FLYTHROUGH__()` — Toggle guided spline tour
  - `window.__SET_HUD_VISIBLE__(visible)` or `?chromeless=1` — Hide all HUD elements
