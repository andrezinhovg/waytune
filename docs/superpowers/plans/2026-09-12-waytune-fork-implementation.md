# Waytune Fork/Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the `andrezinhovg/better-iptv` fork into an independent project named **Waytune**: new GitHub repo with preserved history, no upstream ties, full GPL v2 compliance, and every product identifier (Rust crate, Tauri app id, npm package, desktop integration, docs, CI) renamed — with zero new features or behavior changes.

**Architecture:** No architecture changes. This is a mechanical identity migration: clone the existing fork's history into a new repo, then rename every hardcoded "better-ip-tv" / "Better IPTV" / "com.m0s.better-ip-tv" identifier across Cargo/Tauri/npm config, Rust source, Linux desktop integration scripts, docs, and CI — in dependency order so each rename is verified (compiler/build check) before the next task builds on it.

**Tech Stack:** Tauri v2 (Rust + `tauri.conf.json`), Cargo, npm/Vite/React, ImageMagick (icon/logo placeholder generation), GitHub CLI (`gh`), GitHub Actions.

**Spec:** [docs/superpowers/specs/2026-09-12-waytune-fork-design.md](../specs/2026-09-12-waytune-fork-design.md)

## Global Constraints

- Project name: **Waytune**. Reverse-domain app identifier: **`io.github.andrezinhovg.waytune`**.
- New GitHub repo: **`andrezinhovg/waytune`**, public, created from the full git history of the current `andrezinhovg/better-iptv` checkout at `/home/andre/Projects/better-iptv`. Local working copy: `/home/andre/Projects/waytune`.
- No `upstream` remote in the new repo — total divergence from `mewset/better-iptv`.
- Must ship a `LICENSE` file with the full GPL-2.0 text (currently missing from this fork) and a credits/provenance note pointing to `mewset/better-iptv` — required by GPL v2 §2, not optional.
- No content specific to `mewset` personally (donation addresses, Sponsors link, AUR package references, Vercel website) may be carried into Waytune's docs or CI — those belong to the original maintainer and don't exist for this project.
- No new features, no behavior changes, no new automated tests — this plan only renames identifiers and updates docs/CI to match. All existing stability fixes (re-render, EPG self-abort, ResizeObserver, mpv async, continue-watching, responsive grid, refresh merge) travel unmodified with the clone.
- Every task below operates inside `/home/andre/Projects/waytune` (created in Task 1) unless stated otherwise.

---

### Task 1: Create the Waytune repository from the existing fork's history

**Files:** none (git/GitHub operations only)

**Interfaces:**
- Produces: local working copy at `/home/andre/Projects/waytune`, `origin` remote pointing at `https://github.com/andrezinhovg/waytune.git`, no `upstream` remote.

- [ ] **Step 1: Create the empty GitHub repository**

```bash
gh repo create andrezinhovg/waytune --public \
  --description "Cross-platform IPTV player (Tauri + Rust + React), forked from better-iptv"
```

Expected: command prints the new repo URL `https://github.com/andrezinhovg/waytune`.

- [ ] **Step 2: Clone the current fork's full history into the new local directory**

```bash
git clone /home/andre/Projects/better-iptv /home/andre/Projects/waytune
cd /home/andre/Projects/waytune
```

- [ ] **Step 3: Point the clone at the new GitHub repo and drop any remote-tracking of the old fork**

```bash
git remote set-url origin https://github.com/andrezinhovg/waytune.git
git remote -v
```

