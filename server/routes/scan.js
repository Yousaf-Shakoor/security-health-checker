import { Router } from 'express'
import { runScan } from '../scanner/index.js'
import { toApiError } from '../errors.js'
import { addRecentScan } from '../scans/recent-scans-store.js'

const router = Router()

router.post('/scan', async (req, res) => {
  const url = req.body && typeof req.body.url === 'string' ? req.body.url : undefined

  try {
    const result = await runScan(url)

    try {
      addRecentScan({ domain: result.domain, score: result.score, status: result.status })
    } catch (feedErr) {
      console.error('[server] failed to record recent-scans entry:', feedErr)
    }

    res.json(result)
  } catch (err) {
    const { status, body } = toApiError(err)
    res.status(status).json(body)
  }
})

export default router
