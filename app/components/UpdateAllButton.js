import React from 'react'
import { Button } from '@aragon/ui'

const UpdateAllButton = ({ updateAllDataFeeds, dataFeedAddrs, medianDataFeedAddress }) => {
  return (
    <Button
      onClick={ updateAllDataFeeds.bind(this, { dataFeedAddrs, medianDataFeedAddress }) }
      style={{ margin: '20px'}}
      mode="strong"
    >
      Update All
    </Button>
  )
}

export default UpdateAllButton
