import axios from 'axios'
import { IGetPriceRequest, IGetSignatureRequest, IGetSignatureResponse } from '../interface'
import { DEFAULT_PRICE_HOST, DEFAULT_SIGN_HOST } from '../../config'

export const priceDataRequest = async ({ tokenIn, tokenOut }: IGetPriceRequest): Promise<number | void> => {
  try {
    const response = await axios.get(`${DEFAULT_PRICE_HOST}/rate/${tokenIn}/${tokenOut}`)

    return response.data.exchangeRate
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error in priceDataRequest:', error.message)
    } else {
      // Handle unexpected errors
      console.error('Unexpected error in priceDataRequest:', error)
    }
  }
}

export const signatureDataRequest = async (data: IGetSignatureRequest): Promise<IGetSignatureResponse | void> => {
  try {
    const response = await axios.post<IGetSignatureResponse>(`${DEFAULT_SIGN_HOST}/sign`, {
      ...data,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error in signatureDataRequest:', error.message)
    } else {
      // Handle unexpected errors
      console.error('Unexpected error in signatureDataRequest:', error)
    }
  }
}
