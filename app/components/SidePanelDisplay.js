import React from 'react'
import { SidePanel } from '@aragon/ui'
import AddDataFeed from '../views/AddDataFeed'

const titles = {
  addDataFeed: 'Add an Oracle'
}

const SidePanelDisplay = ({ panelName, closePanel }) => (
  <SidePanel
    title={titles[panelName] || ''}
    opened={typeof(panelName) !== 'undefined'}
    onClose={closePanel}
  >
    {(() => {
      switch (panelName) {
        case 'addDataFeed':
          return <AddDataFeed />
        default:
          return null
      }
    })()}
  </SidePanel>
)

export default SidePanelDisplay
