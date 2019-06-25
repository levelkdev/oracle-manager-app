const OracleManagerDataFeed = artifacts.require('OracleManagerDataFeed.sol')
const UniswapAdapterMock = artifacts.require('UniswapAdapterMock.sol')
const { increaseTime, uintToBytes32 } = require('./helpers')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

contract('OracleManagerDataFeed', (accounts) => {
  let oracleManagerDataFeed, uniswapAdapterMock, token1, token2

  beforeEach(async () => {
    oracleManagerDataFeed = await OracleManagerDataFeed.new()
    uniswapAdapterMock = await UniswapAdapterMock.new()
    token1 = accounts[1]
    token2 = accounts[2]
  })

  describe('initialize', () => {
    it('initializes with the correct token pair', async () => {
      await oracleManagerDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      expect(await oracleManagerDataFeed.token1()).to.equal(token1)
      expect(await oracleManagerDataFeed.token2()).to.equal(token2)
    })

    it('initializes with the correct dataSource', async () => {
      await oracleManagerDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      expect(await oracleManagerDataFeed.dataSource()).to.equal(uniswapAdapterMock.address)
    })

    it('reverts if initialized twice', async () => {
      await oracleManagerDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      return assertRevert(async () => {
        await oracleManagerDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      })
    })
  })

  describe('logResult()', () => {
    it('calls ping() on the dataSource contract', async () => {
      await oracleManagerDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      const { logs } = await oracleManagerDataFeed.logResult()
      expect(logs[0].event).to.equal('ResultSet')
    })
  })
})
