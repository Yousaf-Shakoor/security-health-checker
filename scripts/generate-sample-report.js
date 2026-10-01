// Generates public/sample-report.pdf — the demo report the homepage's
// "View Sample Report" button opens. It uses the exact same renderer as a
// real scan's "Download PDF" (server/pdf/report.js), fed with the fixed
// fictional data in server/pdf/sample-report-data.js.
//
// The output is a plain static file, so it's served by whatever serves the
// frontend (Vite dev server, `vite preview`, or Express) and works with or
// without the API running. It regenerates automatically before every
// `npm run build` (see the "prebuild" script); run `npm run sample-report`
// by hand after editing the sample data in dev mode.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderReportPdf } from '../server/pdf/report.js'
import { SAMPLE_REPORT } from '../server/pdf/sample-report-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outFile = path.join(__dirname, '..', 'public', 'sample-report.pdf')

fs.mkdirSync(path.dirname(outFile), { recursive: true })
const pdf = await renderReportPdf(SAMPLE_REPORT)
fs.writeFileSync(outFile, pdf)

console.log(`Sample report written to ${path.relative(process.cwd(), outFile)} (${pdf.length} bytes)`)
