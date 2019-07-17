import assert from 'assert'
import dataFeeds from './dataFeeds'

describe('dataFeeds', () => {

  // TODO: fix edgecase where events come in an order other than
  //       the order in which they were mined.
  //       Use blocknumber/transactionIndex to compare

  describe('DATA_FEED_ADDED_EVENT', () => {

    it('adds a data feed to array with existing values', () => {
      const actual = dataFeeds([mockAddr(0)], dataFeedAddedAction(mockAddr(1)))
      const expected = [mockAddr(0), mockAddr(1)]
      assert.deepEqual(actual, expected)
    })

    it('adds a data feed to empty state array', () => {
      const actual = dataFeeds([], dataFeedAddedAction(mockAddr(1)))
      const expected = [mockAddr(1)]
      assert.deepEqual(actual, expected)
    })

    it('does not add if there is a data feed in state with the same address', () => {
      const actual = dataFeeds([mockAddr(1)], dataFeedAddedAction(mockAddr(1)))
      const expected = [mockAddr(1)]
      assert.deepEqual(actual, expected)
    })

  })

  describe('DATA_FEED_REMOVED_EVENT', () => {

    it('removes the data feed with the matching address', () => {
      const actual = dataFeeds([mockAddr(0)], dataFeedRemovedAction(mockAddr(0)))
      const expected = []
      assert.deepEqual(actual, expected)
    })

    it('does not remove any data feeds if there is no matching address', () => {
      const actual = dataFeeds([mockAddr(1)], dataFeedRemovedAction(mockAddr(0)))
      const expected = [mockAddr(1)]
      assert.deepEqual(actual, expected)
    })

  })
})

const mockAddr = i => ({ address: `mock_addr_${i}` })

const dataFeedAddedAction = ({ address }) => ({
  type: 'DATA_FEED_ADDED_EVENT',
  returnValues: { dataFeedAddress: address }
})

const dataFeedRemovedAction = ({ address }) => ({
  type: 'DATA_FEED_REMOVED_EVENT',
  returnValues: { dataFeedAddress: address }
})
