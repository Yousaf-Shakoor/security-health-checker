import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldIcon, SunIcon, MoonIcon } from './Icons.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSecurityAuditClick = () => {
    setOpen(false)
    navigate('/audit')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/#product', label: 'Product' },
    { href: '/#how', label: 'How It Works' },
    { href: '/#features', label: 'Features' },
  ]

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark"><ShieldIcon /></span>
            Security Health Checker
          </Link>
          <nav className="nav-links">
            {links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
            <Link to="/scan">Scan Website</Link>
            <a href="/audit" onClick={(e) => { e.preventDefault(); handleSecurityAuditClick() }}>Security Audit</a>
          </nav>
          <div className="nav-right">
            <button type="button" className="theme-toggle" aria-label={theme === 'dark' ? 'Switch to bright mode' : 'Switch to dark mode'} onClick={toggleTheme}>
              {theme === 'dark' ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
            </button>
            <Link to="/scan" className="btn btn-primary nav-login-desktop">Get Started</Link>
            <button className="nav-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {links.map((l) => <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
        <Link to="/scan" onClick={() => setOpen(false)}>Scan Website</Link>
        <a href="/audit" onClick={(e) => { e.preventDefault(); handleSecurityAuditClick() }}>Security Audit</a>
        <Link to="/scan" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>Get Started</Link>
        <button type="button" className="theme-toggle theme-toggle--mobile" onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon width={16} height={16} /> : <MoonIcon width={16} height={16} />}
          {theme === 'dark' ? 'Bright Mode' : 'Dark Mode'}
        </button>
      </div>
    </>
  )
}
