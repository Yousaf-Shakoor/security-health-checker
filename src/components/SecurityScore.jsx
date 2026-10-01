import { useEffect, useRef, useState } from 'react'
import { getScoreBand } from '../utils/scoreBand.js'

// size: 'md' (hero-style card) | 'lg' (results dashboard hero score)
export default function SecurityScore({ score, status, size = 'md' }) {
  const [animated, setAnimated] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const frameRef = useRef(null)

  const band = getScoreBand(score)
  const radius = size === 'lg' ? 70 : 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setAnimated(true)
      setDisplayScore(score)
      return
    }

    const startDelay = setTimeout(() => {
      setAnimated(true)
      const duration = 1200
      const start = performance.now()

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplayScore(Math.round(eased * score))
        if (t < 1) frameRef.current = requestAnimationFrame(tick)
      }
      frameRef.current = requestAnimationFrame(tick)
    }, 250)

    return () => {
      clearTimeout(startDelay)
      cancelAnimationFrame(frameRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  const viewBox = size === 'lg' ? 160 : 110
  const center = viewBox / 2

  return (
    <div className={`score-ring score-ring--${size} score-ring--${band.key}`}>
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`}>
        <defs>
          <linearGradient id={`scoreGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={band.from} />
            <stop offset="100%" stopColor={band.to} />
          </linearGradient>
        </defs>
        <circle className="track" cx={center} cy={center} r={radius} />
        <circle
          className="fill"
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#scoreGrad-${size})`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animated ? offset : circumference,
          }}
        />
      </svg>
      <div className="score-num">
        <span className="val mono">{displayScore}</span>
        <span className="of">/ 100</span>
        {size === 'lg' && <span className={`score-status score-status--${band.key}`}>{status}</span>}
      </div>
    </div>
  )
}
