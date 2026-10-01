import net from 'node:net'

// Hostnames flow through the pipeline unbracketed (see url-validator.js),
// but IPv6 literals need brackets to be valid inside a URL string again
// (e.g. "https://[::1]/"). This is the single place that re-adds them.
export function formatHostForUrl(hostname) {
  return net.isIPv6(hostname) ? `[${hostname}]` : hostname
}
