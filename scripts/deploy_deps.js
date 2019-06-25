const tryDeployToNetwork = require('./utilities/tryDeployToNetwork')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle

module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts,
    network
  } = {}
) => {
  const UniswapAdapter = artifacts.require('UniswapAdapter')

  const uniswapFactories = {
    rinkeby: '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36',
    mainnet: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'
  }

  try {
    console.log(`Deploying dependencies for "${network}" network`)
    console.log('')

    let uniswapFactoryAddr = uniswapFactories[network]

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
