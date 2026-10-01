import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { runSecurityAudit } from '../api/audit.js'
import '../styles/audit.css'

export default function Audit() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!url.trim()) return setError('Enter a website URL.')
    setLoading(true)
    try { setResult(await runSecurityAudit(url.trim())) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return <div className="page-shell"><Navbar /><main className="page-main audit-page">
    <div className="wrap">
      <section className="audit-hero">
        <div className="audit-eyebrow">SECURITY AUDIT</div>
        <h1 className="display">Audit a Website's Security Posture</h1>
        <p>Run safe, non-invasive HTTPS, TLS, header, cookie, DNS, performance and information-disclosure checks.</p>
        <form className="audit-form" onSubmit={submit}>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" aria-label="Website URL" />
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Auditing…' : 'Run Security Audit'}</button>
        </form>
        {error && <div className="audit-error">{error}</div>}
      </section>

      {result && <section className="audit-results">
        <div className="audit-overview">
          <div><span className="audit-label">AUDIT SCORE</span><strong>{result.score}<small>/100</small></strong><span className={`audit-status audit-status--${result.status.toLowerCase().replace(/\s+/g,'-')}`}>{result.status}</span></div>
          <div className="audit-meta"><b>{result.domain}</b><span>{result.summary.passed} checks passed · {result.findings.length} findings</span></div>
        </div>

        <h2 className="display audit-heading">Audit Checks</h2>
        <div className="audit-check-grid">{result.checks.map(c => <div className={`audit-check ${c.status}`} key={c.id}><span>{c.status === 'pass' ? '✓' : '!'}</span><div><b>{c.name}</b><p>{c.detail}</p></div></div>)}</div>

        <div className="audit-findings-head"><h2 className="display">Findings</h2><span>{result.findings.length} detected</span></div>
        {result.findings.length === 0 ? <div className="audit-clean">✓ No findings were detected by these checks.</div> : <div className="audit-findings">{result.findings.map(f => <article className="audit-finding" key={f.id}><div className={`severity severity-${f.severity.toLowerCase()}`}>{f.severity}</div><div><h3>{f.title}</h3><p>{f.description}</p><strong>Recommendation</strong><p>{f.recommendation}</p></div></article>)}</div>}

        <div className="audit-note">This audit performs non-invasive checks only. It does not attempt exploitation, brute force, credential attacks, or destructive testing.</div>
      </section>}
    </div>
  </main><Footer /></div>
}
