import _ from 'lodash'

const dataFeeds = (state = [], action) => {
  let returnState = state
  switch (action.type) {
    case 'ADDED_DATA_FEED_EVENT':
      returnState = _.uniqBy([
        ...state,
        ...[{ address: action.returnValues.dataFeed }]
      ], 'address')
      break
    case 'REMOVED_DATA_FEED_EVENT':
      returnState = _.filter(state, dataFeed => (
        dataFeed.address != action.returnValues.dataFeed
      ))
      break
  }
  return returnState
}

export default dataFeeds
