import { safeRequest } from './safe-request.js'
import { formatHostForUrl } from './host-format.js'
import { CONFIG } from '../config.js'

/**
 * Checks whether requesting the site over plain HTTP redirects to HTTPS.
 * Follows redirect hops manually (never delegated to an HTTP client's
 * auto-follow) so every hop can be capped and — via safeRequest, which
 * always re-resolves through the SSRF guard — re-validated before any
 * connection is made.
 */
export async function checkHttpToHttpsRedirect(hostname) {
  let currentUrl = `http://${formatHostForUrl(hostname)}/`
  let hops = 0

  try {
    while (hops <= CONFIG.maxRedirects) {
      const res = await safeRequest(currentUrl)
      const { statusCode, headers } = res

      const isRedirect = statusCode >= 300 && statusCode < 400 && headers.location
      if (!isRedirect) {
        // Diagnostic detail (not a scanner error): what we actually got back
        // instead of a redirect, useful when a site behaves differently for
        // this scanner than it does for a real browser (e.g. WAF rules).
        return { httpToHttps: false, status: 'warning', observedStatusCode: statusCode }
      }

      const nextUrl = new URL(headers.location, currentUrl).toString()
      if (nextUrl.startsWith('https://')) {
        return { httpToHttps: true, status: 'working' }
      }

      currentUrl = nextUrl
      hops += 1
    }

    return { httpToHttps: false, status: 'warning', reason: 'TOO_MANY_REDIRECTS' }
  } catch (err) {
    // Plain HTTP being unreachable isn't a crash-worthy scanner error — it
    // just means we can't confirm a working redirect.
    return { httpToHttps: false, status: 'warning', reason: err.code || 'ERROR' }
  }
}
