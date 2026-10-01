const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScanProgress({ progress }) {
  const offset = CIRCUMFERENCE - (Math.min(progress, 100) / 100) * CIRCUMFERENCE

  return (
    <div className="scan-progress-ring">
      <svg viewBox="0 0 180 180">
        <defs>
          <linearGradient id="scanProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38e1ff" />
            <stop offset="100%" stopColor="#5b8def" />
          </linearGradient>
        </defs>
        <circle className="track" cx="90" cy="90" r={RADIUS} />
        <circle
          className="fill"
          cx="90"
          cy="90"
          r={RADIUS}
          style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: offset }}
        />
      </svg>
      <div className="scan-progress-label">
        <span className="val display">{Math.round(progress)}%</span>
        <span className="sub">scanning</span>
      </div>
    </div>
  )
}
