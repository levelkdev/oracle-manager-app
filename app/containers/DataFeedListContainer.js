import React from 'react'
import { connect } from 'react-redux'
import { removeDataFeed, logDataFeedResult } from '../actions'
import DataFeedList from '../components/DataFeedList'

const mapStateToProps = (state) => ({
  dataFeeds: state.dataFeeds
})

const mapDispatchToProps = dispatch => ({
  handleRemove: ({ dataFeedAddress }) => {
    dispatch(removeDataFeed({ dataFeedAddress }))
  },
  handleUpdate: ({ dataFeedAddress }) => {
    dispatch(logDataFeedResult({ dataFeedAddress }))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataFeedList)
