// Shared score-to-color-band logic: green for healthy, amber for
// needs-review, red only for seriously low scores. Used by SecurityScore
// and the results score panel so the palette always stays in sync.
export function getScoreBand(score) {
  if (score >= 80) return { key: 'good', from: '#34d399', to: '#22c07f' }
  if (score >= 50) return { key: 'warn', from: '#38e1ff', to: '#5b8def' }
  return { key: 'critical', from: '#f0567a', to: '#f5a623' }
}
