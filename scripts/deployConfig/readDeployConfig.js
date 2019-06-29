const fs = require('fs')

module.exports = function readDeployConfig (network) {
  try {
    let dependencyAddrs = JSON.parse(fs.readFileSync(`deploy.${network}.json`))
    let tokenAddrs = JSON.parse(fs.readFileSync(`tokens.${network}.json`))
    return { dependencyAddrs, tokenAddrs}
  } catch (err) {
    console.log(`No existing ${network}.json file found:`, err)
  }
}
