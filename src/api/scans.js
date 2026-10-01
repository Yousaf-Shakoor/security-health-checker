// Client for the public recent-scans feed.
export async function getRecentScans() {
  let res
  try {
    res = await fetch('/api/recent-scans')
  } catch {
    throw new Error('Could not reach the scanning service. Please try again.')
  }

  let data = null
  try { data = await res.json() } catch {}
  if (!res.ok) {
    throw new Error((data && data.error) || 'Could not load recent scans.')
  }

  return Array.isArray(data) ? data : []
}
