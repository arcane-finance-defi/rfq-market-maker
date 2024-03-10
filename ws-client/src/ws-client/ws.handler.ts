import WebSocket from 'ws'
import BigNumberJs from 'bignumber.js'

import { IGetSignatureRequest, getLastBlockCache, priceDataRequest, signatureDataRequest } from '../services'
import { IGetPriceWsRequest, IGetPriceWsResponse, getPriceWsRequestSchema } from './ws.interface'
import { getNonce } from '../helpers'
import { ValidConfig } from '../config'

export const handleWsMessage = async (data: WebSocket.RawData, client: WebSocket): Promise<void> => {
  try {
    const sendResponse = (response: IGetPriceWsResponse) => {
      console.log('Sending response to server with data:', JSON.stringify(response))
      client.send(JSON.stringify(response))
    }

    console.log('Received message from server with data:', data.toString())

    const getPriceWsRequestValidate = getPriceWsRequestSchema.validate(JSON.parse(data.toString()))

    if (getPriceWsRequestValidate.error) {
      console.error('Validation PriceWsRequest error:', getPriceWsRequestValidate.error)
      return
    }

    const priceWsRequest: IGetPriceWsRequest = getPriceWsRequestValidate.value

    const exchangeRate = await priceDataRequest({
      tokenIn: Number(priceWsRequest.tokenIn),
      tokenOut: Number(priceWsRequest.tokenOut),
    })

    if (!exchangeRate) {
      console.error('Error getting exchange rate')
      sendResponse({ priceRequestId: priceWsRequest.priceRequestId, data: undefined })
      return
    }

    const amountOut = BigInt(new BigNumberJs(Number(priceWsRequest.amountIn) * exchangeRate).toFixed(0))
    const nonce = getNonce()
    const lastBlock = getLastBlockCache()
    const validUntil = lastBlock + ValidConfig.EXPIRE_BLOCK_NUMBER

    const signatureData: IGetSignatureRequest = {
      amount_out: Number(amountOut.toString()),
      amount_in: Number(priceWsRequest.amountIn.toString()),
      token_in: Number(priceWsRequest.tokenIn),
      token_out: Number(priceWsRequest.tokenOut),
      maker_address: ValidConfig.MAKER_ADDRESS,
      valid_until: validUntil,
      nonce: nonce,
    }

    const signature = await signatureDataRequest(signatureData)

    if (!signature) {
      console.error('Error getting signature')
      sendResponse({ priceRequestId: priceWsRequest.priceRequestId, data: undefined })
      return
    }

    sendResponse({
      data: {
        tokenIn: priceWsRequest.tokenIn,
        tokenOut: priceWsRequest.tokenOut,
        amountIn: priceWsRequest.amountIn,
        amountOut: amountOut.toString(),
        signature: signature.quote_signature,
        address: ValidConfig.MAKER_ADDRESS,
        validUntil: validUntil.toString(),
        nonce: nonce,
      },
      priceRequestId: priceWsRequest.priceRequestId,
    })
  } catch (err) {
    console.error('Unexpected error in handleWsMessage:', err)
    return
  }
}
