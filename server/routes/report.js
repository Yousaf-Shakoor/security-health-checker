import { Router } from 'express'
import { renderReportPdf } from '../pdf/report.js'

const router = Router()

// The frontend already has the full, already-computed scan result (the
// same object the Results dashboard renders) — it posts that back here so
// the PDF always matches exactly what's on screen, without the server
// needing to store scan history or re-run any checks.
router.post('/report/pdf', async (req, res) => {
  const result = req.body

  if (!result || typeof result !== 'object' || typeof result.domain !== 'string' || !result.domain.trim()) {
    res.status(400).json({ error: 'A scan result is required to generate a PDF report.' })
    return
  }

  try {
    const pdfBuffer = await renderReportPdf(result)
    const safeName = result.domain.replace(/[^a-z0-9.-]/gi, '_')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="security-report-${safeName}.pdf"`)
    res.setHeader('Content-Length', pdfBuffer.length)
    res.send(pdfBuffer)
  } catch (err) {
    console.error('[server] PDF generation failed:', err)
    res.status(500).json({ error: 'Could not generate the PDF report. Please try again.' })
  }
})

export default router
