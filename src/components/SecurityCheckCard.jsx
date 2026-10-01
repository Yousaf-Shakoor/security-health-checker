import {
  LockIcon,
  CertificateIcon,
  RedirectIcon,
  HeadersIcon,
  CookieIcon,
  DnsIcon,
  PerformanceIcon,
  CheckIcon,
  WarnIcon,
} from './Icons.jsx'

const ICONS = {
  https: LockIcon,
  ssl: CertificateIcon,
  redirect: RedirectIcon,
  headers: HeadersIcon,
  cookies: CookieIcon,
  dns: DnsIcon,
  performance: PerformanceIcon,
}

export default function SecurityCheckCard({ check }) {
  const Icon = ICONS[check.id] || LockIcon
  const isOk = check.status === 'ok'

  return (
    <div className="check-card">
      <div className={`check-card-icon ${check.status}`}>
        <Icon width={19} height={19} />
      </div>
      <div className="check-card-body">
        <div className="check-card-name">{check.name}</div>
        <div className={`check-card-label ${check.status}`}>
          {isOk ? <CheckIcon width={13} height={13} /> : <WarnIcon width={13} height={13} />}
          {check.label}
        </div>
        <p className="check-card-desc">{check.description}</p>
      </div>
    </div>
  )
}
