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

const unixTime = () => Math.round(new Date().getTime() / 1000)

contract.only('OracleManagerApp', (accounts) => {
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
    await oracleManagerApp.initialize([root], [dataFeed1.address, dataFeed2.address], medianDataFeed.address)

    await dataFeed1.initialize(root)
    await dataFeed2.initialize(root)
    await medianDataFeed.initialize([dataFeed1.address, dataFeed2.address ], oracleManagerApp.address)
  })

  it('should be the best oracle manager evrr', async () => {
    await dataFeed1.setResult(uintToBytes(5), unixTime())
    await dataFeed2.setResult(uintToBytes(7), unixTime())
    await oracleManagerApp.recordDataMedian([dataFeed1.address, dataFeed2.address])
    await increaseTime(60)
    await dataFeed1.setResult(uintToBytes(8), unixTime() + 60)
    await dataFeed2.setResult(uintToBytes(12), unixTime() + 60)
    await oracleManagerApp.recordDataMedian([dataFeed1.address, dataFeed2.address])


    console.log('result! ', bytes32ToNumString((await medianDataFeed.resultByIndexFor(1))[0]))
    console.log('result! ', bytes32ToNumString((await medianDataFeed.resultByIndexFor(2))[0]))
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
    return bn.toString();
}
