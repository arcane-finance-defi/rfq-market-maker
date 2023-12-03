import { CoinGeckoClient } from 'coingecko-api-v3'

const coinGeckoClient = new CoinGeckoClient()
const USD_NAME = 'usd'

export const getExchange = async (coinGeckoIdFirst: string, coinGeckoIdSecond: string): Promise<number | undefined> => {
  const firstPrice = await getCurrentPrice(coinGeckoIdFirst)

  if (!firstPrice) {
    console.log(`Error getting first price: ${firstPrice}`)
    return
  }

  const secondPrice = await getCurrentPrice(coinGeckoIdSecond)

  if (!secondPrice) {
    console.log(`Error getting second price: ${secondPrice}`)
    return
  }

  const exchangeRate = firstPrice / secondPrice

  return exchangeRate
}

const getCurrentPrice = async (coinGeckoId: string): Promise<number | undefined> => {
  const priceData = await coinGeckoClient.coinId({
    id: coinGeckoId,
    market_data: true,
    community_data: false,
    developer_data: false,
    localization: false,
    sparkline: false,
    tickers: false,
  })

  if (!priceData?.market_data?.current_price) {
    console.log(`Error from coingecko api, priceData.market_data.current_price == undefined`)
    return
  }

  const hasProperty = priceData.market_data.current_price.hasOwnProperty(USD_NAME)

  if (!hasProperty) {
    console.log(`Error coingecko: not found currency ${USD_NAME}`)
    return
  }

  const tokenPrice = priceData.market_data.current_price[USD_NAME]

  return tokenPrice
}
