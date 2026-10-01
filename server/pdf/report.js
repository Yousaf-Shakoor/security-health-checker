import PDFDocument from 'pdfkit'
import { Layout, PAGE, CONTENT_WIDTH, COLORS, statusColors, severityColors } from './layout.js'

/**
 * Renders a full PDF security report for a scan result (the same shape the
 * Results dashboard displays) and returns it as a Buffer.
 */
export function renderReportPdf(result) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: PAGE.margin, bottom: PAGE.margin, left: PAGE.margin, right: PAGE.margin },
      bufferPages: true,
      info: {
        Title: `Security Health Report — ${result.domain || 'website'}`,
        Author: 'Security Health Checker',
      },
    })

    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const layout = new Layout(doc)

    drawHeader(layout, result)
    drawScoreSection(layout, result)
    drawChecksSection(layout, result)
    drawIssuesSection(layout, result)
    drawHeadersSection(layout, result)
    drawTwoColumnFacts(layout, 'SSL Certificate', certificateFacts(result.certificate))
    drawCookieSection(layout, result)
    drawTwoColumnFacts(layout, 'DNS Information', dnsFacts(result.dns))
    drawTwoColumnFacts(layout, 'Performance', performanceFacts(result.performance))
    drawRecommendationsSection(layout, result)
    drawSummarySection(layout, result)
    drawFootersOnAllPages(doc, result)

    doc.end()
  })
}

function drawHeader(layout, result) {
  const { doc } = layout
  doc.rect(0, 0, PAGE.width, 96).fill(COLORS.navyDark)

  doc.fillColor(COLORS.white).font('Helvetica-Bold').fontSize(18).text('Security Health Report', PAGE.margin, 28)

  doc
    .fillColor('#9fb3c8')
    .font('Helvetica')
    .fontSize(10)
    .text(result.domain || 'Unknown domain', PAGE.margin, 52)
  doc.fillColor('#6b8299').fontSize(9).text(result.scannedAtLabel || 'Scanned just now', PAGE.margin, 67)

  const sc = statusColors(scoreBandKey(result.score))
  const badgeText = `${result.status || 'Unknown'} · ${typeof result.score === 'number' ? result.score : '—'}/100`
  const badgeWidth = doc.font('Helvetica-Bold').fontSize(10).widthOfString(badgeText) + 24
  const badgeX = PAGE.width - PAGE.margin - badgeWidth
  doc.roundedRect(badgeX, 34, badgeWidth, 24, 12).fill(sc.bg)
  doc.fillColor(sc.fg).font('Helvetica-Bold').fontSize(10).text(badgeText, badgeX + 12, 41, { lineBreak: false })

  doc.y = 118
}

function scoreBandKey(score) {
  if (typeof score !== 'number') return 'warn'
  if (score >= 80) return 'ok'
  if (score >= 50) return 'warn'
  return 'critical'
}

function drawScoreSection(layout, result) {
  const { doc } = layout
  layout.ensureSpace(70)
  const sc = statusColors(scoreBandKey(result.score))

  doc.fillColor(sc.fg).font('Helvetica-Bold').fontSize(30).text(
    typeof result.score === 'number' ? String(result.score) : '—',
    PAGE.margin,
    doc.y
  )
  doc.fillColor(COLORS.mutedLight).font('Helvetica').fontSize(11).text('/ 100', PAGE.margin + 58, doc.y - 26)

  doc.y = doc.y + 4
  layout.paragraph(result.scoreSummary || '', { gap: 0.8 })
  layout.hr()
}

function drawChecksSection(layout, result) {
  layout.sectionTitle('Security Check Summary')
  const { doc } = layout
  const order = result.checkOrder || Object.keys(result.checks || {})

  order.forEach((id) => {
    const check = result.checks?.[id]
    if (!check) return
    layout.ensureSpace(34)

    const rowY = doc.y
    doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10).text(check.name, PAGE.margin, rowY, { continued: false })

    const sc = statusColors(check.status)
    const badgeW = layout.badge(check.label, sc, PAGE.margin + 150, rowY - 2)

    doc
      .fillColor(COLORS.muted)
      .font('Helvetica')
      .fontSize(9)
      .text(check.description, PAGE.margin + 150 + badgeW + 12, rowY + 1, {
        width: CONTENT_WIDTH - 150 - badgeW - 12,
      })

    doc.y = Math.max(doc.y, rowY + 18)
    doc.moveDown(0.4)
  })

  layout.moveDown(0.3)
}

