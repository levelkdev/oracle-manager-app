import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { addOracle, hidePanel } from '../actions'

import AddOracleForm from '../components/AddOracleForm'

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  addOracle: async values => {
    dispatch(hidePanel())
    dispatch(addOracle({
      address: values.address
    }))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOracleForm)
