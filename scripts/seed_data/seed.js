const oracleManagerContract = require('../utilities/oracleManagerContract')

module.exports = async (callback) => {
  try {
    const daoAddress = process.argv[6]
    const dataFileId = process.argv[7] || 0

    if (!daoAddress) {
      throw new Error('The correct arguments were not provided. Script expects `npm run seed <DAO_ADDRESS> [DATAFILE_ID, default=0]`. The DAO address can be copied from the `aragon run` output.')
    }

    const { accounts } = web3.eth

    console.log('seeding data...')
    console.log('')

    const oracleManager = await oracleManagerContract(artifacts, daoAddress)

    const seedData = require('./data/data_' + dataFileId + '.json')

    for (var j = 0; j < seedData.length; j++) {
      const data = seedData[j]
      switch(data.type) {
        case 'addDataFeed':
          const { address } = data
          console.log(`Adding data feed ${address}`)
          await oracleManager.addDataFeed(address)
          console.log(`Data feed added`)
          console.log(``)
          break
        default:
          throw new Error(`${data.type} is not a valid type`)
      }
    }
  } catch (err) {
    console.log('Error in scripts/seed_data/seed.js: ', err)
  }

  callback()
}
