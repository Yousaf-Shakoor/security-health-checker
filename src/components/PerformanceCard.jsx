export default function PerformanceCard({ performance }) {
  const rows = [
    ['Page Response', performance.responseTime],
    ['Page Size', performance.pageSize],
    ['Resources', performance.resources],
  ]

  return (
    <div className="detail-card">
      <div className="perf-status-row">
        <span className="perf-status-badge">{performance.status}</span>
      </div>
      <dl className="tech-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className="mono">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="detail-note">
        Performance metrics are basic indicators and are not a replacement for a complete
        performance audit.
      </p>
    </div>
  )
}
