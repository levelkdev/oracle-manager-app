const readDeployConfig = require('./readDeployConfig')
const isLocalNetwork = require('./isLocalNetwork')

const defaultConf = {
  rpc: {
    dependencyContracts: {}
  },

  mainnet: {
    dependencyContracts: {
      UniswapFactory: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95"
    }
  },

  rinkeby: {
    dependencyContracts: {
      UniswapFactory: "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36"
    }
  }
}

module.exports = function configForEnv (network) {
  if (isLocalNetwork(network)) {
    return defaultConf.rpc
  } else {
    return readDeployConfig(network) || defaultConf[network]
  }
}
