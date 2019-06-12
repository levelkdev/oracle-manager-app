// AragonOS setup contracts
const DAOFactory = artifacts.require('DAOFactory')
const EVMScriptRegistryFactory = artifacts.require('EVMScriptRegistryFactory')
const ACL = artifacts.require('ACL')
const Kernel = artifacts.require('Kernel')

// Tidbit contracts
const DataFeedOracleBase = artifacts.require('DataFeedOracleBase.sol')
const DataFeedOracle = artifacts.require('DataFeedOracle.sol')

// Local Contracts
const OracleManagerApp = artifacts.require('OracleManagerApp.sol')
const { increaseTime } = require('./helpers')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const unixTime = () => Math.round(new Date().getTime() / 1000)

contract('OracleManagerApp', (accounts) => {
  let daoFactory, oracleManagerAppBase, oracleManagerApp, root
  let dataFeed1, dataFeed2, medianDataFeed
  let APP_MANAGER_ROLE

  before(async () => {
    root = accounts[0]
    const kernelBase = await Kernel.new(true) // petrify immediately
    const aclBase = await ACL.new()
    const regFact = await EVMScriptRegistryFactory.new()
    daoFactory = await DAOFactory.new(kernelBase.address, aclBase.address, regFact.address)
    oracleManagerAppBase = await OracleManagerApp.new()
    APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
  })

  beforeEach(async () => {
    // aragon OS setup
    const r = await daoFactory.newDAO(root)
    const dao = await Kernel.at(r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao)
    const acl = ACL.at(await dao.acl())
    await acl.createPermission(root, dao.address, APP_MANAGER_ROLE, root, { from: root })
    const receipt = await dao.newAppInstance('0x1234', oracleManagerAppBase.address, '0x', false, { from: root })

    // deploy data feed oracles
    dataFeed1 = await DataFeedOracleBase.new()
    dataFeed2 = await DataFeedOracleBase.new()
    medianDataFeed = await DataFeedOracle.new()

    // initialize oracleManagerApp
    oracleManagerApp = OracleManagerApp.at(receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy)

    await dataFeed1.initialize(root)
    await dataFeed2.initialize(root)
    await medianDataFeed.initialize([dataFeed1.address, dataFeed2.address ], oracleManagerApp.address)
  })

  describe('initialize()', () => {
    it('sets the correct medianDataFeed', async () => {
      await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)
      expect(await oracleManagerApp.medianDataFeed()).to.equal(medianDataFeed.address)
    })

    it('sets the correct approvedDataFeedsLength', async () => {
      await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)
      expect((await oracleManagerApp.approvedDataFeedsLength()).toNumber()).to.equal(2)
    })

    it('sets all dataFeeds to true in approvedDataFeeds mapping', async () => {
      await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)
      expect(await oracleManagerApp.approvedDataFeeds(dataFeed1.address)).to.equal(true)
      expect(await oracleManagerApp.approvedDataFeeds(dataFeed2.address)).to.equal(true)
    })

    it('sets all permissionsedAccounts to true in permissionedAccounts mapping', async () => {
      await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)
      expect(await oracleManagerApp.permissionedAccounts(root)).to.equal(true)
    })

    it('reverts if duplicate dataFeeds are submitted', async () => {
      return assertRevert(async () => {
        await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address, dataFeed1.address], medianDataFeed.address)
      })
    })
  })

  describe('recordMedianData()', () => {
    let unapprovedDataFeed

    beforeEach(async () => {
      unapprovedDataFeed = await DataFeedOracleBase.new()
      unapprovedDataFeed.initialize(root)

      await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)
      await dataFeed1.setResult(uintToBytes(5), unixTime())
      await dataFeed2.setResult(uintToBytes(7), unixTime())
      await unapprovedDataFeed.setResult(uintToBytes(9), unixTime())
    })

    it('sets the result to the median of the dataFeeds', async () => {
      await oracleManagerApp.recordDataMedian([dataFeed1.address, dataFeed2.address])
      expect(bytes32ToNumString((await medianDataFeed.resultByIndexFor(1))[0])).to.equal(6)
    })

    it('reverts if a dataFeed is not approved', async () => {
      return assertRevert(async () => {
        await oracleManagerApp.recordDataMedian([dataFeed1.address, dataFeed2.address, unapprovedDataFeed.address])
      })
    })

    it('reverts if not all approved DataFeeds are included', async () => {
      return assertRevert(async () => {
        await oracleManagerApp.recordDataMedian([dataFeed1.address])
      })
    })

    it('reverts if there are duplicated dataFeeds sent', async () => {
      return assertRevert(async () => {
        await oracleManagerApp.recordDataMedian([dataFeed1.address, dataFeed2.address, dataFeed1.address])
      })
    })
  })

  describe('addOracle', () => {
    let newlyApprovedDataFeed

    beforeEach(async () => {
      newlyApprovedDataFeed = await DataFeedOracleBase.new()
      newlyApprovedDataFeed.initialize(root)

      await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)
    })

    it('increases approvedDataFeedsLength by one', async () => {
      expect((await oracleManagerApp.approvedDataFeedsLength()).toNumber()).to.equal(2)
      await oracleManagerApp.addOracle(newlyApprovedDataFeed.address)
      expect((await oracleManagerApp.approvedDataFeedsLength()).toNumber()).to.equal(3)
    })

    it('sets approvedDataFeeds mapping to true for dataFeed', async () => {
      expect(await oracleManagerApp.approvedDataFeeds(newlyApprovedDataFeed.address)).to.equal(false)
      await oracleManagerApp.addOracle(newlyApprovedDataFeed.address)
      expect(await oracleManagerApp.approvedDataFeeds(newlyApprovedDataFeed.address)).to.equal(true)
    })

    it('adds the newly approved dataFeed to the medianDataFeed', async () => {
      expect(await medianDataFeed.dataSources(newlyApprovedDataFeed.address)).to.equal(false)
      await oracleManagerApp.addOracle(newlyApprovedDataFeed.address)
      expect(await medianDataFeed.dataSources(newlyApprovedDataFeed.address)).to.equal(true)
    })

    it('reverts if dataFeed is already approved', async () => {
      return assertRevert(async () => {
        await oracleManagerApp.addOracle(dataFeed1.address)
      })
    })
  })

  describe('removeOracle()', () => {
    let unapprovedDataFeed

    beforeEach(async () => {
      unapprovedDataFeed = await DataFeedOracleBase.new()
      unapprovedDataFeed.initialize(root)

      await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)
    })

    it('decreases approvedDataFeedsLength by one', async () => {
      expect((await oracleManagerApp.approvedDataFeedsLength()).toNumber()).to.equal(2)
      await oracleManagerApp.removeOracle(dataFeed1.address)
      expect((await oracleManagerApp.approvedDataFeedsLength()).toNumber()).to.equal(1)
    })

    it('sets approvedDataFeeds mapping to false for dataFeed', async () => {
      expect(await oracleManagerApp.approvedDataFeeds(dataFeed1.address)).to.equal(true)
      await oracleManagerApp.removeOracle(dataFeed1.address)
      expect(await oracleManagerApp.approvedDataFeeds(dataFeed1.address)).to.equal(false)
    })

    it('remove the dataFeed from the medianDataFeed', async () => {
      expect(await medianDataFeed.dataSources(dataFeed1.address)).to.equal(true)
      await oracleManagerApp.removeOracle(dataFeed1.address)
      expect(await medianDataFeed.dataSources(dataFeed1.address)).to.equal(false)
    })

    it('reverts if datafeed is not currently approved', async () => {
      return assertRevert(async () => {
        await oracleManagerApp.removeOracle(unapprovedDataFeed.address)
      })
    })
  })

function uintToBytes(num) {
  const hexString = num.toString(16)
  return padToBytes32(hexString)
}

function padToBytes32(n) {
    while (n.length < 64) {
        n = "0" + n;
    }
    return "0x" + n;
}

function bytes32ToNumString(bytes32str) {
    bytes32str = bytes32str.replace(/^0x/, '');
    while (bytes32str[0] == 0) {
      bytes32str = bytes32str.substr(1)
    }
    var bn = web3.toDecimal('0x' + bytes32str, 16);
    return bn
}
