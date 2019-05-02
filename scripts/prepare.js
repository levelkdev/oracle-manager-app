/**
 * Prepares for deployment by deploying dependencies and allocating tokens
 */

const getAccounts = require('@aragon/os/scripts/helpers/get-accounts')
const readAccounts = require('./deployConfig/readAccounts')

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
      accounts = readAccounts(network)
      owner = (await getAccounts(web3))[0]
    }

    // TODO: prepare here
  } catch (err) {
    console.log('Error in scripts/prepare.js: ', err)
    truffleExecCallback()
  }

    console.log(`owner: ${owner}`)
    console.log('')
}
