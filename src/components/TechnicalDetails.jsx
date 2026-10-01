export default function TechnicalDetails({ technical }) {
  const rows = [
    ['Website URL', technical.url],
    ['Protocol', technical.protocol],
    ['HTTP Status', technical.httpStatus],
    ['Response Time', technical.responseTime],
    ['Server', technical.server],
    ['Content Type', technical.contentType],
    ['Scan Time', technical.scanTime],
  ]

  return (
    <div className="tech-card">
      <dl className="tech-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className="mono">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="tech-note">Sample/demo results until the real backend scanner is implemented.</p>
    </div>
  )
}
