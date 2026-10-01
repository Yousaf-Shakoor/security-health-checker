export async function runSecurityAudit(url) {
  let res
  try {
    res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch {
    throw new Error('Could not reach the audit service. Please try again.')
  }

  let data = null
  try { data = await res.json() } catch {}
  if (!res.ok) throw new Error(data?.error || 'The security audit could not be completed.')
  return data
}
