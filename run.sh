#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

./setup-linux.sh

RUNTIME_DIR="$PWD/.runtime/node"
export PATH="$RUNTIME_DIR/bin:$PATH"

printf '\nStarting Security Health Checker...\n'
echo 'Web UI: http://localhost:5173'
echo 'API:    http://localhost:4000'
echo 'Press Ctrl+C to stop.'

exec "$RUNTIME_DIR/bin/npm" run dev:all
