import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button } from '@aragon/ui'
import styled from 'styled-components'

const createReduxForm = reduxForm({ form: 'createDecisionMarket' })

const AddOracleForm = createReduxForm(({
  handleSubmit,
  addOracle
}) => {
  return (
    <form onSubmit={handleSubmit(addOracle)}>
      <StyledField
        name="address" 
        component="input" 
        type="text" 
        placeholder="Enter an Oracle address"
      />
      <br /><br />
      <Button mode="strong" type="submit" wide>Add Oracle</Button>
    </form>
  )
})

const StyledField = styled(Field)`
  padding: 8px;
  background: #FFFFFF;
  border: 1px solid rgba(209,209,209,0.75);
  box-shadow: inset 0 2px 3px 0 rgba(0,0,0,0.06);
  outline: none;
  width: 100%;
  border-radius: 3px;
  ::placeholder { opacity: .5; }
`

export default AddOracleForm
