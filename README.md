<div align="center">

[![English](https://img.shields.io/badge/%F0%9F%8C%90_Language-English_(Active)-2563eb?style=for-the-badge)](./README.md)
[![Tiếng Việt](https://img.shields.io/badge/%F0%9F%87%BB%F0%9F%87%B3_Ng%C3%B4n_ng%E1%BB%AF-Ti%E1%BA%BFng_Vi%E1%BB%87t-dc2626?style=for-the-badge)](./README.vi.md)

# ✨ Antigravity Custom Theme Engine (v7 MVVM)

**Animated Chibi Mascot & Glassmorphism UI Theme Engine for Google Antigravity Desktop Client**

[![Themes](https://img.shields.io/badge/Chibi_Themes-17_Presets-10b981?style=for-the-badge)](#%EF%B8%8F-17-animated-theme-showcase-live-svg)
[![SVGs](https://img.shields.io/badge/Vector_Animations-51_SVGs-f59e0b?style=for-the-badge)](#%EF%B8%8F-17-animated-theme-showcase-live-svg)
[![Architecture](https://img.shields.io/badge/Architecture-MVVM_Zero_Deps-38bdf8?style=for-the-badge)](#%EF%B8%8F-project-architecture-mvvm)
[![Modes](https://img.shields.io/badge/Appearance-Dark_%26_Light-ec4899?style=for-the-badge)](#-key-features)

<br />

<img src="./stickers/jade-dragon/idle.svg" width="66" alt="Jade Dragon" />
<img src="./stickers/fire-phoenix/idle.svg" width="66" alt="Fire Phoenix" />
<img src="./stickers/tet-lion/idle.svg" width="66" alt="Lunar New Year Lion" />
<img src="./stickers/code-cat/idle.svg" width="66" alt="Hacker Code Cat" />
<img src="./stickers/pixel-knight/idle.svg" width="66" alt="8-Bit Pixel Knight" />
<img src="./stickers/cloud-whale/idle.svg" width="66" alt="Sunset Cloud Whale" />
<img src="./stickers/gangster-pawn/idle.svg" width="66" alt="Gangster Pawn" />
<img src="./stickers/noel-snowman/idle.svg" width="66" alt="Christmas Snowman" />

<br />

👉 **[Launch Live Interactive Web Preview (GitHub Pages)](https://datnguyen0909.github.io/antigravity-custom-theme/?lang=en)**  
*(Try typing in the chat box, hovering bubbles, toggling Dark/Light & EN/VI across all 17 themes right in your browser!)*

</div>

---

## 🌟 Key Features

- **🎭 4-Tier Interactive Mascot System (51 pure CSS-animated SVGs, ultra-lightweight)**:
  1. **Idle + 15-Second Auto-Skits (`idle.svg`)**: Mascots perch atop your chat bubbles and perform a funny character skit every 15 seconds (Code Cat hits `ERROR` and smashes its laptop, Gangster Pawn's cigar misfires, Pixel Knight opens a chest for a disappointing `+1 EXP`, Cloud Whale spouts a rainbow...).
  2. **Character-Specific Typing Reactions (`typing.svg`)**: While you type a prompt, your mascot switches to an authentic activity pose (Shark files its teeth, Midnight Cat bats a red yarn ball, Bunny pounds Mochi, Knight hammers a glowing blade on an anvil, Dragon swirls its mystic pearl...) with per-keystroke particles and a thinking bubble when you pause for 1.5s.
  3. **Panoramic Hover Stage (`action.svg`)**: Hovering over any user chat bubble or the prompt input unveils a full wide-screen animated stage (Torii gates, plum-blossom poles, retro pipes & `?` blocks, sunset floating islands, ringed planets...).
  4. **Adaptive Dark / Light Glassmorphism & Bilingual UI**: Seamlessly hooks into **Settings → Custom theme** inside Antigravity with built-in **EN / VI** language toggle, full **Dark** & **Light** mode palettes, background dimming slider, custom wallpaper upload, and persistent disk storage via Electron IPC.

---

## 🖼️ 17 Animated Theme Showcase (Live SVG)

> 💡 Every image below is a **live animated SVG** rendered directly from `stickers/` — watch for 15 seconds to see each mascot perform its mini-skit right inside this table!

| # | Theme | Idle + 15s Auto-Skit | While Typing | Panoramic Hover Stage |
|:-:|:---|:---:|:---:|:---:|
| 1 | **🐉 Jade Dragon**<br/>`jade-dragon` | <img src="./stickers/jade-dragon/idle.svg" width="64" /><br/><sub>Sneezes emerald fire</sub> | <img src="./stickers/jade-dragon/typing.svg" width="64" /><br/><sub>Swirls mystic pearl in clouds</sub> | <img src="./stickers/jade-dragon/action.svg" width="190" /><br/><sub>Soars through drifting jade clouds</sub> |
| 2 | **🔥 Fire Phoenix**<br/>`fire-phoenix` | <img src="./stickers/fire-phoenix/idle.svg" width="64" /><br/><sub>Hatches a tiny chick</sub> | <img src="./stickers/fire-phoenix/typing.svg" width="64" /><br/><sub>Draws glowing fire runes</sub> | <img src="./stickers/fire-phoenix/action.svg" width="190" /><br/><sub>Glides across blazing clouds & sun</sub> |
| 3 | **🚀 Galaxy Astronaut**<br/>`space-astronaut` | <img src="./stickers/space-astronaut/idle.svg" width="64" /><br/><sub>UFO beams up mini Saturn</sub> | <img src="./stickers/space-astronaut/typing.svg" width="64" /><br/><sub>Juggles orbiting planets</sub> | <img src="./stickers/space-astronaut/action.svg" width="190" /><br/><sub>Jetpack flight around planets</sub> |
| 4 | **🦉 Ancient Scroll Owl**<br/>`wise-owl` | <img src="./stickers/wise-owl/idle.svg" width="64" /><br/><sub>Dozes off & pops sleep bubble</sub> | <img src="./stickers/wise-owl/typing.svg" width="64" /><br/><sub>Writes calligraphy with feather quill</sub> | <img src="./stickers/wise-owl/action.svg" width="190" /><br/><sub>Delivers scrolls over misty peaks</sub> |
| 5 | **🌙 Moonlight Witch**<br/>`moon-witch` | <img src="./stickers/moon-witch/idle.svg" width="64" /><br/><sub>Spell backfires into green frog</sub> | <img src="./stickers/moon-witch/typing.svg" width="64" /><br/><sub>Stirs glowing magic cauldron</sub> | <img src="./stickers/moon-witch/action.svg" width="190" /><br/><sub>Broomstick flight past crescent moon</sub> |
| 6 | **🦊 Chibi Kitsune**<br/>`fox-chibi` | <img src="./stickers/fox-chibi/idle.svg" width="64" /><br/><sub>Transforms tofu into leaf</sub> | <img src="./stickers/fox-chibi/typing.svg" width="64" /><br/><sub>Spins mystical foxfire orbs</sub> | <img src="./stickers/fox-chibi/action.svg" width="190" /><br/><sub>Dashes through Torii gates & lanterns</sub> |
| 7 | **🌸 Sakura Mochi Bunny**<br/>`sakura-bunny` | <img src="./stickers/sakura-bunny/idle.svg" width="64" /><br/><sub>Munches Dango & bursts hearts</sub> | <img src="./stickers/sakura-bunny/typing.svg" width="64" /><br/><sub>Pounds Mochi with wooden mallet</sub> | <img src="./stickers/sakura-bunny/action.svg" width="190" /><br/><sub>Hops through cherry blossom woods</sub> |
| 8 | **🦈 Ocean Shark**<br/>`ocean-shark` | <img src="./stickers/ocean-shark/idle.svg" width="64" /><br/><sub>Blows rubber ducky bubble</sub> | <img src="./stickers/ocean-shark/typing.svg" width="64" /><br/><sub>Files its sharp teeth</sub> | <img src="./stickers/ocean-shark/action.svg" width="190" /><br/><sub>Slices waves & breaches high</sub> |
| 9 | **♟ Gangster Pawn**<br/>`gangster-pawn` | <img src="./stickers/gangster-pawn/idle.svg" width="64" /><br/><sub>Cigar misfires & tosses away</sub> | <img src="./stickers/gangster-pawn/typing.svg" width="64" /><br/><sub>Flips gold coin & fans dollar bills</sub> | <img src="./stickers/gangster-pawn/action.svg" width="190" /><br/><sub>Rook charges → Promotes to Queen</sub> |
| 10 | **❄️ Glacier Penguin**<br/>`ice-penguin` | <img src="./stickers/ice-penguin/idle.svg" width="64" /><br/><sub>Ice cream brain-freeze</sub> | <img src="./stickers/ice-penguin/typing.svg" width="64" /><br/><sub>Juggles 3 silver fish</sub> | <img src="./stickers/ice-penguin/action.svg" width="190" /><br/><sub>Belly-slides across Arctic icebergs</sub> |
| 11 | **🤖 Minimalist AI Bot**<br/>`ai-robot` | <img src="./stickers/ai-robot/idle.svg" width="64" /><br/><sub>404 glitch & self-taps head</sub> | <img src="./stickers/ai-robot/typing.svg" width="64" /><br/><sub>Types on hologram keyboard</sub> | <img src="./stickers/ai-robot/action.svg" width="190" /><br/><sub>Hoverboards through hologram gates</sub> |
| 12 | **🐾 Midnight Cat**<br/>`black-cat` | <img src="./stickers/black-cat/idle.svg" width="64" /><br/><sub>Pounces on red laser dot</sub> | <img src="./stickers/black-cat/typing.svg" width="64" /><br/><sub>Bats unraveling red yarn ball</sub> | <img src="./stickers/black-cat/action.svg" width="190" /><br/><sub>Leaps across moonlit rooftops</sub> |
| 13 | **⛄ Christmas Snowman**<br/>`noel-snowman` | <img src="./stickers/noel-snowman/idle.svg" width="64" /><br/><sub>Unboxes reindeer antlers</sub> | <img src="./stickers/noel-snowman/typing.svg" width="64" /><br/><sub>Writes wish list with candy cane</sub> | <img src="./stickers/noel-snowman/action.svg" width="190" /><br/><sub>Rides reindeer sleigh over pines</sub> |
| 14 | **🦁 Lunar New Year Lion**<br/>`tet-lion` | <img src="./stickers/tet-lion/idle.svg" width="64" /><br/><sub>Unfurls lucky scroll & firecrackers</sub> | <img src="./stickers/tet-lion/typing.svg" width="64" /><br/><sub>Dances to festive drumbeats</sub> | <img src="./stickers/tet-lion/action.svg" width="190" /><br/><sub>Leaps plum-blossom poles</sub> |
| 15 | **🐱‍💻 Hacker Code Cat**<br/>`code-cat` | <img src="./stickers/code-cat/idle.svg" width="64" /><br/><sub>ERROR → smashes laptop & grabs new</sub> | <img src="./stickers/code-cat/typing.svg" width="64" /><br/><sub>Codes furiously on glowing screen</sub> | <img src="./stickers/code-cat/action.svg" width="190" /><br/><sub>Surfs mouse cursor catching bugs</sub> |
| 16 | **🗡️ 8-Bit Pixel Knight**<br/>`pixel-knight` | <img src="./stickers/pixel-knight/idle.svg" width="64" /><br/><sub>Opens chest to tiny +1 EXP</sub> | <img src="./stickers/pixel-knight/typing.svg" width="64" /><br/><sub>Forges glowing sword on anvil</sub> | <img src="./stickers/pixel-knight/action.svg" width="190" /><br/><sub>Jumps pipes & hits coin blocks</sub> |
| 17 | **🐋 Sunset Cloud Whale**<br/>`cloud-whale` | <img src="./stickers/cloud-whale/idle.svg" width="64" /><br/><sub>Spouts rainbow & swallow perches</sub> | <img src="./stickers/cloud-whale/typing.svg" width="64" /><br/><sub>Sings notes & cloud bubbles</sub> | <img src="./stickers/cloud-whale/action.svg" width="190" /><br/><sub>Swims past sunset floating islands</sub> |

---

## 🚀 1-Click Installation & Usage (Windows)

> **Zero external dependencies!** No Node.js or `npm install` required — the installer automatically runs using Antigravity's built-in Electron binary.

### 1. Install
1. Clone or download this repository as a ZIP:
   ```bash
   git clone https://github.com/DatNguyen0909/antigravity-custom-theme.git
   ```
2. Close **Antigravity** (or reload the window after installing).
3. Double-click **`install.bat`**.
   - Automatically creates a safe backup (`app.asar.bak`) inside `%LOCALAPPDATA%\Programs\antigravity\resources\`, builds `clean_bundle.js`, and patches `app.asar` with verified 4-byte header alignment and SHA-256 integrity recalculation.
4. Launch **Antigravity** (or press `Ctrl + Shift + P` → `Developer: Reload Window`).
5. Open **Settings (⚙️) → Custom theme** (right below `Appearance`) to choose your mascot, switch **EN / VI**, adjust background dimming, or set a custom wallpaper!

### 2. After Antigravity Auto-Updates
Whenever Antigravity updates to a newer version, its updater replaces `app.asar`. Simply **double-click `install.bat` again** (~2 seconds) — all your saved theme preferences remain 100% intact.

### 3. Uninstall / Restore Default
- **Instant in-app toggle**: Open **Settings → Custom theme** and switch **OFF** to immediately revert to the native interface without restarting.
- **Full unpatch**: Double-click **`uninstall.bat`** to restore the original `app.asar.bak`.

---

## 🏗️ Project Architecture (MVVM)

```text
antigravity-custom-theme/
├── index.html                      # Interactive Live Web Simulator & Gallery (EN / VI)
├── README.md                       # Documentation (English)
├── README.vi.md                    # Documentation (Vietnamese / Tiếng Việt)
├── stickers/                       # 17 mascot folders, 3 animated SVG states each
│   ├── jade-dragon/                # idle.svg | action.svg | typing.svg
│   ├── pixel-knight/               # idle.svg | action.svg | typing.svg
│   ├── cloud-whale/                # idle.svg | action.svg | typing.svg
│   └── ... (17 theme folders)
├── src/
│   ├── models/                     # [MODEL] Single Source of Truth (EN & VI metadata)
│   │   ├── themes.js               # 17 theme definitions (colors, localized text, FX)
│   │   ├── backgrounds.js          # Dark & Light gradients + frosted sidebar palettes
│   │   └── decor.js                # Background SVG scenery & ambient particle configs
│   ├── services/                   # [SERVICE] Persistence & runtime environment
│   │   ├── storageService.js       # Syncs localStorage + Electron disk storage.json
│   │   └── environmentService.js   # Light/Dark detection, portal filtering, SVG reset
│   ├── viewmodels/                 # [VIEWMODEL] Reactive state & user commands
│   │   └── themeViewModel.js       # State store, EN/VI language toggle, typing timers
│   ├── views/                      # [VIEW] Decoupled DOM renderers & stylesheets
│   │   ├── styles/
│   │   │   ├── base.css            # Background, overlay, sidebar, bubbles, composer
│   │   │   ├── mascots.css         # Keyframe animations for all 17 mascots
│   │   │   └── settings.css        # Settings -> Custom Theme modal UI
│   │   ├── backgroundView.js       # Renders #ag-custom-bg, #ag-custom-overlay, #ag-custom-decor
│   │   ├── chatView.js             # Renders chat bubbles, input stickers, typing particles
│   │   └── settingsView.js         # Hooks Custom theme tab & bilingual picker overlay
│   └── app.js                      # Bootstrapper (MVVM subscriptions, observers, tick)
├── build_bundle.js                 # Auto-discovers stickers/ + compiles src/ -> clean_bundle.js
├── repack_asar.js                  # Safe ASAR patcher with alignment & integrity verification
├── install.bat                     # 1-click build & install script
└── uninstall.bat                   # 1-click restore from app.asar.bak
```

---

## 🛠️ How to Add a New Theme (3 Easy Steps)

Thanks to the MVVM structure and automatic folder discovery in `build_bundle.js`, adding a 18th mascot is effortless:

1. Create `stickers/<theme-id>/` containing `idle.svg` (`120×120`), `typing.svg` (`120×120`), and `action.svg` (`260×95`).
2. Add `<theme-id>` entries to `src/models/themes.js`, `src/models/backgrounds.js`, `src/models/decor.js`, and its CSS rules in `src/views/styles/mascots.css`.
3. Run `install.bat` — the bundler automatically embeds the new folder and deploys it into Antigravity!

---

## 📄 License

Released under the **MIT License** — free to use, customize, and contribute new mascots!
