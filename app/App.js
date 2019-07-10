import React from 'react'
import { Main, AppBar } from '@aragon/ui'
import SidePanelDisplayContainer from './containers/SidePanelDisplayContainer'
import ShowPanelButtonContainer from './containers/ShowPanelButtonContainer'

const ShowAddOraclePanel = () => (
  <ShowPanelButtonContainer panelName="addOracle">
    Add Oracle
  </ShowPanelButtonContainer>
)

export default class App extends React.Component {
  render () {
    return (
      <Main>
        <AppBar title="Oracles" endContent={<ShowAddOraclePanel />} />
        <SidePanelDisplayContainer />
      </Main>
    )
  }
}
