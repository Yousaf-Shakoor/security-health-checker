import { ArrowRightIcon, ShieldOutlineIcon } from './Icons.jsx'

export default function ScannerInput({
  value,
  onChange,
  onSubmit,
  error,
  loading = false,
  label = 'Enter your website URL',
  buttonLabel = 'Scan Website',
  note = 'Only scan websites you own or are authorized to audit.',
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form className="scan-card" onSubmit={handleSubmit} noValidate>
      <div className="scan-label">{label}</div>
      <div className="scan-row">
        <input
          className="scan-input"
          type="text"
          placeholder="https://example.com"
          aria-label="Website URL"
          aria-invalid={Boolean(error)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-primary scan-btn" type="submit" disabled={loading}>
          {loading ? 'Scanning\u2026' : buttonLabel}
          {!loading && <ArrowRightIcon width={15} height={15} />}
        </button>
      </div>
      {error && <div className="scan-error" role="alert">{error}</div>}
      <div className="scan-note">
        <ShieldOutlineIcon width={14} height={14} />
        {note}
      </div>
    </form>
  )
}
