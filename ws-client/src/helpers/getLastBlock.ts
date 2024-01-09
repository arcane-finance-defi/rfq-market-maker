import axios from 'axios'
import { ValidConfig } from '../config'

const CACHE_DURATION = 30000 // 30 seconds

// Cache object to store the value and the timestamp
let cache = {
  value: undefined,
  timestamp: 0,
}

export const getLastBlock = async (): Promise<number | undefined> => {
  const now = Date.now()
  console.log(`Current time: ${now}`)

  // Check if the cache is valid (not older than 30 seconds)
  if (cache.value && now - cache.timestamp < CACHE_DURATION) {
    console.log(`Using cached value: ${cache.value} at ${cache.timestamp}`)
    return cache.value
  }

  try {
    const response = await axios.get(`${ValidConfig.ALEO_API_HOST}/v1/testnet3/latest/block`)

    // Update cache
    cache = {
      value: response.data.header.metadata.height,
      timestamp: Date.now(),
    }

    console.log(`New value cached: ${cache.value} at ${cache.timestamp}`)
    return cache.value
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message)
    } else {
      console.error('Unexpected error:', error)
    }
    return
  }
}
