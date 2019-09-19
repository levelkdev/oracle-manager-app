import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import UpdateAllButton from '../components/UpdateAllButton'
import { updateAllDataFeeds } from '../actions'

const mapStateToProps = state => ({
  dataFeedAddrs: _.map(state.dataFeeds, 'dataFeedAddress'),
  medianDataFeedAddress: state.medianDataFeed.medianDataFeedAddress
})

const mapDispatchToProps = dispatch => ({
  updateAllDataFeeds: async ({ dataFeedAddrs, medianDataFeedAddress }) => {
    dispatch(updateAllDataFeeds({dataFeedAddrs, medianDataFeedAddress}))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateAllButton)
