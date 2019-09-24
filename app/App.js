import React from 'react'
import { Main, AppBar } from '@aragon/ui'
import SidePanelDisplayContainer from './containers/SidePanelDisplayContainer'
import ShowPanelButtonContainer from './containers/ShowPanelButtonContainer'
import DataFeedListContainer from './containers/DataFeedListContainer'
import MedianDataFeedContainer from './containers/MedianDataFeedContainer'
import UpdateAllButton from './containers/UpdateAllContainer'

const ShowAddDataFeedPanel = () => (
  <ShowPanelButtonContainer panelName="addDataFeed">
    Add Data Feed
  </ShowPanelButtonContainer>
)

export default class App extends React.Component {
  render () {
    return (
      <Main>
        <AppBar title="Data Feeds" endContent={<ShowAddDataFeedPanel />} />
        <UpdateAllButton />
        <MedianDataFeedContainer />
        <DataFeedListContainer />
        <SidePanelDisplayContainer />
      </Main>
    )
  }
}
