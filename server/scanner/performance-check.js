import { safeRequestWithBody } from './safe-request.js'
import { formatHostForUrl } from './host-format.js'

/**
 * Basic performance indicators: total response time, page size (capped —
 * see CONFIG.maxResponseBytes), and an approximate resource reference
 * count from scanning the HTML for src=/href= attributes. This is a rough
 * indicator only, not a full performance audit.
 */
export async function checkPerformance(hostname) {
  try {
    let res
    try {
      res = await safeRequestWithBody(`https://${formatHostForUrl(hostname)}/`)
    } catch {
      res = await safeRequestWithBody(`http://${formatHostForUrl(hostname)}/`)
    }

    const resourceCount = countResourceReferences(res.body)
    const status = res.timeMs < 1000 ? 'Good' : res.timeMs < 3000 ? 'Fair' : 'Slow'

    return {
      responseTimeMs: res.timeMs,
      pageSizeBytes: res.bytes,
      resourceCount,
      status,
      truncated: res.truncated,
    }
  } catch (err) {
    return {
      responseTimeMs: null,
      pageSizeBytes: null,
      resourceCount: null,
      status: 'Unknown',
      reason: err.code || 'ERROR',
    }
  }
}

function countResourceReferences(html) {
  if (!html) return 0
  const matches = html.match(/\s(?:src|href)\s*=\s*["'][^"']+["']/gi)
  return matches ? matches.length : 0
}
