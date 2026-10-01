import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'
import '../styles/legal.css'

export default function Security() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main legal-page">
        <div className="wrap">
          <div className="legal-content">
            <h1 className="display">Security</h1>
            <p className="legal-intro">
              Security Health Checker is built to be defensive and non-invasive from the ground up.
              This page explains exactly what the scanner does, what it deliberately avoids doing, and
              how to report a security concern.
            </p>

            <div className="legal-section">
              <h2>What a scan actually does</h2>
              <p>Every scan runs a small, fixed set of read-only checks against a website you enter:</p>
              <ul>
                <li>Checks whether the site is reachable over <strong>HTTPS</strong></li>
                <li>Checks whether plain <strong>HTTP redirects to HTTPS</strong></li>
                <li>Reads the <strong>SSL/TLS certificate</strong>'s validity, issuer and expiry</li>
                <li>Reads publicly visible <strong>security headers</strong> (HSTS, CSP, X-Frame-Options, etc.)</li>
                <li>Checks <strong>cookie attributes</strong> (Secure, HttpOnly, SameSite) — never cookie values</li>
                <li>Looks up basic public <strong>DNS records</strong> (A, AAAA, MX, nameservers)</li>
                <li>Measures basic <strong>response time and page size</strong></li>
              </ul>
              <p>That's the entire list. Nothing beyond it runs, ever.</p>
            </div>

            <div className="legal-section">
              <h2>What it will never do</h2>
              <p>
                This tool does not perform exploitation, SQL injection testing, brute force,
                credential attacks, authentication bypass, port scanning, phishing, or any intrusive
                penetration-testing technique. If a check can't be done safely and passively, it isn't
                included.
              </p>
            </div>

            <div className="legal-section">
              <h2>Built-in abuse protections</h2>
              <p>Because scanning means the server makes outbound requests on your behalf, several protections are always active:</p>
              <ul>
                <li>Private, loopback, link-local, and cloud-metadata addresses are always blocked — resolved IPs are checked, not just the hostname you typed</li>
                <li>The resolved address is pinned for the actual connection, closing the gap DNS-rebinding attacks rely on</li>
                <li>Every outbound request has a connect/response timeout, a capped redirect chain, and a response-size limit</li>
                <li>Response bodies are read only where strictly needed (the performance check) and are never stored</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>Only scan what you're authorized to</h2>
              <p>
                Only run scans against websites you own or have explicit permission to test. Even
                though every check here is passive and non-invasive, scanning systems without
                authorization can violate terms of service or local law.
              </p>
            </div>

            <div className="legal-section">
              <h2>Reporting a security issue</h2>
              <p>
                Found a vulnerability in this application itself, or a way the scanner could be
                misused? Please let us know via the <Link to="/contact">Contact</Link> page rather than
                disclosing it publicly first.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
