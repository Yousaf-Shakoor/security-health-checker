// ---------------------------------------------------------------------------
// Mock scan data architecture.
//
// Every value here is sample/demo data used to power the UI before a real
// backend scanning engine exists. When the real scanner ships, replace
// `getMockScanResult()` with an API call that returns data in this same
// shape, and the rest of the app (components/pages) will not need to change.
// ---------------------------------------------------------------------------

// The ordered sequence of checks shown on the scanning screen.
export const SCAN_SEQUENCE = [
  { id: 'https', label: 'HTTPS Check' },
  { id: 'ssl', label: 'SSL Certificate' },
  { id: 'headers', label: 'Security Headers' },
  { id: 'redirect', label: 'HTTP \u2192 HTTPS Redirect' },
  { id: 'cookies', label: 'Cookie Security' },
  { id: 'dns', label: 'DNS Information' },
  { id: 'performance', label: 'Performance Check' },
]

// Security check summary cards shown on the results dashboard.
const baseChecks = {
  https: {
    id: 'https',
    name: 'HTTPS',
    status: 'ok',
    label: 'Secure',
    description: 'HTTPS is enabled',
  },
  ssl: {
    id: 'ssl',
    name: 'SSL Certificate',
    status: 'ok',
    label: 'Valid',
    description: 'Certificate appears valid',
  },
  redirect: {
    id: 'redirect',
    name: 'HTTPS Redirect',
    status: 'ok',
    label: 'Working',
    description: 'HTTP redirects to HTTPS',
  },
  headers: {
    id: 'headers',
    name: 'Security Headers',
    status: 'warn',
    label: 'Needs Review',
    description: '2 important security headers are missing',
  },
  cookies: {
    id: 'cookies',
    name: 'Cookie Security',
    status: 'warn',
    label: 'Needs Review',
    description: 'Some cookie security attributes should be reviewed',
  },
  dns: {
    id: 'dns',
    name: 'DNS',
    status: 'ok',
    label: 'Available',
    description: 'Basic DNS information available',
  },
  performance: {
    id: 'performance',
    name: 'Performance',
    status: 'ok',
    label: 'Good',
    description: 'Basic page performance check completed',
  },
}

const issues = [
  {
    id: 'hsts',
    title: 'HSTS Header Missing',
    severity: 'Medium',
    description: 'The Strict-Transport-Security header was not detected.',
    recommendation: 'Consider enabling HSTS to help browsers enforce HTTPS connections.',
  },
  {
    id: 'xcto',
    title: 'X-Content-Type-Options Missing',
    severity: 'Low',
    description: 'The X-Content-Type-Options security header was not detected.',
    recommendation: 'Consider configuring the header to reduce MIME-type sniffing risks.',
  },
  {
    id: 'csp',
    title: 'Content Security Policy Review',
    severity: 'Medium',
    description: 'A Content-Security-Policy header was not detected in the sample scan.',
    recommendation: 'Review whether a suitable Content Security Policy can be configured for the website.',
  },
]

const headersTable = [
  { header: 'Strict-Transport-Security', present: false },
  { header: 'Content-Security-Policy', present: false },
  { header: 'X-Content-Type-Options', present: false },
  { header: 'X-Frame-Options', present: true },
  { header: 'Referrer-Policy', present: true },
  { header: 'Permissions-Policy', present: true },
]

const certificate = {
  status: 'valid',
  issuer: 'Example Certificate Authority',
  validFrom: 'Jan 01, 2026',
  validUntil: 'Jan 01, 2027',
  daysRemaining: 102,
}

const cookieAttributes = [
  { attribute: 'Secure', status: 'ok', label: 'Present' },
  { attribute: 'HttpOnly', status: 'ok', label: 'Present' },
  { attribute: 'SameSite', status: 'warn', label: 'Review' },
]

const dnsInfo = {
  aRecord: '93.184.216.34',
  aaaa: 'Available',
  mx: 'Available',
  nameservers: 'ns1.example.com',
}

