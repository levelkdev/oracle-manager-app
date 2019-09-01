import assert from 'assert'
import bytes32ToNum from './bytes32ToNum'
import uintToBytes32 from './uintToBytes32'

describe('bytes32ToNum', () => {
  it('returns the correct result', async () => {
    const bytes = uintToBytes32(10)
    assert.deepEqual(bytes32ToNum(bytes), 10)
  })
})
