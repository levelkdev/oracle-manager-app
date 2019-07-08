import React from 'react'
import { SidePanel } from '@aragon/ui'
import AddOracle from '../views/AddOracle'

const titles = {
  addOracle: 'Add an Oracle'
}

const SidePanelDisplay = ({ panelName, closePanel }) => (
  <SidePanel
    title={titles[panelName] || ''}
    opened={typeof(panelName) !== 'undefined'}
    onClose={closePanel}
  >
    {(() => {
      switch (panelName) {
        case 'addOracle':
          return <AddOracle />
        default:
          return null
      }
    })()}
  </SidePanel>
)

export default SidePanelDisplay
