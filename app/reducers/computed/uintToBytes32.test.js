const web3_utils = require('web3-utils')
import assert from 'assert'
import bytes32ToNum from './bytes32ToNum'
import uintToBytes32 from './uintToBytes32'

describe('uintToBytes32', () => {
  it('returns the correct result', async () => {
    const bytes = '0x000000000000000000000000000000000000000000000000000000000000000a'
    assert.deepEqual(bytes32ToNum(bytes), web3_utils.toBN(10))
  })
})
