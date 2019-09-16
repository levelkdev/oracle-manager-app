import assert from 'assert'
import formatResult from './formatResult'
import uintToBytes32 from './uintToBytes32'

describe('formatResult', () => {
  it('returns the correct result', async () => {
    const date = Date.now()
    const result = uintToBytes32(5600 * 10 ** 18)
    assert.equal(formatResult(result, date), '5600')
  })

  it('returns correct result for dataFeeds never updated', async () => {
    const date = 0
    const result = uintToBytes32(5600 * 10 ** 18)
    assert.equal(formatResult(result, date), undefined)
  })
})
