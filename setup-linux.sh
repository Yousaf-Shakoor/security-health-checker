#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

RUNTIME_DIR="$PWD/.runtime"
NODE_DIR="$RUNTIME_DIR/node"
NODE_BIN="$NODE_DIR/bin/node"
NPM_BIN="$NODE_DIR/bin/npm"
NODE_MAJOR="22"

say() { printf '\n%s\n' "$1"; }

say "==============================================="
say " Security Health Checker - Linux Setup"
say " Portable Node.js mode (no system Node/npm)"
say "==============================================="

if [ "$(uname -s)" != "Linux" ]; then
  echo "ERROR: This launcher is for Linux."
  exit 1
fi

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64) NODE_ARCH="x64" ;;
  aarch64|arm64) NODE_ARCH="arm64" ;;
  armv7l|armv7) NODE_ARCH="armv7l" ;;
  *)
    echo "ERROR: Unsupported Linux architecture: $ARCH"
    exit 1
    ;;
esac

if [ ! -x "$NODE_BIN" ] || [ ! -x "$NPM_BIN" ]; then
  say "[1/3] Downloading portable Node.js ${NODE_MAJOR}.x (${NODE_ARCH})..."

  command -v curl >/dev/null 2>&1 || {
    echo "ERROR: curl is required to download the portable runtime."
    echo "Install curl with your normal Linux package manager, then run this script again."
    exit 1
  }

  command -v tar >/dev/null 2>&1 || {
    echo "ERROR: tar is required."
    exit 1
  }

  command -v python3 >/dev/null 2>&1 || {
    echo "ERROR: python3 is required only for selecting the latest Node.js 22.x release."
    exit 1
  }

  mkdir -p "$RUNTIME_DIR"
  INDEX_FILE="$RUNTIME_DIR/node-index.json"
  curl -fsSL "https://nodejs.org/dist/index.json" -o "$INDEX_FILE"

  NODE_VERSION="$(python3 - "$INDEX_FILE" <<'PY'
import json, sys
with open(sys.argv[1], encoding='utf-8') as f:
    releases = json.load(f)
for release in releases:
    v = release.get('version', '')
    if release.get('lts') and v.startswith('v22.'):
        print(v)
        break
else:
    for release in releases:
        v = release.get('version', '')
        if v.startswith('v22.'):
            print(v)
            break
PY
)"

  if [ -z "$NODE_VERSION" ]; then
    echo "ERROR: Could not determine a Node.js 22.x release."
    exit 1
  fi

  ARCHIVE="node-${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz"
  URL="https://nodejs.org/dist/${NODE_VERSION}/${ARCHIVE}"
  TMP_ARCHIVE="$RUNTIME_DIR/$ARCHIVE"

  echo "Downloading $URL"
  curl -fL "$URL" -o "$TMP_ARCHIVE"

  rm -rf "$NODE_DIR" "$RUNTIME_DIR/node-extracted"
  mkdir -p "$RUNTIME_DIR/node-extracted"
  tar -xJf "$TMP_ARCHIVE" -C "$RUNTIME_DIR/node-extracted"
  mv "$RUNTIME_DIR/node-extracted/node-${NODE_VERSION}-linux-${NODE_ARCH}" "$NODE_DIR"
  rm -rf "$RUNTIME_DIR/node-extracted" "$TMP_ARCHIVE" "$INDEX_FILE"
fi

export PATH="$NODE_DIR/bin:$PATH"

say "[2/3] Checking project dependencies..."
if [ ! -d "$PWD/node_modules" ] || [ ! -f "$PWD/node_modules/.package-lock.json" ]; then
  echo "Installing project dependencies locally..."
  "$NPM_BIN" ci --no-audit --no-fund
else
  echo "Dependencies already installed; skipping npm ci."
fi

say "[3/3] Setup complete."
echo "Using local Node: $("$NODE_BIN" --version)"
echo "Using local npm:  $("$NPM_BIN" --version)"
echo
echo "Start the tool with: ./run.sh"
