/**
 * Setup and run deployment on local devchain
 */

const execa = require('execa')
const getAccounts = require('@aragon/os/scripts/helpers/get-accounts')
const defaultOwner = process.env.OWNER

module.exports = async (
  truffleExecCallback,
  {
    owner = defaultOwner
  } = {}
) => {
  const network = process.argv[5]

  try {
    const MedianDataFeedMock = artifacts.require('MedianDataFeedMock')

    let accounts
    if (!owner) {
      accounts = await getAccounts(web3)
      owner = accounts[0]
    }

    console.log(`owner: ${owner}`)
    console.log('')
    
    console.log(`Deploying MedianDataFeedMock...`)
    const medianDataFeedMock = await MedianDataFeedMock.new()
    console.log(`Deployed: ${medianDataFeedMock.address}`)

    const aragonRunArgs = [
      'run',
      'start:aragon:http',
      '--',
      '--app-init-args',
      medianDataFeedMock.address
    ]

    console.log(`npm ${aragonRunArgs.join(' ')}`)
    console.log('')

    const run = execa('npm', aragonRunArgs)
    run.stdout.pipe(process.stdout)
  } catch (err) {
    console.log('Error in scripts/run.js: ', err)
    truffleExecCallback()
  }
}
