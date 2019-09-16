import assert from 'assert'
import formatDate from './formatDate'

describe('formatDate', () => {
  it('returns the correct result', async () => {
    const date = Date.now()
    const expected = new Date(new Number(date) * 1000).toLocaleString()
    assert.deepEqual(formatDate(date), expected)
  })

  it('returns correct result for dataFeeds never updated', async () => {
    const date = 0
    assert.deepEqual(formatDate(date), undefined)
  })
})
