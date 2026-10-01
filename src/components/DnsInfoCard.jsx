export default function DnsInfoCard({ dns }) {
  const rows = [
    ['A Record', dns.aRecord],
    ['AAAA', dns.aaaa],
    ['MX', dns.mx],
    ['Nameservers', dns.nameservers],
  ]

  return (
    <div className="detail-card">
      <dl className="tech-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className="mono">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="detail-note">Basic public DNS information only. Real lookups are not yet implemented.</p>
    </div>
  )
}
