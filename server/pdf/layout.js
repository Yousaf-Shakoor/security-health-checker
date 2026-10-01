// Small layout helper wrapping a PDFKit document: tracks the cursor,
// handles page breaks, and provides reusable drawing primitives so the
// report sections (report.js) read like content, not coordinate math.

export const PAGE = {
  width: 612, // US Letter, points
  height: 792,
  margin: 50,
}

export const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2

export const COLORS = {
  navy: '#0b1220',
  navyDark: '#070c14',
  text: '#1a2433',
  muted: '#5b6b7d',
  mutedLight: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  cyan: '#0e7490',
  cyanBg: '#ecfeff',
  success: '#059669',
  successBg: '#ecfdf5',
  warning: '#b45309',
  warningBg: '#fffbeb',
  danger: '#dc2626',
  dangerBg: '#fef2f2',
  white: '#ffffff',
}

export function statusColors(status) {
  if (status === 'ok' || status === 'secure' || status === 'Good' || status === 'working') {
    return { fg: COLORS.success, bg: COLORS.successBg }
  }
  if (status === 'critical' || status === 'At Risk') {
    return { fg: COLORS.danger, bg: COLORS.dangerBg }
  }
  return { fg: COLORS.warning, bg: COLORS.warningBg }
}

export function severityColors(severity) {
  if (severity === 'High') return { fg: COLORS.danger, bg: COLORS.dangerBg }
  if (severity === 'Low') return { fg: COLORS.cyan, bg: COLORS.cyanBg }
  return { fg: COLORS.warning, bg: COLORS.warningBg } // Medium
}

export class Layout {
  constructor(doc) {
    this.doc = doc
    this.footerText = ''
  }

  get y() {
    return this.doc.y
  }

  set y(value) {
    this.doc.y = value
  }

  // Ensures `needed` points of vertical space remain on the current page,
  // adding a new page (with the standard side margins) if not.
  ensureSpace(needed) {
    const bottom = PAGE.height - PAGE.margin
    if (this.doc.y + needed > bottom) {
      this.doc.addPage({ margins: { top: PAGE.margin, bottom: PAGE.margin, left: PAGE.margin, right: PAGE.margin } })
      this.doc.y = PAGE.margin
    }
  }

  moveDown(amount = 1) {
    this.doc.moveDown(amount)
  }

  sectionTitle(text) {
    this.ensureSpace(40)
    this.doc
      .fillColor(COLORS.navy)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text(text, PAGE.margin, this.doc.y)
    this.doc
      .moveTo(PAGE.margin, this.doc.y + 6)
      .lineTo(PAGE.width - PAGE.margin, this.doc.y + 6)
      .strokeColor(COLORS.border)
      .lineWidth(1)
      .stroke()
    this.doc.moveDown(0.9)
  }

  subheading(text) {
    this.ensureSpace(20)
    this.doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10.5).text(text, PAGE.margin, this.doc.y)
    this.doc.moveDown(0.3)
  }

  paragraph(text, opts = {}) {
    this.ensureSpace(30)
    this.doc
      .fillColor(opts.color || COLORS.muted)
      .font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(opts.size || 9.5)
      .text(text, PAGE.margin, this.doc.y, { width: CONTENT_WIDTH, lineGap: 2 })
    this.doc.moveDown(opts.gap ?? 0.6)
  }

  badge(text, { fg, bg }, x, y) {
    const paddingX = 8
    const width = this.doc.font('Helvetica-Bold').fontSize(8).widthOfString(text) + paddingX * 2
    const height = 15
    this.doc.roundedRect(x, y, width, height, 7.5).fill(bg)
    this.doc.fillColor(fg).font('Helvetica-Bold').fontSize(8).text(text, x + paddingX, y + 4, { lineBreak: false })
    return width
  }

  hr(gapAfter = 0.6) {
    this.ensureSpace(10)
    this.doc
      .moveTo(PAGE.margin, this.doc.y)
      .lineTo(PAGE.width - PAGE.margin, this.doc.y)
      .strokeColor(COLORS.borderLight)
      .lineWidth(1)
      .stroke()
    this.doc.moveDown(gapAfter)
  }
}
