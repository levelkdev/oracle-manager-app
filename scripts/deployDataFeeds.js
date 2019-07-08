const configForNetwork = require('./deployConfig/configForNetwork')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle
const network = process.argv[5]

module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts
  } = {}
) => {
  const UniswapAdapter = artifacts.require('UniswapAdapter')
  const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed')
  const {
    uniswapFactory,
    tokens
  } = configForNetwork(network)
  const { ANT, DAI } = tokens

  try {
    console.log(`Deploying data feeds for "${network}" network`)
    console.log('')

    console.log(`Deploying uniswapAdapter...`)
    const uniswapAdapterContract = await UniswapAdapter.new(uniswapFactory)
    console.log(`Deployed: ${uniswapAdapterContract.address}`)
    console.log(``)

    console.log(`Deploying Uniswap data feed for ANT-DAI...`)
    const dataFeedUniswap_ANT_DAI = await TokenPriceDataFeed.new()
    console.log(`Deployed: ${dataFeedUniswap_ANT_DAI.address}`)
    console.log(`Initializing Uniswap data feed for ANT-DAI...`)
    const tx = await dataFeedUniswap_ANT_DAI.initialize(ANT, DAI, uniswapAdapterContract.address)
    console.log(`Initialized: ${tx.tx}`)
    console.log(``)

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    } else {
      return {
        uniswapAdapterAddress: uniswapAdapter.address
      }
    }
  } catch (err) {
    console.log('Error in scripts/deployDataFeeds.js: ', err)
  }
}
