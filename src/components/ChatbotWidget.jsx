import { useEffect, useRef, useState } from 'react'
import { RobotIcon, SendIcon, CloseIcon } from './Icons.jsx'
import { matchReply, WELCOME_MESSAGE } from '../data/chatbotResponses.js'
import '../styles/chatbot.css'

let idCounter = 0
const nextId = () => `msg-${++idCounter}`

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ id: nextId(), from: 'bot', text: WELCOME_MESSAGE }])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => () => clearTimeout(typingTimer.current), [])

  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return

    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text }])
    setDraft('')
    setTyping(true)

    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId(), from: 'bot', text: matchReply(text) }])
      setTyping(false)
    }, 550)
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Security Health Checker assistant">
          <div className="chat-header">
            <span className="chat-header-icon"><RobotIcon width={17} height={17} /></span>
            <div className="chat-header-text">
              <div className="chat-header-title">Assistant</div>
              <div className="chat-header-sub">Ask about scans, scores &amp; more</div>
            </div>
            <button type="button" className="chat-close" aria-label="Close chat" onClick={() => setOpen(false)}>
              <CloseIcon width={15} height={15} />
            </button>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble chat-bubble--${m.from}`}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="chat-bubble chat-bubble--bot chat-typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={send}>
            <input
              className="chat-input"
              type="text"
              placeholder="Type a question…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Message"
            />
            <button type="submit" className="chat-send" aria-label="Send message" disabled={!draft.trim()}>
              <SendIcon width={16} height={16} />
            </button>
          </form>
        </div>
      )}

      <div className="chat-fab-wrap">
        {!open && (
          <span className="chat-fab-tooltip" role="tooltip">
            Ask any question
          </span>
        )}
        <button
          type="button"
          className="chat-fab"
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={24} height={24} /> : <RobotIcon width={30} height={30} />}
        </button>
      </div>
    </div>
  )
}
