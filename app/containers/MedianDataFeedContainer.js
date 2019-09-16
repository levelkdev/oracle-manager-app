import React from 'react'
import { connect } from 'react-redux'
import { logMedianDataFeedResult } from '../actions'
import DataFeedList from '../components/DataFeedList'

const mapStateToProps = (state) => {
  const medianDataFeed = state.medianDataFeed
  medianDataFeed.dataFeedAddress = medianDataFeed.medianDataFeedAddress
  return {
    dataFeeds: [medianDataFeed],
    title: 'Median Data Feed'
  }
}

const mapDispatchToProps = dispatch => ({
  handleUpdate: ({ dataFeedAddress }) => {
    dispatch(logMedianDataFeedResult({ dataFeedAddress }))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataFeedList)
