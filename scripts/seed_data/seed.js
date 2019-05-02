const BigNumber = require('bignumber.js')
const advanceTime = require('../utilities/advanceTime')

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

    // TODO: seed here

  callback()
}
