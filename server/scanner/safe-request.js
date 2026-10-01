import http from 'node:http'
import https from 'node:https'
import { resolveSafeAddress, pinnedLookup } from './ssrf-guard.js'
import { CONFIG } from '../config.js'
import { makeScannerError } from '../errors.js'

/**
 * Performs a single outbound HTTP(S) request to a pre-validated,
 * SSRF-safe address. Only the status code and headers are read — the
 * response body is never consumed, so this is safe and cheap even for
 * large or slow responses. Does not follow redirects automatically;
 * callers decide what to do with a 3xx response.
 */
export async function safeRequest(targetUrl, { method = 'GET', timeoutMs = CONFIG.requestTimeoutMs } = {}) {
  const parsed = new URL(targetUrl)
  const { address, family } = await resolveSafeAddress(parsed.hostname)
  const transport = parsed.protocol === 'https:' ? https : http

  return new Promise((resolve, reject) => {
    let settled = false

    const req = transport.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: (parsed.pathname || '/') + (parsed.search || ''),
        method,
        lookup: pinnedLookup(address, family),
        timeout: timeoutMs,
        headers: {
          'User-Agent': CONFIG.userAgent,
          'Accept': CONFIG.acceptHeader,
          Host: parsed.hostname,
        },
        rejectUnauthorized: true,
      },
      (res) => {
        if (settled) return
        settled = true
        const result = { statusCode: res.statusCode, headers: res.headers }
        res.destroy() // never read the body — we only need headers/status
        resolve(result)
      }
    )

    req.on('timeout', () => {
      if (settled) return
      settled = true
      req.destroy()
      reject(makeScannerError('The request timed out.', 'TIMEOUT'))
    })

    req.on('error', (err) => {
      if (settled) return
      settled = true
      reject(normalizeRequestError(err))
    })

    req.end()
  })
}

/**
 * Like safeRequest, but reads the response body — capped at maxBytes and
 * aborted the moment the cap is exceeded — and reports basic timing. Used
 * only by the performance check, which is the one check that legitimately
 * needs body content (to estimate page size and count resource references).
 */
export async function safeRequestWithBody(
  targetUrl,
  { method = 'GET', timeoutMs = CONFIG.requestTimeoutMs, maxBytes = CONFIG.maxResponseBytes } = {}
) {
  const parsed = new URL(targetUrl)
  const { address, family } = await resolveSafeAddress(parsed.hostname)
  const transport = parsed.protocol === 'https:' ? https : http
  const startedAt = Date.now()

  return new Promise((resolve, reject) => {
    let settled = false
    let bytes = 0
    let truncated = false
    const chunks = []

    const req = transport.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: (parsed.pathname || '/') + (parsed.search || ''),
        method,
        lookup: pinnedLookup(address, family),
        timeout: timeoutMs,
        headers: {
          'User-Agent': CONFIG.userAgent,
          'Accept': CONFIG.acceptHeader,
          Host: parsed.hostname,
        },
        rejectUnauthorized: true,
      },
      (res) => {
        res.on('data', (chunk) => {
          bytes += chunk.length
          if (bytes > maxBytes) {
            truncated = true
            res.destroy()
            return
          }
          chunks.push(chunk)
        })

        res.on('end', () => {
          if (settled) return
          settled = true
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            bytes,
            timeMs: Date.now() - startedAt,
            truncated,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        })

        res.on('close', () => {
          if (settled) return
          settled = true
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            bytes,
            timeMs: Date.now() - startedAt,
            truncated,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        })
      }
    )

    req.on('timeout', () => {
      if (settled) return
      settled = true
      req.destroy()
      reject(makeScannerError('The request timed out.', 'TIMEOUT'))
    })

    req.on('error', (err) => {
      if (settled) return
      settled = true
      reject(normalizeRequestError(err))
    })

    req.end()
  })
}

function normalizeRequestError(err) {
  if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
    return makeScannerError('The hostname could not be resolved.', 'DNS_ERROR')
  }
  if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET' || err.code === 'EHOSTUNREACH') {
    return makeScannerError('Could not connect to the website.', 'CONNECTION_ERROR')
  }
  if (typeof err.code === 'string' && err.code.startsWith('CERT_')) {
    return makeScannerError('The site presented an invalid TLS certificate.', 'TLS_ERROR')
  }
  if (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || err.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
    return makeScannerError('The site presented an invalid TLS certificate.', 'TLS_ERROR')
  }
  return makeScannerError('The request failed.', 'REQUEST_ERROR')
}
