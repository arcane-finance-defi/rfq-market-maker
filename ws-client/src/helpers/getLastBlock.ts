import axios from 'axios'
import { ValidConfig } from '../config'

export const getLastBlock = async (): Promise<number | undefined> => {
  try {
    const response = await axios.get(`${ValidConfig.ALEO_API_HOST}/v1/testnet3/latest/block`)

    return response.data.header.metadata.height
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message)
    } else {
      console.error('Unexpected error:', error)
    }
    return
  }
}
