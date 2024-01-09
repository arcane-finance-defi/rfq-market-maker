import express from 'express'
import { CoinGeckoClient } from 'coingecko-api-v3'
import cron from 'node-cron'
import { tokens } from '../tokens.json'

const coinGeckoClient = new CoinGeckoClient()

interface ExchangeRate {
  [key: string]: number
}

const exchangeRates: ExchangeRate = {}
let updateWork = false

async function updateExchangeRates() {
  if (updateWork) {
    return
  }
  updateWork = true
  console.log('Updating exchange rates')
  try {
    await Promise.all(
      tokens.map(async ({ coinGeckoId, id }) => {
        const priceData = await coinGeckoClient.simplePrice({
          ids: coinGeckoId,
          vs_currencies: 'usd',
        })
        exchangeRates[id] = priceData[coinGeckoId].usd
      }),
    )
    console.log(`Updated exchange rates`, exchangeRates)
  } catch (error) {
    console.error(`Error update exchenge`, error)
  }
  updateWork = false
}

cron.schedule('*/30 * * * * *', () => {
  updateExchangeRates()
})

const app = express()
const port = 8001

app.get('/rate/:tokenIn/:tokenOut', (req, res) => {
  const { tokenIn, tokenOut } = req.params
  const rateIn = exchangeRates[tokenIn]
  const rateOut = exchangeRates[tokenOut]

  if (rateIn && rateOut) {
    const exchangeRate = rateIn / rateOut
    res.json({ exchangeRate })
  } else {
    console.log(`Not found exchange rate for ${tokenIn} or ${tokenOut}`)

    res.status(404).send('Not found')
  }
})

app.listen(port, () => {
  console.log(`Exchange service running on ${port}`)
  updateExchangeRates()
})
