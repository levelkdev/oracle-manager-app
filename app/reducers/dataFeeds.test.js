import _ from 'lodash'
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
    let currentResult, lastUpdated, dataFeedAddress, nullLastUpdated

    beforeEach(async () => {
      nullLastUpdated = 0
      lastUpdated = Date.now()
      currentResult = uintToBytes32(123)
      dataFeedAddress = mockAddr(1)
    })

    it('adds formatted current result information', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ dataFeedAddress, lastUpdated, currentResult }))
      const dataFeed = _.find(output, { dataFeedAddress: dataFeedAddress })
      assert.deepEqual(dataFeed.currentResult, formatResult(currentResult, lastUpdated))
    })

    it('adds formatted lastUpdated information', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ dataFeedAddress, lastUpdated, currentResult }))
      const dataFeed = _.find(output, { dataFeedAddress: dataFeedAddress })
      const expected = formatDate(lastUpdated)
      const actual = dataFeed.lastUpdated

      assert.deepEqual(actual, expected)
    })

    it('does not affect other dataFeeds', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ dataFeedAddress, lastUpdated, currentResult }))
      const dataFeed = _.find(output, { dataFeedAddress: mockAddr(0) })
      const expected = undefined
      const actual = dataFeed.lastUpdated

      assert.deepEqual(actual, expected)
    })

    it('returns -- for current result if datafeed was never updated', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ dataFeedAddress, lastUpdated: nullLastUpdated, currentResult }))
      const dataFeed = _.find(output, { dataFeedAddress: dataFeedAddress })
      const expected = undefined
      const actual = dataFeed.currentResult

      assert.deepEqual(actual, expected)
    })

    it('returns -- for lastUpdated if datafeed was never updated', async () => {
      const output = dataFeeds([mockDataFeed(0), mockDataFeed(1)], dataFeedLatestResultLoaded({ dataFeedAddress, lastUpdated: nullLastUpdated, currentResult }))
      const dataFeed = _.find(output, { dataFeedAddress: dataFeedAddress })
      const expected = undefined
      const actual = dataFeed.lastUpdated

      assert.deepEqual(actual, expected)
    })
  })
})

const mockDataFeed = i => ({ dataFeedAddress: `mock_addr_${i}` })

const mockAddr = i => ( `mock_addr_${i}` )

const dataFeedAddedAction = ({ dataFeedAddress }) => {
  return {
  type: 'ADDED_DATA_FEED_EVENT',
  returnValues: { dataFeed: dataFeedAddress }
  }
}

const dataFeedRemovedAction = ({ dataFeedAddress }) => {
  return {type: 'REMOVED_DATA_FEED_EVENT',
  returnValues: { dataFeed: dataFeedAddress }
}}

const dataFeedLatestResultLoaded = ({ dataFeedAddress, currentResult, lastUpdated }) => ({
  type: 'DATA_FEED_LATEST_RESULT_LOADED',
  dataFeedAddress,
  currentResult,
  lastUpdated
})
