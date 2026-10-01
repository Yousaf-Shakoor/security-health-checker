// Thin client around POST /api/scan.
// Scanning is public: no account, token, or payment is required.
export async function scanWebsite(url) {
  let res
  try {
    res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch {
    throw new Error('Could not reach the scanning service. Please try again.')
  }

  let data = null
  try { data = await res.json() } catch {}
  if (!res.ok) {
    throw new Error((data && data.error) || 'The scan could not be completed. Please try again.')
  }
  return data
}
