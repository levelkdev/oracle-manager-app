module.exports = async function oracleManagerContract (artifacts, daoAddress) {
  const Kernel = artifacts.require('Kernel')
  const OracleManager = artifacts.require('OracleManager')

  const dao = await Kernel.at(daoAddress)

  return new Promise((resolve, reject) => {
    dao.getPastEvents({
      fromBlock: 0,
      toBlock: 'latest'
    }, async (err, evts) => {
      if (err) {
        reject(err)
      }
      try {
        for (var i in evts) {
          const evt = evts[i]
          if (evt.returnValues.proxy) {
            const app = await OracleManager.at(evt.returnValues.proxy)
            let medianDataFeed // using the `medianDataFeed` property to check if this
                              // is the right contract implementation
            try {
              medianDataFeed = await app.medianDataFeed()
            } catch (err) { }
            if (medianDataFeed) {
              resolve(app)
            }
          }
        }
      } catch (err) {
        reject(err)
      }
    })
  })
}
