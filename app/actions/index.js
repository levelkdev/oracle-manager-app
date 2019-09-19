import _ from 'lodash'
import { logDebug, logError } from '../util/logger'
import bytes32ToNum from '../reducers/computed/bytes32ToNum'
import client from '../client'

export const fetchMedianDataFeedInfo = () => dispatch => {
  return client.getMedianDataFeedInfo().then(medianDataFeedInfo => {
    const medianDataFeedAddress = medianDataFeedInfo[0]
    const lastUpdatedResult = medianDataFeedInfo[1]
    const lastUpdated = medianDataFeedInfo[2]
    dispatch(medianDataFeedInfoLoaded({ medianDataFeedAddress, lastUpdatedResult, lastUpdated }))
  }, err => {
    logError(`client.getMedianDataFeedAddress`, err)
  })
}

export const addDataFeed = ({ dataFeedAddress }) => dispatch => {
  return client.addDataFeed({ dataFeedAddress }).then(txHash => {
    logDebug(`client.addDataFeed: tx:`, txHash)
  }, err => {
    logError(`client.addDataFeed`, err)
  })
}

export const removeDataFeed = ({ dataFeedAddress }) => dispatch => {
  return client.removeDataFeed({ dataFeedAddress }).then(txHash => {
    logDebug(`client.removeDataFeed: tx:`, txHash)
  }, err => {
    logError(`client.removeDataFeed`, err)
  })
}

export const fetchDataFeedLatestResult = ({ dataFeedAddress }) => (dispatch, getState) => {
  return client.getDataFeedLatestResult({ dataFeedAddress }).then(
    latestResults => {
      const lastUpdatedResult = latestResults.lastUpdatedResult
      const lastUpdated = latestResults.lastUpdated
      if (getState().medianDataFeed.medianDataFeedAddress == dataFeedAddress) {
        dispatch(medianDataFeedInfoLoaded({ medianDataFeedAddress: dataFeedAddress, lastUpdatedResult, lastUpdated }))
      } else {
        dispatch(dataFeedLatestResultLoaded({ dataFeedAddress, lastUpdatedResult, lastUpdated }))
      }
    }
  )
}

export const logDataFeedResult = ({ dataFeedAddress }) => dispatch => {
  return client.logDataFeedResult({ dataFeedAddress }).then(
    () => {
      dispatch(fetchDataFeedLatestResult({ dataFeedAddress }))
    }
  )
}

export const logMedianDataFeedResult = ({ dataFeedAddress }) => (dispatch, getState) => {
  let dataFeeds = getState().dataFeeds
  _.map(dataFeeds, dataFeed => { dataFeed.lastUpdatedResult = new Number(dataFeed.lastUpdatedResult) })
  dataFeeds = _.map(_.sortBy(dataFeeds, ['lastUpdatedResult']), _.property('dataFeedAddress'))
  return client.logMedianDataFeedResult(dataFeeds).then(
    () => {
      dispatch(fetchDataFeedLatestResult( { dataFeedAddress }))
    }
  )
}

export const updateAllDataFeeds = ({ dataFeedAddrs, medianDataFeedAddress }) => (dispatch, getState) => {


  let orderedDataFeeds = _.sortBy(dataFeedAddrs, async (dataFeedAddress) => {
    let result = await client.getDataFeedlastUpdatedResult({ dataFeedAddress })
    result = bytes32ToNum(result) / 10 ** 18
    return result
  })

  // return client.updateAllDataFeeds({ dataFeedAddrs }).then(
  //   () => {
  //     for (datafeedAddress of dataFeedAddrs) {
  //       dispatch(fetchDataFeedLatestResult({ dataFeedAddress }))
  //     }
  //     dispatch(fetchDataFeedLatestResult({ medianDataFeedAddress }))
  //   }
  // )
}

export const dataFeedLatestResultLoaded = ({ lastUpdatedResult, lastUpdated, dataFeedAddress }) => ({
  type: 'DATA_FEED_LATEST_RESULT_LOADED',
  lastUpdatedResult,
  lastUpdated,
  dataFeedAddress
})

export const medianDataFeedInfoLoaded = ({ medianDataFeedAddress, lastUpdatedResult, lastUpdated }) => {
  let action =  {
    type: 'MEDIAN_DATA_FEED_INFO_LOADED',
    medianDataFeedAddress,
    lastUpdatedResult,
    lastUpdated
  }
  return action

}

export const fetchInitData = () => async (dispatch) => {
  await Promise.all([
    dispatch(fetchAccounts()),
    dispatch(fetchLatestBlock()),
    dispatch(fetchMedianDataFeedInfo())
  ])
}

export const fetchAccounts = propFetchDispatcher('accounts')
export const fetchLatestBlock = propFetchDispatcher('latestBlock')

export const showPanel = ({ panelName, panelContext }) => ({
  type: 'SHOW_PANEL',
  panelName,
  panelContext
})

export const hidePanel = () => ({
  type: 'HIDE_PANEL'
})

// property value loaded from the Futarchy smart contract
export const propValueLoaded = ({ prop, value }) => ({
  type: 'PROP_VALUE_LOADED',
  prop,
  value
})

// error loading property value from the Futarchy smart contract
export const propValueLoadingError = ({ prop, errorMessage }) => ({
  type: 'PROP_VALUE_LOADING_ERROR',
  prop,
  errorMessage
})

function propFetchDispatcher (prop) {
  return () => dispatch => {
    return client[prop]().then(
      propValue => dispatch(propValueLoaded({ prop, value: propValue })),
      errorMessage => {
        console.error(errorMessage)
        return dispatch(propValueLoadingError({ prop, errorMessage }))
      }
    )
  }
}
