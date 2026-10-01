import tls from 'node:tls'
import { resolveSafeAddress, pinnedLookup } from './ssrf-guard.js'
import { CONFIG } from '../config.js'
import { makeScannerError } from '../errors.js'

/**
 * Connects over TLS (SSRF-safe, pinned to the pre-validated address) and
 * reads the peer certificate's metadata. `rejectUnauthorized: false` is
 * intentional here — this check's whole job is to report whether the
 * certificate is valid, so it needs to complete the handshake even for an
 * invalid/self-signed/expired cert in order to inspect and report on it.
 * No data is ever sent to the server beyond the TLS handshake itself.
 */
export async function checkSsl(hostname) {
  try {
    const { address, family } = await resolveSafeAddress(hostname)

    const { certificate, authorized } = await new Promise((resolve, reject) => {
      let settled = false

      const socket = tls.connect(
        {
          host: hostname,
          port: 443,
          servername: hostname,
          lookup: pinnedLookup(address, family),
          timeout: CONFIG.requestTimeoutMs,
          rejectUnauthorized: false,
        },
        () => {
          if (settled) return
          settled = true
          const certificate = socket.getPeerCertificate()
          const authorized = socket.authorized
          socket.end()
          resolve({ certificate, authorized })
        }
      )

      socket.on('timeout', () => {
        if (settled) return
        settled = true
        socket.destroy()
        reject(makeScannerError('The request timed out.', 'TIMEOUT'))
      })

      socket.on('error', (err) => {
        if (settled) return
        settled = true
        reject(err)
      })
    })

    if (!certificate || Object.keys(certificate).length === 0) {
      return { valid: false, status: 'warning', reason: 'NO_CERTIFICATE' }
    }

    const validFrom = new Date(certificate.valid_from)
    const validTo = new Date(certificate.valid_to)
    const now = new Date()
    const notExpired = now >= validFrom && now <= validTo
    const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const valid = Boolean(authorized) && notExpired

    return {
      valid,
      status: valid ? 'secure' : 'warning',
      issuer: certificate.issuer?.O || certificate.issuer?.CN || 'Unknown',
      subject: certificate.subject?.CN || hostname,
      validFrom: validFrom.toISOString(),
      validTo: validTo.toISOString(),
      daysRemaining,
    }
  } catch (err) {
    return { valid: false, status: 'warning', reason: err.code || 'ERROR' }
  }
}
