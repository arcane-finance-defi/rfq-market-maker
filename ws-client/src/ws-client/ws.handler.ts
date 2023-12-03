import WebSocket from 'ws'
import BigNumberJs from 'bignumber.js'

import { IGetPriceWsRequest, IGetPriceWsResponse, getPriceWsRequestSchema } from './ws.interface'
import { getExchange, getLastBlock, getNonce } from '../helpers'
import { AMOUNT_OUT_FIXED, NONCE_SIZE, TOKENS, ValidConfig } from '../config'
import { signatureDataRequest, IGetSignatureRequest } from '../signature'

export const handleWsMessage = async (data: WebSocket.RawData, client: WebSocket): Promise<void> => {
  try {
    console.log('Received message from server with data:', data.toString())
    const anyRecord: Record<string, any> = JSON.parse(data.toString())

    const getPriceWsRequestValidate = getPriceWsRequestSchema.validate(anyRecord)
    if (getPriceWsRequestValidate.error) {
      console.error('Validation PriceWsRequest error:', getPriceWsRequestValidate.error)
      return
    }

    const priceWsRequest: IGetPriceWsRequest = getPriceWsRequestValidate.value

    const tokenInConfig = TOKENS.find((token) => token.id === Number(priceWsRequest.tokenIn))
    if (!tokenInConfig) {
      console.error('TokenIn not found in config')
      return
    }

    const tokenOutConfig = TOKENS.find((token) => token.id === Number(priceWsRequest.tokenOut))
    if (!tokenOutConfig) {
      console.error('TokenOut not found in config')
      return
    }

    const exchangeRate = await getExchange(tokenInConfig.coinGeckoId, tokenOutConfig.coinGeckoId)

    if (!exchangeRate) {
      console.error('Error getting exchange rate')
      return
    }

    const amountOut = Number(priceWsRequest.amountIn) * exchangeRate

    const amountInDecimal = BigInt(new BigNumberJs(priceWsRequest.amountIn).times((10n ** BigInt(tokenInConfig.decimals)).toString()).toFixed(0))
    const amountOutDecimal = BigInt(new BigNumberJs(amountOut).times((10n ** BigInt(tokenOutConfig.decimals)).toString()).toFixed(0))
    const nonce = getNonce(NONCE_SIZE)
    const lastBlock = await getLastBlock()

    if (!lastBlock) {
      console.error('Error getting last block')
      return
    }

    const validUntil = lastBlock + ValidConfig.EXPIRE_BLOCK_NUMBER

    const signatureData: IGetSignatureRequest = {
      amount_out: Number(amountOutDecimal.toString()),
      amount_in: Number(amountInDecimal.toString()),
      token_in: Number(priceWsRequest.tokenIn),
      token_out: Number(priceWsRequest.tokenOut),
      maker_address: ValidConfig.MAKER_ADDRESS,
      valid_until: validUntil,
      nonce: nonce,
    }

    const signature = await signatureDataRequest(signatureData)

    if (!signature) {
      console.error('Error getting signature')
      return
    }

    const response: IGetPriceWsResponse = {
      tokenIn: priceWsRequest.tokenIn,
      tokenOut: priceWsRequest.tokenOut,
      amountIn: priceWsRequest.amountIn,
      amountOut: amountOut.toFixed(AMOUNT_OUT_FIXED),
      signature: signature.quote_signature,
      quote: signature.quote_signature,
      address: ValidConfig.MAKER_ADDRESS,
      validUntil: validUntil.toString(),
      nonce: nonce,
      priceRequestId: priceWsRequest.priceRequestId,
    }

    console.log('Sending response to server with data:', JSON.stringify(response))
    client.send(JSON.stringify(response))
  } catch (err) {
    console.error('Unexpected error in handleWsMessage:', err)
    return
  }
}
