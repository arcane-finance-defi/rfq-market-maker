import { getLastBlock } from '../../helpers'
import cron from 'node-cron'

let updateWork = false
let lastBlockCache = 0

export const getLastBlockCache = () => {
  return lastBlockCache
}

const updateLastBlock = async () => {
  if (updateWork) {
    return
  }
  updateWork = true
  console.log('Updating last block')
  const lastBlock = await getLastBlock()
  if (lastBlock) {
    lastBlockCache = lastBlock
  }
  console.log(`Updated last block`, lastBlockCache)
  updateWork = false
}

cron.schedule('*/60 * * * * *', () => {
  updateLastBlock()
})

updateLastBlock()
console.log('init last block')
