import WebSocket from 'ws'

import { ValidConfig } from '../config'
import { handleWsMessage } from './ws.handler'

let client: WebSocket
let reconnectInterval: NodeJS.Timeout

export const connectWebSocket = () => {
  client = new WebSocket(ValidConfig.ROUTER_WS_HOST, {
    headers: {
      'auth-token': ValidConfig.AUTH_TOKEN,
    },
  })

  client.on('open', () => {
    console.log('Connected to the WebSocket server')
    clearInterval(reconnectInterval)
  })

  client.on('close', () => {
    console.log('Disconnected from the WebSocket server')
    reconnectInterval = setInterval(() => {
      console.log('Attempting to reconnect to the WebSocket server...')
      connectWebSocket()
    }, 10000)
  })

  client.on('message', (data) => {
    handleWsMessage(data, client)
  })

  client.on('error', (error) => {
    console.error('WebSocket error:', error)
    reconnectInterval = setInterval(() => {
      console.log('Attempting to reconnect to the WebSocket server...')
      connectWebSocket()
    }, 10000)
  })
}
