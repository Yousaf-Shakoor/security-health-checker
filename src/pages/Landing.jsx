import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ScannerInput from '../components/ScannerInput.jsx'
import SecurityScore from '../components/SecurityScore.jsx'
import RecentScansFeed from '../components/RecentScansFeed.jsx'
import useReveal from '../hooks/useReveal.js'
import {
  ShieldOutlineIcon, CheckIcon, WarnIcon, ArrowRightIcon,
  LockIcon, CertificateIcon, HeadersIcon, RedirectIcon, CookieIcon, DnsIcon, PerformanceIcon, ScoreIcon,
} from '../components/Icons.jsx'
import '../styles/landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const [heroUrl, setHeroUrl] = useState('')
  useReveal()

  const goToScan = () => {
    navigate('/scan', heroUrl ? { state: { prefillUrl: heroUrl } } : undefined)
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">

        <section className="hero" id="product">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1 className="display">Know Your Website's Security Health</h1>
              <p className="hero-sub">
                Scan your website for common security configuration issues, missing security
                headers, HTTPS problems and other basic technical risks — in seconds.
              </p>
              <ScannerInput
                value={heroUrl}
                onChange={setHeroUrl}
                onSubmit={goToScan}
                note="Safe, non-invasive security checks. Only scan websites you own or are authorized to audit."
              />
            </div>

            <div className="hero-visual">
              <div className="hero-score-card">
                <div className="hero-score-top">
                  <h3>Security Health</h3>
                  <span className="hero-score-badge">Needs Improvement</span>
                </div>
                <div className="hero-score-ring-wrap">
                  <SecurityScore score={72} size="md" />
                  <p className="hero-score-desc">
                    Your site passes <strong>core HTTPS checks</strong> but is missing a few
                    recommended security headers.
                  </p>
                </div>
                <div className="check-list">
                  <div className="check-item ok"><CheckIcon /><span>HTTPS Enabled</span></div>
                  <div className="check-item ok"><CheckIcon /><span>HTTPS Redirect</span></div>
                  <div className="check-item warn"><WarnIcon /><span>HSTS Missing</span></div>
                  <div className="check-item warn"><WarnIcon /><span>Content Security Policy Missing</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust">
          <div className="wrap">
            <div className="trust-head reveal">
              <h2 className="display">Simple checks. Clear results. Better security.</h2>
            </div>
            <div className="trust-grid reveal-stagger">
              <div className="trust-item">
                <div className="trust-icon"><ShieldOutlineIcon width={21} height={21} /></div>
                <h3>Safe &amp; Non-Invasive</h3>
                <p>Designed for defensive website security checks.</p>
              </div>
              <div className="trust-item">
                <div className="trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" width={21} height={21}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
                </div>
                <h3>Fast Security Checks</h3>
                <p>Quickly identify common configuration issues.</p>
              </div>
              <div className="trust-item">
                <div className="trust-icon">
                  <svg viewBox="0 0 24 24" fill="none" width={21} height={21}><path d="M9 3h6l2 4h3v14H4V7h3l2-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                </div>
                <h3>Easy-to-Understand Reports</h3>
                <p>Clear results without complicated security terminology.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="wrap">
            <div className="section-head reveal">
              <h2 className="display">Everything you need for a basic security health check</h2>
              <p>Eight core checks, run automatically and combined into one score you can act on.</p>
            </div>
            <div className="feature-grid reveal-stagger">
              {[
                [LockIcon, 'HTTPS Check', 'Check whether the website is using HTTPS.'],
                [CertificateIcon, 'SSL Certificate', 'Display basic SSL/TLS certificate information and validity status.'],
                [HeadersIcon, 'Security Headers', 'Check common security headers and identify missing ones.'],
                [RedirectIcon, 'Redirect Check', 'Verify whether HTTP properly redirects to HTTPS.'],
                [CookieIcon, 'Cookie Security', 'Check publicly observable cookie attributes such as Secure, HttpOnly and SameSite.'],
                [DnsIcon, 'DNS Information', 'Display basic public DNS information.'],
                [PerformanceIcon, 'Performance Check', 'Show basic technical and page performance indicators.'],
                [ScoreIcon, 'Security Health Score', 'Combine the results into an easy-to-understand score.'],
              ].map(([Icon, title, desc]) => (
                <div className="feature-card" key={title}>
                  <div className="feature-icon"><Icon width={19} height={19} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="how" id="how">
          <div className="wrap">
            <div className="section-head reveal">
              <h2 className="display">How it works</h2>
              <p>From URL to report in three straightforward steps.</p>
            </div>
            <div className="how-steps reveal-stagger">
              <div className="how-line"></div>
              <div className="how-step">
                <div className="how-num mono">01</div>
                <h3>Enter URL</h3>
                <p>Enter the website you own or are authorized to audit.</p>
              </div>
              <div className="how-step">
                <div className="how-num mono">02</div>
                <h3>Run safe checks</h3>
                <p>The system performs non-invasive security and technical checks.</p>
              </div>
              <div className="how-step">
                <div className="how-num mono">03</div>
                <h3>Get your report</h3>
                <p>Receive a security score, detected issues and recommended fixes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="report">
          <div className="wrap">
            <div className="section-head reveal">
              <h2 className="display">See what a report looks like</h2>
              <p>A sample result — every real scan produces a report shaped like this.</p>
            </div>
            <div className="report-panel reveal">
              <div className="report-top">
                <div className="report-score"><span className="num display">72</span><span className="lbl">/ 100 · Security Health</span></div>
                <a
                  href="/sample-report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  View Sample Report <ArrowRightIcon width={14} height={14} />
                </a>
              </div>
              <div className="report-grid">
                <div className="report-cell"><div className="k">HTTPS</div><div className="v ok"><CheckIcon />Secure</div></div>
                <div className="report-cell"><div className="k">SSL Certificate</div><div className="v ok"><CheckIcon />Valid</div></div>
                <div className="report-cell"><div className="k">Security Headers</div><div className="v warn"><WarnIcon />2 Missing</div></div>
                <div className="report-cell"><div className="k">HTTPS Redirect</div><div className="v ok"><CheckIcon />Working</div></div>
                <div className="report-cell"><div className="k">Cookies</div><div className="v warn"><WarnIcon />Review Required</div></div>
                <div className="report-cell"><div className="k">DNS</div><div className="v ok"><CheckIcon />Available</div></div>
              </div>
              <div className="report-issues">
                <h4>Issues found</h4>
                <div className="issue-row"><WarnIcon />HSTS header is missing</div>
                <div className="issue-row"><WarnIcon />X-Content-Type-Options header is missing</div>
                <div className="issue-row"><WarnIcon />Content Security Policy should be reviewed</div>
              </div>
            </div>
          </div>
        </section>

        <RecentScansFeed />

        <section className="pricing" id="open-source">
          <div className="wrap">
            <div className="section-head center reveal">
              <h2 className="display">Free and open source</h2>
              <p>No login, subscription, or payment is required. Clone the repository, install dependencies, and run your own scanner.</p>
            </div>
            <div className="pricing-grid reveal-stagger">
              <div className="price-card">
                <div className="price-plan-row"><span className="price-name">Local Tool</span></div>
                <div className="price-amount">$0</div>
                <ul className="price-list">
                  <li><CheckIcon />Unlimited local scans</li>
                  <li><CheckIcon />Real security checks</li>
                  <li><CheckIcon />PDF reports</li>
                  <li><CheckIcon />No account required</li>
                </ul>
                <Link to="/scan" className="btn btn-primary btn-block">Run a Scan</Link>
              </div>
              <div className="price-card pro">
                <div className="price-plan-row"><span className="price-name">GitHub CLI</span><span className="price-tag">Open Source</span></div>
                <div className="price-amount">Free</div>
                <ul className="price-list">
                  <li><CheckIcon />Clone with Git</li>
                  <li><CheckIcon />Run from Linux terminal</li>
                  <li><CheckIcon />No cloud account</li>
                  <li><CheckIcon />Safe, non-invasive checks</li>
                </ul>
                <a href="https://github.com/" target="_blank" rel="noreferrer" className="btn btn-ghost btn-block">View on GitHub</a>
              </div>
            </div>
          </div>
        </section>

        <section className="responsible">
          <div className="wrap">
            <div className="resp-panel reveal">
              <div className="resp-icon"><ShieldOutlineIcon width={34} height={34} /></div>
              <div className="resp-copy">
                <h2 className="display">Built for defensive security</h2>
                <p>
                  Security Health Checker is designed for safe, non-invasive website auditing. It
                  checks publicly accessible security and configuration information and does not
                  perform exploitation, brute-force attacks or intrusive penetration testing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="wrap">
            <div className="cta-panel reveal">
              <h2 className="display">Is your website security-ready?</h2>
              <p>Run a quick security health check and discover common configuration issues.</p>
              <Link to="/scan" className="btn btn-primary btn-lg cta-btn">
                Check My Website <ArrowRightIcon width={16} height={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
