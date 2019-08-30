const abi = require('../app/client/TokenPriceDataFeed.abi')

module.exports = async () => {
  try {
    const daoAddr = '0xec90c53161dd2178cd80b82444b8a4cab60de8b3'
    const dataFeed1 = '0x2E60D2b4C9f2523bB7faa81D7A95C1D886535Ca0'
    const dataFeed2 = '0xdb0d2d201C6d8e6c609AE07Be0cBC4711C7Ed32B'
    const OracleManagerApp = artifacts.require('OracleManagerApp')
    const TokenPriceDataFeedMock = artifacts.require('TokenPriceDataFeedMock')
    const oracleManagerApp = OracleManagerApp.at(daoAddr)


    console.log((await oracleManagerApp.approvedDataFeedsLength()).toNumber())
    console.log(await oracleManagerApp.approvedDataFeeds(dataFeed1))
    console.log(await oracleManagerApp.approvedDataFeeds(dataFeed2))

    await TokenPriceDataFeedMock.at(dataFeed1).logResult()
  } catch (err) {
    console.log('err', err)
  }
}
