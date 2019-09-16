const formatDate = (blockTimestamp) => {
  const unixTime = new Number(blockTimestamp) * 1000
  return unixTime > 0 ? new Date(unixTime).toLocaleString() : undefined
}

export default formatDate
