// Centralized, environment-safe configuration for the scanner API.
// Every timeout/limit the scanner uses lives here so future checks
// (SSL, headers, cookies, DNS, performance) share the same guardrails.
export const CONFIG = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Per-request network guardrails.
  requestTimeoutMs: Number(process.env.SCAN_REQUEST_TIMEOUT_MS) || 6000,
  maxRedirects: Number(process.env.SCAN_MAX_REDIRECTS) || 5,
  maxResponseBytes: Number(process.env.SCAN_MAX_RESPONSE_BYTES) || 1_000_000,

  // A standard, browser-like User-Agent. Many sites (especially behind a
  // WAF/CDN) serve different behavior — or block outright — requests whose
  // User-Agent identifies as an unfamiliar bot, which was causing false
  // "redirect not working" results for sites that redirect real browsers
  // just fine. This scanner still only ever makes minimal, read-only,
  // non-invasive requests (see safe-request.js) — this only changes how
  // it identifies itself, not what it does.
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}
