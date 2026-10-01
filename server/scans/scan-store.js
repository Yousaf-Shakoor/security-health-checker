import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// Same lightweight JSON-file approach as user-store.js — fine for local/dev
// use, not for concurrent-write-heavy production traffic.
const DATA_DIR = path.join(process.cwd(), 'server', 'data')
const SCANS_FILE = path.join(DATA_DIR, 'scans.json')
const MAX_SCANS_PER_USER = 50

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(SCANS_FILE)) fs.writeFileSync(SCANS_FILE, '[]', 'utf8')
}

function readScans() {
  ensureStore()
  try {
    const parsed = JSON.parse(fs.readFileSync(SCANS_FILE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeScans(scans) {
  ensureStore()
  fs.writeFileSync(SCANS_FILE, JSON.stringify(scans, null, 2), 'utf8')
}

// `result` is the raw /api/scan response (same shape buildScanResult on the
// frontend expects as input) — stored as-is so viewing history later goes
// through the exact same display logic as a live scan.
export function saveScan({ userId, domain, score, status, result }) {
  const scans = readScans()

  const record = {
    id: crypto.randomUUID(),
    userId,
    domain,
    score: typeof score === 'number' ? score : null,
    status: status || 'Unknown',
    scannedAt: new Date().toISOString(),
    result,
  }

  scans.push(record)

  // Keep only the most recent MAX_SCANS_PER_USER records for this user so
  // the file doesn't grow without bound; other users' records are untouched.
  const forUser = scans.filter((s) => s.userId === userId).sort((a, b) => b.scannedAt.localeCompare(a.scannedAt))
  if (forUser.length > MAX_SCANS_PER_USER) {
    const toDrop = new Set(forUser.slice(MAX_SCANS_PER_USER).map((s) => s.id))
    writeScans(scans.filter((s) => !toDrop.has(s.id)))
  } else {
    writeScans(scans)
  }

  return record
}

export function listScansForUser(userId) {
  return readScans()
    .filter((s) => s.userId === userId)
    .sort((a, b) => b.scannedAt.localeCompare(a.scannedAt))
    .map(({ id, domain, score, status, scannedAt }) => ({ id, domain, score, status, scannedAt }))
}

export function getScanForUser(userId, id) {
  return readScans().find((s) => s.userId === userId && s.id === id) || null
}

export function deleteScanForUser(userId, id) {
  const scans = readScans()
  const next = scans.filter((s) => !(s.userId === userId && s.id === id))
  const removed = next.length !== scans.length
  if (removed) writeScans(next)
  return removed
}
