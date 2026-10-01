// A small, rule-based FAQ bot — no external AI API, no cost, works
// instantly. Matches the visitor's message against keyword groups and
// returns the first matching canned answer. Good enough for common product
// questions; swap matchReply() for a real AI-backed endpoint later if
// wanted (e.g. proxied through the server to keep any API key private).
const RULES = [
  {
    keywords: ['hello', 'hi', 'hey', 'salam', 'assalam'],
    reply: "Hi! I'm the Security Health Checker assistant. Ask me about HTTPS, SSL, security headers, scoring, how scanning works.",
  },
  {
    keywords: ['what is this', 'what does this do', 'what is security health checker', 'about'],
    reply:
      'Security Health Checker runs safe, non-invasive checks on a website you own or are authorized to audit — HTTPS, SSL certificate, security headers, cookies, DNS and basic performance — then gives you a score and clear recommendations.',
  },
  {
    keywords: ['how does it work', 'how do i scan', 'how to scan', 'start a scan'],
    reply:
      'Just go to the Scan page, enter a website URL, and click "Scan Website". We run the checks live and show you a full report in a few seconds.',
  },
  {
    keywords: [
      '8 check', 'eight check', 'core check', 'what checks', 'which checks',
      'all checks', 'list of checks', 'checks do you run', 'checks does it run',
      'checks do you perform', 'what do you check', 'what does it check',
    ],
    reply:
      'Here are the 8 core checks, run automatically on every scan:\n' +
      '1. HTTPS Check — confirms your site is reachable over an encrypted HTTPS connection, not just plain HTTP.\n' +
      "2. SSL Certificate — verifies your certificate is valid, checks the issuer, and how many days remain before it expires.\n" +
      '3. Security Headers — checks for protective headers like HSTS, Content-Security-Policy, X-Frame-Options, Referrer-Policy and Permissions-Policy.\n' +
      '4. Redirect Check — verifies that plain HTTP automatically redirects to HTTPS.\n' +
      '5. Cookie Security — checks the Secure, HttpOnly and SameSite attributes on cookies (never reads actual cookie values).\n' +
      '6. DNS Information — shows basic public DNS records: A, AAAA, MX and nameservers.\n' +
      '7. Performance Check — a basic look at response time, page size and resource count.\n' +
      '8. Security Health Score — combines all of the above into one score out of 100, with issues and recommendations.\n\n' +
      'Ask me about any one of these by name if you want more detail!',
  },
  {
    keywords: ['safe', 'legal', 'authorized', 'permission', 'hack', 'exploit', 'penetration'],
    reply:
      "This tool is strictly defensive and non-invasive — it only reads publicly available information (like HTTP headers and DNS records). It never attempts exploitation, brute force, or intrusive testing. Only scan sites you own or are authorized to check.",
  },
  {
    keywords: ['https'],
    reply: 'The HTTPS check confirms your site is reachable over an encrypted HTTPS connection, not just plain HTTP.',
  },
  {
    keywords: ['ssl', 'certificate', 'cert'],
    reply:
      'The SSL Certificate check connects over TLS and reports whether the certificate is valid, its issuer, and how many days remain before it expires.',
  },
  {
    keywords: ['header', 'hsts', 'csp', 'content security policy'],
    reply:
      'The Security Headers check looks for recommended headers like Strict-Transport-Security, Content-Security-Policy, X-Frame-Options and more — these help browsers apply extra protections to your site.',
  },
  {
    keywords: ['cookie'],
    reply:
      'The Cookie Security check looks at whether cookies use the Secure, HttpOnly and SameSite attributes. It never reads or exposes actual cookie values.',
  },
  {
    keywords: ['dns'],
    reply: 'The DNS check shows basic public records — A, AAAA, MX and nameservers — the same info any public DNS lookup would show.',
  },
  {
    keywords: ['performance', 'speed', 'slow', 'response time'],
    reply:
      'The Performance check is a basic indicator — response time, page size and resource count. It is not a full performance audit.',
  },
  {
    keywords: ['score', 'scoring', 'how is the score', '/100'],
    reply:
      'Your score out of 100 is calculated from HTTPS, redirect behavior, SSL validity, security headers present, cookie attributes and performance — combined into one number, with issues and recommendations listed below it.',
  },
  {
    keywords: ['pdf', 'download report', 'export'],
    reply: 'On the Results page, click "Download PDF" to get a formatted copy of your exact report to save or share.',
  },
  {
    keywords: ['price', 'pricing', 'cost', 'free', 'plan', 'pro'],
    reply: 'Security Health Checker is free to self-host. There is no login or payment requirement. Clone the GitHub repository and run it locally.',
  },
  {
    keywords: ['contact', 'support', 'help', 'human', 'email'],
    reply: "I'm just a simple assistant for common questions — for anything else, reach out via the Contact link in the footer.",
  },
  {
    keywords: ['thank', 'thanks', 'shukriya'],
    reply: "You're welcome! Let me know if you have any other questions.",
  },
]

const FALLBACK_REPLY =
  "I'm not sure about that one — I can help with questions about HTTPS, SSL, security headers, cookies, DNS, performance, scoring, or how to run a scan. Try asking about one of those, or just scan a website using the button above!"

export function matchReply(message) {
  const text = message.toLowerCase()
  const match = RULES.find((rule) => rule.keywords.some((k) => text.includes(k)))
  return match ? match.reply : FALLBACK_REPLY
}

export const WELCOME_MESSAGE =
  "Hi there! I'm here to help with questions about Security Health Checker — how scans work, what each check means, pricing, or how to run a scan. What would you like to know?"