function drawIssuesSection(layout, result) {
  const issues = result.issues || []
  layout.sectionTitle(`Issues Found (${issues.length})`)

  if (issues.length === 0) {
    layout.paragraph('No issues were detected in this scan.', { color: COLORS.success, bold: true })
    return
  }

  issues.forEach((issue) => {
    layout.ensureSpace(70)
    const { doc } = layout
    const rowY = doc.y

    doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10.5).text(issue.title, PAGE.margin, rowY, {
      width: CONTENT_WIDTH - 80,
    })

    const sevColors = severityColors(issue.severity)
    layout.badge(issue.severity, sevColors, PAGE.width - PAGE.margin - 60, rowY - 1)

    doc.y = Math.max(doc.y, rowY + 16)
    doc.fillColor(COLORS.muted).font('Helvetica').fontSize(9).text(issue.description, PAGE.margin, doc.y, {
      width: CONTENT_WIDTH,
      lineGap: 1,
    })
    doc.moveDown(0.2)
    doc
      .fillColor(COLORS.text)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('Recommendation: ', PAGE.margin, doc.y, { continued: true })
    doc.font('Helvetica').fillColor(COLORS.muted).text(issue.recommendation, { width: CONTENT_WIDTH })
    doc.moveDown(0.7)
  })
}

function drawHeadersSection(layout, result) {
  const rows = result.headersTable || []
  layout.sectionTitle('Security Headers')

  if (rows.length === 0) {
    layout.paragraph('No header data available.')
    return
  }

  const { doc } = layout
  const colHeaderWidth = CONTENT_WIDTH - 120

  layout.ensureSpace(22)
  doc.fillColor(COLORS.mutedLight).font('Helvetica-Bold').fontSize(8.5)
  doc.text('HEADER', PAGE.margin, doc.y, { width: colHeaderWidth, continued: false })
  doc.text('STATUS', PAGE.margin + colHeaderWidth, doc.y - doc.currentLineHeight(), { width: 100 })
  doc.moveDown(0.4)
  layout.hr(0.3)

  rows.forEach((row) => {
    layout.ensureSpace(22)
    const rowY = doc.y
    doc.fillColor(COLORS.text).font('Helvetica').fontSize(9.5).text(row.header, PAGE.margin, rowY, {
      width: colHeaderWidth,
    })
    const sc = statusColors(row.present ? 'ok' : 'warn')
    layout.badge(row.present ? 'Present' : 'Missing', sc, PAGE.margin + colHeaderWidth, rowY - 2)
    doc.y = Math.max(doc.y, rowY + 16)
  })

  layout.paragraph(
    'Security headers help browsers apply additional security protections to web pages.',
    { size: 8.5, gap: 0.8 }
  )
  layout.hr()
}

function drawCookieSection(layout, result) {
  const attrs = result.cookieAttributes || []
  layout.sectionTitle('Cookie Security')

  if (attrs.length === 0) {
    layout.paragraph('No cookies were observed on this page.')
    layout.hr()
    return
  }

  const { doc } = layout
  attrs.forEach((attr) => {
    layout.ensureSpace(22)
    const rowY = doc.y
    doc.fillColor(COLORS.text).font('Helvetica').fontSize(9.5).text(attr.attribute, PAGE.margin, rowY, { width: 200 })
    const sc = statusColors(attr.status === 'ok' ? 'ok' : 'warn')
    layout.badge(attr.label, sc, PAGE.margin + 200, rowY - 2)
    doc.y = Math.max(doc.y, rowY + 16)
  })
  layout.moveDown(0.3)
  layout.hr()
}

