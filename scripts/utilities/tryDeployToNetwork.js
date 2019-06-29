const configForNetwork = require('../deployConfig/configForNetwork')
const isLocalNetwork = require('../deployConfig/isLocalNetwork')
const writeDeployConfig = require('../deployConfig/writeDeployConfig')

const tryDeployToNetwork = async (network, contractArtifact, contractName, params = []) => {
  const deployConfig = configForNetwork(network)
  let contractInstance
  const deployedAddress = deployConfig.dependencyAddrs[contractName]
  if (!deployedAddress) {
    console.log(`Deploying ${contractName}...`)
    contractInstance = await contractArtifact.new.apply(null, params)
    console.log(`Deployed ${contractName}: ${contractInstance.address}`)
    if (!isLocalNetwork(network)) {
      deployConfig[contractName] = contractInstance.address
      writeDeployConfig(network, deployConfig)
    }
  } else {
    contractInstance = await contractArtifact.at(deployedAddress)
    console.log(`${contractName} already deployed: ${deployedAddress}`)
  }
  return contractInstance
}

module.exports = tryDeployToNetwork
