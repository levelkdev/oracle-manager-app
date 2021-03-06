// AragonOS setup contracts
const DAOFactory = artifacts.require('DAOFactory')
const EVMScriptRegistryFactory = artifacts.require('EVMScriptRegistryFactory')
const ACL = artifacts.require('ACL')
const Kernel = artifacts.require('Kernel')

// Tidbit contracts
const TokenPriceDataFeedMock = artifacts.require('TokenPriceDataFeedMock.sol')
const MedianDataFeedOracle = artifacts.require('MedianDataFeedOracle.sol')

// Local Contracts
const OracleManager = artifacts.require('OracleManager.sol')
const { bytes32ToNum, increaseTime, uintToBytes32 } = require('./helpers')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')
const latestTimestamp = require('./helpers/latestTimestamp')(web3)
const timeTravel = require('@aragon/test-helpers/timeTravel')(web3)
const unixTime = () => Math.round(new Date().getTime() / 1000)

contract('OracleManager', (accounts) => {
  let daoFactory, oracleManagerBase, oracleManager, root
  let dataFeed1, dataFeed2, medianDataFeed
  let APP_MANAGER_ROLE

  before(async () => {
    root = accounts[0]
    const kernelBase = await Kernel.new(true) // petrify immediately
    const aclBase = await ACL.new()
    const regFact = await EVMScriptRegistryFactory.new()
    daoFactory = await DAOFactory.new(kernelBase.address, aclBase.address, regFact.address)
    oracleManagerBase = await OracleManager.new()
    APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
  })

  beforeEach(async () => {
    // aragon OS setup
    const r = await daoFactory.newDAO(root)
    const dao = await Kernel.at(r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao)
    const acl = ACL.at(await dao.acl())
    await acl.createPermission(root, dao.address, APP_MANAGER_ROLE, root, { from: root })
    const receipt = await dao.newAppInstance('0x1234', oracleManagerBase.address, '0x', false, { from: root })

    // deploy data feed oracles
    dataFeed1 = await TokenPriceDataFeedMock.new()
    dataFeed2 = await TokenPriceDataFeedMock.new()
    initializeDataFeed(dataFeed1, accounts)
    initializeDataFeed(dataFeed2, accounts)
    medianDataFeed = await MedianDataFeedOracle.new()

    // initialize oracleManager
    oracleManager = await OracleManager.at(receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy)
    const MANAGE_DATA_FEEDS = await oracleManager.MANAGE_DATA_FEEDS()
    await acl.createPermission(root, oracleManager.address, MANAGE_DATA_FEEDS, root);
  })

  describe('initialize()', () => {
    it('initializes the contract', async () => {
      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      expect(await oracleManager.hasInitialized()).to.equal(true)
    })

    it('reverts if called a second time', async () => {
      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      return assertRevert(async () => {
        await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      })
    })

    it('sets the correct approvedDataFeedsLength', async () => {
      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      expect((await oracleManager.approvedDataFeedsLength()).toNumber()).to.equal(2)
    })

    it('sets all dataFeeds to true in approvedDataFeeds mapping', async () => {
      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      expect(await oracleManager.approvedDataFeeds(dataFeed1.address)).to.equal(true)
      expect(await oracleManager.approvedDataFeeds(dataFeed2.address)).to.equal(true)
    })

    it('emits AddedDataFeed events for initial dataFeeds', async () => {
      const { logs } = await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      expect(logs[0].event).to.equal('AddedDataFeed')
      expect(logs[1].event).to.equal('AddedDataFeed')
      expect(logs[0].args.dataFeed).to.equal(dataFeed1.address)
      expect(logs[1].args.dataFeed).to.equal(dataFeed2.address)
    })

    it('reverts if duplicate dataFeeds are submitted', async () => {
      return assertRevert(async () => {
        await oracleManager.initialize([dataFeed1.address, dataFeed2.address, dataFeed1.address], 0)
      })
    })
  })

  describe('setResult()', () => {
    let unapprovedDataFeed

    beforeEach(async () => {
      unapprovedDataFeed = await TokenPriceDataFeedMock.new()

      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      await setDataFeedResult(dataFeed1, 5)
      await setDataFeedResult(dataFeed2, 7)
      await initializeDataFeed(unapprovedDataFeed, accounts)
      await setDataFeedResult(unapprovedDataFeed, 9)
    })

    it('sets the result to the median of the dataFeeds', async () => {
      await oracleManager.setResult([dataFeed1.address, dataFeed2.address])
      expect(bytes32ToNum((await oracleManager.resultByIndex(1))[0])).to.equal(6 * 10 ** 18)
    })

    it('reverts if a dataFeed is not approved', async () => {
      return assertRevert(async () => {
        await oracleManager.setResult([dataFeed1.address, unapprovedDataFeed.address])
      })
    })

    it('reverts if not all approved DataFeeds are included', async () => {
      return assertRevert(async () => {
        await oracleManager.setResult([dataFeed1.address])
      })
    })

    it('reverts if there are duplicated dataFeeds sent', async () => {
      return assertRevert(async () => {
        await oracleManager.setResult([dataFeed1.address, dataFeed1.address])
      })
    })
  })

  describe('addDataFeed', () => {
    let newlyApprovedDataFeed

    beforeEach(async () => {
      newlyApprovedDataFeed = await TokenPriceDataFeedMock.new()

      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
    })

    it('increases approvedDataFeedsLength by one', async () => {
      expect((await oracleManager.approvedDataFeedsLength()).toNumber()).to.equal(2)
      await oracleManager.addDataFeed(newlyApprovedDataFeed.address)
      expect((await oracleManager.approvedDataFeedsLength()).toNumber()).to.equal(3)
    })

    it('sets approvedDataFeeds mapping to true for dataFeed', async () => {
      expect(await oracleManager.approvedDataFeeds(newlyApprovedDataFeed.address)).to.equal(false)
      await oracleManager.addDataFeed(newlyApprovedDataFeed.address)
      expect(await oracleManager.approvedDataFeeds(newlyApprovedDataFeed.address)).to.equal(true)
    })

    it('emits AddedDataFeed event', async () => {
      const { logs } = await oracleManager.addDataFeed(newlyApprovedDataFeed.address)
      expect(logs[0].event).to.equal('AddedDataFeed')
      expect(logs[0].args.dataFeed).to.equal(newlyApprovedDataFeed.address)
    })

    it('reverts if dataFeed is already approved', async () => {
      return assertRevert(async () => {
        await oracleManager.addDataFeed(dataFeed1.address)
      })
    })
  })

  describe('removeDataFeed()', () => {
    let unapprovedDataFeed

    beforeEach(async () => {
      unapprovedDataFeed = await TokenPriceDataFeedMock.new()
      await initializeDataFeed(unapprovedDataFeed, accounts)

      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
    })

    it('decreases approvedDataFeedsLength by one', async () => {
      expect((await oracleManager.approvedDataFeedsLength()).toNumber()).to.equal(2)
      await oracleManager.removeDataFeed(dataFeed1.address)
      expect((await oracleManager.approvedDataFeedsLength()).toNumber()).to.equal(1)
    })

    it('sets approvedDataFeeds mapping to false for dataFeed', async () => {
      expect(await oracleManager.approvedDataFeeds(dataFeed1.address)).to.equal(true)
      await oracleManager.removeDataFeed(dataFeed1.address)
      expect(await oracleManager.approvedDataFeeds(dataFeed1.address)).to.equal(false)
    })

    it('emits RemovedDataFeed event', async () => {
      const { logs } = await oracleManager.removeDataFeed(dataFeed1.address)
      expect(logs[0].event).to.equal('RemovedDataFeed')
      expect(logs[0].args.dataFeed).to.equal(dataFeed1.address)
    })

    it('reverts if datafeed is not currently approved', async () => {
      return assertRevert(async () => {
        await oracleManager.removeDataFeed(unapprovedDataFeed.address)
      })
    })
  })

  describe('updateAll()', () => {
    beforeEach(async () => {
      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
      await setDataFeedResult(dataFeed1, 5)
      await setDataFeedResult(dataFeed2, 7)
      await oracleManager.setResult([dataFeed1.address, dataFeed2.address])
      await dataFeed1.mock_setResult(5)
      await dataFeed2.mock_setResult(10)
    })

    it('updates approved data feeds', async () => {
      await increaseTime(1000)
      await oracleManager.updateAll([dataFeed1.address, dataFeed2.address])
      expect(await dataFeed1.latestResult()).to.equal(uintToBytes32(5 * 10 ** 18))
      expect(await dataFeed2.latestResult()).to.equal(uintToBytes32(10 * 10 ** 18))
    })

    it('updates medianDataFeed', async () => {
      expect(await oracleManager.latestResult()).to.equal(uintToBytes32(6 * 10 ** 18))
      await increaseTime(1000)
      await oracleManager.updateAll([dataFeed1.address, dataFeed2.address])
      expect(await oracleManager.latestResult()).to.equal(uintToBytes32(7.5 * 10 ** 18))
    })
  })

  describe('contractAddress()', () => {
    beforeEach(async () => {
      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)
    })

    it('returns the contract address', async () => {
      expect(await oracleManager.contractAddress()).to.equal(oracleManager.address)
    })
  })

  describe('medianizeByIndices', () => {
    beforeEach(async () => {
      const timehop = 1000
      await oracleManager.initialize([dataFeed1.address, dataFeed2.address], 0)

      await setDataFeedResult(dataFeed1, 5)
      await setDataFeedResult(dataFeed2, 7)
      await oracleManager.setResult([dataFeed1.address, dataFeed2.address])

      await increaseTime(timehop)

      await setDataFeedResult(dataFeed1, 7)
      await setDataFeedResult(dataFeed2, 9)
      await oracleManager.setResult([dataFeed1.address, dataFeed2.address])

      await increaseTime(timehop)

      await setDataFeedResult(dataFeed1, 9)
      await setDataFeedResult(dataFeed2, 11)
      await oracleManager.setResult([dataFeed1.address, dataFeed2.address])
    })

    it('has correct TimeMedianDataFeed functionality', async () => {
      expect(await oracleManager.medianizeByIndices(1, 2)).to.equal(uintToBytes32(8 * 10 ** 18))
    })
  })
})

async function setDataFeedResult(dataFeed, result) {
  await dataFeed.mock_setResult(result)
  await dataFeed.logResult()
}

async function initializeDataFeed(dataFeed, accounts) {
  // Mocking dataFeeds for ease of testing. These addresses are arbitrary values
  // in mocked contract
  let mockAddr1 = accounts[1]
  let mockAddr2 = accounts[2]
  let mockAddr3 = accounts[3]

  await dataFeed.initialize(mockAddr1, mockAddr2, mockAddr3)
}
