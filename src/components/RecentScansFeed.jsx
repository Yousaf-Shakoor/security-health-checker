import { useEffect, useRef, useState } from 'react'
import { getRecentScans } from '../api/scans.js'
import { getScoreBand } from '../utils/scoreBand.js'

const POLL_INTERVAL_MS = 8000

function timeAgo(iso) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 45) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function RecentScansFeed() {
  const [scans, setScans] = useState(null)
  const [error, setError] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await getRecentScans()
        if (!cancelled) {
          setScans(data)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    load()
    timerRef.current = setInterval(load, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(timerRef.current)
    }
  }, [])

  if (error || (scans && scans.length === 0)) return null

  return (
    <section className="recent-scans">
      <div className="wrap">
        <div className="recent-scans-panel reveal">
          <div className="recent-scans-head">
            <span className="live-dot" aria-hidden="true" />
            <h2 className="display">Recently Scanned</h2>
            <span className="recent-scans-sub">Live activity from real scans, updated automatically</span>
          </div>

          {!scans && <div className="recent-scans-loading">Loading recent activity…</div>}

          {scans && scans.length > 0 && (
            <ul className="recent-scans-list">
              {scans.slice(0, 8).map((scan) => {
                const band = getScoreBand(typeof scan.score === 'number' ? scan.score : 0)
                return (
                  <li key={scan.id} className="recent-scan-row">
                    <span className={`recent-scan-dot recent-scan-dot--${band.key}`} />
                    <span className="recent-scan-domain mono">{scan.domain}</span>
                    <span className={`recent-scan-status recent-scan-status--${band.key}`}>{scan.status}</span>
                    <span className="recent-scan-score mono">{typeof scan.score === 'number' ? scan.score : '—'}/100</span>
                    <span className="recent-scan-time">{timeAgo(scan.scannedAt)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
