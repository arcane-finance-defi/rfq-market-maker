import axios from 'axios'
import { IGetSignatureRequest, IGetSignatureResponse } from './signature.interface'

const SIG_HOST = 'http://localhost:8000'

export const signatureDataRequest = async (data: IGetSignatureRequest): Promise<IGetSignatureResponse | void> => {
  try {
    const response = await axios.post<IGetSignatureResponse>(`${SIG_HOST}/sign`, {
      ...data,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error:', error.message)
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error)
    }
  }
}
