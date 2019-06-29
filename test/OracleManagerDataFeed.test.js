const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed.sol')
const UniswapAdapterMock = artifacts.require('UniswapAdapterMock.sol')
const { increaseTime, uintToBytes32 } = require('./helpers')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

contract('TokenPriceDataFeed', (accounts) => {
  let TokenPriceDataFeed, uniswapAdapterMock, token1, token2

  beforeEach(async () => {
    TokenPriceDataFeed = await TokenPriceDataFeed.new()
    uniswapAdapterMock = await UniswapAdapterMock.new()
    token1 = accounts[1]
    token2 = accounts[2]
  })

  describe('initialize', () => {
    it('initializes with the correct token pair', async () => {
      await TokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      expect(await TokenPriceDataFeed.token1()).to.equal(token1)
      expect(await TokenPriceDataFeed.token2()).to.equal(token2)
    })

    it('initializes with the correct dataSource', async () => {
      await TokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      expect(await TokenPriceDataFeed.dataSource()).to.equal(uniswapAdapterMock.address)
    })

    it('reverts if initialized twice', async () => {
      await TokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      return assertRevert(async () => {
        await TokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      })
    })
  })

  describe('logResult()', () => {
    it('calls ping() on the dataSource contract', async () => {
      await TokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      const { logs } = await TokenPriceDataFeed.logResult()
      expect(logs[0].event).to.equal('ResultSet')
    })
  })
})
