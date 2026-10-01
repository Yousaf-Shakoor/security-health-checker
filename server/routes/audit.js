import { Router } from 'express'
import { runSecurityAudit } from '../scanner/audit.js'
import { toApiError } from '../errors.js'

const router = Router()

router.post('/audit', async (req, res) => {
  const url = req.body && typeof req.body.url === 'string' ? req.body.url : undefined
  try {
    res.json(await runSecurityAudit(url))
  } catch (err) {
    const { status, body } = toApiError(err)
    res.status(status).json(body)
  }
})

export default router
