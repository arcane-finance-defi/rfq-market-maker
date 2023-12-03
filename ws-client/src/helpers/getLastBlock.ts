export const getLastBlock = async (): Promise<number | undefined> => {
  try {
    const { AleoNetworkClient } = (await import('@aleohq/sdk')) as any
    const networkClient = new AleoNetworkClient('https://api.explorer.aleo.org/v1')

    const block = await networkClient.getLatestHeight().then((block: any) => {
      return block
    })

    return block
  } catch (err) {
    console.log(`Error getting last block: ${err}`)

    return
  }
}
