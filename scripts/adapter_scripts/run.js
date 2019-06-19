const configForNetwork = require('../deployConfig/configForNetwork')
const globalArtifacts = this.artifacts // Not injected unless called directly via truffle

module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts,
  } = {}
) => {
  const token1 = "0xDA5B056Cfb861282B4b59d29c9B395bcC238D29B"
  const token2 = "0x2448eE2641d78CC42D7AD76498917359D961A783"


  const network = process.argv[5]
  const UniswapAdapter = artifacts.require('UniswapAdapter')
  const config = configForNetwork(network)
  const uniswapAdapter = UniswapAdapter.at(config.dependencyContracts.UniswapAdapter)


  console.log(`Pinging Uniswap for token pair: ${token1} ${token2}`)

  const { logs } = await uniswapAdapter.ping(token1, token2)
  const result = logs[0].args
  const numberResult = (result.price.toNumber()) / 10 ** 18

  console.log('')
  console.log(`Price of token ${token1} in units of token2 ${token2}:   ${numberResult}`)
}
