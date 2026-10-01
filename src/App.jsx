import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Scan from './pages/Scan.jsx'
import Results from './pages/Results.jsx'
import Security from './pages/Security.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import Contact from './pages/Contact.jsx'
import Audit from './pages/Audit.jsx'
import ChatbotWidget from './components/ChatbotWidget.jsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/results" element={<Results />} />
        <Route path="/security" element={<Security />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/audit" element={<Audit />} />
      </Routes>
      <ChatbotWidget />
    </>
  )
}
