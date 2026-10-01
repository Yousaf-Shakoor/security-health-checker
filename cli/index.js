#!/usr/bin/env node
import { runScan } from '../server/scanner/index.js'

const args = process.argv.slice(2)
const url = args.find((arg) => !arg.startsWith('-'))

if (!url || args.includes('--help') || args.includes('-h')) {
  console.log(`\nSecurity Health Checker CLI\n\nUsage:\n  security-health-checker <url>\n  npm run scan -- <url>\n\nExample:\n  security-health-checker https://example.com\n\nOnly scan websites you own or are authorized to audit.\n`)
  process.exit(url ? 0 : 1)
}

function mark(ok) { return ok ? '✓' : '✗' }
function value(v, fallback='Unknown') { return v === undefined || v === null || v === '' ? fallback : v }

try {
  console.log('\nSecurity Health Checker')
  console.log('────────────────────────────────')
  console.log(`Target: ${url}\n`)

  const result = await runScan(url)

  console.log(`${mark(result.https?.enabled)} HTTPS             ${result.https?.enabled ? 'Enabled' : 'Not enabled'}`)
  console.log(`${mark(result.ssl?.valid)} SSL Certificate   ${result.ssl?.valid ? 'Valid' : 'Needs attention'}`)
  console.log(`${mark(result.redirect?.working)} HTTP → HTTPS      ${result.redirect?.working ? 'Working' : 'Needs attention'}`)

  const headerTable = Array.isArray(result.headers?.table) ? result.headers.table : []
  const headerCount = headerTable.filter((h) => h.present).length
  const headerTotal = headerTable.length || '?'
  console.log(`${mark(headerCount === headerTable.length && headerTable.length > 0)} Security Headers  ${headerCount}/${headerTotal} present`)
  console.log(`${mark(result.dns?.status === 'secure')} DNS               Checked`)
  console.log(`${mark(result.cookies?.status === 'secure')} Cookies           ${result.cookies?.status === 'secure' ? 'Secure' : 'Review required'}`)

  console.log('\n────────────────────────────────')
  console.log(`Security Health Score: ${result.score}/100`)
  console.log(`Status: ${value(result.status)}`)

  if (result.issues?.length) {
    console.log('\nIssues:')
    for (const issue of result.issues) {
      const severity = value(issue.severity, 'INFO').toUpperCase()
      console.log(`  [${severity}] ${value(issue.title || issue.message, 'Issue detected')}`)
    }
  } else {
    console.log('\nNo issues reported by the configured checks.')
  }

  console.log('')
} catch (err) {
  console.error(`\nScan failed: ${err.message || err}`)
  process.exit(1)
}
