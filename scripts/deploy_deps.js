const tryDeployToNetwork = require('./utilities/tryDeployToNetwork')
const configForNetwork = require('./deployConfig/configForNetwork')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle

module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts,
    network
  } = {}
) => {
  const UniswapAdapter = artifacts.require('UniswapAdapter')
  const OracleManagerDataFeed = artifacts.require('OracleManagerDataFeed')
  const deployConfig = configForNetwork(network)

  try {
    console.log(`Deploying dependencies for "${network}" network`)
    console.log('')

    const uniswapFactoryAddr = deployConfig.dependencyContracts.UniswapFactory

    const uniswapAdapter = await tryDeploy(
      UniswapAdapter,
      'UniswapAdapter',
      [ uniswapFactoryAddr ]
    )

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    } else {
      return {
        uniswapAdapterAddress: uniswapAdapter.address
      }
    }
  } catch (err) {
    console.log('Error in scripts/deploy_deps.js: ', err)
  }

  async function tryDeploy (contractArtifact, contractName, params = []) {
    const resp = await tryDeployToNetwork(network, contractArtifact, contractName, params)
    return resp
  }
}
