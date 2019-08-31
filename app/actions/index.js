import _ from 'lodash'
import { logDebug, logError } from '../util/logger'
import client from '../client'

export const addDataFeed = ({ address }) => dispatch => {
  return client.addDataFeed({ address }).then(txHash => {
    logDebug(`client.addDataFeed: tx:`, txHash)
  }, err => {
    logError(`client.addDataFeed`, err)
  })
}

export const removeDataFeed = ({ address }) => dispatch => {
  return client.removeDataFeed({ address }).then(txHash => {
    logDebug(`client.removeDataFeed: tx:`, txHash)
  }, err => {
    logError(`client.removeDataFeed`, err)
  })
}

export const fetchDataFeedLatestResult = ({ dataFeedAddress }) => dispatch => {
  return client.getDataFeedLatestResult({ dataFeedAddress }).then(
    latestResults => {
      const currentResult = latestResults.currentResult
      const lastUpdated = latestResults.lastUpdated
      dispatch(dataFeedLatestResultLoaded({ currentResult, lastUpdated, dataFeedAddress }))
    }
  )
}

export const logDataFeedResult = ({ address }) => dispatch => {
  return client.logDataFeedResult({ address }).then(
    () => {
      dispatch(fetchDataFeedLatestResult({ address }))
    }
  )
}

export const dataFeedLatestResultLoaded = ({ currentResult, lastUpdated, dataFeedAddress }) => ({
  type: 'DATA_FEED_LATEST_RESULT_LOADED',
  currentResult,
  lastUpdated,
  dataFeedAddress
})

export const fetchInitData = () => async (dispatch) => {
  await Promise.all([
    dispatch(fetchAccounts()),
    dispatch(fetchLatestBlock())
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
