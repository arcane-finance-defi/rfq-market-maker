import axios from 'axios'
import { IGetSignatureRequest, IGetSignatureResponse } from './signature.interface'
import { DEFAULT_SIGN_HOST } from '../config'

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
