export interface IGetPriceRequest {
  tokenIn: number
  tokenOut: number
}

export interface IGetSignatureRequest {
  amount_in: number
  amount_out: number
  token_in: number
  token_out: number
  maker_address: string
  nonce: string
  valid_until: number
}

export interface IGetSignatureResponse {
  quote_signature: string
}
