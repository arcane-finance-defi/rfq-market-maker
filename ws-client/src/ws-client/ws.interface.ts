import joi from '@hapi/joi'

const onlyNumbersRegex = /^\d+(\.\d+)?$/

export interface IGetPriceWsRequest {
  priceRequestId: number
  tokenIn: string
  tokenOut: string
  amountIn: string
}

export const getPriceWsRequestSchema = joi.object<IGetPriceWsResponse>({
  priceRequestId: joi.number().required(),
  tokenIn: joi.string().required(),
  tokenOut: joi.string().required(),
  amountIn: joi.string().regex(onlyNumbersRegex).required(),
})

export interface IGetPriceWsResponse {
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  signature: string
  quote: string
  address: string
  validUntil: string
  nonce: string
  priceRequestId: number
}