Expected: only one remote, `origin`, both fetch/push pointing at `andrezinhovg/waytune.git`. (A local-path clone only creates `origin` for the source path — it does not copy the source's other remotes, so there is no `upstream` to remove.)

- [ ] **Step 4: Push history to the new repo**

```bash
git push -u origin main
```

- [ ] **Step 5: Verify history parity**

```bash
git log --oneline -5
git -C /home/andre/Projects/better-iptv log --oneline -5
```

Expected: identical commit hashes/messages in both outputs.

---

### Task 2: Add the missing GPL-2.0 LICENSE file

**Files:**
- Create: `/home/andre/Projects/waytune/LICENSE`

**Interfaces:**
- Produces: `LICENSE` file (GPL-2.0 canonical text) at repo root — required before Task 7 can reference it from the credits section.

- [ ] **Step 1: Download the canonical GPL-2.0 text**

```bash
cd /home/andre/Projects/waytune
curl -fsSL -o LICENSE https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
```

- [ ] **Step 2: Verify it's the right license text**

```bash
head -5 LICENSE
```

Expected:
```
                    GNU GENERAL PUBLIC LICENSE
                       Version 2, June 1991

 Copyright (C) 1989, 1991 Free Software Foundation, Inc.,
 <https://fsf.org/>
```

- [ ] **Step 3: Commit**

```bash
git add LICENSE
git commit -m "chore: add missing GPL-2.0 LICENSE file"
```

---

### Task 3: Rebrand the Rust crate (Cargo.toml, main.rs, lib.rs, doc comments)

**Files:**
- Modify: `src-tauri/Cargo.toml`
- Modify: `src-tauri/src/main.rs`
- Modify: `src-tauri/src/lib.rs`
- Modify: `src-tauri/src/epg_domain/mod.rs`
- Modify: `src-tauri/src/channel_domain/mod.rs`

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: Cargo package name `waytune`, lib crate name `waytune_lib`, on-disk log filename `waytune`/`waytune.log`, SQLite db filename `waytune.db` — Task 7 (README log-path docs) reads these exact values.

- [ ] **Step 1: Rename the package and lib in Cargo.toml**

In `src-tauri/Cargo.toml`, change:
```toml
[package]
name = "better-ip-tv"
```
to:
```toml
[package]
name = "waytune"
```
and:
```toml
[lib]
name = "better_ip_tv_lib"
```
to:
```toml
[lib]
name = "waytune_lib"
```

- [ ] **Step 2: Confirm the break (main.rs still references the old lib name)**

```bash
cd src-tauri && cargo check 2>&1 | head -20
```

Expected: FAIL — error resolving/linking `better_ip_tv_lib` (Cargo now looks for a lib crate named `waytune_lib`).

- [ ] **Step 3: Fix main.rs**

In `src-tauri/src/main.rs`, change:
```rust
    better_ip_tv_lib::run()
```
to:
```rust
    waytune_lib::run()
```

- [ ] **Step 4: Rename the hardcoded log file name and database file name in lib.rs**

In `src-tauri/src/lib.rs`, change:
```rust
                    Target::new(TargetKind::LogDir {
                        file_name: Some("better-ip-tv".to_string()),
                    }),
```
to:
```rust
                    Target::new(TargetKind::LogDir {
                        file_name: Some("waytune".to_string()),
                    }),
```
and change:
```rust
            let db_path = app_data_dir.join("better-ip-tv.db");
```
to:
```rust
            let db_path = app_data_dir.join("waytune.db");
```

- [ ] **Step 5: Fix the crate name in doc-comment examples**

In `src-tauri/src/epg_domain/mod.rs`, change:
```rust
/// use better_ip_tv::epg_domain::validate_epg_url;
```
to:
```rust
/// use waytune_lib::epg_domain::validate_epg_url;
```

In `src-tauri/src/channel_domain/mod.rs`, change (2 separate doc blocks, 3 lines total):
```rust
/// use better_ip_tv::channel_domain::validate_content_type;
```
to:
```rust
/// use waytune_lib::channel_domain::validate_content_type;
```
and:
```rust
/// use better_ip_tv::channel_domain::filter_by_content_type;
/// use better_ip_tv::db::models::Channel;
```
to:
```rust
/// use waytune_lib::channel_domain::filter_by_content_type;
/// use waytune_lib::db::models::Channel;
```

- [ ] **Step 6: Verify the build is green and no old identifiers remain**

```bash
cargo check
grep -rn "better-ip-tv\|better_ip_tv" ../src-tauri/src/ ../src-tauri/Cargo.toml
```

Expected: `cargo check` passes with no errors; the `grep` prints nothing (no matches, exit code 1).

- [ ] **Step 7: Commit**

```bash
cd ..
git add src-tauri/Cargo.toml src-tauri/src/main.rs src-tauri/src/lib.rs \
  src-tauri/src/epg_domain/mod.rs src-tauri/src/channel_domain/mod.rs
git commit -m "rebrand: rename Rust crate and identifiers from better-ip-tv to waytune"
```

---

### Task 4: Rebrand Tauri app identity and Linux desktop integration

**Files:**
- Modify: `src-tauri/tauri.conf.json`
- Rename: `src-tauri/templates/better-iptv.desktop` → `src-tauri/templates/waytune.desktop`
- Modify: `src-tauri/scripts/postinst.sh`
- Modify: `src-tauri/scripts/postrm.sh`

**Interfaces:**
- Consumes: nothing code-level from Task 3 (independent files), but must stay consistent with it (same project identity).
- Produces: `productName` = `"Waytune"`, `identifier` = `"io.github.andrezinhovg.waytune"` — Task 7's README log-path docs and installer filenames are derived from these exact values.

- [ ] **Step 1: Update tauri.conf.json**

In `src-tauri/tauri.conf.json`, change:
```json
  "productName": "Better IPTV",
  "version": "2.6.1",
  "identifier": "com.m0s.better-ip-tv",
```
to:
```json
  "productName": "Waytune",
  "version": "2.6.1",
  "identifier": "io.github.andrezinhovg.waytune",
```

Change the window title:
```json
        "title": "Better IPTV",
```
to:
```json
        "title": "Waytune",
```

Change both desktop template references:
```json
        "desktopTemplate": "templates/better-iptv.desktop",
```
(appears twice, under `linux.deb` and `linux.rpm`) to:
```json
        "desktopTemplate": "templates/waytune.desktop",
```

- [ ] **Step 2: Rename the desktop template file**

```bash
cd /home/andre/Projects/waytune
git mv src-tauri/templates/better-iptv.desktop src-tauri/templates/waytune.desktop
```

(No content changes needed inside the file — it's a Handlebars template driven entirely by `{{{name}}}`/`{{{icon}}}`/etc. placeholders filled in from `tauri.conf.json` at build time.)

- [ ] **Step 3: Update postinst.sh**

In `src-tauri/scripts/postinst.sh`, change the comment:
```sh
# Runs after .deb/.rpm install. Tauri's Linux bundler names the .desktop
# file after productName ("Better IPTV.desktop"), but the app's Wayland/GTK
# app_id is the identifier (com.m0s.better-ip-tv, from tauri.conf.json).
```
to:
```sh
# Runs after .deb/.rpm install. Tauri's Linux bundler names the .desktop
# file after productName ("Waytune.desktop"), but the app's Wayland/GTK
# app_id is the identifier (io.github.andrezinhovg.waytune, from tauri.conf.json).
```
and change:
```sh
ORIGINAL="Better IPTV.desktop"
TARGET="$DESKTOP_DIR/com.m0s.better-ip-tv.desktop"
```
to:
```sh
ORIGINAL="Waytune.desktop"
TARGET="$DESKTOP_DIR/io.github.andrezinhovg.waytune.desktop"
```

- [ ] **Step 4: Update postrm.sh**

In `src-tauri/scripts/postrm.sh`, change:
```sh
TARGET="$DESKTOP_DIR/com.m0s.better-ip-tv.desktop"
```
to:
```sh
TARGET="$DESKTOP_DIR/io.github.andrezinhovg.waytune.desktop"
```

- [ ] **Step 5: Verify JSON validity and no leftover identifiers**

```bash
python3 -m json.tool src-tauri/tauri.conf.json > /dev/null && echo "valid JSON"
grep -rn "better-ip-tv\|Better IPTV\|com\.m0s" src-tauri/tauri.conf.json \
  src-tauri/templates/waytune.desktop src-tauri/scripts/postinst.sh src-tauri/scripts/postrm.sh
```

Expected: `valid JSON` printed; the `grep` prints nothing.

- [ ] **Step 6: Commit**

```bash
git add src-tauri/tauri.conf.json src-tauri/templates/waytune.desktop \
  src-tauri/scripts/postinst.sh src-tauri/scripts/postrm.sh
git commit -m "rebrand: rename Tauri app identity and Linux desktop integration to Waytune"
```

---

### Task 5: Rebrand package.json and verify the frontend build

**Files:**
- Modify: `package.json`
- Modify (regenerated by tooling): `package-lock.json`

**Interfaces:**
- Produces: npm package name `waytune`; installed `node_modules` (needed by Task 6's `npx tauri icon`).

- [ ] **Step 1: Rename the npm package**

In `package.json`, change:
```json
  "name": "better-ip-tv",
```
to:
```json
  "name": "waytune",
```

- [ ] **Step 2: Reinstall to sync package-lock.json**

```bash
npm install
```

- [ ] **Step 3: Verify the frontend still builds**

```bash
npm run build
```

Expected: `tsc && vite build` completes with no errors.

- [ ] **Step 4: Verify the rename propagated**

```bash
grep '"name"' package.json
head -5 package-lock.json | grep '"name"'
```

Expected: both show `"waytune"`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "rebrand: rename npm package from better-ip-tv to waytune"
```

---

### Task 6: Generate placeholder app icons and in-app logo assets

**Files:**
- Modify (regenerated in place): `src-tauri/icons/32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.icns`, `icon.ico`, `icon.png`, `Square*.png`, `StoreLogo.png`
- Modify (regenerated in place): `src/assets/logo/logo-{64,128,256,512,1024}.png`, `src/assets/logo/logo-{64,128,256,512,1024}.webp`

**Interfaces:**
- Consumes: `node_modules`/`@tauri-apps/cli` from Task 5.
- Produces: placeholder Waytune branding at the exact same file paths the app and bundler already reference — no code changes needed anywhere else.

- [ ] **Step 1: Generate a 1024×1024 base placeholder image**

```bash
cd /home/andre/Projects/waytune
convert -size 1024x1024 xc:'#0f2a43' -gravity center \
  -font DejaVu-Sans-Bold -pointsize 480 -fill white -annotate 0 "W" \
  src-tauri/icons/_base.png
```

- [ ] **Step 2: Regenerate the full Tauri app icon set from the base image**

```bash
npx tauri icon src-tauri/icons/_base.png
```

Expected: overwrites `32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.icns`, `icon.ico`, `icon.png`, and the Windows `Square*Logo.png`/`StoreLogo.png` set inside `src-tauri/icons/`.

- [ ] **Step 3: Regenerate the in-app logo assets used by LoadingScreen/Setup/AboutTab**

```bash
for size in 1024 512 256 128 64; do
  convert src-tauri/icons/_base.png -resize ${size}x${size} src/assets/logo/logo-${size}.png
  convert src-tauri/icons/_base.png -resize ${size}x${size} src/assets/logo/logo-${size}.webp
done
```

- [ ] **Step 4: Remove the temporary base image**

```bash
rm src-tauri/icons/_base.png
```

- [ ] **Step 5: Verify the regenerated assets**

```bash
identify src-tauri/icons/icon.png
identify src/assets/logo/logo-256.png
```

Expected: both report valid PNG images at the expected dimensions (`icon.png` per Tauri's default output size, `logo-256.png` as `256x256`).

- [ ] **Step 6: Commit**

```bash
git add src-tauri/icons/ src/assets/logo/
git commit -m "rebrand: replace app icons and in-app logo with Waytune placeholder"
```

---

### Task 7: Rebrand README.md and CONTRIBUTING.md

**Files:**
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`

**Interfaces:**
- Consumes: identifier `io.github.andrezinhovg.waytune` and log filename `waytune`/`waytune.db` from Tasks 3–4; repo URL `andrezinhovg/waytune` from Task 1.
- Produces: GPL v2 §2 "changes made" / provenance notice satisfied (together with Task 2's LICENSE file).

- [ ] **Step 1: Replace README.md in full**

Overwrite `README.md` with:

```markdown
<div align="center">
  <img src="src/assets/logo/logo-256.png" alt="Waytune Logo" width="200"/>

  # Waytune

  **Modern, cross-platform IPTV player built with Rust and Tauri**

  [![Test Build](https://github.com/andrezinhovg/waytune/workflows/Test%20Build/badge.svg)](https://github.com/andrezinhovg/waytune/actions)
  [![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-blue.svg)](#-installation)
  [![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](LICENSE)

  [Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [FAQ](#-faq) • [Contributing](#-contributing)
</div>

> **Note:** Waytune is not affiliated with any IPTV provider. Users are responsible for compliance with local laws and provider terms.

---

## 📺 Overview

Waytune is a desktop IPTV player that combines the performance of Rust with a modern web UI. Built on MPV for video playback, it handles live TV, movies, and series across Linux, Windows, and macOS.

**Why Waytune?**
- **Fast & Efficient** - Rust backend handles 100,000+ channels smoothly
- **Smart Features** - EPG, parental controls, multi-profile support, and more
- **Modern UI** - Clean, responsive interface with dark/light themes
- **Privacy First** - All data stored locally, credentials never leave your device
- **Cross-Platform** - One app for Linux, Windows, and macOS

---

## ✨ Features

### 🎬 Content Library
- **Live TV** - Stream live channels with real-time Electronic Program Guide (EPG)
- **Movies (VOD)** - Browse and watch on-demand movies
- **TV Series** - Season/episode organization with automatic episode queuing
- **Smart Search** - Instant filtering across all content types
- **Virtual Scrolling** - Smooth performance even with 100K+ channels

### 🔒 Parental Controls
- PIN protection (4-6 digits) with manual or automatic channel blocking
- Auto-detection of adult content (+18, XXX, Adult markers)
- Category-level blocking for entire channel groups
- Three viewing modes: Hide, Lock Icon, or Blur
- Session-based unlock that re-locks on restart

### 📋 Playlist Management
- **M3U/M3U8** import from local files or URLs
- **Xtream Codes** integration with your IPTV provider
- **Multi-Profile System** - Switch between multiple providers/playlists
- **Favorites** - Star any channel and find them in a dedicated tab
- **Custom User-Agent** - Presets for TiviMate, VLC, or enter your own
- **Category Quick-Access** - Horizontal bar for instant category filtering

### 🌐 Language Support
19 languages for audio and subtitle preferences (Scandinavian, European, and International), configurable per profile.

---

## 📥 Installation

### MPV Media Player

Waytune uses MPV for video playback. Installation varies by platform:

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install mpv

# Arch Linux
sudo pacman -S mpv

# Fedora
sudo dnf install mpv
```

**macOS:**
```bash
brew install mpv
```

**Windows:**
> **New in v2.3.0:** MPV is bundled with the installer. No separate installation needed.

If you prefer a manual installation: download from [mpv.io](https://mpv.io/installation/) or use `choco install mpv`.

### Download Waytune

1. Visit [Releases](https://github.com/andrezinhovg/waytune/releases/latest)
2. Download for your platform:
   - **Linux (Ubuntu/Debian)**: `.AppImage`, `.deb`
   - **Linux (Arch/Manjaro)**: `-arch.AppImage`
   - **Linux (Fedora/RHEL)**: `.rpm`
   - **Windows**: `.msi` installer or `.exe` portable
   - **macOS**: `.dmg` disk image

**Linux AppImage (Ubuntu/Debian):**
```bash
chmod +x Waytune_*_amd64.AppImage
./Waytune_*_amd64.AppImage
```

**Linux AppImage (Arch/Manjaro):**

> **Important:** Use the `-arch.AppImage` variant on Arch-based distros. The standard AppImage bundles WebKit libraries from Ubuntu that conflict with newer system libraries on rolling-release distros and will cause a crash on startup.

```bash
chmod +x Waytune_*_amd64-arch.AppImage
./Waytune_*_amd64-arch.AppImage
```

---

## 🚀 Quick Start

### 1. Import Playlist

On first launch, choose your import method:

**Option A: M3U/M3U8 File**
1. Click **"Import M3U Playlist"**
2. Enter a profile name (e.g., "My IPTV")
3. Choose source: **Local File** or **URL**
4. Click **"Import"** and wait for channels to load

**Option B: Xtream Codes**
1. Click **"Import Xtream Playlist"**
2. Enter a profile name
3. Fill in your server URL, username, and password
4. Click **"Import"** (loads Live TV, Movies, and Series)

### 2. Configure EPG (Optional)

1. Open **Settings** (gear icon) → **General** → **EPG Settings**
2. Enter your XMLTV EPG URL (Xtream users get this automatically)
3. Click **"Update Now"** — EPG updates automatically going forward

### 3. Start Watching

- Use tabs (All / Live TV / Movies / Series / Favorites) and the category bar to browse
- Type in the search box for instant filtering
- Click play on any channel — MPV opens in a separate window

**Series:** Select a series → choose season → click Play on any episode. Remaining episodes auto-queue.

**Favorites:** Hover over any channel card and click the star to add or remove.

**Multiple Profiles:** Import additional playlists as separate profiles and switch between them from the setup screen.

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Stop current channel |
| `/` | Focus search bar |
| `Escape` | Stop playback |
| `Ctrl+1-4` | Switch settings tabs |

For MPV player controls (fullscreen, volume, seek, etc.), see the [MPV keyboard documentation](https://mpv.io/manual/stable/#keyboard-control).

---

## ❓ FAQ

<details>
<summary><strong>Why won't MPV open?</strong></summary>

MPV must be installed on your system (except Windows v2.3.0+ which includes it bundled).

Verify installation:
```bash
mpv --version
```

See [Installation](#-installation) for platform-specific instructions.
</details>

<details>
<summary><strong>Can I watch channels directly in the app?</strong></summary>

No, Waytune uses MPV as an external player. This provides broad codec support and hardware acceleration, but video displays in a separate window.
</details>

<details>
<summary><strong>EPG data not showing?</strong></summary>

Check:
1. Playlist contains EPG identifiers (`tvg-id` or `tvg-name`)
2. EPG URL configured in Settings → EPG Settings
3. EPG data fetched (click "Fetch EPG" button)
4. Wait a minute for EPG refresh cycle
</details>

<details>
<summary><strong>How many channels can it handle?</strong></summary>

Waytune has been tested with 150,000+ channels during development without issues.
</details>

<details>
<summary><strong>Does it work with VPN?</strong></summary>

Yes. Ensure your VPN is active before launching streams.
</details>

<details>
<summary><strong>Are my Xtream credentials secure?</strong></summary>

Yes. All credentials are stored locally on your device. Nothing is sent to external servers. Logs automatically mask sensitive data.
</details>

<details>
<summary><strong>Can I play local video files?</strong></summary>

No, Waytune is designed for IPTV streams. Use MPV directly for local media.
</details>

---

## 🛠️ Troubleshooting

### Channels Buffering
- **Check internet connection** - Run speed test
- **Try another channel** - May be provider/server issue
- **Adjust MPV cache** - Advanced users: edit MPV config

### Series Not Importing (Xtream)
- **Verify credentials** - Double-check username/password
- **Check provider support** - Not all Xtream providers offer series
- **Retry import** - Network issues may cause partial imports

### App Won't Start
- **Linux**: Ensure `.AppImage` has execute permissions (`chmod +x`)
- **Windows**: Run as administrator or check Windows Defender
- **macOS**: Allow app in **System Preferences → Security & Privacy**

### Parental Controls Issues
- **Auto-detect not working?** - Re-save settings to trigger channel scan
- **Lock mode not showing channels?** - Update to v2.3.0+ (bug fixed)
- **PIN modal stuck?** - Restart app, issue resolved in v2.3.0

### Logs

**Linux**: `~/.local/share/waytune/logs/waytune.log`
**Windows**: `%APPDATA%\io.github.andrezinhovg.waytune\logs\waytune.log`
**macOS**: `~/Library/Application Support/io.github.andrezinhovg.waytune/logs/waytune.log`

Credentials are automatically masked in logs.

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, code standards, and PR guidelines.

- [Report a bug](https://github.com/andrezinhovg/waytune/issues/new)
- [Request a feature](https://github.com/andrezinhovg/waytune/issues/new)
- [Join discussions](https://github.com/andrezinhovg/waytune/discussions)

---

## 📝 Changelog

See [CHANGELOG_USER.md](CHANGELOG_USER.md) for version history and release notes.

---

## 📄 License

[GNU General Public License v2.0](LICENSE) — MPV is GPL v2+ licensed, and we chose GPL v2.0 for compatibility.

---

## 🙏 Acknowledgments

- **[better-iptv](https://github.com/mewset/better-iptv)** by mewset - Waytune started as a fork of this project, under GPL v2
- **[MPV Project](https://mpv.io/)** - Media player with comprehensive codec support
- **[Tauri](https://tauri.app/)** - Cross-platform framework enabling this project
- **[Open TV](https://github.com/Fredolx/open-tv)** - Architectural inspiration
- **IPTV Community** - Standards, protocols, and ongoing support

---

<div align="center">

  **Made for IPTV enthusiasts**

</div>
```

- [ ] **Step 2: Replace CONTRIBUTING.md in full**

Overwrite `CONTRIBUTING.md` with:

```markdown
# Contributing to Waytune

## Report Bugs

[Create an issue](https://github.com/andrezinhovg/waytune/issues/new) with:
- Detailed description
- Steps to reproduce
- OS and app version
- Screenshots if applicable
- Log file (see [Troubleshooting](README.md#%EF%B8%8F-troubleshooting))

## Suggest Features

[Open a feature request](https://github.com/andrezinhovg/waytune/issues/new) describing:
- What you want
- Why it's useful
- How it should work

## Development Setup

```bash
# Fork & clone
git clone https://github.com/YOUR-USERNAME/waytune.git
cd waytune

# Install dependencies
npm install

# Run dev server
npm run tauri dev

# Run tests
npm run test          # Frontend tests
cd src-tauri && cargo test  # Rust tests
```

### Build from Source

```bash
npm run tauri build
# Output: src-tauri/target/release/bundle/
```

## Code Standards

- **TypeScript**: Follow ESLint config (`npm run lint`)
- **Rust**: Use `rustfmt` and `clippy`
  ```bash
  cargo fmt
  cargo clippy
  ```
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)
  ```
  feat: add category quick-access bar
  fix: resolve EPG timezone bug
  docs: update README installation steps
  ```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes with tests
3. Run linters: `npm run lint && cargo clippy`
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/my-feature`
6. Open PR on GitHub with detailed description

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help other users in issues/discussions
- Document your changes clearly
```

- [ ] **Step 3: Verify no old identifiers or mewset-specific funding info remain**

```bash
grep -n "Better IPTV\|better-ip-tv\|com\.m0s\|mewset/better-iptv\|ko-fi\|sponsors/mewset" README.md CONTRIBUTING.md
```

Expected: no matches except the intentional `mewset/better-iptv` link inside the new Acknowledgments credit line in README.md.

- [ ] **Step 4: Commit**

```bash
git add README.md CONTRIBUTING.md
git commit -m "rebrand: update README and CONTRIBUTING for Waytune, add GPL provenance credit"
```

---

### Task 8: Update CI workflow (remove mewset-specific release step)

**Files:**
- Modify: `.github/workflows/release.yml`

**Interfaces:** none — no other task depends on this one.

- [ ] **Step 1: Rename the release title and body**

In `.github/workflows/release.yml`, change:
```yaml
          releaseName: 'Better IPTV ${{ github.ref_name }}'
          releaseBody: |
            ## What's Changed
            See the assets below to download Better IPTV for your platform.

            **Note:** Make sure MPV is installed on your system before running Better IPTV.
```
to:
```yaml
          releaseName: 'Waytune ${{ github.ref_name }}'
          releaseBody: |
            ## What's Changed
            See the assets below to download Waytune for your platform.

            **Note:** Make sure MPV is installed on your system before running Waytune.
```

- [ ] **Step 2: Remove the mewset-specific website deploy step**

Delete this entire step from the end of the `release` job (it triggers a Vercel rebuild for `better-iptv-web`, a site that doesn't exist for Waytune, and would reference a `VERCEL_DEPLOY_HOOK` secret that will never be configured in this repo):
```yaml
      - name: Trigger website rebuild (Linux only)
        if: matrix.platform == 'ubuntu-24.04'
        run: |
          echo "🌐 Triggering better-iptv-web rebuild on Vercel..."
          curl -s -X POST "${{ secrets.VERCEL_DEPLOY_HOOK }}"
          echo "✅ Rebuild triggered"
```

- [ ] **Step 3: Verify no old identifiers remain and YAML is still valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/release.yml'))" && echo "valid YAML"
grep -n "Better IPTV\|better-iptv-web\|VERCEL_DEPLOY_HOOK" .github/workflows/release.yml
```

Expected: `valid YAML` printed; the `grep` prints nothing.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: rebrand release workflow, drop mewset-specific website deploy step"
```

---

### Task 9: Add heritage notes to the historical changelogs

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `CHANGELOG_USER.md`

**Interfaces:** none.

- [ ] **Step 1: Add a heritage note to CHANGELOG.md**

Right after the `# Changelog` title line, insert a blank line then:
```markdown
> History before 2026-09-12 is inherited from the [better-iptv](https://github.com/mewset/better-iptv) fork (by mewset), prior to Waytune's divergence. Entries below this point describe that project under its original name and are kept unedited as an accurate historical record.
```
Leave every entry below untouched — they're historical record of what actually happened under the old name.

- [ ] **Step 2: Add the same heritage note to CHANGELOG_USER.md**

Right after the `# What's New in Better IPTV` title line, insert a blank line then the same blockquote as Step 1. Leave every entry below untouched.

- [ ] **Step 3: Verify**

```bash
head -5 CHANGELOG.md
head -5 CHANGELOG_USER.md
```

Expected: both show the title line followed by the new blockquote.

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md CHANGELOG_USER.md
git commit -m "docs: note changelog history predates the Waytune fork"
```

---

### Task 10: Full build and manual smoke test

**Files:** none (verification only)

**Interfaces:** none — terminal task, verifies the sum of Tasks 1–9.

- [ ] **Step 1: Clean build**

```bash
cd /home/andre/Projects/waytune
npm run tauri build
```

Expected: build completes; bundles land in `src-tauri/target/release/bundle/` named after `Waytune` (e.g. `Waytune_*_amd64.AppImage`, `Waytune_*.deb`, `Waytune_*.rpm`).

- [ ] **Step 2: Confirm the installed identity**

```bash
find src-tauri/target/release/bundle -iname "*waytune*" -o -iname "*Waytune*"
grep -rl "better-ip-tv\|Better IPTV\|com\.m0s" src-tauri/target/release/bundle/ 2>/dev/null
```

Expected: the first command lists the built bundles; the second prints nothing (no leftover old-name artifacts inside the built bundles).

- [ ] **Step 3: Manual smoke test (Linux/Hyprland)**

Run the built app (or `npm run tauri dev` for a faster iteration loop) and confirm by hand:
- Window title and taskbar icon show "Waytune" with the new placeholder icon (not the old Better IPTV branding).
- App launches to the setup/loading screen showing the new placeholder logo.
- Import a playlist (or reuse an existing profile if testing against real data) and confirm the channel grid renders and scrolls smoothly.
- Open Continue Watching and confirm it still expands/collapses correctly.
- Play a channel and stop it — confirm no UI freeze (this exercises the mpv async fix inherited from better-iptv).
- Resize the window and confirm the channel grid re-flows without stale/giant cards (exercises the inherited ResizeObserver fix).

- [ ] **Step 4: Push everything**

```bash
git push origin main
```

Expected: all 9 prior commits land on `andrezinhovg/waytune` main branch on GitHub.
