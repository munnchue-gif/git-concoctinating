# THE FORGE — Full Transfer Document
> Hand this to any AI model. It contains the complete state of the project: the app, the Forge fabric concepts, where we are, and what's next.
> Last updated: 2026-07-22 · GitHub: connected as `munnchue-gif` (repo scope)

---

## 1. What this project is (two halves)

**Half A — The Forge (`forge_ng`)**: a local Python "AI fabric" that runs bare-metal on a Pop!_OS machine (Arrow Lake NPU + RTX 5080). Stdlib-only by design, 119 passing tests. It is a living resident process (systemd service), not a library.

**Half B — This web app (Base44, React + Tailwind)**: the command bridge / operator console for the Forge. Dark starship-bridge aesthetic (Orbitron/Exo 2/Share Tech Mono, amber + cyan on deep navy).

The two halves talk over HTTPS through a Cloudflare tunnel: the app is "the glass" — a read-only window plus gate-signed capability requests. Secrets never live in the app's database.

## 2. Forge core concepts (the vocabulary)

- **The Substance** — alien fabric coating the system; one material, many forms.
- **The Skeleton** — the hard frame: 7 organs, all built and GREEN.
- **Gate** — the ONE door; every privileged action is signed/verified through it (multi-tenant, replay-exact policy). Known gaps: false-replay on identical legit actions (needs nonce), unescaped `|` delimiter in signed strings (security fix pending).
- **SubstanceBus** — deaf sections + the Overseer's omnipresent tap. Gap: silent drops under load, not thread-safe.
- **Overseer** — Watcher (observe) + Commander (act-through-gate). Next: level-3 command vocabulary.
- **Capabilities** — the verbs: Spawn/Mount/Egress/NpuEval + Conform/Splice/Reclaim.
- **Wrap** — the mold that IS the training; seal identity, reclaim/repour models. Next: persistent vector store (L2).
- **VectorConduit** — the NPU bond loop (bonded, not fused). Currently on HeuristicSeat; real Arrow Lake NPU seat is the next brick.
- **Concoctinator** — sandbox/testing grounds (concoct + strip verbs, observe-mode by design).
- **Design laws**: "Pieces & LEGO" (snap-on/off modularity, war-jeep philosophy), "deaf by default, one door, nothing bare," "nothing thrown away" (The Wardrobe = recycle yard), "baptism not code" (The Awakening — gains from structure, not scale).
- **Sockets & Layers** (concept, YELLOW) — snap whole capabilities on. **Capsule Shrink & Restore** (ORANGE) — suspend/resume a Forge personality; data-pack format undefined.

Grading system used everywhere: GREEN (solid) / YELLOW (needs work) / RED (broken) / PURPLE (abstract) / ORANGE (undefined).

## 3. The app — pages & data

| Route | Page | Purpose |
|---|---|---|
| `/` | Board | Command board: all Forge pieces, graded + filterable, plus a live Bridge Controls strip |
| `/piece/:id` | PieceDetail | Full detail + editing of one piece |
| `/deck` | ControlDeck | Codeless operator console — sliders/toggles/buttons sync in real time; the Forge polls them |
| `/forge` | ForgeLink | "The glass": Sockets, Live Feed (SSE), Health, Wraps, Ledger, Mint, Concoct, Tasks |
| `/review` | ReviewBay | Drop files for graded reviews (FileReview) |
| `/install` | InstallGuide | Master install: bare-metal Pop!_OS setup, 8 steps |
| `/cheatsheet` | CheatSheet | Quick reference |

**Entities**: `ForgePiece` (the board), `ForgeControl` (live deck controls), `ForgeTask` (open work items), `FileReview`, `BridgeConnection` (socket keychain — endpoint metadata only), `ConnectionEvent` (bridge history log).

**Security model**: tokens/CF Access secrets live ONLY in the browser (`localStorage` via `src/lib/connectionVault.js` + `src/lib/forgeBridge.js`). The database stores endpoint metadata + history, never keys. `bridgeFetch` injects `Authorization`, `CF-Access-Client-Id`, `CF-Access-Client-Secret` headers; the live feed streams SSE over fetch (EventSource can't carry CF headers).

**Socket keychain (newest feature)**: register any endpoint (WSL, GitHub, Cloudflare, GPU offloader, DB, custom), pin favorites, one-press "Bridge in" (applies config + health check + logs a ConnectionEvent), "Capture live connection" saves the currently-working bridge as a socket.

## 4. The transport chain (how app ↔ Forge connect)

1. Pop!_OS machine runs the bridge: `python -m forge_ng.bridge` (endpoints: `/health`, `/feed` SSE, `/wraps`, `/ledger`, `/mint`, `/concoct/preview`).
2. `cloudflared tunnel run forge` exposes it publicly behind Cloudflare Access.
3. App's Forge Link settings hold the tunnel URL + CF service-token credentials (browser-only).
4. Separately, the Forge polls the app's `ForgeControl` entity via the Base44 data API (`forge_ng/bridge.py` DeckBridge — one-way pull, zero verbs of attack surface).

## 5. Master install — the facts

- The Install Guide (`/install`) installs the **Forge fabric on the PC**, NOT this web app. The app lives here (Base44 hosted) — nothing to install for it.
- It is current as of this writing: env setup → 119-test green check → NPU wiring (intel_vpu + Level Zero + OpenVINO) → kernel bootstrap `main.py` → NpuSeat skeleton → systemd service → DeckBridge poller.
- The bootstrap/bridge Python blocks are **templates** — import paths/signatures must be adapted to the exact forge_ng code on the machine.
- Prereqs before installing: forge_ng source on the machine, kernel 6.8+, Python 3.11+, and (for the deck bridge) the App ID + API key from this app's dashboard (Settings → API).
- After install: yes — all Forge-side fixes happen directly on the machine; app-side fixes happen here. The two evolve independently and meet at the bridge contract.

## 6. Version transfer

- **App**: Base44 keeps version history; GitHub repo sync (connected) gives full git history — branch/tag to snapshot versions.
- **Forge**: standard git on the PC (`git tag v0.x && git push`), pushed to a GitHub repo under `munnchue-gif`. Conceptually this is "Capsule Shrink & Restore" — until that's built, git IS the capsule.

## 7. Where we left off + open tasks

**Detour just completed**: socket keychain + connection history on Forge Link (done, seeded with 6 sockets — the placeholder URLs need replacing with real endpoints).

**Open ForgeTasks (the human's part)**:
1. Verify PC power and network (Pop!_OS machine on + connected).
2. Validate the local bridge process is listening (localhost:8787).
3. Check Cloudflare tunnel status (`cloudflared tunnel status`).
4. Configure the Forge Bridge URL in the app's connection settings.
5. Validate CF Access service tokens in settings.
6. Once connected: press **Capture live connection** in Forge Link → Sockets, and fix/delete placeholder sockets.

**Next bricks on the fabric (the main road we return to)**:
- Gate: nonce field (fix false replay) + escape/hash the `|` delimiter (security).
- SubstanceBus: drop logging + thread safety.
- VectorConduit: bind the real Arrow Lake NPU seat (OpenVINOSeat) — install Step 4/6.
- Wrap: persistent vector store (L2).
- Concepts: build The Embedded Tailor (unblocks Sockets & Layers), define the capsule data-pack format.

## 8. For the receiving model

You now have full context. Rules of the road: everything is LEGO (snap-on pieces, clean interfaces), nothing is thrown away (grade it, don't delete it), one door (all privileged action through the Gate), secrets stay client-side, and the app is glass — logic lives in the Forge.