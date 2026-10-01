import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ScannerInput from '../components/ScannerInput.jsx'
import ScanProgress from '../components/ScanProgress.jsx'
import ScanCheckItem from '../components/ScanCheckItem.jsx'
import { validateScanInput } from '../utils/validateUrl.js'
import { SCAN_SEQUENCE, normalizeDomain, buildScanResult } from '../data/mockScanData.js'
import { scanWebsite } from '../api/scan.js'
import '../styles/scan.css'

// While the real API request is in flight we don't know how long it will
// take, so the progress bar eases toward a cap and holds there. Once the
// response arrives it eases the rest of the way to 100 and navigates.
const PROGRESS_CAP_WHILE_WAITING = 92
const EASE_TOWARD_CAP = 0.045
const EASE_TOWARD_DONE = 0.22

export default function Scan() {
  const navigate = useNavigate()
  const location = useLocation()
  const [url, setUrl] = useState(location.state?.prefillUrl || '')
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const frameRef = useRef(null)

  const domain = normalizeDomain(url)
  const activeIndex = Math.min(
    SCAN_SEQUENCE.length - 1,
    Math.floor((progress / 100) * SCAN_SEQUENCE.length)
  )

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const startScan = () => {
    const validationError = validateScanInput(url)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setScanning(true)
    setProgress(0)

    let current = 0
    let target = PROGRESS_CAP_WHILE_WAITING
    let done = false
    let apiResult = null
    let apiError = null

    const tick = () => {
      const ease = done ? EASE_TOWARD_DONE : EASE_TOWARD_CAP
      current += (target - current) * ease
      if (done && target - current < 0.3) current = target
      setProgress(current)

      if (done && current >= target) {
        if (apiError) {
          setScanning(false)
          setError(apiError)
          return
        }
        setTimeout(() => {
          navigate('/results', { state: { result: buildScanResult(apiResult) } })
        }, 250)
        return
      }

      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    scanWebsite(url)
      .then((result) => {
        apiResult = { domain, ...result }
        target = 100
        done = true
      })
      .catch((err) => {
        apiError = err.message || 'The scan could not be completed. Please try again.'
        target = 100
        done = true
      })
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <section className="scan-hero">
          <div className="wrap">
            {!scanning ? (
              <div className="scan-hero-inner">
                <h1 className="display">Check Your Website Security</h1>
                <p className="scan-hero-sub">
                  Enter a website URL to run a safe, non-invasive security health check.
                </p>
                <ScannerInput
                  value={url}
                  onChange={(v) => {
                    setUrl(v)
                    if (error) setError(null)
                  }}
                  onSubmit={startScan}
                  error={error}
                />
              </div>
            ) : (
              <div className="scanning-screen">
                <div className="scanning-eyebrow">Analyzing</div>
                <div className="scanning-domain mono">{domain}</div>
                <div className="scanning-status">Security scan in progress…</div>

                <ScanProgress progress={progress} />

                <div className="scan-checks-panel">
                  <h4>Security Checks</h4>
                  {SCAN_SEQUENCE.map((check, i) => {
                    let status = 'pending'
                    if (i < activeIndex) status = 'done'
                    else if (i === activeIndex) status = progress >= 100 ? 'done' : 'active'
                    return <ScanCheckItem key={check.id} label={check.label} status={status} />
                  })}
                </div>

                <p className="scanning-note">Performing safe, non-invasive checks…</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
