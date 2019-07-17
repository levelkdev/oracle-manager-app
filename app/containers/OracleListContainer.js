import React from 'react'
import { connect } from 'react-redux'
import OracleList from '../components/OracleList'

const mapStateToProps = (state) => ({
  oracles: state.dataFeeds
})

export default connect(
  mapStateToProps
)(OracleList)
