import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import SecurityScore from '../components/SecurityScore.jsx'
import SecurityCheckCard from '../components/SecurityCheckCard.jsx'
import IssueCard from '../components/IssueCard.jsx'
import SecurityHeadersTable from '../components/SecurityHeadersTable.jsx'
import CertificateCard from '../components/CertificateCard.jsx'
import TechnicalDetails from '../components/TechnicalDetails.jsx'
import CookieSecurityCard from '../components/CookieSecurityCard.jsx'
import DnsInfoCard from '../components/DnsInfoCard.jsx'
import PerformanceCard from '../components/PerformanceCard.jsx'
import RecommendationCard from '../components/RecommendationCard.jsx'
import Toast from '../components/Toast.jsx'
import useReveal from '../hooks/useReveal.js'
import { getMockScanResult } from '../data/mockScanData.js'
import { getScoreBand } from '../utils/scoreBand.js'
import { downloadPdfReport } from '../api/report.js'
import { DownloadIcon, ShareIcon, RefreshIcon, ArrowRightIcon } from '../components/Icons.jsx'
import '../styles/results.css'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  // If we arrived from a real scan, use the merged result it produced
  // (real HTTPS + redirect data, everything else still mock). Otherwise —
  // e.g. a direct link or page refresh — fall back to a fully mock report
  // so the page never breaks.
  const passedResult = location.state?.result
  const fallbackDomain = location.state?.domain || 'example.com'
  const result = useMemo(
    () => passedResult || getMockScanResult(fallbackDomain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [passedResult, fallbackDomain]
  )
  const scoreBand = getScoreBand(result.score)

  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef(null)

  const [pdfLoading, setPdfLoading] = useState(false)

  const showToast = (message) => {
    setToastMessage(message)
    setToastVisible(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2600)
  }

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const handleDownloadPdf = async () => {
    if (pdfLoading) return
    setPdfLoading(true)
    try {
      await downloadPdfReport(result)
    } catch (err) {
      showToast(err.message || 'Could not generate the PDF report. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  useReveal([result.domain])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main results-page">
        <div className="wrap">
          <div className="results-header">
            <div className="results-heading">
              <h1 className="display">Security Health Report</h1>
              <div className="results-domain mono">{result.domain}</div>
              <div className="results-timestamp">
                {result.scannedAtLabel}
              </div>
            </div>
            <div className="results-actions">
              <button className="btn btn-ghost" onClick={() => navigate('/scan')}>
                <RefreshIcon width={15} height={15} /> Scan Again
              </button>
              <button className="btn btn-ghost" onClick={handleDownloadPdf} disabled={pdfLoading}>
                <DownloadIcon width={15} height={15} /> {pdfLoading ? 'Generating…' : 'Download PDF'}
              </button>
              <button className="btn btn-ghost" onClick={() => showToast('Report sharing is coming soon.')}>
                <ShareIcon width={15} height={15} /> Share Report
              </button>
            </div>
          </div>

          <div className="score-panel reveal">
            <SecurityScore score={result.score} status={result.status} size="lg" />
            <div className="score-panel-copy">
              <h2>Security Health</h2>
              <p>{result.scoreSummary}</p>
              <span className={`score-panel-badge score-panel-badge--${scoreBand.key}`}>{result.status}</span>
            </div>
          </div>

          <section className="results-section">
            <div className="results-section-head">
              <h2 className="display">Security Check Summary</h2>
            </div>
            <div className="summary-grid reveal-stagger">
              {result.checkOrder.map((id) => (
                <SecurityCheckCard key={id} check={result.checks[id]} />
              ))}
            </div>
          </section>

          <section className="results-section">
            <div className="results-section-head">
              <h2 className="display">Issues Found</h2>
              <p>{result.issues.length} issues detected</p>
            </div>
            <div className="issue-list reveal-stagger">
              {result.issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </section>

          <section className="results-section">
            <div className="results-section-head">
              <h2 className="display">Security Headers</h2>
            </div>
            <p className="headers-note">
              Security headers help browsers apply additional security protections to web pages.
            </p>
            <div className="reveal">
              <SecurityHeadersTable rows={result.headersTable} />
            </div>
          </section>

          <section className="results-section">
            <div className="details-grid reveal-stagger">
              <CertificateCard certificate={result.certificate} />
              <div>
                <div className="results-section-head" style={{ marginBottom: '20px' }}>
                  <h2 className="display" style={{ fontSize: '1.1rem' }}>Technical Details</h2>
                </div>
                <TechnicalDetails technical={result.technical} />
              </div>
            </div>
          </section>

          <section className="results-section">
            <div className="details-grid-3 reveal-stagger">
              <div>
                <h3 className="detail-subhead">Cookie Security</h3>
                <CookieSecurityCard attributes={result.cookieAttributes} />
              </div>
              <div>
                <h3 className="detail-subhead">DNS Information</h3>
                <DnsInfoCard dns={result.dns} />
              </div>
              <div>
                <h3 className="detail-subhead">Basic Performance</h3>
                <PerformanceCard performance={result.performance} />
              </div>
            </div>
          </section>

          <section className="results-section">
            <div className="results-section-head">
              <h2 className="display">Recommended Actions</h2>
            </div>
            <div className="rec-list reveal-stagger">
              {result.recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onLearnMore={() => showToast('Documentation is coming soon.')}
                />
              ))}
            </div>
          </section>

          <section className="results-section">
            <div className="summary-panel reveal">
              <h2 className="display">Security Summary</h2>
              <p>{result.reportSummary}</p>
            </div>
          </section>

          <div className="rescan-cta reveal">
            <p>Want to check another website, or re-run this scan?</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/scan')}>
              Run Another Scan <ArrowRightIcon width={16} height={16} />
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  )
}
