import { ArrowRightIcon } from './Icons.jsx'

export default function RecommendationCard({ recommendation, onLearnMore }) {
  return (
    <div className="rec-card">
      <div className="rec-card-num mono">{String(recommendation.order).padStart(2, '0')}</div>
      <div className="rec-card-body">
        <h3>{recommendation.title}</h3>
        <p>{recommendation.description}</p>
        <button type="button" className="rec-learn-more" onClick={onLearnMore}>
          Learn More <ArrowRightIcon width={13} height={13} />
        </button>
      </div>
    </div>
  )
}
