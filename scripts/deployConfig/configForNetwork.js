const readDeployConfig = require('./readDeployConfig')
const isLocalNetwork = require('./isLocalNetwork')

const defaultConf = {
  dependencyContracts: {}
}

module.exports = function configForEnv (network) {
  if (isLocalNetwork(network)) {
    return defaultConf
  } else {
    return readDeployConfig(network) || defaultConf
  }
}
