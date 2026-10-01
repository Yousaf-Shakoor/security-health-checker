import { CheckIcon, WarnIcon } from './Icons.jsx'

export default function CookieSecurityCard({ attributes }) {
  return (
    <div className="detail-card">
      <div className="headers-table-wrap">
        <table className="headers-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((row) => (
              <tr key={row.attribute}>
                <td className="mono">{row.attribute}</td>
                <td>
                  <span className={`header-status ${row.status}`}>
                    {row.status === 'ok' ? <CheckIcon width={13} height={13} /> : <WarnIcon width={13} height={13} />}
                    {row.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="detail-note">
        Secure cookie attributes help prevent cookies from being exposed over unencrypted
        connections or accessed by client-side scripts. Cookie values themselves are never
        inspected or exposed.
      </p>
    </div>
  )
}
