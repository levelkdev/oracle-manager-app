import React from 'react'
import { connect } from 'react-redux'
import { removeDataFeed, logDataFeedResult } from '../actions'
import DataFeedList from '../components/DataFeedList'

const mapStateToProps = (state) => ({
  dataFeeds: state.dataFeeds
})

const mapDispatchToProps = dispatch => ({
  handleRemove: ({ address }) => {
    dispatch(removeDataFeed({ address }))
  },
  handleUpdate: ({ address }) => {
    console.log('here1')
    dispatch(logDataFeedResult({ address }))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataFeedList)
