import { validateAndNormalizeUrl } from './url-validator.js'
import { resolveSafeAddress } from './ssrf-guard.js'
import { checkHttps } from './https-check.js'
import { checkHttpToHttpsRedirect } from './redirect-check.js'
import { checkSsl } from './ssl-check.js'
import { checkHeaders } from './headers-check.js'
import { checkCookies } from './cookie-check.js'
import { checkDns } from './dns-check.js'
import { checkPerformance } from './performance-check.js'
import { buildIssuesAndScore } from './score.js'

/**
 * Runs every implemented safe, non-invasive check for a URL and returns a
 * fully real (no mock) report: HTTPS, HTTP->HTTPS redirect, SSL
 * certificate, security headers, cookie security, basic DNS, basic
 * performance, plus a computed score, issues and recommendations derived
 * from those real results.
 */
export async function runScan(rawUrl) {
  const { hostname } = validateAndNormalizeUrl(rawUrl)

  // Fail fast with a clear SSRF/DNS error before running any checks.
  await resolveSafeAddress(hostname)

  const [https, redirect, ssl, headersOutcome, dnsInfo, performance] = await Promise.all([
    checkHttps(hostname),
    checkHttpToHttpsRedirect(hostname),
    checkSsl(hostname),
    checkHeaders(hostname),
    checkDns(hostname),
    checkPerformance(hostname),
  ])

  const headers = headersOutcome.result
  const cookies = checkCookies(headersOutcome.rawHeaders)

  const { issues, score, status, recommendations } = buildIssuesAndScore({
    https,
    redirect,
    ssl,
    headers,
    cookies,
    performance,
  })

  const rawHeaders = headersOutcome.rawHeaders || {}
  const technical = {
    protocol: https.enabled ? 'HTTPS' : 'HTTP',
    httpStatus: headers.statusCode != null ? String(headers.statusCode) : 'Unknown',
    server: rawHeaders.server || 'Unknown',
    contentType: rawHeaders['content-type'] || 'Unknown',
  }

  return {
    domain: hostname,
    score,
    status,
    https,
    redirect,
    ssl,
    headers,
    cookies,
    dns: dnsInfo,
    performance,
    issues,
    recommendations,
    technical,
  }
}
