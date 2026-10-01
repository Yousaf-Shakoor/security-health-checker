// Posts the already-computed scan result to the backend, which renders a
// matching PDF, then triggers a browser download of the response.
export async function downloadPdfReport(result) {
  let res
  try {
    res = await fetch('/api/report/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    })
  } catch {
    throw new Error('Could not reach the server to generate the PDF. Please try again.')
  }

  if (!res.ok) {
    let message = 'Could not generate the PDF report. Please try again.'
    try {
      const data = await res.json()
      if (data && data.error) message = data.error
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message)
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const safeName = (result.domain || 'website').replace(/[^a-z0-9.-]/gi, '_')

  const link = document.createElement('a')
  link.href = url
  link.download = `security-report-${safeName}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
