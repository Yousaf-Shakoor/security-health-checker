import { Router } from 'express'
import { saveContactMessage } from '../contact/contact-store.js'

const router = Router()
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE_LENGTH = 5000

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body || {}

  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Please enter your name.' })
    return
  }
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    res.status(400).json({ error: 'Please enter a valid email address.' })
    return
  }
  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Please enter a message.' })
    return
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: 'Message is too long.' })
    return
  }

  try {
    saveContactMessage({ name, email, message })
    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('[server] failed to save contact message:', err)
    res.status(500).json({ error: 'Could not send your message. Please try again.' })
  }
})

export default router
