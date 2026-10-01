import { validateAndNormalizeUrl } from './url-validator.js'
import { resolveSafeAddress } from './ssrf-guard.js'
import { checkHttps } from './https-check.js'
import { checkHttpToHttpsRedirect } from './redirect-check.js'
import { checkSsl } from './ssl-check.js'
import { checkHeaders } from './headers-check.js'
import { checkCookies } from './cookie-check.js'
import { checkDns } from './dns-check.js'
import { checkPerformance } from './performance-check.js'

const severityWeight = { Critical: 25, High: 18, Medium: 10, Low: 5 }

export async function runSecurityAudit(rawUrl) {
  const { hostname } = validateAndNormalizeUrl(rawUrl)
  await resolveSafeAddress(hostname)

  const [https, redirect, ssl, headersOutcome, dns, performance] = await Promise.all([
    checkHttps(hostname),
    checkHttpToHttpsRedirect(hostname),
    checkSsl(hostname),
    checkHeaders(hostname),
    checkDns(hostname),
    checkPerformance(hostname),
  ])

  const headers = headersOutcome.result
  const cookies = checkCookies(headersOutcome.rawHeaders)
  const raw = headersOutcome.rawHeaders || {}

  const findings = []
  const add = (id, title, severity, description, recommendation) =>
    findings.push({ id, title, severity, description, recommendation })

  if (!https.enabled) add('audit-https', 'HTTPS is not confirmed', 'High', 'The target could not be confirmed as reachable over HTTPS.', 'Serve the site over HTTPS with a trusted certificate.')
  if (!redirect.httpToHttps) add('audit-redirect', 'HTTP does not redirect to HTTPS', 'Medium', 'Plain HTTP did not redirect to an HTTPS URL.', 'Redirect HTTP traffic to the canonical HTTPS URL.')
  if (!ssl.valid) add('audit-ssl', 'TLS certificate needs review', 'High', 'The certificate could not be fully validated by the scanner.', 'Install and maintain a valid certificate covering the hostname.')

  for (const row of headers.table || []) {
    if (!row.present) {
      const severity = row.header === 'Content-Security-Policy' || row.header === 'Strict-Transport-Security' || row.header === 'X-Frame-Options' ? 'Medium' : 'Low'
      add(`audit-header-${row.header.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, `${row.header} is missing`, severity, `The ${row.header} response header was not detected.`, `Configure an appropriate ${row.header} header for the application.`)
    }
  }

  if (cookies.cookieCount > 0 && cookies.status !== 'secure') {
    add('audit-cookies', 'Cookie security attributes need review', 'Medium', 'One or more observed cookies are missing Secure, HttpOnly, or SameSite attributes.', 'Review session and authentication cookies and set appropriate security attributes.')
  }

  if (raw.server) add('audit-server-disclosure', 'Server information is exposed', 'Low', `The response exposes a Server header (${String(raw.server).slice(0, 80)}).`, 'Consider minimizing unnecessary server/version disclosure in response headers.')
  if (raw['x-powered-by']) add('audit-powered-by', 'Technology disclosure header is exposed', 'Low', `The response exposes X-Powered-By (${String(raw['x-powered-by']).slice(0, 80)}).`, 'Remove X-Powered-By where possible to reduce unnecessary technology disclosure.')

  const passed = [
    ['https', https.enabled, 'HTTPS', 'HTTPS is reachable.'],
    ['ssl', ssl.valid, 'TLS certificate', 'The certificate is valid and trusted by the scanner.'],
    ['redirect', redirect.httpToHttps, 'HTTPS redirect', 'HTTP redirects to HTTPS.'],
    ['headers', headers.missingCount === 0, 'Security headers', 'All checked security headers are present.'],
    ['cookies', cookies.cookieCount === 0 || cookies.status === 'secure', 'Cookie security', 'Observed cookies use the checked security attributes.'],
    ['dns', dns.status === 'secure', 'DNS resolution', 'Basic DNS information was resolved.'],
    ['performance', performance.status !== 'Slow', 'Response performance', 'The response was not classified as slow.'],
    ['disclosure', !raw.server && !raw['x-powered-by'], 'Header disclosure', 'No Server or X-Powered-By disclosure headers were detected.'],
  ]

  const failedWeight = findings.reduce((sum, item) => sum + (severityWeight[item.severity] || 0), 0)
  const score = Math.max(0, Math.min(100, 100 - failedWeight))
  const status = score >= 85 ? 'Good' : score >= 60 ? 'Needs Improvement' : 'At Risk'

  return {
    domain: hostname,
    score,
    status,
    scannedAt: new Date().toISOString(),
    checks: passed.map(([id, ok, name, detail]) => ({ id, name, status: ok ? 'pass' : 'fail', detail })),
    findings: findings.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0)),
    summary: {
      passed: passed.filter(([, ok]) => ok).length,
      failed: passed.filter(([, ok]) => !ok).length,
      findings: findings.length,
    },
    source: 'safe, non-invasive HTTP/TLS/DNS checks',
  }
}
