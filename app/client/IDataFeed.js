import abi from './IDataFeed.abi'
import contractFn from './contractFn'

const contractName = 'iDataFeed'

export default (aragonClient, address) => {
  const dataFeed = aragonClient.external(address, abi)

  return {
    ...dataFeed,
    currentPrice: async () => {
      const result = await contractFn(dataFeed, contractName, 'latestResult')
      return result
    },
    lastUpdated: async () => {
      const result = await contractFn(dataFeed, contractName, 'latestResultDate')
      return result
    },
    viewCurrentResult: async () => {
      const result = await contractFn(dataFeed, contractName, 'viewCurrentResult')
      return result
    }
  }
}
