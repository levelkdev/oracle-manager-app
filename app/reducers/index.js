import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { appEvents } from '../aragonRedux/aragonRedux'
import propValue from './propValue'
import initDataLoadStates from './initDataLoadStates'
import initDataProps from './initDataProps'
import sidePanel from './sidePanel'
import dataFeeds from './dataFeeds'
import medianDataFeed from './medianDataFeed'

let reducers = {
  appEvents,
  initDataLoadStates,
  form,
  sidePanel,
  dataFeeds,
  medianDataFeed
}

initDataProps.forEach(val => {
  reducers[val.prop] = propValue({
    prop: val.prop,
    defaultValue: val.defaultValue
  })
})

export default combineReducers(reducers)
