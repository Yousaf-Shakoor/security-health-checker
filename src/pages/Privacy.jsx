import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'
import '../styles/legal.css'

export default function Privacy() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main legal-page">
        <div className="wrap">
          <div className="legal-content">
            <h1 className="display">Privacy Policy</h1>
            <div className="legal-updated">Last updated: 2026</div>

            <div className="legal-notice">
              This is a self-hosted project. This page describes, plainly and accurately, what this
              specific application does with data — it is not a substitute for legal review if you
              deploy this for real users in a commercial or regulated setting.
            </div>

            <div className="legal-section">
              <h2>What we collect</h2>
              <p>This version does not require accounts or login. A scan sends the target URL to your own server and returns the report.</p>
              <ul>
                <li><strong>Scan data:</strong> results are generated during the scan and can be downloaded as a PDF.</li>
                <li><strong>Recently Scanned:</strong> the homepage may show an anonymous domain, score, status and time.</li>
                <li><strong>No account credentials:</strong> there is no signup, login, or password database in this open-source version.</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>What we don't do</h2>
              <ul>
                <li>We don't sell or share your data with third parties.</li>
                <li>We don't use third-party analytics or advertising trackers.</li>
                <li>We don't store scanned websites' cookie values — only whether recommended security attributes are present.</li>
                <li>We don't store the full body of scanned pages — only what's needed to compute a result.</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>How data is stored</h2>
              <p>
                The application is designed to be self-hosted. Any scan/feed data written by the server is
                stored locally on the machine where you run it, rather than in a required third-party cloud database.
              </p>
            </div>

            <div className="legal-section">
              <h2>Your choices</h2>
              <p>
                Because there is no account system in this version, there is no account to register or delete.
                If you self-host the project, you control the local data files created by your server.
              </p>
            </div>

            <div className="legal-section">
              <h2>Changes to this policy</h2>
              <p>If what this application collects or does with data changes, this page will be updated to reflect it.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
