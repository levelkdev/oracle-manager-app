import assert from 'assert'
const web3_utils = require('web3-utils')
import medianDataFeed from './medianDataFeed'
import uintToBytes32 from './computed/uintToBytes32'
import formatResult from './computed/formatResult'
import formatDate from './computed/formatDate'

describe('medianDataFeed', () => {

  describe('MEDIAN_DATA_FEED_INFO_LOADED', () => {
    let medianDataFeedAddress, lastUpdatedResult, lastUpdated

    beforeEach(async () => {
      medianDataFeedAddress = 'mock_addr_1'
      const num = web3_utils.toBN(5 * 10 ** 18)
      lastUpdatedResult = uintToBytes32(web3_utils.toBN(5 * 10 ** 18))
      lastUpdated = Date.now()
    })

    it('it adds the correct medianDataFeedAddress', () => {
      const actual = medianDataFeed({}, dataFeedLatestResultLoaded({ medianDataFeedAddress, lastUpdatedResult, lastUpdated }))
      assert.deepEqual(actual.medianDataFeedAddress, medianDataFeedAddress)
    })

    it('adds the correctly formatted currenResult', () => {
      const actual = medianDataFeed({}, dataFeedLatestResultLoaded({ medianDataFeedAddress, lastUpdatedResult, lastUpdated }))
      const expected = formatResult(lastUpdatedResult, lastUpdated)
      assert.deepEqual(actual.lastUpdatedResult, expected)
    })

    it('adds the correctly formatted currenResult if the result has never been updated', () => {
      const actual = medianDataFeed({}, dataFeedLatestResultLoaded({ medianDataFeedAddress, lastUpdatedResult, lastUpdated: 0 }))
      const expected = undefined
      assert.deepEqual(actual.lastUpdatedResult, expected)
    })

    it('adds the correctly formatted latsUpdated', () => {
      const actual = medianDataFeed({}, dataFeedLatestResultLoaded({ medianDataFeedAddress, lastUpdatedResult, lastUpdated }))
      const expected = formatDate(lastUpdated)
      assert.deepEqual(actual.lastUpdated, expected)
    })

    it('adds the correctly latsUpdated if the result has never been updated', () => {
      const actual = medianDataFeed({}, dataFeedLatestResultLoaded({ medianDataFeedAddress, lastUpdatedResult, lastUpdated: 0 }))
      const expected = undefined
      assert.deepEqual(actual.lastUpdated, expected)
    })

  })
})

const dataFeedLatestResultLoaded = ({ medianDataFeedAddress, lastUpdatedResult, lastUpdated }) => ({
  type: 'MEDIAN_DATA_FEED_INFO_LOADED',
  medianDataFeedAddress,
  lastUpdatedResult,
  lastUpdated
})
