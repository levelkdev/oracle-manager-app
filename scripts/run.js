/**
 * Setup and run deployment on local devchain
 */

// const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ZERO_ADDRESS = '0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb'

const execa = require('execa')
const getAccounts = require('@aragon/os/scripts/helpers/get-accounts')
const deployDeps = require('./deployDataFeeds')
const defaultOwner = process.env.OWNER

module.exports = async (
  truffleExecCallback,
  {
    owner = defaultOwner
  } = {}
) => {
  const network = process.argv[5]

  try {
    let accounts
    if (!owner) {
      accounts = await getAccounts(web3)
      owner = accounts[0]
    }

    console.log(`owner: ${owner}`)
    console.log('')

    console.log('')

    await deployDeps(null, { artifacts, network })
    console.log('')

    // PLACEHOLDER .. use ZERO_ADDRESS for the median data feed contract
    const medianDataFeedAddress = ZERO_ADDRESS

    const aragonRunArgs = [
      'run',
      'start:aragon:http',
      '--',
      '--app-init-args',
      medianDataFeedAddress
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
