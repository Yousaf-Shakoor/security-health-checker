import { CertificateIcon, CheckIcon } from './Icons.jsx'

export default function CertificateCard({ certificate }) {
  return (
    <div className="cert-card">
      <div className="cert-card-top">
        <div className="cert-card-icon"><CertificateIcon width={19} height={19} /></div>
        <div>
          <h3>SSL Certificate</h3>
          <span className="cert-status"><CheckIcon width={13} height={13} /> Valid</span>
        </div>
      </div>
      <dl className="cert-list">
        <div><dt>Domain</dt><dd className="mono">{certificate.domain}</dd></div>
        <div><dt>Issuer</dt><dd>{certificate.issuer}</dd></div>
        <div><dt>Valid From</dt><dd>{certificate.validFrom}</dd></div>
        <div><dt>Valid Until</dt><dd>{certificate.validUntil}</dd></div>
        <div><dt>Days Remaining</dt><dd><strong>{certificate.daysRemaining} days</strong></dd></div>
      </dl>
      <p className="cert-note">This is mock data only for the current UI.</p>
    </div>
  )
}
