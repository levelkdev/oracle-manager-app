import React from 'react'
import { connect } from 'react-redux'
import { removeDataFeed } from '../actions'
import OracleList from '../components/OracleList'

const mapStateToProps = (state) => ({
  oracles: state.dataFeeds
})

const mapDispatchToProps = dispatch => ({
  handleRemove: ({ address }) => {
    dispatch(removeDataFeed({ address }))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OracleList)