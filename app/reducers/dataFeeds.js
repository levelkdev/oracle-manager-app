import _ from 'lodash'
import formatDate from './computed/formatDate'
import formatResult from './computed/formatResult'

const dataFeeds = (state = [], action) => {
  let returnState = state
  switch (action.type) {
    case 'ADDED_DATA_FEED_EVENT':
      returnState = _.uniqBy([
        ...state,
        ...[{ dataFeedAddress: action.returnValues.dataFeed }]
      ], 'dataFeedAddress')
      break
    case 'REMOVED_DATA_FEED_EVENT':
      returnState = _.filter(state, dataFeed => (
        dataFeed.dataFeedAddress != action.returnValues.dataFeed
      ))
      break
    case 'DATA_FEED_LATEST_RESULT_LOADED':
      returnState = state.map(dataFeed => {
        if (dataFeed.dataFeedAddress == action.dataFeedAddress) {
          dataFeed.lastUpdatedResult = formatResult(action.lastUpdatedResult, action.lastUpdated)
          dataFeed.lastUpdated = formatDate(action.lastUpdated)
        }
        return dataFeed
      })
      break
  }
  return returnState
}

export default dataFeeds
