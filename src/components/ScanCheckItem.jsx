import { CheckIcon, SpinnerIcon, CircleIcon } from './Icons.jsx'

// status: 'done' | 'active' | 'pending'
export default function ScanCheckItem({ label, status }) {
  return (
    <div className={`scan-check-item ${status}`}>
      <span className="scan-check-icon">
        {status === 'done' && <CheckIcon width={15} height={15} />}
        {status === 'active' && <SpinnerIcon className="spin" width={15} height={15} />}
        {status === 'pending' && <CircleIcon width={15} height={15} />}
      </span>
      <span className="scan-check-label">{label}</span>
    </div>
  )
}
