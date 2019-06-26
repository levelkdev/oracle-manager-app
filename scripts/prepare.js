/**
 * Prepares for deployment by deploying dependencies and allocating tokens
 */

const getAccounts = require('@aragon/os/scripts/helpers/get-accounts')
const deployDeps = require('./deploy_deps')

const defaultOwner = process.env.OWNER

module.exports = async (
  truffleExecCallback,
  {
    owner = defaultOwner
  } = {}
) => {
  const network = process.argv[5]

  try {
    if (!owner) {
      owner = (await getAccounts(web3))[0]
    }

    console.log(`owner: ${owner}`)
    console.log('')

    console.log('')

    await deployDeps(null, { artifacts, network })
    console.log('')
    console.log('')
    console.log('Prepare complete')
    console.log('')

  } catch (err) {
    console.log('Error in scripts/prepare.js: ', err)
    truffleExecCallback()
  }
}
