import bytes32ToNum from './bytes32ToNum'

const formatResult = (result, blockTimestamp) => {

  const unixTime = new Number(blockTimestamp) * 1000
  return unixTime > 0 ? new String(bytes32ToNum(result) / 10 ** 18) : '--'
}

export default formatResult
