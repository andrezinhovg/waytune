#!/bin/sh
# Runs after .deb/.rpm install. Tauri's Linux bundler names the .desktop
# file after productName ("Waytune.desktop"), but the app's Wayland/GTK
# app_id is the identifier (io.github.andrezinhovg.waytune, from tauri.conf.json).
# KDE Plasma's taskbar matches a running window's app_id against a
# <app_id>.desktop filename (unlike its app menu, which just reads Icon=
# from any .desktop) — without this, KDE users see a generic taskbar icon
# even though the app menu shows the right one.
set -e

DESKTOP_DIR="/usr/share/applications"
ORIGINAL="Waytune.desktop"
TARGET="$DESKTOP_DIR/io.github.andrezinhovg.waytune.desktop"

if [ -f "$DESKTOP_DIR/$ORIGINAL" ] && [ ! -e "$TARGET" ]; then
    ln -sf "$ORIGINAL" "$TARGET"
fi

if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$DESKTOP_DIR" || true
fi

if command -v gtk-update-icon-cache >/dev/null 2>&1; then
    gtk-update-icon-cache -f /usr/share/icons/hicolor >/dev/null 2>&1 || true
fi

exit 0
