import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'
import '../styles/legal.css'

export default function Terms() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main legal-page">
        <div className="wrap">
          <div className="legal-content">
            <h1 className="display">Terms of Service</h1>
            <div className="legal-updated">Last updated: 2026</div>

            <div className="legal-notice">
              This is a self-hosted demo project. These terms describe reasonable, honest ground
              rules for using it — they aren't a substitute for a lawyer-reviewed agreement if you
              deploy this commercially.
            </div>

            <div className="legal-section">
              <h2>Authorized use only</h2>
              <p>
                Only scan websites you own or have explicit permission to test. You are responsible
                for making sure you're authorized to scan any target you enter.
              </p>
            </div>

            <div className="legal-section">
              <h2>Acceptable use</h2>
              <p>You agree not to use this service to:</p>
              <ul>
                <li>Attempt to exploit, attack, or gain unauthorized access to any system</li>
                <li>Circumvent the scanner's safety limits or abuse protections</li>
                <li>Scan targets you do not own or are not authorized to test</li>
                <li>Use the service in any way that violates applicable law</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>Accounts</h2>
              <p>
                Keep your password confidential. You're responsible for activity under your account.
                Sign up requires a valid email address and a password of at least 8 characters.
              </p>
            </div>

            <div className="legal-section">
              <h2>No warranty</h2>
              <p>
                Scan results are basic, automated indicators of common configuration issues — they are
                not a complete security audit and come with no guarantee of accuracy or completeness.
                The service is provided "as is," without warranties of any kind.
              </p>
            </div>

            <div className="legal-section">
              <h2>Availability</h2>
              <p>
                The service may change, be interrupted, or be discontinued at any time without notice.
              </p>
            </div>

            <div className="legal-section">
              <h2>Limitation of liability</h2>
              <p>
                To the fullest extent permitted by law, this service and its operator are not liable
                for any damages arising from your use of it, including decisions made based on a scan
                result.
              </p>
            </div>

            <div className="legal-section">
              <h2>Questions</h2>
              <p>
                Questions about these terms? Reach out via the <Link to="/contact">Contact</Link> page.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