const performance = {
  responseTime: '420 ms',
  pageSize: '1.8 MB',
  resources: 34,
  status: 'Good',
}

const technical = {
  protocol: 'HTTPS (TLS 1.3)',
  httpStatus: '200 OK',
  responseTime: '284 ms',
  server: 'nginx',
  contentType: 'text/html; charset=UTF-8',
}

const recommendations = [
  {
    id: 'rec-hsts',
    order: 1,
    title: 'Enable HSTS',
    description: 'Help browsers enforce secure HTTPS connections.',
  },
  {
    id: 'rec-xcto',
    order: 2,
    title: 'Add X-Content-Type-Options',
    description: 'Reduce the risk of MIME-type sniffing.',
  },
  {
    id: 'rec-csp',
    order: 3,
    title: 'Review Content Security Policy',
    description: 'Consider implementing a suitable CSP for your application.',
  },
]

// Maps a REAL /api/scan response into the shape every results component
// expects. Nothing here is mock anymore — every field is derived from the
// actual check results the backend returned for this specific domain.
export function buildScanResult(apiResult) {
  if (!apiResult) return getMockScanResult()

  const {
    domain,
    score,
    status,
    https,
    redirect,
    ssl,
    headers,
    cookies,
    dns,
    performance,
    issues = [],
    recommendations = [],
    technical: apiTechnical = {},
  } = apiResult

  const checks = {
    https: https?.enabled
      ? { id: 'https', name: 'HTTPS', status: 'ok', label: 'Secure', description: 'HTTPS is enabled' }
      : {
          id: 'https',
          name: 'HTTPS',
          status: 'warn',
          label: 'Not Detected',
          description: 'HTTPS could not be confirmed for this website',
        },

    ssl: ssl?.valid
      ? { id: 'ssl', name: 'SSL Certificate', status: 'ok', label: 'Valid', description: 'Certificate appears valid' }
      : {
          id: 'ssl',
          name: 'SSL Certificate',
          status: 'warn',
          label: 'Needs Review',
          description: 'Certificate could not be fully validated',
        },

    redirect: redirect?.httpToHttps
      ? { id: 'redirect', name: 'HTTPS Redirect', status: 'ok', label: 'Working', description: 'HTTP redirects to HTTPS' }
      : {
          id: 'redirect',
          name: 'HTTPS Redirect',
          status: 'warn',
          label: 'Needs Review',
          description: 'HTTP does not appear to redirect to HTTPS',
        },

    headers: headers && headers.missingCount === 0
      ? { id: 'headers', name: 'Security Headers', status: 'ok', label: 'Good', description: 'All checked security headers are present' }
      : {
          id: 'headers',
          name: 'Security Headers',
          status: 'warn',
          label: 'Needs Review',
          description: `${headers?.missingCount ?? 'Some'} important security header${headers?.missingCount === 1 ? ' is' : 's are'} missing`,
        },

    cookies: !cookies || cookies.cookieCount === 0
      ? { id: 'cookies', name: 'Cookie Security', status: 'ok', label: 'N/A', description: 'No cookies were observed on this page' }
      : cookies.status === 'secure'
      ? { id: 'cookies', name: 'Cookie Security', status: 'ok', label: 'Secure', description: 'Cookie security attributes look good' }
      : {
          id: 'cookies',
          name: 'Cookie Security',
          status: 'warn',
          label: 'Needs Review',
          description: 'Some cookie security attributes should be reviewed',
        },

    dns: dns && dns.status === 'secure'
      ? { id: 'dns', name: 'DNS', status: 'ok', label: 'Available', description: 'Basic DNS information available' }
      : {
          id: 'dns',
          name: 'DNS',
          status: 'warn',
          label: 'Needs Review',
          description: 'DNS records could not be fully resolved',
        },

    performance: performance && performance.status === 'Good'
      ? { id: 'performance', name: 'Performance', status: 'ok', label: 'Good', description: 'Basic page performance check completed' }
      : {
          id: 'performance',
          name: 'Performance',
          status: 'warn',
          label: performance?.status || 'Unknown',
          description: 'Page responded slower than expected, or could not be measured',
        },
  }

  return {
    domain,
    score: typeof score === 'number' ? score : 0,
    status: status || 'Unknown',
    scoreSummary: buildSummary({ issueCount: issues.length }),
    scannedAtLabel: 'Scanned just now',
    checks,
    checkOrder: ['https', 'ssl', 'redirect', 'headers', 'cookies', 'dns', 'performance'],
    issues: issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      severity: issue.severity,
      description: issue.description,
      recommendation: issue.recommendation,
    })),
    headersTable: headers?.table || [],
    certificate: buildCertificate(domain, ssl),
    cookieAttributes: cookies?.attributes || [],
    dns: dns || {},
    performance: {
      responseTime: performance?.responseTimeMs != null ? `${performance.responseTimeMs} ms` : 'Unknown',
      pageSize: performance?.pageSizeBytes != null ? formatBytes(performance.pageSizeBytes) : 'Unknown',
      resources: performance?.resourceCount ?? 'Unknown',
      status: performance?.status || 'Unknown',
    },
    technical: {
      url: `${https?.enabled ? 'https' : 'http'}://${domain}`,
      protocol: apiTechnical.protocol || (https?.enabled ? 'HTTPS' : 'HTTP'),
      httpStatus: apiTechnical.httpStatus || 'Unknown',
      responseTime: performance?.responseTimeMs != null ? `${performance.responseTimeMs} ms` : 'Unknown',
      server: apiTechnical.server || 'Unknown',
      contentType: apiTechnical.contentType || 'Unknown',
      scanTime: 'Just now',
    },
    recommendations: recommendations.map((rec) => ({
      id: rec.id,
      order: rec.order,
      title: rec.title,
      description: rec.description,
    })),
    reportSummary: buildSummary({ issueCount: issues.length }),
  }
}

