import { Link } from 'react-router-dom'
import { ShieldIcon } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark"><ShieldIcon /></span>
              Security Health Checker
            </div>
            <p>Simple security visibility for modern websites.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <a href="/#product">Product</a>
              <a href="/#features">Features</a>
            </div>
            <div className="footer-col">
              <Link to="/security">Security</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
            <div className="footer-col">
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Security Health Checker. All rights reserved.</div>
      </div>
    </footer>
  )
}
