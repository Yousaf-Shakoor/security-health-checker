import { safeRequest } from './safe-request.js'
import { formatHostForUrl } from './host-format.js'

const TARGET_HEADERS = [
  ['strict-transport-security', 'Strict-Transport-Security'],
  ['content-security-policy', 'Content-Security-Policy'],
  ['x-content-type-options', 'X-Content-Type-Options'],
  ['x-frame-options', 'X-Frame-Options'],
  ['referrer-policy', 'Referrer-Policy'],
  ['permissions-policy', 'Permissions-Policy'],
]

/**
 * Fetches the page once (https, falling back to http) and returns both the
 * security-headers table AND the raw response headers, so cookie-check can
 * analyze Set-Cookie from the very same response without a second request.
 */
export async function checkHeaders(hostname) {
  let res
  let scheme = 'https'

  try {
    res = await safeRequest(`https://${formatHostForUrl(hostname)}/`)
  } catch {
    try {
      scheme = 'http'
      res = await safeRequest(`http://${formatHostForUrl(hostname)}/`)
    } catch (err) {
      return {
        result: {
          table: TARGET_HEADERS.map(([, name]) => ({ header: name, present: false })),
          missingCount: TARGET_HEADERS.length,
          status: 'warning',
          statusCode: null,
          reason: err.code || 'ERROR',
        },
        rawHeaders: {},
        scheme,
      }
    }
  }

  const headers = res.headers || {}
  const table = TARGET_HEADERS.map(([key, name]) => ({ header: name, present: Boolean(headers[key]) }))
  const missingCount = table.filter((h) => !h.present).length

  return {
    result: {
      table,
      missingCount,
      status: missingCount === 0 ? 'secure' : 'warning',
      statusCode: res.statusCode,
    },
    rawHeaders: headers,
    scheme,
  }
}
