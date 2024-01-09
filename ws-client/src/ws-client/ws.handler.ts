import WebSocket from 'ws'
import BigNumberJs from 'bignumber.js'

import { IGetPriceWsRequest, IGetPriceWsResponse, getPriceWsRequestSchema } from './ws.interface'
import { getLastBlock, getNonce } from '../helpers'
import { NONCE_SIZE, ValidConfig } from '../config'
import { priceDataRequest } from '../price'
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

    const exchangeRate = await priceDataRequest({
      tokenIn: Number(priceWsRequest.tokenIn),
      tokenOut: Number(priceWsRequest.tokenOut),
    })

    if (!exchangeRate) {
      console.error('Error getting exchange rate')
      return
    }

    const amountOut = BigInt(new BigNumberJs(Number(priceWsRequest.amountIn) * exchangeRate).toFixed(0))
    const nonce = getNonce(NONCE_SIZE)
    const lastBlock = await getLastBlock()

    if (!lastBlock) {
      console.error('Error getting last block')
      return
    }

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
      return
    }

    const response: IGetPriceWsResponse = {
      tokenIn: priceWsRequest.tokenIn,
      tokenOut: priceWsRequest.tokenOut,
      amountIn: priceWsRequest.amountIn,
      amountOut: amountOut.toString(),
      signature: signature.quote_signature,
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
