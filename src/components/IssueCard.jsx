import { WarnIcon } from './Icons.jsx'

const SEVERITY_CLASS = {
  High: 'sev-high',
  Medium: 'sev-medium',
  Low: 'sev-low',
}

export default function IssueCard({ issue }) {
  return (
    <div className="issue-card">
      <div className="issue-card-top">
        <div className="issue-card-title">
          <WarnIcon width={17} height={17} />
          <span>{issue.title}</span>
        </div>
        <span className={`sev-badge ${SEVERITY_CLASS[issue.severity] || 'sev-medium'}`}>
          {issue.severity}
        </span>
      </div>
      <p className="issue-card-desc">{issue.description}</p>
      <p className="issue-card-rec">
        <strong>Recommendation:</strong> {issue.recommendation}
      </p>
    </div>
  )
}
