import { makeScannerError } from '../errors.js'

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

const DOMAIN_PATTERN = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))*\.[a-z]{2,}$/i
// Single-label hostnames are valid too (e.g. "localhost", "fileserver01");
// these are exactly the kind of internal/private hosts the SSRF guard
// needs to see and explicitly reject, rather than have them rejected here
// as "malformed" with a less specific error.
const SINGLE_LABEL_HOSTNAME_PATTERN = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/i
const IPV4_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/

/**
 * Validates and normalizes a raw user-supplied URL/domain string.
 * Throws a scanner error (INVALID_URL / UNSUPPORTED_PROTOCOL) for anything
 * malformed. Never performs any network activity — SSRF checks happen
 * separately in ssrf-guard.js once we have a validated hostname.
 */
export function validateAndNormalizeUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw makeScannerError('A website URL is required.', 'INVALID_URL')
  }

  let candidate = rawUrl.trim()

  // Allow bare domains like "example.com" by defaulting to https.
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate)) {
    candidate = `https://${candidate}`
  }

  let parsed
  try {
    parsed = new URL(candidate)
  } catch {
    throw makeScannerError('Please provide a valid website URL.', 'INVALID_URL')
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw makeScannerError('Only http and https URLs are supported.', 'UNSUPPORTED_PROTOCOL')
  }

  if (parsed.username || parsed.password) {
    throw makeScannerError('URLs with embedded credentials are not allowed.', 'INVALID_URL')
  }

  // URL keeps IPv6 literals bracketed ("[::1]") — strip the brackets so the
  // rest of the pipeline (SSRF guard, DNS lookup, display) works with the
  // plain address consistently.
  let hostname = parsed.hostname.toLowerCase()
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    hostname = hostname.slice(1, -1)
  }

  if (!hostname || !isPlausibleHostname(hostname)) {
    throw makeScannerError('Please provide a valid website URL.', 'INVALID_URL')
  }

  return { url: parsed.toString(), hostname, protocol: parsed.protocol }
}

function isPlausibleHostname(hostname) {
  if (IPV4_PATTERN.test(hostname)) return true
  if (hostname.includes(':')) return true // looks like an IPv6 literal; ssrf-guard validates further
  if (SINGLE_LABEL_HOSTNAME_PATTERN.test(hostname)) return true
  return DOMAIN_PATTERN.test(hostname)
}
