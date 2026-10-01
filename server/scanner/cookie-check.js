/**
 * Analyzes Set-Cookie headers already fetched by headers-check — no
 * network access here. Only checks whether Secure/HttpOnly/SameSite
 * attributes are present; cookie names and values are never read, stored
 * or returned.
 */
export function checkCookies(rawHeaders = {}) {
  const setCookie = rawHeaders['set-cookie']
  const entries = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : []

  if (entries.length === 0) {
    return {
      attributes: [],
      cookieCount: 0,
      status: 'secure',
      note: 'No cookies were observed on this page.',
    }
  }

  const countWith = (pattern) => entries.filter((cookie) => pattern.test(cookie)).length
  const total = entries.length

  const secureCount = countWith(/;\s*Secure/i)
  const httpOnlyCount = countWith(/;\s*HttpOnly/i)
  const sameSiteCount = countWith(/;\s*SameSite=/i)

  const attributes = [
    {
      attribute: 'Secure',
      status: secureCount === total ? 'ok' : 'warn',
      label: secureCount === total ? 'Present' : 'Review',
    },
    {
      attribute: 'HttpOnly',
      status: httpOnlyCount === total ? 'ok' : 'warn',
      label: httpOnlyCount === total ? 'Present' : 'Review',
    },
    {
      attribute: 'SameSite',
      status: sameSiteCount === total ? 'ok' : 'warn',
      label: sameSiteCount === total ? 'Present' : 'Review',
    },
  ]

  return {
    attributes,
    cookieCount: total,
    status: attributes.every((a) => a.status === 'ok') ? 'secure' : 'warning',
  }
}
