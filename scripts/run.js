/**
 * Setup and run deployment on local devchain
 */

const execa = require('execa')
const getAccounts = require('@aragon/os/scripts/helpers/get-accounts')
const defaultOwner = process.env.OWNER

const ADDRESS_0 = "0x0000000000000000000000000000000000000000"
const ADDRESS_1 = "0x0000000000000000000000000000000000000001"
const ADDRESS_2 = "0x0000000000000000000000000000000000000002"
const ADDRESS_3 = "0x0000000000000000000000000000000000000003"

module.exports = async (
  truffleExecCallback,
  {
    owner = defaultOwner
  } = {}
) => {
  const network = process.argv[5]

  try {
    const TokenPriceDataFeedMock = artifacts.require('TokenPriceDataFeedMock')

    let accounts
    if (!owner) {
      accounts = await getAccounts(web3)
      owner = accounts[0]
    }

    console.log(`owner: ${owner}`)
    console.log('')

    console.log(`Deploying DataFeedOracleBase1...`)
    const dataFeedOracleBase1 = await TokenPriceDataFeedMock.new()
    await dataFeedOracleBase1.initialize(
      ADDRESS_1,
      ADDRESS_2,
      ADDRESS_3
    )
    console.log(`Deployed: ${dataFeedOracleBase1.address}`)

    console.log(`Deploying DataFeedOracleBase2...`)
    const dataFeedOracleBase2 = await TokenPriceDataFeedMock.new()
    await dataFeedOracleBase2.initialize(
      ADDRESS_1,
      ADDRESS_2,
      ADDRESS_3
    )
    console.log(`Deployed: ${dataFeedOracleBase2.address}`)

    const aragonRunArgs = [
      'run',
      'start:aragon:http',
      '--',
      '--app-init-args',
      `["${dataFeedOracleBase1.address}", "${dataFeedOracleBase2.address}"]`,
      ADDRESS_0
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
