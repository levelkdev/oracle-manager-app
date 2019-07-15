import _ from 'lodash'

const dataFeeds = (state = [], action) => {
  let returnState = state
  switch (action.type) {
    case 'DATA_FEED_ADDED_EVENT':
      returnState = _.uniqBy([
        ...state,
        ...[{ address: action.returnValues.dataFeedAddress }]
      ], 'address')
      break
    case 'DATA_FEED_REMOVED_EVENT':
      returnState = _.filter(state, dataFeed => (
        dataFeed.address != action.returnValues.dataFeedAddress
      ))
      break
  }
  return returnState
}

export default dataFeeds
