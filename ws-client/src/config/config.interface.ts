import joi from '@hapi/joi'

export interface IConfig {
  ROUTER_WS_HOST: string
  SIGN_HOST: string
  AUTH_TOKEN: string
  MAKER_ADDRESS: string
  EXPIRE_BLOCK_NUMBER: number
  ALEO_API_HOST: string
}

export const configSchema = joi.object<IConfig>({
  ROUTER_WS_HOST: joi.string().required(),
  SIGN_HOST: joi.string().required(),
  AUTH_TOKEN: joi.string().required(),
  MAKER_ADDRESS: joi.string().required(),
  EXPIRE_BLOCK_NUMBER: joi.number().required(),
  ALEO_API_HOST: joi.string().required(),
})

export interface ITokenConfig {
  id: number
  coinGeckoId: string
  decimals: number
}
