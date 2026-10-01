import dns from 'node:dns'
import net from 'node:net'
import { makeScannerError } from '../errors.js'

// Hostnames that are always rejected outright, before any DNS lookup.
const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /\.localhost$/i,
  /^metadata\.google\.internal$/i,
  /^metadata$/i,
  /\.internal$/i,
  /\.local$/i,
]

// Private, reserved, loopback, link-local and other non-public IPv4 ranges,
// including the cloud metadata range (169.254.0.0/16 covers 169.254.169.254).
const IPV4_BLOCKED_CIDRS = [
  '0.0.0.0/8',
  '10.0.0.0/8',
  '100.64.0.0/10',
  '127.0.0.0/8',
  '169.254.0.0/16',
  '172.16.0.0/12',
  '192.0.0.0/24',
  '192.0.2.0/24',
  '192.168.0.0/16',
  '198.18.0.0/15',
  '198.51.100.0/24',
  '203.0.113.0/24',
  '224.0.0.0/4',
  '240.0.0.0/4',
  '255.255.255.255/32',
]

function ipv4ToLong(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0
}

function isIpv4InCidr(ip, cidr) {
  const [range, bitsStr] = cidr.split('/')
  const bits = Number(bitsStr)
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
  return (ipv4ToLong(ip) & mask) === (ipv4ToLong(range) & mask)
}

function isBlockedIpv4(ip) {
  return IPV4_BLOCKED_CIDRS.some((cidr) => isIpv4InCidr(ip, cidr))
}

function isBlockedIpv6(ip) {
  const lower = ip.toLowerCase()
  if (lower === '::1' || lower === '::') return true
  if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true // fe80::/10 link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true // fc00::/7 unique local
  if (lower.startsWith('ff')) return true // ff00::/8 multicast

  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isBlockedIpv4(mapped[1])

  return false
}

export function isBlockedIp(ip) {
  if (net.isIPv4(ip)) return isBlockedIpv4(ip)
  if (net.isIPv6(ip)) return isBlockedIpv6(ip)
  return true // unrecognized format — block conservatively
}

export function isBlockedHostname(hostname) {
  return BLOCKED_HOSTNAME_PATTERNS.some((pattern) => pattern.test(hostname))
}

/**
 * Resolves a hostname and validates that every candidate address is public
 * (not private/loopback/link-local/reserved/metadata). Returns the address
 * to connect to. This is the single choke point all outbound scanner
 * requests must pass through.
 */
export async function resolveSafeAddress(hostname) {
  if (isBlockedHostname(hostname)) {
    throw makeScannerError('This hostname is not allowed to be scanned.', 'SSRF_BLOCKED')
  }

  if (net.isIP(hostname)) {
    if (isBlockedIp(hostname)) {
      throw makeScannerError('This address is not allowed to be scanned.', 'SSRF_BLOCKED')
    }
    return { address: hostname, family: net.isIPv6(hostname) ? 6 : 4 }
  }

  let records
  try {
    records = await dns.promises.lookup(hostname, { all: true, verbatim: true })
  } catch {
    throw makeScannerError('The hostname could not be resolved.', 'DNS_ERROR')
  }

  if (!records || records.length === 0) {
    throw makeScannerError('The hostname could not be resolved.', 'DNS_ERROR')
  }

  if (records.some((record) => isBlockedIp(record.address))) {
    throw makeScannerError(
      'This website resolves to a private or internal address and cannot be scanned.',
      'SSRF_BLOCKED'
    )
  }

  const chosen = records[0]
  return { address: chosen.address, family: chosen.family }
}

/**
 * Builds a `lookup` function for Node's http(s) request options that always
 * returns the already-validated address, regardless of what DNS says at
 * connect time. This closes the gap between the SSRF check above and the
 * actual TCP connection (DNS-rebinding protection).
 *
 * Node's `net.connect` invokes `lookup` with `options.all` set, in which
 * case the callback must receive an array of `{ address, family }` records
 * rather than a single `(err, address, family)` triple — support both
 * call shapes so this works regardless of Node version/internals.
 */
export function pinnedLookup(address, family) {
  return (_hostname, options, callback) => {
    if (options && options.all) {
      callback(null, [{ address, family }])
    } else {
      callback(null, address, family)
    }
  }
}
