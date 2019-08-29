import _ from 'lodash'
import {
  fetchDataFeedLatestResult
} from '../actions'

const appEventInterceptor = store => next => action => {
  const state = store.getState()
  const { latestBlock } = state
  switch (action.type) {
    case 'ADDED_DATA_FEED_EVENT':
      store.dispatch(
        fetchDataFeedLatestResult({address: action.returnValues.dataFeed })
      )
      break
  }

  const result = next(action)

  return result
}

export default appEventInterceptor
