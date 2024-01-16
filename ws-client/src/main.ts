import { connectWebSocket } from './ws-client'
import express from 'express'

const port = 3000

;(() => {
  connectWebSocket()

  const app = express()

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).send('OK')
  })

  app.listen(port, () => {
    console.log(`Server for Health check  running on port ${port}`)
  })
})()
