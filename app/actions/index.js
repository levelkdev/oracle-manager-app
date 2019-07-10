import _ from 'lodash'
import { logDebug, logError } from '../util/logger'
import client from '../client'

export const addOracle = ({ address }) => dispatch => {
  return client.addOracle({ address }).then(txHash => {
    logDebug(`client.addOracle: tx:`, txHash)
  }, err => {
    logError(`client.addOracle`, err)
  })
}

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
