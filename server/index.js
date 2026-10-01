import { createApp } from './app.js'
import { CONFIG } from './config.js'

const app = createApp()

app.listen(CONFIG.port, () => {
  console.log(`Security Health Checker API listening on port ${CONFIG.port}`)
})
