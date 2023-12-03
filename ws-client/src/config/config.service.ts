import { config } from 'dotenv'
import { configSchema, IConfig } from './config.interface'
import { DEFAULT_EXPIRE_BLOCK_NUMBER, DEFAULT_SIGN_HOST } from './config.const'

config()

export const ValidConfig: IConfig = {
  ROUTER_WS_HOST: process.env.ROUTER_WS_HOST ?? '',
  SIGN_HOST: process.env.SIGN_HOST ?? '',
  AUTH_TOKEN: process.env.AUTH_TOKEN ?? '',
  MAKER_ADDRESS: process.env.MAKER_ADDRESS ?? DEFAULT_SIGN_HOST,
  EXPIRE_BLOCK_NUMBER: process.env.EXPIRE_BLOCK_NUMBER ? Number(process.env.EXPIRE_BLOCK_NUMBER) : DEFAULT_EXPIRE_BLOCK_NUMBER,
}

const resultValidationConfig = configSchema.validate(ValidConfig)

if (resultValidationConfig.error) {
  console.error(`Validate config error: ${resultValidationConfig.error.message}`)
  process.exit(1)
}

console.log('Validate config complete')
