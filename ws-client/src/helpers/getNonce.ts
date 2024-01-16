import { NONCE_SIZE } from '../config'

export const getNonce = (): string => {
  return '1' + Array.from({ length: NONCE_SIZE }, () => Math.floor(Math.random() * 10).toString()).join('') + 'field'
}
