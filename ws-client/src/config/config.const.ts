import { ITokenConfig } from '.'

export const TOKENS: ITokenConfig[] = [
  {
    id: 1,
    coinGeckoId: 'tether',
    decimals: 6,
  },
  {
    id: 2,
    coinGeckoId: 'usd-coin',
    decimals: 6,
  },
  {
    id: 3,
    coinGeckoId: 'bitcoin',
    decimals: 6,
  },
  {
    id: 4,
    coinGeckoId: 'ethereum',
    decimals: 6,
  },
]

export const NONCE_SIZE = 72
export const DEFAULT_EXPIRE_BLOCK_NUMBER = 100
export const DEFAULT_SIGN_HOST = 'http://localhost:8000'
