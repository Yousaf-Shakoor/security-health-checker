import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// A small public "recently scanned" feed — separate from the private,
// per-user history in scan-store.js. Every completed scan (whether the
// person was signed in or not) adds a lightweight, anonymous entry here:
// just domain, score, status and time. No user identity is ever stored or
// exposed through this feed.
const DATA_DIR = path.join(process.cwd(), 'server', 'data')
const RECENT_FILE = path.join(DATA_DIR, 'recent-scans.json')
const MAX_RECENT = 20

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(RECENT_FILE)) fs.writeFileSync(RECENT_FILE, '[]', 'utf8')
}

function readRecent() {
  ensureStore()
  try {
    const parsed = JSON.parse(fs.readFileSync(RECENT_FILE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRecent(list) {
  ensureStore()
  fs.writeFileSync(RECENT_FILE, JSON.stringify(list, null, 2), 'utf8')
}

export function addRecentScan({ domain, score, status }) {
  const list = readRecent()

  const entry = {
    id: crypto.randomUUID(),
    domain,
    score: typeof score === 'number' ? score : null,
    status: status || 'Unknown',
    scannedAt: new Date().toISOString(),
  }

  list.unshift(entry)
  writeRecent(list.slice(0, MAX_RECENT))
  return entry
}

export function getRecentScans() {
  return readRecent()
}
