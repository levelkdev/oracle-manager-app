import assert from 'assert'
import dataFeeds from './dataFeeds'
import uintToBytes32 from './computed/uintToBytes32'
import formatResult from './computed/formatResult'
import formatDate from './computed/formatDate'

describe('dataFeeds', () => {

  // TODO: fix edgecase where events come in an order other than
  //       the order in which they were mined.
  //       Use blocknumber/transactionIndex to compare

  describe('DATA_FEED_ADDED_EVENT', () => {

    it('adds a data feed to array with existing values', () => {
      const actual = dataFeeds([mockDataFeed(0)], dataFeedAddedAction(mockDataFeed(1)))
      const expected = [mockDataFeed(0), mockDataFeed(1)]
      assert.deepEqual(actual, expected)
    })

    it('adds a data feed to empty state array', () => {
      const actual = dataFeeds([], dataFeedAddedAction(mockDataFeed(1)))
      const expected = [mockDataFeed(1)]
      assert.deepEqual(actual, expected)
    })

    it('does not add if there is a data feed in state with the same address', () => {
      const actual = dataFeeds([mockDataFeed(1)], dataFeedAddedAction(mockDataFeed(1)))
      const expected = [mockDataFeed(1)]
      assert.deepEqual(actual, expected)
    })

  })

  describe('DATA_FEED_REMOVED_EVENT', () => {

    it('removes the data feed with the matching address', () => {
      const actual = dataFeeds([mockDataFeed(0)], dataFeedRemovedAction(mockDataFeed(0)))
      const expected = []
      assert.deepEqual(actual, expected)
    })

    it('does not remove any data feeds if there is no matching address', () => {
      const actual = dataFeeds([mockDataFeed(1)], dataFeedRemovedAction(mockDataFeed(0)))
      const expected = [mockDataFeed(1)]
      assert.deepEqual(actual, expected)
    })

  })

  describe('DATA_FEED_LATEST_RESULT_LOADED', () => {
    let currentResult, lastUpdated, address, nullLastUpdated

    beforeEach(async () => {
      nullLastUpdated = 0
      lastUpdated = Date.now()
      currentResult = uintToBytes32(123)
      address = mockAddr(1)
    })

    it('adds formatted current result information', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ address, lastUpdated, currentResult }))
      const dataFeed = (output.filter(dataFeedObj => { if (dataFeedObj.address == address) { return dataFeedObj } }))[0]
      assert.deepEqual(dataFeed.currentResult, formatResult(currentResult, lastUpdated))
    })

    it('adds formatted lastUpdated information', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ address, lastUpdated, currentResult }))
      const dataFeed = (output.filter(dataFeedObj => { if (dataFeedObj.address == address) { return dataFeedObj } }))[0]

      assert.deepEqual(dataFeed.lastUpdated, formatDate(lastUpdated))
    })

    it('does not affect other dataFeeds', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ address, lastUpdated, currentResult }))
      const dataFeed = (output.filter(dataFeedObj => { if (dataFeedObj.address == mockAddr(0)) { return dataFeedObj } }))[0]

      assert.deepEqual(dataFeed.lastUpdated, undefined)
    })

    it('returns -- for current result if datafeed was never updated', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ address, lastUpdated: nullLastUpdated, currentResult }))
      const dataFeed = (output.filter(dataFeedObj => { if (dataFeedObj.address == address) { return dataFeedObj } }))[0]

      assert.deepEqual(dataFeed.currentResult, '--')
    })

    it('returns -- for lastUpdated if datafeed was never updated', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ address, lastUpdated: nullLastUpdated, currentResult }))
      const dataFeed = (output.filter(dataFeedObj => { if (dataFeedObj.address == address) { return dataFeedObj } }))[0]

      assert.deepEqual(dataFeed.lastUpdated, '--')
    })
  })
})

const mockDataFeed = i => ({ address: `mock_addr_${i}` })

const mockAddr = i => ( `mock_addr_${i}` )

const dataFeedAddedAction = ({ address }) => ({
  type: 'ADDED_DATA_FEED_EVENT',
  returnValues: { dataFeed: address }
})

const dataFeedRemovedAction = ({ address }) => ({
  type: 'REMOVED_DATA_FEED_EVENT',
  returnValues: { dataFeed: address }
})

const dataFeedLatestResultLoaded = ({ address, currentResult, lastUpdated }) => ({
  type: 'DATA_FEED_LATEST_RESULT_LOADED',
  address,
  currentResult,
  lastUpdated
})
