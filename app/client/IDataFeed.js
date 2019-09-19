import abi from './IDataFeed.abi'
import contractFn from './contractFn'

const contractName = 'iDataFeed'

export default (aragonClient, address) => {
  const iDataFeed = aragonClient.external(address, abi)

  return {
    ...iDataFeed,
    currentPrice: async () => {
      const result = await contractFn(iDataFeed, contractName, 'latestResult')
      return result
    },
    lastUpdated: async () => {
      const result = await contractFn(iDataFeed, contractName, 'latestResultDate')
      return result
    },
    viewlastUpdatedResult: async () => {
      const result = await contractFn(iDataFeed, contractName, 'viewlastUpdatedResult')
      return result
    }
  }
}
