import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// Same lightweight JSON-file approach used elsewhere in this project.
// There's no outbound email sending here (no SMTP credentials configured)
// — messages are saved so whoever runs the app can read them from
// server/data/contact-messages.json. Wire up real email delivery later if
// needed.
const DATA_DIR = path.join(process.cwd(), 'server', 'data')
const MESSAGES_FILE = path.join(DATA_DIR, 'contact-messages.json')
const MAX_MESSAGES = 500

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '[]', 'utf8')
}

function readMessages() {
  ensureStore()
  try {
    const parsed = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeMessages(list) {
  ensureStore()
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(list, null, 2), 'utf8')
}

export function saveContactMessage({ name, email, message }) {
  const list = readMessages()

  const entry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    submittedAt: new Date().toISOString(),
  }

  list.push(entry)
  writeMessages(list.slice(-MAX_MESSAGES))
  return entry
}
