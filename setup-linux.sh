#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "==============================================="
echo " Security Health Checker - Linux Setup"
echo "==============================================="
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js 18+ is required."; exit 1; }
npm install
npm run dev:all
