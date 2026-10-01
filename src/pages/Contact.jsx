import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import '../styles/legal.css'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error((data && data.error) || 'Could not send your message. Please try again.')
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send your message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main legal-page">
        <div className="wrap">
          <div className="contact-card">
            {sent ? (
              <div className="contact-success">
                <h2>Message sent</h2>
                <p>Thanks for reaching out — we'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h1 className="display">Contact</h1>
                <p className="contact-sub">
                  Questions, feedback, or a security issue to report? Send us a message.
                </p>

                {error && (
                  <div className="auth-error" role="alert">
                    {error}
                  </div>
                )}

                <div className="auth-field">
                  <label className="auth-label" htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    className="auth-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    className="auth-input"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
