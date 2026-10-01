const HEADER_SEVERITY = {
  'Strict-Transport-Security': 'Medium',
  'Content-Security-Policy': 'Medium',
  'X-Content-Type-Options': 'Low',
  'X-Frame-Options': 'Medium',
  'Referrer-Policy': 'Low',
  'Permissions-Policy': 'Low',
}

const HEADER_ACTIONS = {
  'Strict-Transport-Security': 'Enable HSTS',
  'Content-Security-Policy': 'Review Content Security Policy',
  'X-Content-Type-Options': 'Add X-Content-Type-Options',
  'X-Frame-Options': 'Add X-Frame-Options',
  'Referrer-Policy': 'Add a Referrer-Policy',
  'Permissions-Policy': 'Add a Permissions-Policy',
}

const HEADER_RECOMMENDATIONS = {
  'Strict-Transport-Security': 'Consider enabling HSTS to help browsers enforce HTTPS connections.',
  'Content-Security-Policy': 'Review whether a suitable Content Security Policy can be configured for the website.',
  'X-Content-Type-Options': 'Consider configuring this header to reduce MIME-type sniffing risks.',
  'X-Frame-Options': 'Consider configuring this header to help prevent clickjacking.',
  'Referrer-Policy': 'Consider setting a Referrer-Policy to control how much referrer information is shared.',
  'Permissions-Policy': 'Consider configuring a Permissions-Policy to restrict powerful browser features.',
}

const SEVERITY_RANK = { High: 0, Medium: 1, Low: 2 }

/**
 * Builds the issues list, score and recommendations from the actual check
 * results — nothing here is hard-coded per-domain; every issue is derived
 * from a real condition observed during this scan.
 */
export function buildIssuesAndScore({ https, redirect, ssl, headers, cookies, performance }) {
  const issues = []

  if (!https?.enabled) {
    issues.push({
      id: 'https-missing',
      title: 'HTTPS Not Enabled',
      severity: 'High',
      description: 'The website could not be confirmed as reachable over HTTPS.',
      recommendation: 'Enable HTTPS with a valid TLS certificate for all pages.',
      action: 'Enable HTTPS',
    })
  }

  if (https?.enabled && !redirect?.httpToHttps) {
    issues.push({
      id: 'redirect-missing',
      title: 'HTTP Does Not Redirect to HTTPS',
      severity: 'Medium',
      description: 'Requests to the HTTP version of this site do not redirect to HTTPS.',
      recommendation: 'Configure a server-side redirect from HTTP to HTTPS.',
      action: 'Add an HTTP to HTTPS Redirect',
    })
  }

  if (https?.enabled && ssl && !ssl.valid) {
    issues.push({
      id: 'ssl-invalid',
      title: 'SSL Certificate Issue',
      severity: 'High',
      description: 'The SSL/TLS certificate could not be fully validated.',
      recommendation: 'Check that the certificate is valid, trusted by browsers, and not expired.',
      action: 'Fix the SSL Certificate',
    })
  } else if (ssl?.valid && typeof ssl.daysRemaining === 'number' && ssl.daysRemaining <= 14) {
    issues.push({
      id: 'ssl-expiring',
      title: 'SSL Certificate Expiring Soon',
      severity: 'Medium',
      description: `The SSL certificate expires in ${ssl.daysRemaining} day(s).`,
      recommendation: 'Renew the SSL certificate before it expires.',
      action: 'Renew the SSL Certificate',
    })
  }

  if (headers?.table) {
    headers.table
      .filter((h) => !h.present)
      .forEach((h) => {
        issues.push({
          id: `header-${h.header.toLowerCase()}`,
          title: `${h.header} Header Missing`,
          severity: HEADER_SEVERITY[h.header] || 'Low',
          description: `The ${h.header} header was not detected.`,
          recommendation: HEADER_RECOMMENDATIONS[h.header] || `Consider configuring the ${h.header} header.`,
          action: HEADER_ACTIONS[h.header] || `Add ${h.header}`,
        })
      })
  }

  if (cookies && cookies.cookieCount > 0 && cookies.status !== 'secure') {
    issues.push({
      id: 'cookies-review',
      title: 'Cookie Security Attributes Should Be Reviewed',
      severity: 'Medium',
      description: 'One or more cookies are missing recommended security attributes.',
      recommendation: 'Set Secure, HttpOnly and SameSite attributes on cookies that carry session data.',
      action: 'Review Cookie Security Attributes',
    })
  }

  if (performance && performance.status === 'Slow') {
    issues.push({
      id: 'performance-slow',
      title: 'Slow Page Response Time',
      severity: 'Low',
      description: 'The page took longer than expected to respond.',
      recommendation: 'Investigate server response time and consider caching or a CDN.',
      action: 'Improve Page Response Time',
    })
  }

  issues.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])

  const score = computeScore({ https, redirect, ssl, headers, cookies, performance })
  const status = score >= 80 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'At Risk'

  const recommendations = issues.slice(0, 5).map((issue, i) => ({
    id: `rec-${issue.id}`,
    order: i + 1,
    title: issue.action,
    description: issue.recommendation,
  }))

  return { issues, score, status, recommendations }
}

function computeScore({ https, redirect, ssl, headers, cookies, performance }) {
  let score = 0

  score += https?.enabled ? 20 : 0
  score += redirect?.httpToHttps ? 10 : 0
  score += ssl?.valid ? 20 : 0

  if (headers?.table?.length) {
    const presentCount = headers.table.filter((h) => h.present).length
    score += (presentCount / headers.table.length) * 20
  }

  if (cookies) {
    if (cookies.cookieCount === 0) {
      score += 10 // nothing to flag
    } else {
      const okCount = cookies.attributes.filter((a) => a.status === 'ok').length
      score += (okCount / cookies.attributes.length) * 10
    }
  }

  if (performance) {
    if (performance.status === 'Good') score += 10
    else if (performance.status === 'Fair') score += 5
    else if (performance.status === 'Unknown') score += 5 // don't penalize unmeasurable
  }

  score += 10 // DNS is informational only for now, not penalized

  return Math.round(Math.min(100, Math.max(0, score)))
}
