import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { addDataFeed, hidePanel } from '../actions'

import AddDataFeedForm from '../components/AddDataFeedForm'

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  addDataFeed: async values => {
    dispatch(hidePanel())
    dispatch(addDataFeed({
      address: values.address
    }))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDataFeedForm)
