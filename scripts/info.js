/**
 * Read and output info from an OracleManagerApp contract
 */

const oracleManagerAppContract = require('./utilities/oracleManagerAppContract')

module.exports = async (
  truffleExecCallback
) => {
  const daoAddress = process.argv[6]

  try {
    const oracleManagerApp = await oracleManagerAppContract(artifacts, daoAddress)
    
    console.log(`OracleManagerApp:<${oracleManagerApp.address}`)
    console.log(`  MANAGE_DATA_FEEDS: ${await oracleManagerApp.MANAGE_DATA_FEEDS()}`)
    console.log(`  medianDataFeed: ${await oracleManagerApp.medianDataFeed()}`)
    console.log(`  approvedDataFeedsLength: ${await oracleManagerApp.approvedDataFeedsLength()}`)

    console.log(``)

  } catch (err) {
    console.log('Error in scripts/info.js: ', err)
    truffleExecCallback()
  }
  truffleExecCallback()
}