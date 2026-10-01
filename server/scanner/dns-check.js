import dns from 'node:dns'

/**
 * Looks up basic public DNS records only — A, AAAA, MX, NS. This never
 * connects to any of the resolved hosts, so it carries no SSRF risk; it
 * only reads what any public DNS resolver would already return.
 */
export async function checkDns(hostname) {
  const [a, aaaa, mx, ns] = await Promise.allSettled([
    dns.promises.resolve4(hostname),
    dns.promises.resolve6(hostname),
    dns.promises.resolveMx(hostname),
    dns.promises.resolveNs(hostname),
  ])

  const aRecords = a.status === 'fulfilled' ? a.value : []
  const aaaaRecords = aaaa.status === 'fulfilled' ? aaaa.value : []
  const mxRecords = mx.status === 'fulfilled' ? mx.value.map((m) => m.exchange) : []
  const nsRecords = ns.status === 'fulfilled' ? ns.value : []

  return {
    aRecord: aRecords[0] || 'Not found',
    aaaa: aaaaRecords.length ? 'Available' : 'Not found',
    mx: mxRecords.length ? 'Available' : 'Not found',
    nameservers: nsRecords[0] || 'Not found',
    status: aRecords.length ? 'secure' : 'warning',
  }
}
