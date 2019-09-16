import formatDate from './computed/formatDate'
import formatResult from './computed/formatResult'

const medianDataFeed = (state = {}, action) => {
  let returnState = state
  switch (action.type) {
    case 'MEDIAN_DATA_FEED_INFO_LOADED':
      returnState = {
        medianDataFeedAddress: action.medianDataFeedAddress,
        currentResult: formatResult(action.currentResult, action.lastUpdated),
        lastUpdated: formatDate(action.lastUpdated)
      }
      break
  }
  return returnState
}

export default medianDataFeed
