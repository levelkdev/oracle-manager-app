/**
 * Read and output info from an OracleManager contract
 */

const oracleManagerContract = require('./utilities/oracleManagerContract')

module.exports = async (
  truffleExecCallback
) => {
  const daoAddress = process.argv[6]

  try {
    const oracleManager = await oracleManagerContract(artifacts, daoAddress)
    
    console.log(`OracleManager:<${oracleManager.address}`)
    console.log(`  MANAGE_DATA_FEEDS: ${await oracleManager.MANAGE_DATA_FEEDS()}`)
    console.log(`  medianDataFeed: ${await oracleManager.medianDataFeed()}`)
    console.log(`  approvedDataFeedsLength: ${await oracleManager.approvedDataFeedsLength()}`)

    console.log(``)

  } catch (err) {
    console.log('Error in scripts/info.js: ', err)
    truffleExecCallback()
  }
  truffleExecCallback()
}