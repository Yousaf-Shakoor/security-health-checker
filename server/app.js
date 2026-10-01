import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import scanRouter from './routes/scan.js'
import auditRouter from './routes/audit.js'
import reportRouter from './routes/report.js'
import contactRouter from './routes/contact.js'
import { CONFIG } from './config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, '..', 'dist')

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(cors({ origin: CONFIG.corsOrigin }))
  // The full scan-result JSON posted to /api/report/pdf is bigger than a
  // plain scan request, so the body limit is larger here than a bare scan
  // needs — still small and bounded, nowhere near file-upload territory.
  app.use(express.json({ limit: '256kb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api', scanRouter)
  app.use('/api', auditRouter)
  app.use('/api', reportRouter)
  app.use('/api', contactRouter)

  // If a production frontend build exists (npm run build), serve it from
  // this same server/port — so `node server.js` alone is enough to run the
  // whole app, no separate Vite dev server needed. In dev, Vite's own
  // server + proxy is what people usually run instead (npm run dev:all).
  const hasBuiltFrontend = fs.existsSync(path.join(DIST_DIR, 'index.html'))
  if (hasBuiltFrontend) {
    app.use(express.static(DIST_DIR))
    // SPA fallback: any non-/api route serves index.html so client-side
    // routing (react-router) works on direct loads/refreshes of /scan, /results.
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'))
    })
  }

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('[server] unhandled error:', err)
    res.status(500).json({ error: 'Something went wrong.' })
  })

  return app
}
