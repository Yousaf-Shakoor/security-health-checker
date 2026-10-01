// Demo data for the "View Sample Report" button on the landing page. It is
// shaped exactly like the result object the Results dashboard renders (and
// that /api/report/pdf accepts), and deliberately mirrors the preview
// shown on the homepage — 72/100, 2 missing headers, 3 issues — so the
// report a visitor opens matches what they just looked at.
//
// Every value here is fictional sample data; nothing is scanned.
export const SAMPLE_REPORT = {
  domain: 'example.com',
  score: 72,
  status: 'Needs Improvement',
  scoreSummary: 'Your website has several basic security configurations that should be reviewed.',
  scannedAtLabel: 'Sample report · demo data, not a real scan',

  checkOrder: ['https', 'ssl', 'redirect', 'headers', 'cookies', 'dns', 'performance'],
  checks: {
    https: { id: 'https', name: 'HTTPS', status: 'ok', label: 'Secure', description: 'HTTPS is enabled' },
    ssl: { id: 'ssl', name: 'SSL Certificate', status: 'ok', label: 'Valid', description: 'Certificate appears valid' },
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
    dns: { id: 'dns', name: 'DNS', status: 'ok', label: 'Available', description: 'Basic DNS information available' },
    performance: {
      id: 'performance',
      name: 'Performance',
      status: 'ok',
      label: 'Good',
      description: 'Basic page performance check completed',
    },
  },

  issues: [
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
      recommendation: 'Consider configuring this header to reduce MIME-type sniffing risks.',
    },
    {
      id: 'csp',
      title: 'Content Security Policy Review',
      severity: 'Medium',
      description: 'A Content-Security-Policy header was detected but appears permissive.',
      recommendation: 'Review whether the policy can be tightened to suit the website.',
    },
  ],

  headersTable: [
    { header: 'Strict-Transport-Security', present: false },
    { header: 'Content-Security-Policy', present: true },
    { header: 'X-Content-Type-Options', present: false },
    { header: 'X-Frame-Options', present: true },
    { header: 'Referrer-Policy', present: true },
    { header: 'Permissions-Policy', present: true },
  ],

  certificate: {
    domain: 'example.com',
    issuer: 'Example Certificate Authority',
    validFrom: 'Jan 01, 2026',
    validUntil: 'Jan 01, 2027',
    daysRemaining: 102,
  },

  cookieAttributes: [
    { attribute: 'Secure', status: 'ok', label: 'Present' },
    { attribute: 'HttpOnly', status: 'ok', label: 'Present' },
    { attribute: 'SameSite', status: 'warn', label: 'Review' },
  ],

  dns: {
    aRecord: '93.184.216.34',
    aaaa: 'Available',
    mx: 'Available',
    nameservers: 'ns1.example.com',
  },

  performance: {
    responseTime: '420 ms',
    pageSize: '1.8 MB',
    resources: 34,
    status: 'Good',
  },

  recommendations: [
    { id: 'rec-hsts', order: 1, title: 'Enable HSTS', description: 'Help browsers enforce HTTPS connections.' },
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
      description: 'Consider implementing an appropriate CSP for the website.',
    },
  ],

  reportSummary:
    "Your website has HTTPS and a valid SSL certificate, but several security headers should be reviewed. Addressing the detected configuration issues can improve the website's basic security posture.",
}
