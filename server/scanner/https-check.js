import { safeRequest } from './safe-request.js'
import { formatHostForUrl } from './host-format.js'

/**
 * Determines whether the target hostname is reachable over HTTPS.
 * Any successful HTTP response (even a 4xx/5xx from the app itself) means
 * the TLS handshake succeeded, which is what this check cares about.
 */
export async function checkHttps(hostname) {
  try {
    const res = await safeRequest(`https://${formatHostForUrl(hostname)}/`)
    return { enabled: true, status: 'secure', statusCode: res.statusCode }
  } catch (err) {
    return { enabled: false, status: 'warning', reason: err.code || 'ERROR' }
  }
}
