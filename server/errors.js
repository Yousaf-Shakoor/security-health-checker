// Maps internal scanner error codes to HTTP status codes and safe,
// user-friendly messages. Never leaks stack traces or internal details
// to the client.
const KNOWN_CODES = {
  INVALID_URL: { status: 400 },
  UNSUPPORTED_PROTOCOL: { status: 400 },
  SSRF_BLOCKED: { status: 400 },
  DNS_ERROR: { status: 422 },
  TIMEOUT: { status: 504 },
  CONNECTION_ERROR: { status: 502 },
  TLS_ERROR: { status: 502 },
  TOO_MANY_REDIRECTS: { status: 502 },
  REQUEST_ERROR: { status: 502 },
}

export function toApiError(err) {
  const known = err && err.code ? KNOWN_CODES[err.code] : null

  if (known) {
    return {
      status: known.status,
      body: { error: err.message, code: err.code },
    }
  }

  return {
    status: 500,
    body: { error: 'Something went wrong while scanning this website.', code: 'INTERNAL_ERROR' },
  }
}

export function makeScannerError(message, code) {
  const err = new Error(message)
  err.code = code
  return err
}
