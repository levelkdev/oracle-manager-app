import abi from './TokenPriceDataFeed.abi'
import contractFn from './contractFn'

const contractName = 'tokenPriceDataFeed'

export default (aragonClient, address) => {
  const tokenPriceDataFeed = aragonClient.external(address, abi)

  return {
    ...tokenPriceDataFeed,
    currentPrice: async () => {
      const result = await contractFn(tokenPriceDataFeed, contractName, 'latestResult')
      return result
    },
    lastUpdated: async () => {
      const result = await contractFn(tokenPriceDataFeed, contractName, 'latestResultDate')
      return result
    }
  }
}
