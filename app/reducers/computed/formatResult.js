import bytes32ToNum from './bytes32ToNum'

const formatResult = (result, blockTimestamp) => {
  const unixTime = new Number(blockTimestamp) * 1000

  return unixTime > 0 ? new String(bytes32ToNum(result)) : '--'
}

export default formatResult
