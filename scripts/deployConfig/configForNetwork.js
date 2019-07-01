const fs = require('fs')
const isLocalNetwork = require('./isLocalNetwork')

const defaultDependencyAddrs = {
  rpc: {},

  mainnet: {
    UniswapFactory: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95"
  },

  rinkeby: {
    UniswapFactory: "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36"
  }
}

module.exports = function configForEnv (network) {
  if (isLocalNetwork(network)) {
    return defaultConf('rpc')
  } else {
    return readDeployConfig(network) || defaultConf(network)
  }
}

function readDeployConfig (network) {
  try {
    let dependencyAddrs = JSON.parse(fs.readFileSync(`deploy.${network}.json`))
    let tokenAddrs = JSON.parse(fs.readFileSync(`tokens.${network}.json`))
    return { dependencyAddrs, tokenAddrs }
  } catch (err) {
    console.log(`No existing ${network}.json file found:`, err)
  }
}

function defaultConf (network) {
  return { dependencyAddrs: defaultDependencyAddrs[network], tokenAddrs: {} }
}
