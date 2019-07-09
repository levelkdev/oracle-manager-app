/**
 * Initialize local devchain app
 */

const getAccounts = require('@aragon/os/scripts/helpers/get-accounts')
const oracleManagerAppContract = require('./utilities/oracleManagerAppContract')
const defaultOwner = process.env.OWNER

const Kernel = artifacts.require('Kernel')
const ACL = artifacts.require('ACL')

module.exports = async (
  truffleExecCallback,
  {
    owner = defaultOwner
  } = {}
) => {
  const daoAddress = process.argv[6]

  try {
    let accounts
    if (!owner) {
      accounts = await getAccounts(web3)
      owner = accounts[0]
    }

    const dao = await Kernel.at(daoAddress)
    const acl = await(ACL.at(await dao.acl()))
    const oracleManagerApp = await oracleManagerAppContract(artifacts, daoAddress)
    const MANAGE_DATA_FEEDS_ROLE = await oracleManagerApp.MANAGE_DATA_FEEDS()
    
    console.log(`Granting MANAGE_DATA_FEEDS role to ${owner}...`)
    const tx = await acl.createPermission(owner, daoAddress, MANAGE_DATA_FEEDS_ROLE, owner)
    console.log(`Success: `, tx.tx)
    console.log(``)

  } catch (err) {
    console.log('Error in scripts/init.js: ', err)
    truffleExecCallback()
  }
  truffleExecCallback()
}