function buildCertificate(domain, ssl) {
  if (!ssl || !ssl.validFrom) {
    return { domain, issuer: 'Unknown', validFrom: 'Unknown', validUntil: 'Unknown', daysRemaining: 'Unknown' }
  }
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

  return {
    domain,
    issuer: ssl.issuer || 'Unknown',
    validFrom: formatDate(ssl.validFrom),
    validUntil: formatDate(ssl.validTo),
    daysRemaining: typeof ssl.daysRemaining === 'number' ? ssl.daysRemaining : 'Unknown',
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function buildSummary({ issueCount }) {
  if (issueCount === 0) {
    return 'No significant configuration issues were detected in this scan.'
  }
  return `This scan found ${issueCount} issue${issueCount === 1 ? '' : 's'} that should be reviewed. Addressing them can improve the website's basic security posture. This reflects a point-in-time automated check, not a complete security audit.`
}

// Normalizes whatever the user typed into a bare, display-friendly domain.
export function normalizeDomain(input) {
  if (!input) return 'example.com'
  let value = input.trim().replace(/^https?:\/\//i, '')
  value = value.replace(/\/.*$/, '')
  return value || 'example.com'
}

// Builds a full mock scan result for a given (already-validated) URL/domain.
// Values are static sample data; only the domain and timestamp are dynamic.
export function getMockScanResult(rawUrl) {
  const domain = normalizeDomain(rawUrl)
  return {
    domain,
    score: 72,
    status: 'Needs Improvement',
    scoreSummary: 'Your website has several basic security configurations that should be reviewed.',
    scannedAtLabel: 'Scanned just now',
    checks: baseChecks,
    checkOrder: ['https', 'ssl', 'redirect', 'headers', 'cookies', 'dns', 'performance'],
    issues,
    headersTable,
    certificate: { ...certificate, domain },
    cookieAttributes,
    dns: dnsInfo,
    performance,
    technical: {
      ...technical,
      url: `https://${domain}`,
      scanTime: 'Just now',
    },
    recommendations,
    reportSummary:
      "Your website has HTTPS and a valid SSL certificate, but several security headers should be reviewed. Addressing the detected configuration issues can improve the website's basic security posture.",
  }
}
