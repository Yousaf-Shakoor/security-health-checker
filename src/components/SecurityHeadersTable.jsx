import { CheckIcon, WarnIcon } from './Icons.jsx'

export default function SecurityHeadersTable({ rows }) {
  return (
    <div className="headers-table-wrap">
      <table className="headers-table">
        <thead>
          <tr>
            <th>Security Header</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.header}>
              <td className="mono">{row.header}</td>
              <td>
                <span className={`header-status ${row.present ? 'ok' : 'warn'}`}>
                  {row.present ? <CheckIcon width={13} height={13} /> : <WarnIcon width={13} height={13} />}
                  {row.present ? 'Present' : 'Missing'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
