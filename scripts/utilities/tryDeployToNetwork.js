const configForNetwork = require('../deployConfig/configForNetwork')
const isLocalNetwork = require('../deployConfig/isLocalNetwork')

const tryDeployToNetwork = async (network, contractArtifact, contractName, params = []) => {
  const deployConfig = configForNetwork(network)
  let contractInstance
  const deployedAddress = deployConfig.dependencyAddrs[contractName]
  if (!deployedAddress) {
    console.log(`Deploying ${contractName}...`)
    contractInstance = await contractArtifact.new.apply(null, params)
    console.log(`Deployed ${contractName}: ${contractInstance.address}`)
  } else {
    contractInstance = await contractArtifact.at(deployedAddress)
    console.log(`${contractName} already deployed: ${deployedAddress}`)
  }
  console.log('')
  return contractInstance
}

module.exports = tryDeployToNetwork