function certificateFacts(cert) {
  if (!cert) return []
  return [
    ['Domain', cert.domain],
    ['Issuer', cert.issuer],
    ['Valid From', cert.validFrom],
    ['Valid Until', cert.validUntil],
    ['Days Remaining', String(cert.daysRemaining)],
  ]
}

function dnsFacts(dns) {
  if (!dns) return []
  return [
    ['A Record', dns.aRecord],
    ['AAAA', dns.aaaa],
    ['MX', dns.mx],
    ['Nameservers', dns.nameservers],
  ]
}

function performanceFacts(perf) {
  if (!perf) return []
  return [
    ['Page Response', perf.responseTime],
    ['Page Size', perf.pageSize],
    ['Resources', String(perf.resources)],
    ['Status', perf.status],
  ]
}

function drawTwoColumnFacts(layout, title, facts) {
  layout.sectionTitle(title)
  if (!facts.length) {
    layout.paragraph('No data available.')
    return
  }
  const { doc } = layout
  facts.forEach(([label, value]) => {
    layout.ensureSpace(20)
    const rowY = doc.y
    doc.fillColor(COLORS.muted).font('Helvetica').fontSize(9.5).text(label, PAGE.margin, rowY, { width: 160 })
    doc.fillColor(COLORS.text).font('Helvetica-Bold').fontSize(9.5).text(String(value ?? '—'), PAGE.margin + 160, rowY, {
      width: CONTENT_WIDTH - 160,
    })
    doc.y = Math.max(doc.y, rowY + 16)
  })
  layout.moveDown(0.3)
  layout.hr()
}

function drawRecommendationsSection(layout, result) {
  const recs = result.recommendations || []
  layout.sectionTitle('Recommended Actions')

  if (recs.length === 0) {
    layout.paragraph('No specific recommendations for this scan.')
    return
  }

  const { doc } = layout
  recs.forEach((rec) => {
    layout.ensureSpace(36)
    const rowY = doc.y
    doc.fillColor(COLORS.cyan).font('Helvetica-Bold').fontSize(11).text(String(rec.order).padStart(2, '0'), PAGE.margin, rowY, {
      width: 26,
    })
    doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10).text(rec.title, PAGE.margin + 30, rowY, {
      width: CONTENT_WIDTH - 30,
    })
    doc.fillColor(COLORS.muted).font('Helvetica').fontSize(9).text(rec.description, PAGE.margin + 30, doc.y + 2, {
      width: CONTENT_WIDTH - 30,
    })
    doc.moveDown(0.6)
  })
}

function drawSummarySection(layout, result) {
  layout.sectionTitle('Security Summary')
  layout.paragraph(result.reportSummary || result.scoreSummary || '', { color: COLORS.text, gap: 0.3 })
}

function drawFootersOnAllPages(doc, result) {
  const range = doc.bufferedPageRange()
  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i)

    // The footer sits below the page's normal bottom margin. PDFKit's
    // .text() auto-paginates when it would render past doc.page.margins,
    // so temporarily zero the bottom margin while drawing the footer —
    // otherwise every footer draw silently appends a blank extra page.
    const originalBottomMargin = doc.page.margins.bottom
    doc.page.margins.bottom = 0

    const y = PAGE.height - PAGE.margin + 14

    doc
      .moveTo(PAGE.margin, y - 8)
      .lineTo(PAGE.width - PAGE.margin, y - 8)
      .strokeColor(COLORS.borderLight)
      .lineWidth(1)
      .stroke()

    doc
      .fillColor(COLORS.mutedLight)
      .font('Helvetica')
      .fontSize(7.5)
      .text(
        `Automated basic security health check — not a complete security audit. Generated ${generatedAt}.`,
        PAGE.margin,
        y,
        { width: CONTENT_WIDTH - 60, lineBreak: false }
      )

    doc
      .fillColor(COLORS.mutedLight)
      .font('Helvetica')
      .fontSize(7.5)
      .text(`Page ${i - range.start + 1} of ${range.count}`, PAGE.width - PAGE.margin - 60, y, {
        width: 60,
        align: 'right',
        lineBreak: false,
      })

    doc.page.margins.bottom = originalBottomMargin
  }
}
